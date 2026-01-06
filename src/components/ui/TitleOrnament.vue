<!-- src/components/ui/TitleOrnament.vue -->
<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'gold' | 'jade'
type Align = 'start' | 'center'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    tone?: Tone
    align?: Align
    symbol?: string
    size?: Size
  }>(),
  {
    tone: 'gold',
    align: 'center',
    symbol: '卍',
    size: 'md',
  }
)

const toneClass = computed(() =>
  props.tone === 'jade' ? 'ornament--jade' : 'ornament--gold'
)
const alignClass = computed(() =>
  props.align === 'start' ? 'justify-start' : 'justify-center'
)
const sizeClass = computed(() => {
  if (props.size === 'sm') return 'ornament--sm'
  if (props.size === 'lg') return 'ornament--lg'
  return 'ornament--md'
})
</script>

<template>
  <div
    class="ornament"
    :class="[toneClass, alignClass, sizeClass]"
    aria-hidden="true"
  >
    <span class="ornament__line" />
    <span class="ornament__symbol">{{ symbol }}</span>
    <span class="ornament__line" />
  </div>
</template>

<style scoped>
.ornament {
  display: flex;
  align-items: center;
  gap: 16px;
  user-select: none;
}

.ornament--sm .ornament__line {
  width: clamp(120px, 18vw, 340px);
  height: 2px;
}
.ornament--sm .ornament__symbol {
  font-size: 14px;
}

.ornament--md .ornament__line {
  width: clamp(180px, 26vw, 620px);
  height: 2px;
}
.ornament--md .ornament__symbol {
  font-size: 18px;
}
.ornament--lg .ornament__line {
  width: clamp(220px, 34vw, 860px);
  height: 2px;
}
.ornament--lg .ornament__symbol {
  font-size: 18px;
}

.ornament__line {
  border-radius: 9999px;
  background: linear-gradient(to right, transparent, var(--tone), transparent);
  box-shadow: 0 0 22px var(--glow);
  opacity: 0.95;
}

.ornament__symbol {
  color: var(--tone);
  filter: drop-shadow(0 0 12px var(--glow));
  opacity: 0.95;
  line-height: 1;
}

/* tones */
.ornament--gold {
  --tone: rgba(245, 181, 72, 0.95);
  --glow: rgba(245, 181, 72, 0.24);
}

.ornament--jade {
  --tone: rgba(52, 211, 153, 0.95);
  --glow: rgba(52, 211, 153, 0.26);
}
</style>
