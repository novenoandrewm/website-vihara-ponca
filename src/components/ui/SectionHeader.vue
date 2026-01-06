<!-- src/components/ui/SectionHeader.vue -->
<script setup lang="ts">
import { computed } from 'vue'

type Align = 'left' | 'center'
type Tone = 'gold' | 'jade' | 'neutral'
type HeadingTag = 'h1' | 'h2' | 'h3'
type Size = 'default' | 'page' | 'hero'
type Separator = 'none' | 'line' | 'mantra'

const props = withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    align?: Align
    as?: HeadingTag
    showDot?: boolean
    tone?: Tone
    size?: Size
    separator?: Separator
  }>(),
  {
    align: 'left',
    as: 'h2',
    showDot: true,
    tone: 'gold',
    size: 'default',
    separator: 'mantra',
  }
)

const wrapAlign = computed(() =>
  props.align === 'center' ? 'text-center' : 'text-left'
)

const titleGradient = computed(() => {
  if (props.tone === 'jade') {
    // jade + warm highlight (tetap premium, tidak neon)
    return 'bg-gradient-to-r from-jade-200 via-jade-100 to-brand-200'
  }
  if (props.tone === 'neutral') {
    return 'bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-100'
  }
  // premium gold text gradient (dari tailwind.config: gold-text)
  return 'bg-gold-text'
})

const dotClass = computed(() => {
  if (props.tone === 'jade') return 'text-jade-300'
  if (props.tone === 'neutral') return 'text-zinc-300'
  return 'text-brand-300'
})

const titleSizeClass = computed(() => {
  if (props.size === 'hero') return 'text-4xl md:text-6xl'
  if (props.size === 'page') return 'text-3xl md:text-4xl'
  return 'text-3xl md:text-5xl'
})

const titleTrackClass = computed(() => {
  if (props.size === 'page') return 'tracking-[0.05em]'
  if (props.size === 'hero') return 'tracking-[0.07em]'
  return 'tracking-[0.06em]'
})

const subtitleSizeClass = computed(() => {
  if (props.size === 'page') return 'text-base md:text-lg'
  return 'text-lg md:text-xl'
})

const lineWidthClass = computed(() => {
  // biar divider “keliatan” dan elegan (center)
  if (props.size === 'hero') return 'w-64 md:w-[560px]'
  if (props.size === 'page') return 'w-64 md:w-[520px]'
  return 'w-48 md:w-72'
})

const lineClass = computed(() => {
  if (props.separator === 'line') {
    // GOLD divider mewah (dari tailwind.config: gold-line)
    return [
      'bg-gold-line',
      'h-[2px] md:h-[3px]',
      'rounded-full',
      'opacity-95',
      'shadow-[0_0_22px_rgba(245,181,72,0.18)]',
    ].join(' ')
  }

  // MANTRA divider
  if (props.tone === 'jade') {
    return 'bg-gradient-to-r from-transparent via-brand-400/45 to-transparent'
  }
  if (props.tone === 'neutral') {
    return 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
  }
  return 'bg-gradient-to-r from-transparent via-brand-400/55 to-transparent'
})

const mantraClass = computed(() => {
  if (props.tone === 'jade') return 'text-brand-300/70'
  if (props.tone === 'neutral') return 'text-zinc-400/70'
  return 'text-brand-300/75'
})

const subtitleClass = computed(() => {
  const align =
    props.align === 'center' ? 'mx-auto text-center' : 'mx-0 text-left'
  return [
    'font-sutra',
    align,
    'max-w-3xl',
    subtitleSizeClass.value,
    'leading-relaxed',
    'text-zinc-200',
  ].join(' ')
})

const showSeparator = computed(() => props.separator !== 'none')
</script>

<template>
  <header :class="wrapAlign" class="space-y-4">
    <component
      :is="as"
      class="font-display font-semibold leading-tight"
      :class="[titleSizeClass, titleTrackClass]"
    >
      <span
        :class="titleGradient"
        class="bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(0,0,0,0.55)]"
      >
        {{ title }}
      </span>
      <span v-if="showDot" :class="dotClass">.</span>
    </component>

    <!-- Divider BETWEEN title & subtitle -->
    <div
      v-if="showSeparator"
      class="flex items-center justify-center"
      aria-hidden="true"
    >
      <!-- Simple GOLD line -->
      <div
        v-if="props.separator === 'line'"
        :class="[lineWidthClass, lineClass]"
      />

      <!-- Mantra style -->
      <div v-else class="flex w-full items-center gap-3">
        <div :class="lineClass" class="h-px flex-1" />
        <span
          :class="mantraClass"
          class="font-mantra text-xs tracking-[0.22em]"
        >
          ॐ
        </span>
        <div :class="lineClass" class="h-px flex-1" />
      </div>
    </div>

    <p v-if="subtitle" :class="subtitleClass">
      {{ subtitle }}
    </p>
  </header>
</template>
