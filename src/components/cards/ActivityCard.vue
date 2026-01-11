<!-- src/components/cards/ActivityCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RouteLocationRaw } from 'vue-router'
import BaseCard from '@/components/ui/BaseCard.vue'
import Badge from '@/components/ui/Badge.vue'

const { t } = useI18n({ useScope: 'global' })

type Tone = 'gold' | 'neutral' | 'jade'

const props = withDefaults(
  defineProps<{
    title: string
    date: string
    location: string
    desc?: string
    badge?: string
    tone?: Tone
    to?: RouteLocationRaw
  }>(),
  { tone: 'neutral' }
)

const ornamentLine = computed<string>(() => {
  return [
    'bg-gradient-to-r from-transparent via-brand-400/70 to-transparent',
    'opacity-95',
    'relative',
    'after:pointer-events-none after:absolute after:inset-0',
    'after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent',
  ].join(' ')
})

const titleClass = computed<string>(() => {
  const tint =
    props.tone === 'jade'
      ? 'from-zinc-50 via-zinc-50 to-jade-200/85'
      : props.tone === 'gold'
        ? 'from-zinc-50 via-brand-100/95 to-brand-300/85'
        : 'from-zinc-50 via-zinc-50 to-brand-100/70'

  return [
    'font-display',
    'text-lg md:text-xl',
    'font-semibold',
    'tracking-[0.08em]',
    'bg-gradient-to-r',
    tint,
    'bg-clip-text text-transparent',
    'drop-shadow-[0_1px_0_rgba(0,0,0,0.55)]',
  ].join(' ')
})

const isLink = computed(() => Boolean(props.to))
const linkRing = computed(() => {
  return props.tone === 'jade'
    ? 'focus-visible:ring-jade-400/55'
    : 'focus-visible:ring-brand-400/60'
})
</script>

<template>
  <BaseCard
    hover
    :tone="props.tone"
    class="group"
    :class="isLink ? 'cursor-pointer' : ''"
  >
    <RouterLink
      v-if="isLink"
      :to="props.to!"
      class="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      :class="linkRing"
      :aria-label="`${t('common.view_detail', 'Lihat detail')}: ${props.title}`"
    >
      <span class="sr-only">{{ t('common.view_detail', 'Lihat detail') }}</span>
    </RouterLink>

    <template #header>
      <div class="flex items-start justify-between gap-3">
        <h3 :class="titleClass" class="transition group-hover:opacity-95">
          {{ props.title }}
        </h3>

        <Badge v-if="props.badge" :tone="props.tone" size="sm">
          {{ props.badge }}
        </Badge>
      </div>

      <div
        class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-300"
      >
        <span class="font-sutra">{{ props.date }}</span>
        <span class="text-zinc-600" aria-hidden="true">•</span>
        <span class="font-sutra">{{ props.location }}</span>
      </div>

      <div class="mt-4 h-px w-full" :class="ornamentLine" aria-hidden="true" />
    </template>

    <p
      v-if="props.desc"
      class="font-sutra text-sm leading-relaxed text-zinc-200 md:text-[15px]"
    >
      {{ props.desc }}
    </p>

    <template #footer>
      <div class="flex items-center justify-between font-sutra">
        <span class="text-xs text-zinc-500">{{
          t('common.activity_info', 'Info Kegiatan')
        }}</span>
        <span
          v-if="isLink"
          class="text-xs text-brand-200 transition group-hover:text-brand-100"
        >
          {{ t('common.detail', 'Detail') }} →
        </span>
      </div>
    </template>
  </BaseCard>
</template>
