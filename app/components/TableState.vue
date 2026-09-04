<script setup lang="ts">
defineProps<{
  kind: 'loading' | 'error' | 'empty'
  message?: string
}>()
</script>

<template>
  <div class="table-state" :class="`table-state-${kind}`" role="status">
    <span v-if="kind === 'loading'" class="spinner" aria-hidden="true" />
    <svg v-else class="state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <template v-if="kind === 'error'">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v5M12 16h.01" />
      </template>
      <template v-else>
        <path d="M4 7h16M6 7l1 13h10l1-13M9 4h6" />
      </template>
    </svg>
    <p>{{ message }}</p>
  </div>
</template>
