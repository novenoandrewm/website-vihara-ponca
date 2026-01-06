<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getEventById, type EventItem } from '@/services/events'
import SkeletonCard from '@/components/cards/SkeletonCard.vue'
import { formatDate } from '@/utils/formatDate'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n({ useScope: 'global' })

const event = ref<EventItem | null>(null)
const loading = ref(true)
const errorMsg = ref<string | null>(null)

onMounted(async () => {
  const id = String(route.params.id)
  try {
    const data = await getEventById(id)
    if (!data) {
      errorMsg.value = t('event.not_found')
    } else {
      event.value = data
    }
  } catch {
    errorMsg.value = t('event.error_load')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main id="main" tabindex="-1" class="mx-auto max-w-6xl space-y-6 p-6">
    <div v-if="loading">
      <SkeletonCard />
    </div>

    <div
      v-else-if="errorMsg"
      role="alert"
      aria-live="polite"
      class="rounded-xl border border-red-700/40 bg-red-900/20 p-4 text-red-200"
    >
      {{ errorMsg }}
    </div>

    <article v-else-if="event" class="space-y-4">
      <h1 class="text-2xl font-semibold">{{ event.title }}</h1>
      <p class="text-sm text-zinc-300">
        {{ formatDate(event.date) }} · {{ event.location }}
      </p>
      <p class="text-sm text-zinc-300">
        {{ t('categories.' + event.category) }}
      </p>
      <p class="text-zinc-200">{{ event.description }}</p>
      <router-link
        to="/"
        class="inline-block rounded bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
      >
        {{ t('event.back') }}
      </router-link>
    </article>
  </main>
</template>
