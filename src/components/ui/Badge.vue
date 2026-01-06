<!-- src/components/ui/Badge.vue -->
<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'gold' | 'neutral' | 'jade'
type Size = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    tone?: Tone
    size?: Size
  }>(),
  {
    tone: 'gold',
    size: 'md',
  }
)

const cls = computed(() => {
  const base = [
    'inline-flex items-center gap-1',
    'rounded-full border font-medium',
    'backdrop-blur-sm shadow-insetSoft',
    'select-none',
    'bg-gradient-to-b from-white/6 to-transparent',
  ].join(' ')

  const sizes: Record<Size, string> = {
    sm: 'px-2.5 py-0.5 text-[11px] tracking-[0.10em]',
    md: 'px-3 py-1 text-xs tracking-[0.10em]',
  }

  const tones: Record<Tone, string> = {
    gold: [
      'border-brand-400/28 bg-brand-500/10 text-brand-200',
      'ring-1 ring-brand-400/10',
    ].join(' '),
    jade: [
      'border-jade-400/28 bg-jade-500/10 text-jade-200',
      'ring-1 ring-jade-400/10',
    ].join(' '),
    neutral: [
      'border-zinc-700/60 bg-zinc-900/40 text-zinc-200',
      'ring-1 ring-white/5',
    ].join(' '),
  }

  return [base, sizes[props.size], tones[props.tone]].join(' ')
})
</script>

<template>
  <span :class="cls">
    <slot />
  </span>
</template>
