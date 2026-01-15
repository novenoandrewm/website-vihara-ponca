<!-- src/layouts/MainLayout.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import NavBar from '@/components/layout/NavBar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const { t } = useI18n({ useScope: 'global' })
const route = useRoute()

// Key transition
const viewKey = computed(() => route.fullPath)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:rounded-xl focus:bg-zinc-900/80 focus:px-3 focus:py-2 focus:text-white focus:shadow-soft"
    >
      {{ t('nav.skip_to_content', 'Lompat ke konten') }}
    </a>

    <NavBar />

    <main id="main" tabindex="-1" class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in" appear>
          <component :is="Component" :key="viewKey" />
        </Transition>
      </RouterView>
    </main>

    <AppFooter class="mt-auto" />
  </div>
</template>

<style>
/* Page transition: Optimized for Mobile */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 260ms ease,
    transform 260ms ease,
    filter 260ms ease;
  /* Optimization: Hints browser to use GPU */
  will-change: transform, opacity, filter;
  /* Optimization: Fix for Safari flickering */
  backface-visibility: hidden;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
  filter: blur(2px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
  filter: blur(1px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
  .page-enter-from,
  .page-leave-to {
    transform: none;
    filter: none;
  }
}
</style>
