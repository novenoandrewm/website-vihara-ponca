<!-- src/components/sections/HeroSection.vue -->
<script setup lang="ts">
import Container from '@/components/ui/Container.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TitleOrnament from '@/components/ui/TitleOrnament.vue'
</script>

<template>
  <section class="relative overflow-hidden bg-hero-radial">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute inset-0 opacity-[0.10]">
        <div
          class="absolute -left-28 -top-28 h-[420px] w-[420px] rounded-full bg-brand-500 blur-3xl"
        />
        <div
          class="absolute -right-28 top-16 h-[520px] w-[520px] rounded-full bg-jade-500 blur-3xl"
        />
      </div>

      <div
        class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/25 to-transparent"
      />

      <div
        class="absolute right-6 top-12 hidden select-none font-display text-[120px] font-semibold leading-none text-brand-300/[0.05] md:block"
        aria-hidden="true"
      >
        ॐ
      </div>
    </div>

    <Container>
      <div class="relative py-18 md:py-22">
        <div
          class="max-w-3xl animate-fadeUp space-y-7 motion-reduce:animate-none"
        >
          <p
            class="inline-flex items-center gap-2 rounded-full border border-zinc-800/70 bg-zinc-950/30 px-3 py-1 text-sm text-brand-200 backdrop-blur"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-brand-300" />
            Harmoni • Welas Asih • Kedamaian
          </p>

          <h1
            class="text-balance font-display text-4xl font-semibold tracking-[0.045em] text-zinc-50 md:text-6xl"
          >
            Vihara Avalokitesvara<span class="text-brand-300"></span>
          </h1>

          <TitleOrnament tone="jade" align="start" size="lg" symbol="卍" />

          <p
            class="max-w-2xl text-balance text-base leading-relaxed text-zinc-300 md:text-lg"
          >
            Informasi kegiatan rutin, PMV, dan GABI. Temukan aktivitas terbaru
            di komunitas — dengan suasana yang tenang, modern, dan tertata.
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <router-link to="/pmv">
              <BaseButton size="lg">
                Lihat PMV <span aria-hidden="true">→</span>
              </BaseButton>
            </router-link>

            <router-link to="/gabi">
              <BaseButton size="lg" variant="secondary">
                Lihat GABI <span aria-hidden="true">→</span>
              </BaseButton>
            </router-link>

            <router-link
              to="/schedule"
              class="rounded-xl px-3 py-2 text-sm text-zinc-200 underline decoration-zinc-600 transition hover:text-brand-200 hover:decoration-brand-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 motion-reduce:transition-none"
            >
              Lihat Jadwal
            </router-link>
          </div>

          <div class="mt-10 grid gap-3 sm:grid-cols-3">
            <div
              class="group rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-400/30 hover:shadow-glow motion-reduce:transform-none motion-reduce:transition-none"
            >
              <div class="text-sm text-zinc-400">Kegiatan</div>
              <div
                class="mt-1 font-display text-lg font-semibold tracking-[0.04em] text-zinc-100"
              >
                PMV
              </div>
              <div class="mt-2 text-xs text-zinc-500">
                Pembinaan & aktivitas rutin
              </div>
            </div>

            <div
              class="group rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-400/30 hover:shadow-glow motion-reduce:transform-none motion-reduce:transition-none"
            >
              <div class="text-sm text-zinc-400">Komunitas</div>
              <div
                class="mt-1 font-display text-lg font-semibold tracking-[0.04em] text-zinc-100"
              >
                GABI
              </div>
              <div class="mt-2 text-xs text-zinc-500">
                Kebersamaan & pengembangan
              </div>
            </div>

            <div
              class="group rounded-2xl border border-zinc-800/70 bg-zinc-950/40 p-4 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-400/30 hover:shadow-glow motion-reduce:transform-none motion-reduce:transition-none"
            >
              <div class="text-sm text-zinc-400">Informasi</div>
              <div
                class="mt-1 font-display text-lg font-semibold tracking-[0.04em] text-zinc-100"
              >
                Jadwal & Event
              </div>
              <div class="mt-2 text-xs text-zinc-500">
                Update kegiatan terbaru
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>

    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/70 to-transparent"
    />
  </section>
</template>
