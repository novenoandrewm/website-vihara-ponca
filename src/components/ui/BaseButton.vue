<!-- src/components/ui/BaseButton.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'
type BtnType = 'button' | 'submit' | 'reset'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    type?: BtnType
    disabled?: boolean
    loading?: boolean
    to?: string
    href?: string
    as?: string
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
  }
)

const isDisabled = computed(() => props.disabled || props.loading)

const componentTag = computed(() => {
  if (props.to) return RouterLink
  if (props.href) return 'a'
  return props.as || 'button'
})

const cls = computed(() => {
  const base = [
    'relative inline-flex items-center justify-center gap-2',
    'rounded-xl font-medium',
    'transition-all duration-200 ease-out', // Smoother transition
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    'select-none',
    'transform-gpu',
    'active:scale-[0.98]',
  ].join(' ')

  const sizes: Record<Size, string> = {
    // Touch targets optimized (Mobile Friendly)
    sm: 'px-3 py-1.5 text-xs min-h-[36px]',
    md: 'px-5 py-2.5 text-sm min-h-[44px]', // Standard Touch Target (44px)
    lg: 'px-6 py-3.5 text-base min-h-[48px]', // Large Touch Target
  }

  const variants: Record<Variant, string> = {
    primary: [
      'text-zinc-950',
      'bg-gradient-to-b from-brand-300 via-brand-500 to-brand-600',
      'shadow-lg shadow-brand-500/20',
      'hover:brightness-110 hover:shadow-brand-500/30 hover:-translate-y-0.5',
      'active:translate-y-0',
      'after:pointer-events-none after:absolute after:inset-0 after:rounded-xl',
      'after:ring-1 after:ring-white/20', // Crisper ring
    ].join(' '),

    secondary: [
      'border border-zinc-800 bg-zinc-900/80 text-zinc-100',
      'hover:bg-zinc-800 hover:border-zinc-700 hover:-translate-y-0.5',
      'active:translate-y-0',
      'after:pointer-events-none after:absolute after:inset-0 after:rounded-xl',
      'after:ring-1 after:ring-white/5',
    ].join(' '),

    ghost: [
      'border border-transparent bg-transparent text-zinc-300',
      'hover:text-zinc-50 hover:bg-zinc-800/50',
      'active:bg-zinc-800/70',
    ].join(' '),

    danger: [
      'border border-red-900/30 bg-red-900/20 text-red-200',
      'hover:bg-red-900/30 hover:border-red-500/30 hover:-translate-y-0.5',
      'active:translate-y-0',
    ].join(' '),
  }

  const loadingClass = props.loading ? 'pointer-events-none opacity-90' : ''

  return [base, sizes[props.size], variants[props.variant], loadingClass].join(
    ' '
  )
})
</script>

<template>
  <component
    :is="componentTag"
    :to="to"
    :href="href"
    :type="!to && !href ? type : undefined"
    :class="cls"
    :disabled="!to && !href ? isDisabled : undefined"
    :aria-disabled="to || href ? String(isDisabled) : undefined"
  >
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-2 top-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50"
    />

    <span
      v-if="loading"
      class="absolute left-1/2 top-1/2 -ml-2 -mt-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />

    <span
      :class="[
        'relative flex items-center gap-2',
        loading ? 'opacity-0' : 'opacity-100',
      ]"
    >
      <slot />
    </span>
  </component>
</template>
