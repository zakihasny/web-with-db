import { demoModeEnabled } from '../../utils/demo-data'
import { queryRows } from '../../utils/database'

export default defineEventHandler(async () => {
  if (demoModeEnabled()) return { status: 'ok', database: 'demo', postgresMajor: null }

  const rows = await queryRows<{ database_name: string, server_version_num: number }>(`
    SELECT
      current_database() AS database_name,
      current_setting('server_version_num')::integer AS server_version_num
  `)
  const version = Number(rows[0]?.server_version_num || 0)
  const postgresMajor = Math.floor(version / 10_000)
  if (postgresMajor !== 16) {
    throw createError({
      statusCode: 503,
      statusMessage: `PostgreSQL 16 is required; connected major version is ${postgresMajor}.`
    })
  }

  return { status: 'ok', database: rows[0]?.database_name, postgresMajor }
})
