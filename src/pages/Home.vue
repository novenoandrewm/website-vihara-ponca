<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Container from '@/components/ui/Container.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import EventCard from '@/components/cards/EventCard.vue'
import SkeletonCard from '@/components/cards/SkeletonCard.vue'

import { getUpcomingEvents, type EventItem } from '@/services/events'
import { getLatestQuote, type QuoteItem } from '@/services/quotes'
import { upsertJsonLd, eventsItemListSchema } from '@/utils/structured'

import buddhaQuotesImg from '@/assets/images/buddha-quotes.png'

const { t } = useI18n({ useScope: 'global' })

const events = ref<EventItem[]>([])
const loading = ref<boolean>(true)
const errorMsg = ref<string | null>(null)

const quote = ref<QuoteItem | null>(null)
const quoteLoading = ref<boolean>(true)
const quoteError = ref<string | null>(null)

type Category = 'pmv' | 'gabi' | 'general'
type CategoryFilter = 'all' | Category

const CATEGORIES: readonly CategoryFilter[] = [
  'all',
  'pmv',
  'gabi',
  'general',
] as const

const selectedCategory = ref<CategoryFilter>('all')
function setCategory(cat: CategoryFilter): void {
  selectedCategory.value = cat
}

const filteredEvents = computed<EventItem[]>(() => {
  if (selectedCategory.value === 'all') return events.value
  return events.value.filter((e) => e.category === selectedCategory.value)
})

function toErrMsg(err: unknown): string | null {
  if (err instanceof Error) return err.message
  if (typeof err === 'string' && err.trim()) return err
  return null
}

onMounted(async () => {
  loading.value = true
  errorMsg.value = null
  try {
    const data = await getUpcomingEvents()
    events.value = data
    if (data.length > 0) upsertJsonLd('events', eventsItemListSchema(data))
  } catch (e: unknown) {
    errorMsg.value =
      toErrMsg(e) ??
      t('home.error', 'Gagal memuat data acara. Silakan coba muat ulang.')
  } finally {
    loading.value = false
  }

  quoteLoading.value = true
  quoteError.value = null
  try {
    quote.value = await getLatestQuote()
  } catch (e: unknown) {
    quoteError.value =
      toErrMsg(e) ?? t('home.quote_error', 'Gagal memuat kutipan mingguan.')
  } finally {
    quoteLoading.value = false
  }
})
</script>

<template>
  <main id="main" tabindex="-1" class="relative min-h-[60vh] bg-zinc-950">
    <section class="section-screen relative z-0">
      <HeroSection />
    </section>

    <div
      class="pointer-events-none absolute inset-x-0 z-10 -mt-[150px] h-[300px]"
      aria-hidden="true"
    >
      <div class="bg-gradient-bridge h-full w-full"></div>
    </div>
    <section
      id="weekly"
      class="section-screen relative z-20 overflow-hidden bg-hero-radial"
    >
      <div class="pointer-events-none absolute inset-0 z-0">
        <div class="section-fade-top" aria-hidden="true" />
        <div class="section-fade-bottom" aria-hidden="true" />
      </div>

      <Container class="relative z-10 h-full py-10 md:py-14">
        <div class="grid items-center gap-10 md:grid-cols-2 md:gap-12">
          <div class="relative flex items-center justify-center">
            <div
              class="absolute left-6 top-6 hidden select-none font-mantra text-[160px] font-semibold leading-none text-brand-300/[0.06] md:block"
              aria-hidden="true"
            >
              ॐ
            </div>

            <div class="circle-shift">
              <div class="circle-wrap">
                <img
                  :src="buddhaQuotesImg"
                  alt="Weekly quote visual"
                  class="circle-img"
                  loading="lazy"
                />
                <div class="circle-overlay" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div class="mx-auto w-full max-w-xl text-center">
            <h2
              class="quote-title font-display font-semibold tracking-[0.08em] text-zinc-100"
            >
              {{ t('home.weekly_quote_title', 'Kutipan Mingguan') }}
            </h2>

            <div class="mt-4 flex items-center justify-center gap-4">
              <div
                class="h-[2px] w-24 rounded-full bg-gold-line opacity-90 md:w-44"
              />
              <span class="text-brand-300/80" aria-hidden="true">☸</span>
              <div
                class="h-[2px] w-24 rounded-full bg-gold-line opacity-90 md:w-44"
              />
            </div>

            <div class="mt-6">
              <p v-if="quoteError" class="text-red-200">
                {{ quoteError }}
              </p>

              <p v-else-if="quoteLoading" class="text-zinc-400">
                {{ t('home.quote_loading', 'Memuat kutipan...') }}
              </p>

              <div v-else-if="quote" class="space-y-3">
                <blockquote
                  class="quote-text font-sutra leading-relaxed text-zinc-200"
                >
                  “{{ quote.text }}”
                </blockquote>

                <footer class="quote-source font-sutra text-zinc-400">
                  — {{ quote.source }}
                </footer>
              </div>

              <p v-else class="text-zinc-400">
                {{ t('home.no_quote', 'Belum ada kutipan minggu ini.') }}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <section
      id="events"
      class="section-screen relative z-20 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black"
    >
      <div class="pointer-events-none absolute inset-0 z-0">
        <div class="section-fade-top" aria-hidden="true" />
        <div class="section-fade-bottom" aria-hidden="true" />
      </div>

      <Container class="relative z-10 h-full py-10 md:py-14">
        <div class="flex h-full flex-col">
          <SectionHeader
            as="h1"
            :showDot="false"
            :title="t('home.title', 'Beranda')"
            :subtitle="
              t(
                'home.subtitle',
                'Informasi kegiatan terbaru, kutipan mingguan, dan agenda komunitas.'
              )
            "
          />

          <div class="mt-8 flex-1 overflow-y-auto pr-1">
            <div
              v-if="errorMsg"
              role="alert"
              aria-live="polite"
              class="rounded-2xl border border-red-700/40 bg-red-900/20 p-4 text-red-200"
            >
              {{ errorMsg }}
            </div>

            <section
              v-else-if="loading"
              class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              <SkeletonCard v-for="i in 6" :key="i" :lines="3" />
            </section>

            <section
              v-else-if="filteredEvents.length === 0"
              class="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-6 text-zinc-300"
            >
              {{ t('home.no_events', 'Belum ada event untuk ditampilkan.') }}
            </section>

            <section v-else class="space-y-5">
              <div class="flex flex-wrap gap-2">
                <BaseButton
                  v-for="cat in CATEGORIES"
                  :key="cat"
                  size="sm"
                  :variant="selectedCategory === cat ? 'primary' : 'ghost'"
                  @click="setCategory(cat)"
                >
                  {{ t('categories.' + cat) }}
                </BaseButton>
              </div>

              <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <EventCard
                  v-for="e in filteredEvents"
                  :key="e.id"
                  :title="e.title"
                  :date="e.date"
                  :location="e.location"
                  :description="e.description"
                  :image="e.image"
                />
              </div>
            </section>
          </div>
        </div>
      </Container>
    </section>
  </main>
</template>

<style scoped>
.section-screen {
  min-height: calc(100vh - 64px);
}

.bg-gradient-bridge {
  background: linear-gradient(
    to bottom,
    rgba(9, 9, 11, 0) 0%,
    rgba(9, 9, 11, 1) 40%,
    rgba(9, 9, 11, 1) 60%,
    rgba(9, 9, 11, 0) 100%
  );
}

.section-fade-top {
  position: absolute;
  inset: 0 0 auto 0;
  height: 150px;
  background: linear-gradient(
    to bottom,
    rgba(9, 9, 11, 1) 0%,
    rgba(9, 9, 11, 0) 100%
  );
}

.section-fade-bottom {
  position: absolute;
  inset: auto 0 0 0;
  height: 150px;
  background: linear-gradient(
    to top,
    rgba(9, 9, 11, 1) 0%,
    rgba(9, 9, 11, 0) 100%
  );
}

.circle-shift {
  transform: translateX(10px);
}
@media (min-width: 768px) {
  .circle-shift {
    transform: translateX(18px);
  }
}

.circle-wrap {
  height: min(700px, 78vh);
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  border-radius: 9999px;

  box-shadow:
    0 18px 46px rgba(0, 0, 0, 0.52),
    0 0 0 4px rgba(52, 211, 153, 0.42),
    0 0 70px rgba(52, 211, 153, 0.26);
}

.circle-wrap::before {
  content: '';
  position: absolute;
  inset: 14px;
  border-radius: 9999px;
  box-shadow:
    inset 0 0 0 1px rgba(52, 211, 153, 0.18),
    inset 0 0 30px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}

.circle-img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  object-position: center 24%;
}

.circle-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 45% 40%,
      rgba(255, 255, 255, 0.07) 0%,
      rgba(0, 0, 0, 0.18) 52%,
      rgba(0, 0, 0, 0.48) 100%
    ),
    linear-gradient(180deg, rgba(52, 211, 153, 0.08), rgba(0, 0, 0, 0));
  pointer-events: none;
}

@media (max-width: 767px) {
  .circle-wrap {
    height: min(560px, 60vh);
  }
  .circle-img {
    object-position: center 22%;
  }
}

.quote-title {
  font-size: 24px;
  line-height: 1.08;
}
.quote-text {
  font-size: 18px;
  line-height: 1.625;
}
.quote-source {
  font-size: 16px;
}

@media (min-width: 768px) {
  .quote-title {
    font-size: 30px;
  }
  .quote-text {
    font-size: 20px;
    line-height: 1.75;
  }
  .quote-source {
    font-size: 16px;
  }
}
</style>
