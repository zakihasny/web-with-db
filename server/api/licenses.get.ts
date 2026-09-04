import type { QueryResultRow } from 'pg'

import { DEMO_LICENSES, demoModeEnabled } from '../utils/demo-data'
import { queryRows } from '../utils/database'

interface LicenseRow extends QueryResultRow {
  number: string
  asset_id: string
  issuer: string
  sku: string
  expiry_date: string
  expiry_state: 'active' | 'expiring' | 'expired'
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  if (demoModeEnabled()) {
    return { items: DEMO_LICENSES, count: DEMO_LICENSES.length, demo: true }
  }

  const rows = await queryRows<LicenseRow>(`
    SELECT
      number,
      asset_id,
      issuer,
      sku,
      expiry_date::text,
      CASE
        WHEN expiry_date < current_date THEN 'expired'
        WHEN expiry_date <= current_date + 30 THEN 'expiring'
        ELSE 'active'
      END AS expiry_state
    FROM asset_compliance.stock_licenses
    ORDER BY number DESC
    LIMIT 500
  `)

  const items = rows.map((row) => ({
    number: Number(row.number),
    assetId: row.asset_id,
    issuer: row.issuer,
    sku: row.sku,
    expiryDate: row.expiry_date,
    expiryState: row.expiry_state
  }))

  return { items, count: items.length }
})
