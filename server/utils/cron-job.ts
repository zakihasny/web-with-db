import type { PoolClient, QueryResultRow } from 'pg'

import { scheduleBucket } from './domain'
import { withTransaction } from './database'

interface ExistingRun extends QueryResultRow {
  inserted_asset_id: string | null
}

interface RunClaim extends QueryResultRow {
  run_key: string
}

export interface CronInsertResult<T> {
  created: boolean
  duplicate: boolean
  asset: T | null
  runKey: string
  existingAssetId?: string | null
}

export async function runIdempotentCron<T>({
  jobName,
  intervalHours,
  insertAsset,
  nowMs = Date.now()
}: {
  jobName: 'populate-device' | 'populate-license'
  intervalHours: number
  insertAsset: (client: PoolClient) => Promise<T & { assetId: string }>
  nowMs?: number
}): Promise<CronInsertResult<T>> {
  const bucket = scheduleBucket(nowMs, intervalHours)
  const runKey = `${jobName}:${bucket}`

  return withTransaction(async (client) => {
    const claim = await client.query<RunClaim>({
      text: `
        INSERT INTO asset_compliance.cron_runs (run_key, job_name, schedule_bucket)
        VALUES ($1, $2, $3)
        ON CONFLICT (run_key) DO NOTHING
        RETURNING run_key
      `,
      values: [runKey, jobName, bucket]
    })

    if (claim.rowCount === 0) {
      const existing = await client.query<ExistingRun>({
        text: `
          SELECT inserted_asset_id
          FROM asset_compliance.cron_runs
          WHERE run_key = $1
        `,
        values: [runKey]
      })
      return {
        created: false,
        duplicate: true,
        asset: null,
        runKey,
        existingAssetId: existing.rows[0]?.inserted_asset_id || null
      }
    }

    const asset = await insertAsset(client)
    await client.query({
      text: `
        UPDATE asset_compliance.cron_runs
        SET inserted_asset_id = $2, completed_at = current_timestamp
        WHERE run_key = $1
      `,
      values: [runKey, asset.assetId]
    })

    return { created: true, duplicate: false, asset, runKey }
  })
}
