<!-- src/components/sections/HeroSection.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Container from '@/components/ui/Container.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import TitleOrnament from '@/components/ui/TitleOrnament.vue'

const { t } = useI18n({ useScope: 'global' })
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
          class="max-w-4xl animate-fadeUp space-y-7 motion-reduce:animate-none"
        >
          <p
            class="inline-flex items-center gap-2 rounded-full border border-zinc-800/70 bg-zinc-950/30 px-3 py-1 text-sm text-brand-200 backdrop-blur"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-brand-300" />
            {{ t('hero.badge') }}
          </p>

          <div class="flex w-fit flex-col gap-8">
            <h1
              class="font-display text-3xl font-semibold uppercase tracking-[0.045em] text-zinc-50 md:text-5xl"
            >
              Vihara Avalokitesvara<span class="text-brand-300"></span>
            </h1>

            <TitleOrnament
              tone="jade"
              align="start"
              size="lg"
              symbol="卍"
              class="hero-ornament"
            />
          </div>

          <p
            class="max-w-2xl text-balance text-base leading-relaxed text-zinc-300 md:text-lg"
          >
            {{ t('hero.description') }}
          </p>

          <div class="flex flex-wrap items-center gap-3">
            <router-link to="/pmv">
              <BaseButton size="lg">
                {{ t('hero.btn_pmv') }} <span aria-hidden="true">→</span>
              </BaseButton>
            </router-link>

            <router-link to="/gabi">
              <BaseButton size="lg" variant="secondary">
                {{ t('hero.btn_gabi') }} <span aria-hidden="true">→</span>
              </BaseButton>
            </router-link>

            <router-link
              to="/schedule"
              class="rounded-xl px-3 py-2 text-sm text-zinc-200 underline decoration-zinc-600 transition hover:text-brand-200 hover:decoration-brand-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 motion-reduce:transition-none"
            >
              {{ t('hero.btn_general') }}
            </router-link>
          </div>

          <div class="!mt-16 border-l-4 border-brand-500 pl-6">
            <h2
              class="font-display text-xl font-semibold tracking-wide md:text-3xl lg:leading-tight"
            >
              <span
                class="bg-gradient-to-r from-brand-200 via-brand-100 to-brand-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(245,181,72,0.25)]"
              >
                “Sabbe Satta Bhavantu Sukhitatta”
              </span>
            </h2>

            <div class="mt-3 flex items-center gap-3">
              <span class="h-px w-8 bg-brand-400"></span>
              <p
                class="font-sans text-sm font-semibold uppercase tracking-[0.15em] text-zinc-100 drop-shadow-md"
              >
                {{ t('hero.mantra_sub') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>

    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"
    />
  </section>
</template>

<style scoped>
:deep(.hero-ornament) {
  width: 100%;
}

:deep(.hero-ornament .ornament__line) {
  width: auto !important;
  flex: 1;
}
</style>
