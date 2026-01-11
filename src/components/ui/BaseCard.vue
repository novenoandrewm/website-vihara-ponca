<!-- src/components/ui/BaseCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'

type CardTag = 'article' | 'section' | 'div'
type Tone = 'gold' | 'jade' | 'neutral'

const props = withDefaults(
  defineProps<{
    hover?: boolean
    padded?: boolean
    as?: CardTag
    interactive?: boolean
    tone?: Tone
  }>(),
  {
    hover: false,
    padded: true,
    as: 'article',
    interactive: false,
    tone: 'neutral',
  }
)

const paddingClass = computed(() => (props.padded ? 'p-5 md:p-6' : ''))

// Outer gilded frame (premium border)
const frameClass = computed(() => {
  if (props.tone === 'jade') {
    return 'bg-gradient-to-br from-jade-400/28 via-white/6 to-jade-800/14'
  }
  if (props.tone === 'gold') {
    return 'bg-gradient-to-br from-brand-400/32 via-white/6 to-brand-800/16'
  }
  return 'bg-gradient-to-br from-zinc-700/35 via-white/5 to-brand-700/12'
})

const borderClass = computed(() => {
  if (props.tone === 'jade') return 'border-jade-500/14'
  if (props.tone === 'gold') return 'border-brand-500/14'
  return 'border-zinc-800/70'
})

const hoverClass = computed(() => {
  if (!props.hover) return ''
  const toneBorder =
    props.tone === 'jade'
      ? 'hover:border-jade-300/26'
      : props.tone === 'gold'
        ? 'hover:border-brand-300/26'
        : 'hover:border-brand-400/22'

  return [
    'transition will-change-transform motion-reduce:transition-none',
    'hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
    toneBorder,
    'hover:shadow-glow',
  ].join(' ')
})

const interactiveClass = computed(() => {
  if (!props.interactive) return ''
  const ring =
    props.tone === 'jade'
      ? 'focus-visible:ring-jade-400/45'
      : 'focus-visible:ring-brand-400/55'

  return [
    'cursor-pointer',
    'focus:outline-none focus-visible:ring-2',
    ring,
    'focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
  ].join(' ')
})

const ringTint = computed(() => {
  if (props.tone === 'jade') return 'ring-jade-400/10'
  if (props.tone === 'gold') return 'ring-brand-400/12'
  return 'ring-white/5'
})

const topShine = computed(() => {
  if (props.tone === 'jade') {
    return 'bg-gradient-to-r from-transparent via-jade-200/10 to-transparent'
  }
  if (props.tone === 'gold') {
    return 'bg-gradient-to-r from-transparent via-brand-200/12 to-transparent'
  }
  return 'bg-gradient-to-r from-transparent via-white/10 to-transparent'
})

const auraGlow = computed(() => {
  if (props.tone === 'jade') return 'bg-jade-500/8'
  if (props.tone === 'gold') return 'bg-brand-500/9'
  return 'bg-white/4'
})

const outerClassName = computed(() =>
  [
    'relative overflow-hidden rounded-2xl p-px shadow-soft backdrop-blur',
    frameClass.value,
    props.hover ? 'hover:shadow-glow' : '',
    props.interactive ? 'outline-none' : '',
    'h-full',
  ]
    .filter(Boolean)
    .join(' ')
)

const innerClassName = computed(() =>
  [
    'relative overflow-hidden rounded-2xl border bg-zinc-950/35',
    borderClass.value,
    paddingClass.value,
    hoverClass.value,
    interactiveClass.value,
    'h-full flex flex-col',
  ]
    .filter(Boolean)
    .join(' ')
)

const tabIndex = computed(() => (props.interactive ? 0 : -1))
</script>

<template>
  <component :is="as" :class="outerClassName" :tabindex="tabIndex">
    <div :class="innerClassName">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 rounded-2xl ring-1"
        :class="ringTint"
      />

      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-0 h-px"
        :class="topShine"
      />

      <div
        aria-hidden="true"
        class="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl"
        :class="auraGlow"
      />
      <div
        aria-hidden="true"
        class="bg-brand-500/4 pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full blur-3xl"
      />

      <header v-if="$slots.header" class="mb-4 shrink-0">
        <slot name="header" />
      </header>

      <div class="flex flex-1 flex-col">
        <slot />
      </div>

      <footer
        v-if="$slots.footer"
        class="mt-auto shrink-0 pt-5 text-sm text-zinc-300"
      >
        <slot name="footer" />
      </footer>
    </div>
  </component>
</template>
