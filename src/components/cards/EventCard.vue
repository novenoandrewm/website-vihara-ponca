<!-- src/components/cards/EventCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Badge from '@/components/ui/Badge.vue'
import { formatDate } from '@/utils/formatDate'

const { locale, t } = useI18n({ useScope: 'global' })

const props = defineProps<{
  title: string
  date: string
  time?: string
  location?: string
  description?: string
  image?: string
  category: 'pmv' | 'gabi' | 'general'
  to: string
}>()

const categoryTone = computed(() => {
  if (props.category === 'pmv') return 'gold'
  if (props.category === 'gabi') return 'jade'
  return 'neutral'
})

function formatTime(timeString: string): string {
  if (!timeString) return ''

  const [hours, minutes] = timeString.split(':')

  return `${hours}:${minutes} WIB`
}

function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement
  target.src =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMyNzI3MmEiLz48L3N2Zz4='
}
</script>

<template>
  <RouterLink
    :to="to"
    class="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-700/30 bg-zinc-800/40 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:bg-zinc-800/60 hover:shadow-2xl hover:shadow-brand-500/10 active:scale-[0.99]"
  >
    <div
      class="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900 sm:aspect-video"
    >
      <template v-if="image">
        <img
          :src="image"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 h-full w-full object-cover opacity-50 blur-xl transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />

        <img
          :src="image"
          :alt="title"
          class="relative h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
          decoding="async"
          @error="handleImageError"
        />
      </template>

      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-zinc-800/50"
      >
        <span class="text-4xl text-zinc-400 opacity-20">☸</span>
      </div>

      <div class="absolute left-4 top-4 z-10">
        <Badge
          :tone="categoryTone"
          size="sm"
          class="border border-white/10 bg-zinc-900/50 shadow-md backdrop-blur-md"
        >
          {{ t('categories.' + category) }}
        </Badge>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-5 sm:p-6">
      <div class="mb-4">
        <h3
          class="line-clamp-2 font-display text-lg font-bold leading-snug text-zinc-50 transition-colors group-hover:text-brand-300 md:text-xl"
        >
          {{ title }}
        </h3>

        <div
          class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-zinc-300"
        >
          <div class="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="h-4 w-4 shrink-0 text-brand-400"
            >
              <path
                d="M5.25 2.25a.75.75 0 00-1.5 0v1.5h-1.5a3 3 0 00-3 3v9.75a3 3 0 003 3h15.5a3 3 0 003-3V6.75a3 3 0 00-3-3h-1.5v-1.5a.75.75 0 00-1.5 0v1.5h-9.75v-1.5z"
              />
            </svg>
            <span>
              {{ formatDate(date, locale === 'en' ? 'en-US' : 'id-ID') }}
            </span>
          </div>

          <div v-if="time" class="flex items-center gap-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="h-4 w-4 shrink-0 text-brand-400"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75l4 4a.75.75 0 101.06-1.06l-3.25-3.25V5.75z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="uppercase">{{ formatTime(time) }}</span>
          </div>

          <div
            v-if="location"
            class="flex items-center gap-1.5 overflow-hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="h-4 w-4 shrink-0 text-brand-400"
            >
              <path
                fill-rule="evenodd"
                d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.006.003.002.001.003.001a.75.75 0 01-.69 1.35H9.69zM10 12a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="line-clamp-1 break-all" :title="location">{{
              location
            }}</span>
          </div>
        </div>
      </div>

      <div class="mt-auto space-y-4">
        <p
          v-if="description"
          class="line-clamp-2 text-sm leading-relaxed text-zinc-300/80"
        >
          {{ description }}
        </p>

        <div
          class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 opacity-80 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-300 group-hover:opacity-100"
        >
          {{ t('common.read_more') }}
          <span
            aria-hidden="true"
            class="transition-transform group-hover:translate-x-0.5"
            >→</span
          >
        </div>
      </div>
    </div>
  </RouterLink>
</template>
