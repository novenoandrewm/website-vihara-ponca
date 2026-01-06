<!-- src/pages/Schedule.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Container from '@/components/ui/Container.vue'
import EventCard from '@/components/cards/EventCard.vue'
import SkeletonCard from '@/components/cards/SkeletonCard.vue'
import TitleOrnament from '@/components/ui/TitleOrnament.vue'

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

const todayIso = computed<string>(() => new Date().toISOString().slice(0, 10))

const scheduleItems = computed<EventItem[]>(() => {
  return all.value
    .filter((e) => e.category === 'general')
    .slice()
    .sort((a, b) => isoTime(a.date) - isoTime(b.date))
})

const upcoming = computed<EventItem[]>(() =>
  scheduleItems.value.filter((e) => e.date >= todayIso.value)
)

const past = computed<EventItem[]>(() =>
  scheduleItems.value
    .filter((e) => e.date < todayIso.value)
    .slice()
    .sort((a, b) => isoTime(b.date) - isoTime(a.date))
)

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
</script>

<template>
  <div class="min-h-[60vh]">
    <section class="relative overflow-hidden bg-hero-radial py-10 md:py-14">
      <div class="pointer-events-none absolute inset-0">
        <div
          class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/25 to-transparent"
          aria-hidden="true"
        />
        <div
          class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/70 to-transparent"
          aria-hidden="true"
        />
        <div
          class="absolute left-1/2 top-10 hidden -translate-x-1/2 select-none font-display text-[140px] font-semibold tracking-[0.10em] text-brand-300/[0.04] md:block"
          aria-hidden="true"
        >
          ॐ
        </div>
      </div>

      <Container>
        <div class="mx-auto max-w-4xl text-center">
          <h1
            class="font-display text-3xl font-semibold tracking-[0.08em] text-zinc-100 md:text-5xl"
          >
            {{ t('schedule.title', 'Jadwal & Event') }}
          </h1>

          <div class="mt-4 flex justify-center">
            <TitleOrnament tone="gold" align="center" size="md" symbol="卍" />
          </div>

          <p
            class="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-base"
          >
            {{
              t(
                'schedule.subtitle',
                'Jadwal kegiatan dan event umum. Update disusun rapi agar mudah diikuti.'
              )
            }}
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

        <div v-if="loading" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard v-for="i in 6" :key="i" :lines="3" />
        </div>

        <template v-else>
          <div class="mb-6">
            <h2
              class="font-display text-2xl font-semibold tracking-[0.06em] text-zinc-100"
            >
              {{ t('schedule.upcoming', 'Upcoming') }}
            </h2>
            <div
              class="mt-3 h-px w-full bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent"
              aria-hidden="true"
            />
          </div>

          <div
            v-if="upcoming.length === 0"
            class="rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-6 text-zinc-300"
          >
            {{ t('schedule.empty_upcoming', 'Belum ada jadwal terdekat.') }}
          </div>

          <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <EventCard
              v-for="e in upcoming"
              :key="e.id"
              :title="e.title"
              :date="e.date"
              :location="e.location"
              :description="e.description"
              :image="e.image"
            />
          </div>

          <div class="mt-12">
            <div class="mb-4 flex items-center justify-between">
              <h2
                class="font-display text-xl font-semibold tracking-[0.06em] text-zinc-100"
              >
                {{ t('schedule.past', 'Past') }}
              </h2>
              <span class="text-xs text-zinc-500">
                {{ t('schedule.past_note', 'Arsip event sebelumnya') }}
              </span>
            </div>

            <div v-if="past.length === 0" class="text-sm text-zinc-400">
              {{ t('schedule.empty_past', 'Belum ada arsip.') }}
            </div>

            <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <EventCard
                v-for="e in past"
                :key="e.id"
                :title="e.title"
                :date="e.date"
                :location="e.location"
                :description="e.description"
                :image="e.image"
              />
            </div>
          </div>
        </template>
      </section>
    </Container>
  </div>
</template>
