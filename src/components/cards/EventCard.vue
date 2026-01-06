<!-- src/components/cards/EventCard.vue -->
<script setup lang="ts">
import BaseCard from '@/components/ui/BaseCard.vue'
import Badge from '@/components/ui/Badge.vue'
import { formatDate } from '@/utils/formatDate'

defineProps<{
  title: string
  date: string
  location: string
  description?: string
  image?: string
}>()
</script>

<template>
  <BaseCard hover class="group">
    <template #header>
      <div class="flex items-start justify-between gap-3">
        <h3
          class="font-display text-lg font-semibold leading-snug tracking-[0.03em] text-zinc-100 transition group-hover:text-zinc-50"
        >
          {{ title }}
        </h3>

        <Badge tone="gold" size="sm">Event</Badge>
      </div>

      <!-- meta -->
      <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <time class="text-zinc-300" :datetime="date">
          {{ formatDate(date) }}
        </time>

        <span class="text-zinc-700" aria-hidden="true">•</span>

        <span class="text-zinc-300">{{ location }}</span>
      </div>

      <!-- ornament line -->
      <div
        class="mt-3 h-px w-full bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent"
        aria-hidden="true"
      />
    </template>

    <!-- image -->
    <div
      v-if="image"
      class="mb-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40"
    >
      <div class="relative aspect-[16/9]">
        <img
          :src="image"
          :alt="title"
          class="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
          loading="lazy"
        />

        <!-- sacred vignette overlay -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/55 via-transparent to-transparent opacity-80"
        />

        <!-- subtle top shine -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
      </div>
    </div>

    <!-- description -->
    <p
      v-if="description"
      class="line-clamp-4 text-sm leading-relaxed text-zinc-200"
    >
      {{ description }}
    </p>

    <template #footer>
      <div class="flex items-center justify-between">
        <span class="text-xs text-zinc-500">Tersinkron otomatis</span>

        <span
          class="inline-flex items-center gap-2 text-xs text-zinc-500 transition group-hover:text-brand-200"
        >
          Lihat detail <span aria-hidden="true">→</span>
        </span>
      </div>
    </template>
  </BaseCard>
</template>
