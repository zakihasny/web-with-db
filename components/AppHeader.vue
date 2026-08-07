<script setup lang="ts">
import { Menu, X } from '@lucide/vue'

const route = useRoute()
const mobileOpen = ref(false)

const links = [
  { label: 'Home', to: '/' },
  { label: 'SQL Query', to: '/query' },
  { label: 'Add Data', to: '/input' }
]

const isActive = (to: string) => route.path === to

watch(
  () => route.path,
  () => {
    mobileOpen.value = false
  }
)

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') mobileOpen.value = false
}

onMounted(() => window.addEventListener('keydown', closeOnEscape))
onBeforeUnmount(() => window.removeEventListener('keydown', closeOnEscape))
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to main content</a>
  <header class="site-header">
    <div class="container header-inner">
      <NuxtLink class="brand-link" to="/" aria-label="Employee Database Lab home">
        <img src="/brand/Wordmark24.svg" alt="Biznet Gio Nusantara" height="24">
      </NuxtLink>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ 'nav-link--active': isActive(link.to) }"
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <NuxtLink class="btn btn-primary btn-lg header-action" to="/query">
        Open Console
      </NuxtLink>

      <button
        class="icon-button mobile-menu-button"
        type="button"
        :aria-expanded="mobileOpen"
        aria-controls="mobile-navigation"
        :aria-label="mobileOpen ? 'Close navigation' : 'Open navigation'"
        @click="mobileOpen = !mobileOpen"
      >
        <X v-if="mobileOpen" :size="20" :stroke-width="1.5" aria-hidden="true" />
        <Menu v-else :size="20" :stroke-width="1.5" aria-hidden="true" />
      </button>
    </div>

    <div
      v-if="mobileOpen"
      class="mobile-navigation-backdrop"
      @click.self="mobileOpen = false"
    >
      <nav id="mobile-navigation" class="mobile-navigation" aria-label="Mobile navigation">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="mobile-nav-link"
          :class="{ 'mobile-nav-link--active': isActive(link.to) }"
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
