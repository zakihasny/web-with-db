<script setup lang="ts">
interface LicenseRecord {
  number: number
  assetId: string
  issuer: string
  sku: string
  expiryDate: string
  expiryState: 'active' | 'expiring' | 'expired'
}

interface LicenseResponse {
  items: LicenseRecord[]
  count: number
  demo?: boolean
}

useSeoMeta({ title: 'Stock License · Asset Compliance' })

const { data, status, error, refresh } = await useFetch<LicenseResponse>('/api/licenses', {
  key: 'stock-licenses',
  default: () => ({ items: [], count: 0 })
})

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC'
})

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`))
}

function expiryLabel(state: LicenseRecord['expiryState']) {
  if (state === 'expired') return 'Expired'
  if (state === 'expiring') return 'Expiring soon'
  return 'Active'
}
</script>

<template>
  <div class="data-page page-container">
    <div class="page-heading">
      <div>
        <p class="eyebrow">Page 2</p>
        <h1>Stock License</h1>
        <p class="page-description">A new license record is generated every six hours.</p>
      </div>
      <div class="heading-actions">
        <span v-if="data.demo" class="badge badge-info">Demo data</span>
        <RefreshButton :pending="status === 'pending'" @refresh="refresh" />
      </div>
    </div>

    <section class="table-panel" aria-labelledby="license-table-title">
      <div class="table-panel-header">
        <div>
          <h2 id="license-table-title">Stock License</h2>
          <p>{{ data.count }} {{ data.count === 1 ? 'record' : 'records' }}</p>
        </div>
        <span class="schedule-chip">NEO Cron · every 6 hours</span>
      </div>

      <TableState v-if="status === 'pending' && data.items.length === 0" kind="loading" message="Loading license records…" />
      <TableState v-else-if="error" kind="error" message="License records could not be loaded. Check the database connection and try again." />
      <TableState v-else-if="data.items.length === 0" kind="empty" message="No license records are available yet." />

      <div v-else class="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Nomor</th>
              <th scope="col">Asset ID</th>
              <th scope="col">Issuer</th>
              <th scope="col">SKU</th>
              <th scope="col">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="license in data.items" :key="license.assetId">
              <td class="cell-number">{{ license.number }}</td>
              <td><span class="asset-code">{{ license.assetId }}</span></td>
              <td>{{ license.issuer }}</td>
              <td>{{ license.sku }}</td>
              <td>
                <div class="expiry-cell">
                  <span>{{ formatDate(license.expiryDate) }}</span>
                  <span class="badge" :class="`badge-${license.expiryState}`">{{ expiryLabel(license.expiryState) }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
