<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HeroSection from '@/components/HeroSection.vue'
import EventCard from '@/components/EventCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import { getUpcomingEvents, type EventItem } from '@/services/events'
import { upsertJsonLd, eventsItemListSchema } from '@/utils/structured'

// state utama
const events = ref<EventItem[]>([])
const errorMsg = ref<string | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await getUpcomingEvents()
    events.value = data

    // inject JSON-LD hanya kalau ada event
    if (Array.isArray(data) && data.length > 0) {
      upsertJsonLd('events', eventsItemListSchema(data))
    }
  } catch {
    // pesan user-friendly
    errorMsg.value = 'Gagal memuat data acara. Silakan coba muat ulang.'
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
    <section v-else-if="events.length === 0" class="text-zinc-300">
      Belum ada kegiatan terjadwal.
    </section>

    <!-- Data -->
    <section v-else class="grid gap-4 md:grid-cols-2">
      <EventCard
        v-for="e in events"
        :id="`event-${e.id}`"
        :key="e.id"
        :title="e.title"
        :date="e.date"
        :location="e.location"
        :description="e.description"
      />
    </section>
  </main>
</template>
