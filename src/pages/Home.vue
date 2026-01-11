<!-- src/pages/Home.vue -->
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

function getCategoryLabel(cat: CategoryFilter): string {
  if (cat === 'all') return t('categories.all', 'Semua')
  if (cat === 'pmv') return t('categories.pmv', 'PMV')
  if (cat === 'gabi') return t('categories.gabi', 'GABI')
  if (cat === 'general') return t('categories.general', 'Umum')
  return cat
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

function getEventLink(category: string): string {
  const cat = (category || '').toLowerCase()
  if (cat === 'pmv') return '/pmv'
  if (cat === 'gabi') return '/gabi'
  return '/schedule'
}

onMounted(async () => {
  // events
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

  // quote
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

    <section
      id="weekly"
      class="section-screen relative z-20 -mt-40 overflow-hidden pt-24 md:pt-32"
    >
      <div class="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div
          class="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950"
        ></div>

        <div
          class="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-jade-900/10 to-transparent opacity-60 mix-blend-screen"
        ></div>
        <div
          class="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-brand-900/10 to-transparent opacity-60 mix-blend-screen"
        ></div>
      </div>

      <Container class="relative z-10 h-full py-8 md:py-14">
        <div class="grid items-center gap-6 md:grid-cols-2 md:gap-12">
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
            <div
              class="relative rounded-3xl bg-gradient-to-br from-brand-300/40 via-white/10 to-brand-300/5 p-px shadow-2xl backdrop-blur-md"
            >
              <div
                class="relative h-full w-full rounded-3xl bg-zinc-800/60 p-6 md:p-10"
              >
                <div
                  class="absolute left-0 top-0 h-8 w-8 rounded-tl-3xl border-l-2 border-t-2 border-brand-400/30"
                />
                <div
                  class="absolute right-0 top-0 h-8 w-8 rounded-tr-3xl border-r-2 border-t-2 border-brand-400/30"
                />
                <div
                  class="absolute bottom-0 left-0 h-8 w-8 rounded-bl-3xl border-b-2 border-l-2 border-brand-400/30"
                />
                <div
                  class="absolute bottom-0 right-0 h-8 w-8 rounded-br-3xl border-b-2 border-r-2 border-brand-400/30"
                />

                <h2
                  class="quote-title font-display font-semibold tracking-[0.08em] text-zinc-100 drop-shadow-md"
                >
                  {{ t('home.weekly_quote_title', 'Kutipan Mingguan') }}
                </h2>

                <div class="mt-4 flex items-center justify-center gap-3">
                  <div
                    class="h-px w-24 bg-gradient-to-r from-transparent to-brand-400/50 md:w-40"
                  ></div>
                  <span
                    class="text-brand-300 drop-shadow-[0_0_10px_rgba(245,181,72,0.5)]"
                    aria-hidden="true"
                    >☸</span
                  >
                  <div
                    class="h-px w-24 bg-gradient-to-l from-transparent to-brand-400/50 md:w-40"
                  ></div>
                </div>

                <div class="relative mt-6 md:mt-8">
                  <p v-if="quoteError" class="text-red-200">
                    {{ quoteError }}
                  </p>

                  <p v-else-if="quoteLoading" class="text-zinc-400">
                    {{ t('home.quote_loading', 'Memuat kutipan...') }}
                  </p>

                  <div v-else-if="quote" class="space-y-4 md:space-y-6">
                    <blockquote
                      class="quote-text font-sutra italic leading-relaxed text-zinc-50 drop-shadow-sm"
                    >
                      “{{ quote.text }}”
                    </blockquote>

                    <footer
                      class="quote-source font-sutra text-sm font-medium tracking-wider text-brand-200/90 md:text-base"
                    >
                      — {{ quote.source }}
                    </footer>
                  </div>

                  <p v-else class="text-zinc-400">
                    {{ t('home.no_quote', 'Belum ada kutipan minggu ini.') }}
                  </p>
                </div>
              </div>
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
        <div
          class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-zinc-950 to-transparent"
        />
      </div>

      <Container class="relative z-10 h-full py-10 md:py-14">
        <div class="flex h-full flex-col">
          <SectionHeader
            as="h1"
            :showDot="false"
            :title="t('home.title', 'Event & Kegiatan')"
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
                  {{ getCategoryLabel(cat) }}
                </BaseButton>
              </div>

              <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <EventCard
                  v-for="e in filteredEvents"
                  :key="e.id"
                  :title="e.title"
                  :date="e.date"
                  :time="e.time"
                  :location="e.location"
                  :description="e.description"
                  :image="e.image"
                  :category="e.category"
                  :to="getEventLink(e.category)"
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
    0 0 0 4px rgba(52, 211, 153, 0.6),
    0 0 80px rgba(52, 211, 153, 0.4);
}

.circle-wrap::before {
  content: '';
  position: absolute;
  inset: 14px;
  border-radius: 9999px;
  box-shadow:
    inset 0 0 0 1px rgba(52, 211, 153, 0.2),
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
      rgba(255, 255, 255, 0.05) 0%,
      rgba(0, 0, 0, 0.2) 52%,
      rgba(0, 0, 0, 0.6) 100%
    ),
    linear-gradient(180deg, rgba(52, 211, 153, 0.05), rgba(0, 0, 0, 0.1));
  pointer-events: none;
}

@media (max-width: 767px) {
  .circle-wrap {
    height: min(340px, 42vh);
    margin-inline: auto;
  }
  .circle-img {
    object-position: center 15%;
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
