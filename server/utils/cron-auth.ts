import { createHash, timingSafeEqual } from 'node:crypto'
import { createError, getHeader, type H3Event } from 'h3'

function digest(value: string) {
  return createHash('sha256').update(value).digest()
}

export function requireCronAuthorization(event: H3Event) {
  const expected = process.env.CRON_SHARED_SECRET?.trim()
  if (!expected) {
    throw createError({ statusCode: 503, statusMessage: 'Cron authentication is not configured.' })
  }

  const authorization = getHeader(event, 'authorization') || ''
  const bearer = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : ''
  const supplied = bearer || getHeader(event, 'x-cron-secret')?.trim() || ''

  if (!supplied || !timingSafeEqual(digest(supplied), digest(expected))) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Cron credentials.' })
  }
}
