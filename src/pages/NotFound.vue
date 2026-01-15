<!-- src/pages/NotFound.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <main
    class="grid min-h-[80vh] place-items-center bg-zinc-950 p-6 text-center"
  >
    <div
      class="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/60 p-10 shadow-2xl backdrop-blur-md"
    >
      <h1
        class="mb-2 bg-gradient-to-br from-zinc-200 to-zinc-500 bg-clip-text font-display text-6xl font-bold text-transparent"
      >
        404
      </h1>
      <p class="mb-8 text-lg text-zinc-400">
        {{ t('not_found.message', 'Halaman tidak ditemukan.') }}
      </p>

      <router-link
        to="/"
        class="inline-block w-full rounded-xl bg-zinc-100 px-6 py-3 text-sm font-bold text-zinc-900 transition hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95 sm:w-auto"
      >
        {{ t('not_found.back_btn', 'Kembali ke Beranda') }}
      </router-link>
    </div>
  </main>
</template>
