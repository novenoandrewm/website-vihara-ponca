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

const padding = computed(() => (props.padded ? 'px-4 sm:px-6 lg:px-8' : ''))

const cls = computed(() =>
  ['mx-auto w-full', maxW.value, padding.value].filter(Boolean).join(' ')
)
</script>

<template>
  <component :is="as" :class="cls">
    <slot />
  </component>
</template>
