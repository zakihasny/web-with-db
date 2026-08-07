import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import { getWriteDb } from '../utils/db'

interface EmployeeInput {
  fullName?: unknown
  email?: unknown
  jobTitle?: unknown
  hiredDate?: unknown
  siteId?: unknown
  salaryId?: unknown
  seatingId?: unknown
}

function requireText(value: unknown, label: string, maxLength: number) {
  if (typeof value !== 'string' || value.trim().length < 2) {
    throw new Error(`${label} must contain at least two characters.`)
  }
  const normalized = value.trim()
  if (normalized.length > maxLength) throw new Error(`${label} is too long.`)
  return normalized
}

function requireId(value: unknown, label: string) {
  const id = Number(value)
  if (!Number.isInteger(id) || id < 1) throw new Error(`Select a valid ${label}.`)
  return id
}

export default defineEventHandler(async (event) => {
  const body = await readBody<EmployeeInput>(event)

  let input: {
    fullName: string
    email: string
    jobTitle: string
    hiredDate: string
    siteId: number
    salaryId: number
    seatingId: number
  }

  try {
    const email = requireText(body.email, 'Email address', 120).toLowerCase()
    const hiredDate = typeof body.hiredDate === 'string' ? body.hiredDate.trim() : ''

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(hiredDate) || Number.isNaN(Date.parse(`${hiredDate}T00:00:00Z`))) {
      throw new Error('Enter a valid hired date.')
    }

    input = {
      fullName: requireText(body.fullName, 'Full name', 120),
      email,
      jobTitle: requireText(body.jobTitle, 'Job title', 100),
      hiredDate,
      siteId: requireId(body.siteId, 'office site'),
      salaryId: requireId(body.salaryId, 'salary grade'),
      seatingId: requireId(body.seatingId, 'seat')
    }
  } catch (error) {
    throw createError({
      statusCode: 422,
      statusMessage: error instanceof Error ? error.message : 'Employee data is invalid.'
    })
  }

  const db = getWriteDb()

  try {
    const [relationshipRows] = await db.execute<RowDataPacket[]>(`
      SELECT
        EXISTS(SELECT 1 FROM sites WHERE site_id = ?) AS site_exists,
        EXISTS(SELECT 1 FROM salaries WHERE salary_id = ?) AS salary_exists,
        EXISTS(SELECT 1 FROM seating WHERE seating_id = ? AND site_id = ?) AS seating_matches
    `, [input.siteId, input.salaryId, input.seatingId, input.siteId])

    const relationships = relationshipRows[0]
    if (!relationships?.site_exists) throw new Error('The selected office site does not exist.')
    if (!relationships?.salary_exists) throw new Error('The selected salary grade does not exist.')
    if (!relationships?.seating_matches) throw new Error('The selected seat does not belong to the selected site.')

    const [result] = await db.execute<ResultSetHeader>(`
      INSERT INTO employees
        (site_id, salary_id, seating_id, full_name, email, job_title, hired_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      input.siteId,
      input.salaryId,
      input.seatingId,
      input.fullName,
      input.email,
      input.jobTitle,
      input.hiredDate
    ])

    setResponseStatus(event, 201)
    return { employeeId: result.insertId, message: 'Employee added successfully.' }
  } catch (error: any) {
    if (error?.code === 'ER_DUP_ENTRY') {
      throw createError({ statusCode: 409, statusMessage: 'That email address is already registered.' })
    }
    if (error instanceof Error && !('code' in error)) {
      throw createError({ statusCode: 422, statusMessage: error.message })
    }
    throw createError({ statusCode: 500, statusMessage: 'The employee could not be saved.' })
  }
})
