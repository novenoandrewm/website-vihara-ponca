<!-- src/pages/Contact.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import Container from '@/components/ui/Container.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FollowUsSection from '@/components/sections/FollowUsSection.vue'
import TitleOrnament from '@/components/ui/TitleOrnament.vue'

const { t } = useI18n({ useScope: 'global' })
const route = useRoute()

const address =
  'Jl. Pd. Cabe Raya No.64, Pd. Cabe Udik, Kec. Pamulang, Kota Tangerang Selatan, Banten 15148, Indonesia'

const phoneDisplay = '+62 21 7401177'
const phoneHref = phoneDisplay.replace(/[^0-9+]/g, '')

const plusCode = 'MQ34+9Q'
const mapsQuery = `${plusCode} Pd. Cabe Udik, Kota Tangerang Selatan, Banten, Indonesia`
const mapsOpenUrl = 'https://maps.app.goo.gl/8rog6mKrPTjqBBFh8'

const mapsEmbedUrl = computed(() => {
  const q = encodeURIComponent(mapsQuery)
  return `https://www.google.com/maps?q=${q}&output=embed`
})

const showSuccess = computed(() => route.query.success === '1')
</script>

<template>
  <main id="main" tabindex="-1" class="min-h-[60vh]">
    <section class="relative overflow-hidden bg-hero-radial py-10 md:py-14">
      <div class="pointer-events-none absolute inset-0">
        <div
          class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/25 to-transparent"
          aria-hidden="true"
        />
        <div
          class="absolute right-6 top-10 hidden select-none font-display text-[120px] font-semibold tracking-[0.10em] text-brand-300/[0.05] md:block"
          aria-hidden="true"
        >
          ॐ
        </div>
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
            {{ t('contact.title', 'Kontak') }}
          </h1>

          <div class="mt-4 flex justify-center">
            <TitleOrnament tone="gold" align="center" size="md" symbol="卍" />
          </div>

          <p
            class="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-base"
          >
            {{
              t(
                'contact.description',
                'Hubungi kami untuk pertanyaan, informasi kegiatan, atau kerja sama.'
              )
            }}
          </p>

          <div
            v-if="showSuccess"
            role="status"
            aria-live="polite"
            class="mt-6 rounded-2xl border border-green-700/40 bg-green-900/20 p-4 text-green-200"
          >
            {{
              t('contact.success', 'Terima kasih! Pesan Anda sudah terkirim.')
            }}
          </div>
        </div>
      </Container>
    </section>

    <Container>
      <section class="grid gap-6 py-10 md:grid-cols-2 md:py-14">
        <!-- Form -->
        <BaseCard hover>
          <template #header>
            <div class="space-y-2">
              <h2
                class="font-display text-lg font-semibold tracking-[0.06em] text-zinc-100"
              >
                {{ t('contact.form_title', 'Kirim Pesan') }}
              </h2>

              <div
                class="h-px w-full bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent"
                aria-hidden="true"
              />

              <p class="text-sm text-zinc-300">
                {{
                  t('contact.form_subtitle', 'Kami akan membalas secepatnya.')
                }}
              </p>
            </div>
          </template>

          <form
            name="contact"
            method="POST"
            action="/contact/success/"
            data-netlify="true"
            netlify-honeypot="bot-field"
            class="space-y-4"
          >
            <input type="hidden" name="form-name" value="contact" />

            <p class="hidden">
              <label>
                Don’t fill this out if you’re human: <input name="bot-field" />
              </label>
            </p>

            <div>
              <label class="mb-1 block text-sm text-zinc-200" for="name">
                {{ t('contact.name', 'Nama') }}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autocomplete="name"
                required
                class="w-full rounded-xl border border-zinc-700 bg-zinc-900/40 p-2.5 text-zinc-100 outline-none transition focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/20"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm text-zinc-200" for="email">
                {{ t('contact.email', 'Email') }}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="w-full rounded-xl border border-zinc-700 bg-zinc-900/40 p-2.5 text-zinc-100 outline-none transition focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/20"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm text-zinc-200" for="message">
                {{ t('contact.message', 'Pesan') }}
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                class="w-full rounded-xl border border-zinc-700 bg-zinc-900/40 p-2.5 text-zinc-100 outline-none transition focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/20"
              ></textarea>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <BaseButton type="submit" size="lg">
                {{ t('contact.submit', 'Kirim') }}
              </BaseButton>

              <p class="text-xs text-zinc-500">
                {{ t('contact.privacy_note', 'Mohon isi data dengan benar.') }}
              </p>
            </div>
          </form>
        </BaseCard>

        <!-- Location / Map -->
        <BaseCard hover>
          <template #header>
            <div class="space-y-2">
              <h2
                class="font-display text-lg font-semibold tracking-[0.06em] text-zinc-100"
              >
                {{ t('contact.location', 'Lokasi') }}
              </h2>

              <div
                class="h-px w-full bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent"
                aria-hidden="true"
              />
            </div>
          </template>

          <div class="space-y-3 text-sm text-zinc-300">
            <p>
              <span class="font-medium text-zinc-100">
                {{ t('contact.address_label', 'Alamat') }}:
              </span>
              {{ address }}
            </p>

            <p>
              <span class="font-medium text-zinc-100">
                {{ t('contact.phone_label', 'Telepon') }}:
              </span>
              <a
                class="underline decoration-zinc-500 transition hover:text-brand-200 hover:decoration-brand-300"
                :href="`tel:${phoneHref}`"
              >
                {{ phoneDisplay }}
              </a>
            </p>

            <a
              class="inline-flex items-center gap-2 text-zinc-200 underline decoration-zinc-600 transition hover:text-brand-200 hover:decoration-brand-300"
              :href="mapsOpenUrl"
              target="_blank"
              rel="noreferrer"
            >
              {{ t('contact.open_maps', 'Buka di Google Maps') }}
              <span aria-hidden="true">→</span>
            </a>

            <div
              class="mt-3 aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40"
            >
              <iframe
                class="h-full w-full"
                :src="mapsEmbedUrl"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                :title="t('contact.map_title', 'Peta lokasi vihara')"
              ></iframe>
            </div>
          </div>
        </BaseCard>
      </section>
    </Container>

    <FollowUsSection />
  </main>
</template>
