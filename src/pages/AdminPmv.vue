<!-- src/pages/AdminPmv.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AdminEventsManager from '@/components/admin/AdminEventsManager.vue'

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <AdminEventsManager category="pmv" :pageTitle="t('admin.pmv.title')" />
</template>
