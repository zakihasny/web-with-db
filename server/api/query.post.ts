import type { FieldPacket } from 'mysql2'
import { getReadDb } from '../utils/db'
import { guardReadOnlySql } from '../utils/sql-guard'

function toJsonValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'bigint') return value.toString()
  if (Buffer.isBuffer(value)) return value.toString('utf8')
  return value
}

export default defineEventHandler(async (event) => {
  const body = await readBody<{ sql?: unknown }>(event)

  let sql: string
  try {
    sql = guardReadOnlySql(body?.sql)
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : 'Invalid SQL statement.'
    })
  }

  const startedAt = performance.now()

  try {
    const [rawRows, rawFields] = await getReadDb().query({
      sql,
      rowsAsArray: true,
      timeout: 5000
    })
    const fields = rawFields as FieldPacket[]
    const rows = (rawRows as unknown[][]).map((row) => row.map(toJsonValue))

    return {
      columns: fields.map((field) => field.name),
      rows,
      rowCount: rows.length,
      durationMs: Math.max(1, Math.round(performance.now() - startedAt)),
      executedSql: sql
    }
  } catch (error: any) {
    const message = typeof error?.sqlMessage === 'string' ? error.sqlMessage : 'The query could not be executed.'
    throw createError({ statusCode: 400, statusMessage: message })
  }
})
