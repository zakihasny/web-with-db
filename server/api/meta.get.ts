import type { RowDataPacket } from 'mysql2'
import { getReadDb } from '../utils/db'

export default defineEventHandler(async () => {
  try {
    const db = getReadDb()
    const [sitesResult, salariesResult, seatingResult] = await Promise.all([
      db.query<RowDataPacket[]>('SELECT site_id, site_name, city FROM sites ORDER BY site_name'),
      db.query<RowDataPacket[]>('SELECT salary_id, salary_grade, basic_salary, allowance FROM salaries ORDER BY basic_salary'),
      db.query<RowDataPacket[]>('SELECT seating_id, site_id, floor_number, seat_code FROM seating ORDER BY site_id, floor_number, seat_code')
    ])

    return {
      sites: sitesResult[0],
      salaries: salariesResult[0],
      seating: seatingResult[0]
    }
  } catch {
    throw createError({ statusCode: 503, statusMessage: 'Database options are unavailable.' })
  }
})
