<!-- src/components/cards/SkeletonCard.vue -->
<script setup lang="ts">
type CardTone = 'default' | 'temple'

const props = withDefaults(
  defineProps<{
    lines?: number
    showTitle?: boolean
    showMeta?: boolean
    tone?: CardTone
  }>(),
  {
    lines: 3,
    showTitle: true,
    showMeta: true,
    tone: 'temple',
  }
)

function lineWidth(i: number, total: number): string {
  // deterministic “natural” widths
  if (i === total) return 'w-2/3'
  if (i % 4 === 0) return 'w-11/12'
  if (i % 3 === 0) return 'w-5/6'
  return 'w-full'
}

function toneClass(tone: CardTone): string {
  return tone === 'default'
    ? 'border-zinc-800/70 bg-zinc-950/40'
    : 'border-zinc-800/60 bg-zinc-950/45'
}
</script>

<template>
  <div
    class="relative overflow-hidden rounded-2xl p-5 shadow-soft backdrop-blur md:p-6"
    :class="toneClass(props.tone)"
    aria-busy="true"
    aria-label="Loading"
    role="status"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 opacity-40"
    >
      <div
        class="absolute -left-14 -top-14 h-40 w-40 rounded-full bg-brand-500/10 blur-2xl"
      />
      <div
        class="bg-jade-500/8 absolute -right-16 top-12 h-44 w-44 rounded-full blur-2xl"
      />
    </div>

    <div
      aria-hidden="true"
      class="via-white/6 pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_1.7s_infinite] bg-gradient-to-r from-transparent to-transparent"
    />

    <div class="relative">
      <div v-if="showTitle" class="h-5 w-2/3 rounded bg-zinc-800/70" />
      <div v-if="showMeta" class="mt-2 h-4 w-1/3 rounded bg-zinc-800/50" />

      <div class="mt-4 space-y-2">
        <div
          v-for="i in props.lines"
          :key="i"
          class="h-4 rounded bg-zinc-800/50"
          :class="lineWidth(i, props.lines)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-110%);
  }
  100% {
    transform: translateX(130%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-\[shimmer_1\.7s_infinite\] {
    animation: none !important;
  }
}
</style>
