<!-- src/pages/AdminGabi.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AdminEventsManager from '@/components/admin/AdminEventsManager.vue'

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <AdminEventsManager category="gabi" :pageTitle="t('admin.gabi.title')" />
</template>
