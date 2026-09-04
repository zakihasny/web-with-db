import type { QueryResultRow } from 'pg'

import { DEMO_DEVICES, demoModeEnabled } from '../utils/demo-data'
import { queryRows } from '../utils/database'

interface DeviceRow extends QueryResultRow {
  number: string
  asset_id: string
  brand: string
  cpu: number
  ram_gb: number
  gpu: string
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  if (demoModeEnabled()) {
    return { items: DEMO_DEVICES, count: DEMO_DEVICES.length, demo: true }
  }

  const rows = await queryRows<DeviceRow>(`
    SELECT number, asset_id, brand, cpu, ram_gb, gpu
    FROM asset_compliance.stock_devices
    ORDER BY number DESC
    LIMIT 500
  `)

  const items = rows.map((row) => ({
    number: Number(row.number),
    assetId: row.asset_id,
    brand: row.brand,
    cpu: Number(row.cpu),
    ram: `${Number(row.ram_gb)} GB`,
    gpu: row.gpu
  }))

  return { items, count: items.length }
})
