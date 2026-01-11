<!-- src/pages/NotFound.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <main class="grid min-h-[60vh] place-items-center p-6 text-center">
    <div class="rounded-2xl bg-zinc-800/60 p-10 shadow-2xl backdrop-blur-sm">
      <h1 class="mb-2 font-display text-5xl font-bold text-zinc-100">404</h1>
      <p class="mb-6 text-zinc-400">
        {{ t('not_found.message', 'Halaman tidak ditemukan.') }}
      </p>
      <router-link
        to="/"
        class="inline-block rounded-xl bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-white hover:shadow-lg"
      >
        {{ t('not_found.back_btn', 'Kembali ke Beranda') }}
      </router-link>
    </div>
  </main>
</template>
