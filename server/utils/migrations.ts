import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { databaseUrl, useDatabase } from './database'

function migrationEnabled() {
  const value = process.env.RUN_DB_MIGRATIONS?.trim().toLowerCase()
  return value !== 'false' && value !== '0' && value !== 'no'
}

export async function runMigrations() {
  if (!migrationEnabled()) return
  databaseUrl()

  const directory = path.resolve(process.cwd(), 'migrations')
  const files = (await readdir(directory))
    .filter((file) => /^\d+_.+\.sql$/.test(file))
    .sort()

  const client = await useDatabase().connect()
  try {
    await client.query("SELECT pg_advisory_lock(hashtext('asset_compliance_migrations'))")
    for (const file of files) {
      const sql = await readFile(path.join(directory, file), 'utf8')
      await client.query(sql)
      console.log(JSON.stringify({ level: 'info', event: 'migration_applied', migration: file }))
    }
  } finally {
    await client.query("SELECT pg_advisory_unlock(hashtext('asset_compliance_migrations'))").catch(() => undefined)
    client.release()
  }
}
