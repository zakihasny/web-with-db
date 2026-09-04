<script setup lang="ts">
interface DeviceRecord {
  number: number
  assetId: string
  brand: string
  cpu: number
  ram: string
  gpu: string
}

interface DeviceResponse {
  items: DeviceRecord[]
  count: number
  demo?: boolean
}

useSeoMeta({ title: 'Stock Device · Asset Compliance' })

const { data, status, error, refresh } = await useFetch<DeviceResponse>('/api/devices', {
  key: 'stock-devices',
  default: () => ({ items: [], count: 0 })
})
</script>

<template>
  <div class="data-page page-container">
    <div class="page-heading">
      <div>
        <p class="eyebrow">Page 1</p>
        <h1>Stock Device</h1>
        <p class="page-description">A new device record is generated every eight hours.</p>
      </div>
      <div class="heading-actions">
        <span v-if="data.demo" class="badge badge-info">Demo data</span>
        <RefreshButton :pending="status === 'pending'" @refresh="refresh" />
      </div>
    </div>

    <section class="table-panel" aria-labelledby="device-table-title">
      <div class="table-panel-header">
        <div>
          <h2 id="device-table-title">Stock Device</h2>
          <p>{{ data.count }} {{ data.count === 1 ? 'record' : 'records' }}</p>
        </div>
        <span class="schedule-chip">NEO Cron · every 8 hours</span>
      </div>

      <TableState v-if="status === 'pending' && data.items.length === 0" kind="loading" message="Loading device records…" />
      <TableState v-else-if="error" kind="error" message="Device records could not be loaded. Check the database connection and try again." />
      <TableState v-else-if="data.items.length === 0" kind="empty" message="No device records are available yet." />

      <div v-else class="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Nomor</th>
              <th scope="col">Asset ID</th>
              <th scope="col">Brand</th>
              <th scope="col">CPU</th>
              <th scope="col">RAM</th>
              <th scope="col">GPU</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in data.items" :key="device.assetId">
              <td class="cell-number">{{ device.number }}</td>
              <td><span class="asset-code">{{ device.assetId }}</span></td>
              <td>{{ device.brand }}</td>
              <td>{{ device.cpu }}</td>
              <td>{{ device.ram }}</td>
              <td>{{ device.gpu }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
