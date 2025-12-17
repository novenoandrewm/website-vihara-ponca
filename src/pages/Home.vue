<!-- src/pages/Home.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

import HeroSection from '@/components/HeroSection.vue'
import EventCard from '@/components/EventCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'

import { getUpcomingEvents, type EventItem } from '@/services/events'
import { upsertJsonLd, eventsItemListSchema } from '@/utils/structured'

const { t } = useI18n({ useScope: 'global' })

// state utama
const events = ref<EventItem[]>([])
const errorMsg = ref<string | null>(null)
const loading = ref(true)

// filter kategori
const selectedCategory = ref<'all' | 'pmv' | 'gabi' | 'general'>('all')

const filteredEvents = computed(() =>
  selectedCategory.value === 'all'
    ? events.value
    : events.value.filter((e) => e.category === selectedCategory.value)
)

onMounted(async () => {
  try {
    const data = await getUpcomingEvents()
    events.value = data

    // inject JSON-LD hanya kalau ada event
    if (Array.isArray(data) && data.length > 0) {
      upsertJsonLd('events', eventsItemListSchema(data))
    }
  } catch {
    errorMsg.value = t(
      'home.error',
      'Gagal memuat data acara. Silakan coba muat ulang.'
    )
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main id="main" tabindex="-1" class="mx-auto max-w-6xl space-y-6 p-6">
    <HeroSection />

    <!-- Error -->
    <div
      v-if="errorMsg"
      role="alert"
      aria-live="polite"
      class="rounded-xl border border-red-700/40 bg-red-900/20 p-4 text-red-200"
    >
      {{ errorMsg }}
    </div>

    <!-- Loading -->
    <section v-else-if="loading" class="grid gap-4 md:grid-cols-2">
      <SkeletonCard />
      <SkeletonCard />
    </section>

    <!-- Empty -->
    <section v-else-if="filteredEvents.length === 0" class="text-zinc-300">
      {{ t('home.no_events', 'Belum ada kegiatan terjadwal.') }}
    </section>

    <!-- Data -->
    <section v-else class="space-y-4">
      <!-- Filter -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in ['all', 'pmv', 'gabi', 'general']"
          :key="cat"
          class="rounded px-3 py-1 text-sm"
          :class="
            selectedCategory === (cat as any)
              ? 'bg-brand-500 text-white'
              : 'bg-zinc-700 text-zinc-200'
          "
          @click="selectedCategory = cat as any"
        >
          {{ t('categories.' + cat, cat) }}
        </button>
      </div>

      <!-- List -->
      <div class="grid gap-4 md:grid-cols-2">
        <EventCard
          v-for="e in filteredEvents"
          :id="`event-${e.id}`"
          :key="e.id"
          :title="e.title"
          :date="e.date"
          :location="e.location"
          :description="e.description"
        />
      </div>
    </section>
  </main>
</template>
