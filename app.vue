<script setup lang="ts">
import { setLucideProps } from '@lucide/vue'

setLucideProps({ strokeWidth: 1.5 })
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main id="main-content">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>
