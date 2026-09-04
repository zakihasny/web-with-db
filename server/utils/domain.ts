export const DEVICE_BRANDS = ['Asus', 'HP', 'Lenovo', 'Dell', 'MSI'] as const
export const LICENSE_ISSUERS = [
  'Open Source',
  'Windows',
  'cPanel',
  'Plesk',
  'GlobalSign',
  'Red Hat',
  'Adobe'
] as const

export const CPU_OPTIONS = [4, 6, 8, 12, 16, 24, 32] as const
export const RAM_OPTIONS_GB = [8, 16, 32, 64, 128] as const
export const GPU_OPTIONS = [
  'Integrated',
  'Intel Iris Xe',
  'AMD Radeon 780M',
  'NVIDIA RTX A2000',
  'NVIDIA RTX 4060'
] as const

export type DeviceBrand = (typeof DEVICE_BRANDS)[number]
export type LicenseIssuer = (typeof LICENSE_ISSUERS)[number]

export interface RandomDeviceInput {
  brand: DeviceBrand
  cpu: number
  ramGb: number
  gpu: string
}

export interface RandomLicenseInput {
  issuer: LicenseIssuer
  sku: string
  expiryDate: string
}

export function formatAssetId(prefix: 'GAD' | 'LIC', number: number) {
  if (!Number.isSafeInteger(number) || number < 1) {
    throw new TypeError('Asset sequence number must be a positive safe integer.')
  }
  return `${prefix}-${String(number).padStart(3, '0')}`
}

export function scheduleBucket(nowMs: number, intervalHours: number) {
  if (!Number.isFinite(nowMs) || !Number.isInteger(intervalHours) || intervalHours < 1) {
    throw new TypeError('A valid timestamp and positive interval are required.')
  }
  return Math.floor(nowMs / (intervalHours * 60 * 60 * 1000))
}
