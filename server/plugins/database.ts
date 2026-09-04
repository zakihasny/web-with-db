import { demoModeEnabled } from '../utils/demo-data'
import { closeDatabase } from '../utils/database'
import { runMigrations } from '../utils/migrations'

export default defineNitroPlugin(async (nitroApp) => {
  if (!demoModeEnabled()) await runMigrations()
  nitroApp.hooks.hook('close', closeDatabase)
})
