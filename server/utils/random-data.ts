import { randomInt } from 'node:crypto'

import {
  CPU_OPTIONS,
  DEVICE_BRANDS,
  GPU_OPTIONS,
  LICENSE_ISSUERS,
  RAM_OPTIONS_GB,
  type RandomDeviceInput,
  type RandomLicenseInput
} from './domain'

function pick<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length)]!
}

function dateOnlyUtc(date: Date) {
  return date.toISOString().slice(0, 10)
}

export function createRandomDevice(): RandomDeviceInput {
  return {
    brand: pick(DEVICE_BRANDS),
    cpu: pick(CPU_OPTIONS),
    ramGb: pick(RAM_OPTIONS_GB),
    gpu: pick(GPU_OPTIONS)
  }
}

export function createRandomLicense(now = new Date()): RandomLicenseInput {
  const issuer = pick(LICENSE_ISSUERS)
  // Include overdue and upcoming dates so compliance states remain testable.
  const dayOffset = randomInt(-45, 731)
  const expiryDate = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + dayOffset
  ))
  const issuerCode = issuer.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4)

  return {
    issuer,
    sku: `${issuerCode}-${randomInt(100000, 1000000)}`,
    expiryDate: dateOnlyUtc(expiryDate)
  }
}
