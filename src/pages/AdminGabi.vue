<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <main id="main" tabindex="-1" class="mx-auto max-w-6xl space-y-4 p-6">
    <h1 class="text-2xl font-semibold">
      {{ t('admin.gabi.title', 'Kelola Kegiatan GABI') }}
    </h1>
    <p class="text-zinc-300">
      Halaman admin untuk mengelola konten GABI. (CRUD akan kita isi berikutnya)
    </p>
  </main>
</template>
