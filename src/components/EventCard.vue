<script setup lang="ts">
import { formatDate } from '@/utils/formatDate'
defineProps<{
  title: string
  date: string
  location: string
  description?: string
}>()
</script>

<template>
  <article class="rounded-2xl bg-zinc-800 p-4 shadow">
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <p class="text-sm text-zinc-300">{{ formatDate(date) }} · {{ location }}</p>
    <p v-if="description" class="mt-2 text-zinc-200">{{ description }}</p>
  </article>
</template>
