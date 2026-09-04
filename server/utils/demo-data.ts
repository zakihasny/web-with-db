export const DEMO_DEVICES = [
  { number: 5, assetId: 'GAD-005', brand: 'Dell', cpu: 16, ram: '32 GB', gpu: 'NVIDIA RTX A2000' },
  { number: 4, assetId: 'GAD-004', brand: 'Lenovo', cpu: 8, ram: '16 GB', gpu: 'Intel Iris Xe' },
  { number: 3, assetId: 'GAD-003', brand: 'HP', cpu: 12, ram: '32 GB', gpu: 'Integrated' },
  { number: 2, assetId: 'GAD-002', brand: 'Asus', cpu: 24, ram: '64 GB', gpu: 'NVIDIA RTX 4060' },
  { number: 1, assetId: 'GAD-001', brand: 'MSI', cpu: 6, ram: '8 GB', gpu: 'AMD Radeon 780M' }
]

export const DEMO_LICENSES = [
  { number: 5, assetId: 'LIC-005', issuer: 'Adobe', sku: 'ADOB-862191', expiryDate: '2027-05-18', expiryState: 'active' },
  { number: 4, assetId: 'LIC-004', issuer: 'GlobalSign', sku: 'GLOB-498315', expiryDate: '2026-09-25', expiryState: 'expiring' },
  { number: 3, assetId: 'LIC-003', issuer: 'Red Hat', sku: 'REDH-715824', expiryDate: '2026-08-16', expiryState: 'expired' },
  { number: 2, assetId: 'LIC-002', issuer: 'Windows', sku: 'WIND-246817', expiryDate: '2027-02-11', expiryState: 'active' },
  { number: 1, assetId: 'LIC-001', issuer: 'Open Source', sku: 'OPEN-573208', expiryDate: '2028-01-30', expiryState: 'active' }
] as const

export function demoModeEnabled() {
  return process.env.DEMO_MODE?.trim().toLowerCase() === 'true'
}
