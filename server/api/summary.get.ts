import type { RowDataPacket } from 'mysql2'
import { getReadDb } from '../utils/db'

interface SummaryRow extends RowDataPacket {
  sites: number
  employees: number
  devices: number
}

export default defineEventHandler(async () => {
  try {
    const [rows] = await getReadDb().query<SummaryRow[]>(`
      SELECT
        (SELECT COUNT(*) FROM sites) AS sites,
        (SELECT COUNT(*) FROM employees) AS employees,
        (SELECT COUNT(*) FROM employee_devices) AS devices
    `)

    return {
      sites: Number(rows[0]?.sites ?? 0),
      employees: Number(rows[0]?.employees ?? 0),
      devices: Number(rows[0]?.devices ?? 0)
    }
  } catch {
    throw createError({ statusCode: 503, statusMessage: 'The MySQL database is unavailable.' })
  }
})
