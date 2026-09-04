<script setup lang="ts">
useSeoMeta({
  title: 'Populate Asset Compliance',
  description: 'Open device and license inventories populated on schedule by NEO Cron.'
})
</script>

<template>
  <div class="home-page page-container">
    <section class="hero-section" aria-labelledby="home-title">
      <div class="hero-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3 4 7v5c0 4.8 3.3 8.8 8 10 4.7-1.2 8-5.2 8-10V7l-8-4Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </div>
      <p class="eyebrow">NEO App inventory workspace</p>
      <h1 id="home-title">Populate Asset Compliance</h1>
      <p class="hero-copy">Review device and license records created automatically by the configured NEO Cron schedules.</p>
    </section>

    <section class="route-actions" aria-label="Asset inventory pages">
      <NuxtLink to="/devices" class="button button-primary button-large">
        View Stock Device
        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </NuxtLink>
      <NuxtLink to="/licenses" class="button button-outline button-large">
        View Stock License
        <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </NuxtLink>
    </section>
  </div>
</template>
