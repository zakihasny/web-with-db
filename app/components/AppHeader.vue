<script setup lang="ts">
const route = useRoute()

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Stock Device', to: '/devices' },
  { label: 'Stock License', to: '/licenses' }
]
</script>

<template>
  <header class="site-header">
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div class="header-inner">
      <NuxtLink to="/" class="brand-link" aria-label="Asset Compliance home">
        <img src="/wordmark.svg" alt="Biznet Gio Nusantara" class="brand-wordmark">
        <span class="brand-divider" aria-hidden="true" />
        <span class="brand-product">Asset Compliance</span>
      </NuxtLink>

      <nav class="primary-nav" aria-label="Primary navigation">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ 'nav-link-active': route.path === item.to }"
          :aria-current="route.path === item.to ? 'page' : undefined"
          :data-route="item.to"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
