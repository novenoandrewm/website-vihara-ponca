<!-- src/pages/About.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import Container from '@/components/ui/Container.vue'
import TitleOrnament from '@/components/ui/TitleOrnament.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import Badge from '@/components/ui/Badge.vue'

const { t, tm } = useI18n({ useScope: 'global' })

type TimelineItem = { year: string; text: string }
type LeaderItem = { role: string; name: string; note?: string }

const pageTitle = computed(() =>
  t('about.title', 'Tentang Vihara Avalokitesvara')
)
const pageDesc = computed(() =>
  t(
    'about.subtitle',
    'Profil vihara, visi & misi, sejarah singkat, dan informasi pimpinan.'
  )
)

const missionItems = computed(
  () => (tm('about.profile.mission_items') as string[]) ?? []
)
const timeline = computed(
  () => (tm('about.history.timeline') as TimelineItem[]) ?? []
)
const leaders = computed(
  () => (tm('about.leadership.items') as LeaderItem[]) ?? []
)
</script>

<template>
  <div class="min-h-[60vh]">
    <!-- Header -->
    <section class="relative overflow-hidden bg-hero-radial py-10 md:py-14">
      <div class="pointer-events-none absolute inset-0">
        <!-- sacred watermark -->
        <div
          class="absolute left-6 top-8 hidden select-none font-mantra text-[140px] font-semibold leading-none text-brand-300/[0.05] md:block"
          aria-hidden="true"
        >
          ॐ
        </div>

        <!-- top line -->
        <div
          class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/25 to-transparent"
          aria-hidden="true"
        />
        <!-- bottom fade -->
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

          <!-- ✅ ornament gold glow + swastika -->
          <div class="mt-4 flex justify-center">
            <TitleOrnament tone="gold" align="center" size="md" symbol="卍" />
          </div>

          <p
            class="mx-auto mt-5 max-w-3xl text-balance text-base leading-relaxed text-zinc-300 md:text-lg"
          >
            {{ pageDesc }}
          </p>
        </div>
      </Container>
    </section>

    <Container>
      <section class="space-y-8 py-10 md:py-14">
        <!-- (1) Profil + Visi Misi -->
        <BaseCard tone="gold" :hover="false">
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <h2
                class="font-display text-2xl font-semibold tracking-[0.06em] text-zinc-100 md:text-3xl"
              >
                {{ t('about.profile.title', 'Profil, Visi & Misi') }}
              </h2>
              <Badge tone="gold" size="sm">
                {{ t('about.profile.badge', 'Profil') }}
              </Badge>
            </div>

            <div
              class="mt-3 h-px w-full bg-gradient-to-r from-transparent via-brand-400/60 to-transparent"
              aria-hidden="true"
            />
          </template>

          <p class="font-sutra leading-relaxed text-zinc-200">
            {{ t('about.profile.description') }}
          </p>

          <div class="mt-6 grid gap-4 md:grid-cols-2">
            <div
              class="rounded-2xl border border-zinc-800/70 bg-zinc-950/30 p-5"
            >
              <div class="flex items-center gap-2">
                <Badge tone="gold" size="sm">{{
                  t('about.profile.vision_title', 'Visi')
                }}</Badge>
              </div>
              <p class="mt-3 font-sutra leading-relaxed text-zinc-200">
                {{ t('about.profile.vision_text') }}
              </p>
            </div>

            <div
              class="rounded-2xl border border-zinc-800/70 bg-zinc-950/30 p-5"
            >
              <div class="flex items-center gap-2">
                <Badge tone="jade" size="sm">{{
                  t('about.profile.mission_title', 'Misi')
                }}</Badge>
              </div>
              <ul class="mt-3 space-y-2 font-sutra text-zinc-200">
                <li v-for="(m, i) in missionItems" :key="i" class="flex gap-3">
                  <span class="text-brand-300/90">•</span>
                  <span class="leading-relaxed">{{ m }}</span>
                </li>
              </ul>
            </div>
          </div>
        </BaseCard>

        <!-- (2) Sejarah Singkat -->
        <BaseCard tone="neutral" :hover="false">
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <h2
                class="font-display text-2xl font-semibold tracking-[0.06em] text-zinc-100 md:text-3xl"
              >
                {{ t('about.history.title', 'Sejarah Singkat') }}
              </h2>
              <Badge tone="neutral" size="sm">
                {{ t('about.history.badge', 'Sejarah') }}
              </Badge>
            </div>

            <div
              class="mt-3 h-px w-full bg-gradient-to-r from-transparent via-brand-400/50 to-transparent"
              aria-hidden="true"
            />
          </template>

          <div class="grid gap-4 md:grid-cols-2">
            <div
              v-for="(it, i) in timeline"
              :key="i"
              class="rounded-2xl border border-zinc-800/70 bg-zinc-950/30 p-5"
            >
              <div class="flex items-center gap-2">
                <Badge tone="gold" size="sm">{{ it.year }}</Badge>
              </div>
              <p class="mt-3 font-sutra leading-relaxed text-zinc-200">
                {{ it.text }}
              </p>
            </div>
          </div>
        </BaseCard>

        <!-- (3) Informasi Pimpinan -->
        <BaseCard tone="jade" :hover="false">
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <h2
                class="font-display text-2xl font-semibold tracking-[0.06em] text-zinc-100 md:text-3xl"
              >
                {{ t('about.leadership.title', 'Informasi Pimpinan') }}
              </h2>
              <Badge tone="jade" size="sm">
                {{ t('about.leadership.badge', 'Pimpinan') }}
              </Badge>
            </div>

            <div
              class="mt-3 h-px w-full bg-gradient-to-r from-transparent via-brand-400/55 to-transparent"
              aria-hidden="true"
            />
          </template>

          <p class="font-sutra leading-relaxed text-zinc-200">
            {{ t('about.leadership.note') }}
          </p>

          <div class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="(p, i) in leaders"
              :key="i"
              class="rounded-2xl border border-zinc-800/70 bg-zinc-950/30 p-5"
            >
              <div class="flex items-center justify-between gap-3">
                <span class="font-display tracking-[0.06em] text-zinc-100">
                  {{ p.role }}
                </span>
                <span class="text-xs text-brand-200/90">ॐ</span>
              </div>

              <div class="mt-3 font-sutra text-zinc-200">
                <span class="text-zinc-400"
                  >{{ t('about.leadership.name_label', 'Nama') }}:
                </span>
                <span class="font-medium">{{ p.name }}</span>
              </div>

              <p
                v-if="p.note"
                class="mt-3 font-sutra text-sm leading-relaxed text-zinc-300"
              >
                {{ p.note }}
              </p>
            </div>
          </div>
        </BaseCard>
      </section>
    </Container>
  </div>
</template>
