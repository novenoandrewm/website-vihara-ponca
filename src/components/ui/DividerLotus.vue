<!-- src/components/ui/DividerLotus.vue -->
<script setup lang="ts">
withDefaults(
  defineProps<{
    compact?: boolean
    size?: string
    lineColor?: string
  }>(),
  {
    compact: false,
    size: 'h-5 w-5',
    lineColor: 'from-transparent via-zinc-800/80 to-transparent',
  }
)
</script>

<template>
  <div
    aria-hidden="true"
    :class="compact ? 'my-8' : 'my-10 md:my-12'"
    class="flex items-center justify-center gap-4"
  >
    <div :class="`h-px flex-1 bg-gradient-to-r ${lineColor}`" />

    <svg
      viewBox="0 0 64 64"
      :class="[size, 'text-brand-300/80 transition-all duration-500']"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 44c6.5-6 9-13.2 9-19 0-7-4-12-9-16-5 4-9 9-9 16 0 5.8 2.5 13 9 19Z"
        stroke="currentColor"
        stroke-width="inherit"
        stroke-linejoin="round"
      />
      <path
        d="M22 43c-6-3-10-8-12-14 8 0 14 2.8 18 7.5"
        stroke="currentColor"
        stroke-width="inherit"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M42 43c6-3 10-8 12-14-8 0-14 2.8-18 7.5"
        stroke="currentColor"
        stroke-width="inherit"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <div :class="`h-px flex-1 bg-gradient-to-r ${lineColor}`" />
  </div>
</template>
