<!-- src/components/NavBar.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n({ useScope: 'global' })
const open = ref(false)
const toggle = () => (open.value = !open.value)
const close = () => (open.value = false)

// persist bahasa
watch(locale, (v) => localStorage.setItem('locale', String(v)))

// Tutup menu ketika tekan ESC (aksesibilitas)
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <nav class="bg-zinc-950 text-zinc-100">
    <div class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
      <router-link to="/" class="font-semibold"
        >Vihara Avalokitesvara</router-link
      >

      <!-- DESKTOP -->
      <div class="hidden gap-4 text-sm md:flex">
        <router-link v-slot="{ isActive }" to="/">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">
            {{ t('nav.home') }}
          </span>
        </router-link>

        <router-link v-slot="{ isActive }" to="/pmv">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">
            {{ t('nav.pmv') }}
          </span>
        </router-link>

        <router-link v-slot="{ isActive }" to="/gabi">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">
            {{ t('nav.gabi') }}
          </span>
        </router-link>
      </div>

      <!-- spacer -->
      <div class="flex-1"></div>

      <!-- language (desktop) -->
      <div class="hidden items-center gap-2 md:flex">
        <button
          type="button"
          class="rounded bg-zinc-800 px-2 py-1 text-xs"
          @click="locale = 'id'"
        >
          ID
        </button>
        <button
          type="button"
          class="rounded bg-zinc-800 px-2 py-1 text-xs"
          @click="locale = 'en'"
        >
          EN
        </button>
      </div>

      <!-- mobile hamburger -->
      <button
        id="menu-button"
        class="rounded bg-zinc-800 p-2 md:hidden"
        aria-controls="mobile-menu"
        :aria-expanded="open"
        aria-label="Toggle navigation"
        type="button"
        @click="toggle"
      >
        ☰
      </button>
    </div>

    <!-- MOBILE -->
    <div
      v-show="open"
      id="mobile-menu"
      class="border-t border-zinc-800 px-4 pb-3 md:hidden"
    >
      <div class="flex flex-col gap-2 py-3 text-sm">
        <router-link v-slot="{ isActive }" to="/" @click="close">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">{{
            t('nav.home')
          }}</span>
        </router-link>
        <router-link v-slot="{ isActive }" to="/pmv" @click="close">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">{{
            t('nav.pmv')
          }}</span>
        </router-link>
        <router-link v-slot="{ isActive }" to="/gabi" @click="close">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">{{
            t('nav.gabi')
          }}</span>
        </router-link>
      </div>

      <div class="flex gap-2">
        <button
          type="button"
          class="rounded bg-zinc-800 px-2 py-1 text-xs"
          @click="locale = 'id'"
        >
          ID
        </button>
        <button
          type="button"
          class="rounded bg-zinc-800 px-2 py-1 text-xs"
          @click="locale = 'en'"
        >
          EN
        </button>
      </div>
    </div>
  </nav>
</template>
