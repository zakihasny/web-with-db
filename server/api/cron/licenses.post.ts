import { requireCronAuthorization } from '../../utils/cron-auth'
import { runIdempotentCron } from '../../utils/cron-job'
import { createRandomLicense } from '../../utils/random-data'

export default defineEventHandler(async (event) => {
  requireCronAuthorization(event)

  const result = await runIdempotentCron({
    jobName: 'populate-license',
    intervalHours: 6,
    insertAsset: async (client) => {
      const input = createRandomLicense()
      const inserted = await client.query({
        text: `
          INSERT INTO asset_compliance.stock_licenses (issuer, sku, expiry_date)
          VALUES ($1, $2, $3::date)
          RETURNING number, asset_id, issuer, sku, expiry_date::text
        `,
        values: [input.issuer, input.sku, input.expiryDate]
      })
      const row = inserted.rows[0]
      return {
        number: Number(row.number),
        assetId: row.asset_id,
        issuer: row.issuer,
        sku: row.sku,
        expiryDate: row.expiry_date
      }
    }
  })

  setResponseStatus(event, result.created ? 201 : 200)
  return result
})
