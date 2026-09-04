import { Pool, type PoolClient, type QueryResultRow } from 'pg'
import { createError } from 'h3'

let pool: Pool | undefined

export function databaseUrl() {
  const value = process.env.DATABASE_URL?.trim()
  if (!value) {
    throw createError({
      statusCode: 503,
      statusMessage: 'DATABASE_URL is not configured.'
    })
  }
  return value
}

export function useDatabase() {
  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl(),
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      keepAlive: true,
      application_name: 'asset-compliance'
    })

    pool.on('error', (error) => {
      console.error(JSON.stringify({
        level: 'error',
        event: 'postgres_pool_error',
        message: error.message
      }))
    })
  }
  return pool
}

export async function withTransaction<T>(work: (client: PoolClient) => Promise<T>) {
  const client = await useDatabase().connect()
  try {
    await client.query('BEGIN')
    const result = await work(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined)
    throw error
  } finally {
    client.release()
  }
}

export async function queryRows<T extends QueryResultRow>(text: string, values: unknown[] = []) {
  const result = await useDatabase().query<T>(text, values)
  return result.rows
}

export async function closeDatabase() {
  if (pool) {
    await pool.end()
    pool = undefined
  }
}
