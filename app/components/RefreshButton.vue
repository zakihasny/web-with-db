<script setup lang="ts">
defineProps<{ pending?: boolean }>()
defineEmits<{ refresh: [] }>()
</script>

<template>
  <button class="button button-outline button-compact" type="button" :disabled="pending" @click="$emit('refresh')">
    <svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5" />
    </svg>
    {{ pending ? 'Refreshing…' : 'Refresh' }}
  </button>
</template>
