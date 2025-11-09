<script setup lang="ts">
import BaseCard from './BaseCard.vue'
defineProps<{ title: string; date: string; location: string; desc?: string }>()
</script>

<template>
  <BaseCard>
    <template #header>
      <h3 class="text-lg font-semibold">{{ title }}</h3>
    </template>
    <p class="text-sm text-zinc-300">{{ date }} · {{ location }}</p>
    <p v-if="desc" class="mt-2 text-zinc-200">{{ desc }}</p>
  </BaseCard>
</template>
