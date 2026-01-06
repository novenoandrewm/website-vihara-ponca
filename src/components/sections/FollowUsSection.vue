<!-- src/components/sections/FollowUsSection.vue -->
<script setup lang="ts">
import Container from '@/components/ui/Container.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { SOCIAL_LINKS } from '@/config/social'

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
  }>(),
  {
    title: 'Ikuti Kami',
    subtitle:
      'Temukan kanal resmi vihara untuk informasi kegiatan terbaru, dokumentasi, dan pengumuman penting.',
  }
)

const whatsapp = SOCIAL_LINKS.find((s) => s.key === 'whatsapp') ?? null
const socials = SOCIAL_LINKS.filter((s) => s.key !== 'whatsapp')
</script>

<template>
  <section class="relative overflow-hidden py-12 md:py-16">
    <!-- subtle ambient glow -->
    <div class="pointer-events-none absolute inset-0 opacity-[0.06]">
      <div
        class="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-500 blur-3xl"
      />
      <div
        class="absolute -right-24 top-10 h-80 w-80 rounded-full bg-jade-500 blur-3xl"
      />
    </div>

    <Container>
      <div class="relative grid gap-6 lg:grid-cols-2">
        <!-- Left: intro -->
        <div class="space-y-4">
          <SectionHeader :title="title" :subtitle="subtitle" />

          <BaseCard hover class="relative overflow-hidden">
            <!-- subtle “ornament” line -->
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent"
            />

            <div class="space-y-3">
              <p class="text-sm leading-relaxed text-zinc-300">
                Pastikan hanya mengikuti kanal resmi agar terhindar dari
                informasi yang tidak valid.
              </p>

              <div v-if="whatsapp" class="pt-2">
                <a
                  :href="whatsapp.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="`Buka ${whatsapp.label} resmi`"
                >
                  <BaseButton size="lg">Kontak Cepat via WhatsApp</BaseButton>
                </a>
                <p class="mt-2 text-xs text-zinc-500">
                  Respon bergantung pada jam operasional.
                </p>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Right: social grid -->
        <BaseCard padded hover>
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-lg font-semibold text-zinc-100">
                Sosial Media Resmi<span class="text-brand-300">.</span>
              </h3>
              <span class="text-xs text-zinc-500">Tap untuk membuka</span>
            </div>
          </template>

          <div class="grid gap-3 sm:grid-cols-2">
            <a
              v-for="s in socials"
              :key="s.key"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Buka ${s.label} resmi`"
              class="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-200 transition hover:-translate-y-0.5 hover:border-brand-400/50 hover:shadow-glow"
            >
              <span class="font-medium">{{ s.label }}</span>
              <span
                class="text-xs text-zinc-400 transition group-hover:text-brand-200"
              >
                Buka →
              </span>
            </a>
          </div>

          <template #footer>
            <p class="text-xs text-zinc-500">
              <code class="text-zinc-300"></code>.
            </p>
          </template>
        </BaseCard>
      </div>
    </Container>
  </section>
</template>
