<!-- src/pages/Gabi.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Container from '@/components/ui/Container.vue'
import ActivityCard from '@/components/cards/ActivityCard.vue'
import SkeletonCard from '@/components/cards/SkeletonCard.vue'
import TitleOrnament from '@/components/ui/TitleOrnament.vue'

import { formatDate } from '@/utils/formatDate'
import { listEvents, type EventItem } from '@/services/eventsApi'

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
    .filter((e) => e.category === 'gabi')
    .slice()
    .sort((a, b) => isoTime(b.date) - isoTime(a.date))
})

async function refresh(): Promise<void> {
  loading.value = true
  errorMsg.value = null
  try {
    all.value = await listEvents()
  } catch (err: unknown) {
    errorMsg.value =
      getErrMsg(err) ?? t('admin.error_generic', 'Terjadi kesalahan.')
  } finally {
    loading.value = false
  }
}

onMounted(refresh)

const pageTitle = computed(() =>
  t('gabi.title_full', 'Gelanggang Anak Buddhis Indonesia (GABI)')
)

const pageDesc = computed(() =>
  t(
    'gabi.desc_full',
    'GABI (Gelanggang Anak Buddhis Indonesia) adalah wadah pembinaan anak-anak Buddhis (Sekolah Minggu Buddha) di vihara, tempat anak belajar nilai-nilai Buddhis secara menyenangkan melalui cerita Dhamma, doa/paritta sederhana, permainan edukatif, dan kegiatan kreatif.'
  )
)

const EVENT_DETAIL_BASE = '/event'
const eventLink = (id: string) => `${EVENT_DETAIL_BASE}/${id}`
</script>

<template>
  <div class="min-h-[60vh]">
    <section class="relative overflow-hidden bg-hero-radial py-10 md:py-14">
      <div class="pointer-events-none absolute inset-0">
        <div
          class="absolute right-6 top-8 hidden select-none font-mantra text-[140px] font-semibold leading-none text-jade-300/[0.06] md:block"
          aria-hidden="true"
        >
          ॐ
        </div>

        <div
          class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-jade-400/20 to-transparent"
          aria-hidden="true"
        />
        <div
          class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/70 to-transparent"
          aria-hidden="true"
        />
      </div>

      <Container>
        <div class="mx-auto max-w-4xl text-center">
          <h1
            class="font-display text-3xl font-semibold tracking-[0.08em] text-zinc-100 md:text-5xl"
          >
            {{ pageTitle }}
          </h1>

          <!-- ✅ ornament emas sesuai ketentuan -->
          <div class="mt-4 flex justify-center">
            <TitleOrnament tone="gold" align="center" size="md" symbol="卍" />
          </div>

          <p
            class="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-base"
          >
            {{ pageDesc }}
          </p>
        </div>
      </Container>
    </section>

    <Container>
      <section class="py-10 md:py-14">
        <div
          v-if="errorMsg"
          role="alert"
          class="mb-6 rounded-2xl border border-red-700/40 bg-red-900/20 p-4 text-red-200"
        >
          {{ errorMsg }}
        </div>

        <div class="mb-6">
          <h2
            class="font-display text-2xl font-semibold tracking-[0.06em] text-zinc-100 md:text-3xl"
          >
            {{ t('gabi.activities', 'Kegiatan GABI') }}
          </h2>

          <div
            class="mt-3 h-[2px] w-full rounded-full bg-gold-line opacity-95 shadow-[0_0_18px_rgba(245,181,72,0.16)]"
            aria-hidden="true"
          />
        </div>

        <div v-if="loading" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard v-for="i in 6" :key="i" :lines="3" />
        </div>

        <div
          v-else-if="items.length === 0"
          class="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-6 text-zinc-300"
        >
          {{ t('gabi.empty', 'Belum ada data GABI.') }}
        </div>

        <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ActivityCard
            v-for="e in items"
            :key="e.id"
            :title="e.title"
            :date="formatDate(e.date)"
            :location="e.location"
            :desc="e.description"
            badge="GABI"
            tone="jade"
            :to="eventLink(e.id)"
          />
        </div>
      </section>
    </Container>
  </div>
</template>
