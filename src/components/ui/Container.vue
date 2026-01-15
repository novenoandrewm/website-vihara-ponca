<!-- src/components/ui/Container.vue -->
<script setup lang="ts">
import { computed } from 'vue'

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl'
type ContainerTag = 'div' | 'section' | 'main' | 'header' | 'footer' | 'nav'

const props = withDefaults(
  defineProps<{
    size?: ContainerSize
    as?: ContainerTag
    padded?: boolean
  }>(),
  {
    size: 'lg',
    as: 'div',
    padded: true,
  }
)

const maxW = computed(() => {
  const map: Record<ContainerSize, string> = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
  }
  return map[props.size]
})

// Optimization: Mobile Safe Area (Notch) Support
const padding = computed(() => {
  if (!props.padded) return ''
  return [
    'pl-[max(1rem,env(safe-area-inset-left))]', // Left padding + notch safety
    'pr-[max(1rem,env(safe-area-inset-right))]', // Right padding + notch safety
    'sm:px-6', // Tablet padding overrides
    'lg:px-8', // Desktop padding overrides
  ].join(' ')
})

const cls = computed(() =>
  ['mx-auto w-full', maxW.value, padding.value].filter(Boolean).join(' ')
)
</script>

<template>
  <component :is="as" :class="cls">
    <slot />
  </component>
</template>
