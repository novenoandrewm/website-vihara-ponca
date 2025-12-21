<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import HeroSection from '@/components/HeroSection.vue'
import EventCard from '@/components/EventCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'

import { getUpcomingEvents, type EventItem } from '@/services/events'
import { getLatestQuote, type QuoteItem } from '@/services/quotes'
import { upsertJsonLd, eventsItemListSchema } from '@/utils/structured'

// i18n
const { t } = useI18n({ useScope: 'global' })

// state acara
const events = ref<EventItem[]>([])
const errorMsg = ref<string | null>(null)
const loading = ref(true)

// state filter kategori (tidak diubah dari versi sebelumnya)
const selectedCategory = ref<'all' | 'pmv' | 'gabi' | 'general'>('all')
const filteredEvents = computed(() =>
  selectedCategory.value === 'all'
    ? events.value
    : events.value.filter((e) => e.category === selectedCategory.value)
)

// state kutipan mingguan
const quote = ref<QuoteItem | null>(null)
const quoteLoading = ref(true)
const quoteError = ref<string | null>(null)

onMounted(async () => {
  // muat acara
  try {
    const data = await getUpcomingEvents()
    events.value = data
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

  // muat kutipan
  try {
    quote.value = await getLatestQuote()
  } catch {
    quoteError.value = t('home.quote_error', 'Gagal memuat kutipan mingguan.')
  } finally {
    quoteLoading.value = false
  }
})
</script>

<template>
  <main id="main" tabindex="-1" class="mx-auto max-w-6xl space-y-6 p-6">
    <HeroSection />

    <!-- Bagian Weekly Quote -->
    <section class="rounded-2xl border border-zinc-700 bg-zinc-800/60 p-4">
      <h2 class="mb-2 text-xl font-semibold">
        {{ t('home.weekly_quote_title') }}
      </h2>
      <p v-if="quoteError" class="text-red-300">{{ quoteError }}</p>
      <p v-else-if="quoteLoading" class="text-zinc-400">
        {{ t('home.quote_loading') }}
      </p>
      <div v-else-if="quote">
        <blockquote class="text-lg italic text-zinc-200">
          “{{ quote.text }}”
        </blockquote>
        <footer class="mt-2 text-sm text-zinc-400">— {{ quote.source }}</footer>
      </div>
      <p v-else class="text-zinc-400">
        {{ t('home.no_quote') }}
      </p>
    </section>

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
      {{ t('home.no_events') }}
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
            selectedCategory === cat
              ? 'bg-brand-500 text-white'
              : 'bg-zinc-700 text-zinc-200'
          "
          @click="selectedCategory = cat as any"
        >
          {{ t('categories.' + cat) }}
        </button>
      </div>

      <!-- List acara -->
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

    <!-- About Vihara -->
    <section class="mt-6 rounded-2xl border border-zinc-700 bg-zinc-800/60 p-4">
      <h2 class="mb-2 text-xl font-semibold">
        {{ t('home.about_title') }}
      </h2>
      <p class="text-zinc-300">
        {{ t('home.about_description') }}
      </p>
    </section>
  </main>
</template>
