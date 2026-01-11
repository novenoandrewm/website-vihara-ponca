<!-- src/pages/Pmv.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Container from '@/components/ui/Container.vue'
import EventCard from '@/components/cards/EventCard.vue'
import SkeletonCard from '@/components/cards/SkeletonCard.vue'
import TitleOrnament from '@/components/ui/TitleOrnament.vue'

import { getUpcomingEvents, type EventItem } from '@/services/events'

const { t } = useI18n({ useScope: 'global' })

const loading = ref<boolean>(true)
const errorMsg = ref<string | null>(null)
const all = ref<EventItem[]>([])

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function getErrMsg(err: unknown): string | null {
  if (err instanceof Error) return err.message
  if (typeof err === 'string' && err.trim()) return err
  if (isRecord(err) && typeof err.message === 'string' && err.message.trim()) {
    return err.message
  }
  return null
}

function isoTime(iso: string): number {
  const n = new Date(iso).getTime()
  return Number.isFinite(n) ? n : 0
}

const items = computed<EventItem[]>(() => {
  return all.value
    .filter((e) => e.category === 'pmv')
    .slice()
    .sort((a, b) => isoTime(b.date) - isoTime(a.date))
})

async function refresh(): Promise<void> {
  loading.value = true
  errorMsg.value = null
  try {
    all.value = await getUpcomingEvents()
  } catch (err: unknown) {
    errorMsg.value =
      getErrMsg(err) ?? t('admin.error_generic', 'Terjadi kesalahan.')
  } finally {
    loading.value = false
  }
}

onMounted(refresh)

const pageTitle = computed(() =>
  t('pmv.title_full', 'Persatuan Muda Mudi (PMV)')
)
const pageDesc = computed(() =>
  t(
    'pmv.desc_full',
    'PMV (Persatuan Muda-Mudi Vihara) adalah wadah kegiatan pemuda-pemudi di vihara yang fokus pada pembinaan Dhamma, pengembangan karakter & kepemimpinan, serta pelayanan melalui kepanitiaan acara vihara dan kegiatan sosial.'
  )
)
</script>

<template>
  <div class="relative min-h-[60vh] bg-zinc-950">
    <section
      class="relative z-10 overflow-hidden pb-48 pt-10 md:pb-64 md:pt-14"
    >
      <div class="absolute inset-0 -z-20 bg-hero-radial opacity-100" />

      <div class="pointer-events-none absolute inset-0 z-0">
        <div
          class="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-brand-500/20 blur-[100px]"
        />
        <div
          class="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-jade-500/10 blur-[100px]"
        />
      </div>

      <div class="pointer-events-none absolute inset-0 z-10">
        <div
          class="absolute left-6 top-8 hidden select-none font-mantra text-[140px] font-semibold leading-none text-brand-300/[0.05] md:block"
          aria-hidden="true"
        >
          ॐ
        </div>

        <div
          class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/25 to-transparent"
          aria-hidden="true"
        />

        <div
          class="absolute inset-x-0 bottom-0 h-[500px] bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"
          aria-hidden="true"
        />
      </div>

      <Container class="relative z-20">
        <div class="mx-auto max-w-4xl text-center">
          <h1
            class="text-balance bg-gradient-to-r from-amber-200 via-orange-100 to-amber-400 bg-clip-text font-display text-2xl font-semibold tracking-[0.08em] text-transparent drop-shadow-sm md:text-4xl"
          >
            {{ pageTitle }}
          </h1>

          <div class="mt-4 flex justify-center">
            <TitleOrnament tone="gold" align="center" size="sm" symbol="卍" />
          </div>

          <p
            class="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-base"
          >
            {{ pageDesc }}
          </p>
        </div>
      </Container>
    </section>

    <Container class="relative z-10 -mt-32 pb-20 md:-mt-48">
      <section>
        <div
          v-if="errorMsg"
          role="alert"
          class="mb-6 rounded-2xl border border-red-700/40 bg-red-900/20 p-4 text-red-200"
        >
          {{ errorMsg }}
        </div>

        <div class="mb-8">
          <h2
            class="font-display text-2xl font-semibold tracking-[0.06em] text-zinc-100 md:text-3xl"
          >
            {{ t('pmv.activities', 'Kegiatan PMV') }}
          </h2>

          <div
            class="mt-3 h-[2px] w-full rounded-full bg-gold-line opacity-95 shadow-[0_0_18px_rgba(245,181,72,0.16)]"
            aria-hidden="true"
          />
        </div>

        <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard v-for="i in 6" :key="i" :lines="3" />
        </div>

        <div
          v-else-if="items.length === 0"
          class="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/30 p-10 text-center backdrop-blur-sm"
        >
          <div
            class="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800/50 text-zinc-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-8 w-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
              />
            </svg>
          </div>
          <h3 class="mt-4 font-display text-lg font-medium text-zinc-300">
            {{ t('schedule.empty', 'Tidak ada kegiatan') }}
          </h3>
          <p class="mt-2 text-sm text-zinc-500">
            {{ t('pmv.empty', 'Belum ada data PMV.') }}
          </p>
        </div>

        <div
          v-else
          class="grid animate-fadeUp gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <EventCard
            v-for="e in items"
            :key="e.id"
            :title="e.title"
            :date="e.date"
            :time="e.time"
            :location="e.location"
            :description="e.description"
            :image="e.image"
            :category="e.category"
            :to="'/events/' + e.id"
          />
        </div>
      </section>
    </Container>
  </div>
</template>
