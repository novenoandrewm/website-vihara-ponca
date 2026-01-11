<!-- src/components/cards/EventCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BaseCard from '@/components/ui/BaseCard.vue'
import Badge from '@/components/ui/Badge.vue'
import { formatDate } from '@/utils/formatDate'

const { t } = useI18n({ useScope: 'global' })

const props = withDefaults(
  defineProps<{
    title: string
    date: string
    location?: string
    time?: string
    description?: string
    image?: string
    category?: string
    to?: string
  }>(),
  {
    category: 'general',
    to: '',
  }
)

const badgeTone = computed(() => {
  const cat = props.category.toLowerCase()
  if (cat === 'pmv') return 'gold'
  if (cat === 'gabi') return 'jade'
  return 'neutral'
})

const categoryLabel = computed(() => {
  const cat = props.category.toLowerCase()
  if (cat === 'pmv') return 'PMV'
  if (cat === 'gabi') return 'GABI'
  return t('categories.general', 'Umum')
})

const displayImage = computed(() => {
  if (props.image) return props.image
  return null
})
</script>

<template>
  <BaseCard hover class="group relative flex h-full flex-col">
    <RouterLink
      v-if="props.to"
      :to="props.to"
      class="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      :aria-label="`${t('common.view_detail', 'Lihat detail')}: ${props.title}`"
    />

    <template #header>
      <div class="flex items-start justify-between gap-3">
        <h3
          class="line-clamp-2 font-display text-lg font-semibold leading-snug tracking-[0.03em] text-zinc-100 transition group-hover:text-brand-300"
        >
          {{ props.title }}
        </h3>

        <Badge :tone="badgeTone" size="sm">{{ categoryLabel }}</Badge>
      </div>

      <div class="mt-3 space-y-1.5">
        <div class="flex items-center gap-2 text-sm text-zinc-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-4 w-4 shrink-0 text-zinc-500"
          >
            <path
              d="M5.25 2.25a.75.75 0 00-1.5 0v1.5h-1.5a3 3 0 00-3 3v9.75a3 3 0 003 3h15.5a3 3 0 003-3V6.75a3 3 0 00-3-3h-1.5v-1.5a.75.75 0 00-1.5 0v1.5h-9.75v-1.5z"
            />
          </svg>
          <span>{{ formatDate(props.date) }}</span>
        </div>

        <div
          v-if="props.time"
          class="flex items-center gap-2 text-sm text-zinc-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-4 w-4 shrink-0 text-brand-400/80"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75l4 4a.75.75 0 101.06-1.06l-3.25-3.25V5.75z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-medium">{{ props.time }}</span>
        </div>

        <div
          v-if="props.location"
          class="flex items-center gap-2 text-sm text-zinc-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-4 w-4 shrink-0 text-zinc-500"
          >
            <path
              fill-rule="evenodd"
              d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.006.003.002.001.003.001a.75.75 0 01-.69 1.35H9.69zM10 12a3 3 0 100-6 3 3 0 000 6z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="line-clamp-1">{{ props.location }}</span>
        </div>
      </div>

      <div
        class="mt-3 h-px w-full bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent"
        aria-hidden="true"
      />
    </template>

    <div
      v-if="displayImage"
      class="mb-4 shrink-0 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40"
    >
      <div class="relative aspect-[16/9]">
        <img
          :src="displayImage"
          :alt="props.title"
          class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-80"
        />
      </div>
    </div>

    <p
      v-if="props.description"
      class="line-clamp-3 text-sm leading-relaxed text-zinc-300"
    >
      {{ props.description }}
    </p>

    <template #footer>
      <div class="flex items-center justify-between">
        <span class="text-xs text-zinc-500">{{
          t('common.activity_info', 'Info Kegiatan')
        }}</span>
        <span
          class="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 transition group-hover:text-brand-300"
        >
          {{ t('common.view_detail', 'Lihat detail') }}
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </template>
  </BaseCard>
</template>
