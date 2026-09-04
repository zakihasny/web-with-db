import { describe, expect, it } from 'vitest'

import {
  DEVICE_BRANDS,
  LICENSE_ISSUERS,
  formatAssetId,
  scheduleBucket
} from '../server/utils/domain'
import { createRandomDevice, createRandomLicense } from '../server/utils/random-data'

describe('asset identifiers', () => {
  it('uses three digits as the minimum display width', () => {
    expect(formatAssetId('GAD', 1)).toBe('GAD-001')
    expect(formatAssetId('LIC', 27)).toBe('LIC-027')
    expect(formatAssetId('GAD', 1000)).toBe('GAD-1000')
  })
})

describe('Cron schedule buckets', () => {
  it('keeps retries in the same interval idempotent', () => {
    const start = Date.UTC(2026, 8, 3, 0, 0, 0)
    expect(scheduleBucket(start, 6)).toBe(scheduleBucket(start + (5 * 60 * 60 * 1000), 6))
    expect(scheduleBucket(start, 8)).toBe(scheduleBucket(start + (7 * 60 * 60 * 1000), 8))
  })
})

describe('random inventory data', () => {
  it('creates devices within approved value sets', () => {
    for (let index = 0; index < 100; index += 1) {
      const device = createRandomDevice()
      expect(DEVICE_BRANDS).toContain(device.brand)
      expect(device.cpu).toBeGreaterThan(0)
      expect(device.ramGb).toBeGreaterThan(0)
      expect(device.gpu.length).toBeGreaterThan(0)
    }
  })

  it('creates licenses with an approved issuer and ISO date', () => {
    for (let index = 0; index < 100; index += 1) {
      const license = createRandomLicense(new Date('2026-09-03T00:00:00Z'))
      expect(LICENSE_ISSUERS).toContain(license.issuer)
      expect(license.sku).toMatch(/^[A-Z]{4}-\d{6}$/)
      expect(license.expiryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})
