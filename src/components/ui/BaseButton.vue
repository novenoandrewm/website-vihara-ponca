<!-- src/components/ui/BaseButton.vue -->
<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'
type BtnType = 'button' | 'submit' | 'reset'
type Tag = 'button' | 'a'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    type?: BtnType
    disabled?: boolean
    loading?: boolean
    as?: Tag
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    as: 'button',
  }
)

const isDisabled = computed(() => props.disabled || props.loading)

const cls = computed(() => {
  const base = [
    'relative inline-flex items-center justify-center gap-2',
    'rounded-xl font-medium',
    'transition will-change-transform motion-reduce:transition-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    'select-none',
  ].join(' ')

  const sizes: Record<Size, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
  }

  const variants: Record<Variant, string> = {
    primary: [
      'text-zinc-950',
      'bg-gradient-to-b from-brand-300 via-brand-500 to-brand-600',
      'shadow-glow',
      'hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
      'active:translate-y-0',
      'after:pointer-events-none after:absolute after:inset-0 after:rounded-xl',
      'after:ring-1 after:ring-white/10',
    ].join(' '),

    secondary: [
      'border border-zinc-800 bg-zinc-900/60 text-zinc-100',
      'shadow-insetSoft',
      'hover:bg-zinc-900 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
      'active:translate-y-0',
      'after:pointer-events-none after:absolute after:inset-0 after:rounded-xl',
      'after:ring-1 after:ring-white/5',
    ].join(' '),

    ghost: [
      'border border-transparent bg-transparent text-zinc-100',
      'hover:border-zinc-800 hover:bg-zinc-900/60',
      'hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
      'active:translate-y-0',
    ].join(' '),

    danger: [
      'border border-red-800/40 bg-red-900/30 text-red-200',
      'hover:bg-red-900/45 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0',
      'active:translate-y-0',
    ].join(' '),
  }

  const loadingClass = props.loading ? 'pointer-events-none' : ''

  return [base, sizes[props.size], variants[props.variant], loadingClass].join(
    ' '
  )
})
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    :class="cls"
    :disabled="as === 'button' ? isDisabled : undefined"
    :aria-disabled="as !== 'button' ? String(isDisabled) : undefined"
  >
    <!-- subtle top shine -->
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-2 top-1 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-45"
    />

    <!-- loading spinner -->
    <span
      v-if="loading"
      class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-950/30 border-t-zinc-950"
      aria-hidden="true"
    />
    <span class="relative">
      <slot />
    </span>
  </component>
</template>
