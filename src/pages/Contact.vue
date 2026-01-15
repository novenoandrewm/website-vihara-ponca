<!-- src/pages/Contact.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import Container from '@/components/ui/Container.vue'
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
  <main id="main" tabindex="-1" class="min-h-[60vh] bg-zinc-950">
    <section
      class="relative z-10 overflow-hidden pb-48 pt-10 md:pb-64 md:pt-14"
    >
      <div class="absolute inset-0 -z-20 bg-hero-radial opacity-100" />

      <div class="pointer-events-none absolute inset-0 z-0">
        <div
          class="absolute -left-32 -top-32 h-[600px] w-[600px] transform-gpu rounded-full bg-brand-500/20 blur-[100px] will-change-transform"
        />
        <div
          class="absolute -right-32 -top-32 h-[600px] w-[600px] transform-gpu rounded-full bg-jade-500/20 blur-[100px] will-change-transform"
        />
      </div>

      <div class="pointer-events-none absolute inset-0 z-10">
        <div
          class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/25 to-transparent"
          aria-hidden="true"
        />

        <div
          class="absolute right-6 top-0 hidden select-none font-mantra text-[120px] font-semibold tracking-[0.10em] text-brand-300/[0.15] md:block"
          aria-hidden="true"
        >
          卍
        </div>

        <div
          class="absolute inset-x-0 bottom-0 h-[500px] bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"
          aria-hidden="true"
        />
      </div>

      <Container class="relative z-20">
        <div class="mx-auto max-w-4xl text-center">
          <h1
            class="text-balance bg-gradient-to-r from-brand-200 via-amber-100 to-brand-400 bg-clip-text font-display text-2xl font-semibold tracking-[0.08em] text-transparent drop-shadow-sm md:text-4xl"
          >
            {{ t('contact.title', 'Kontak') }}
          </h1>

          <div class="mt-4 flex justify-center">
            <TitleOrnament tone="gold" align="center" size="sm" symbol="卍" />
          </div>

          <p
            class="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-base"
          >
            {{ t('contact.description') }}
          </p>

          <div
            v-if="showSuccess"
            role="status"
            aria-live="polite"
            class="mt-6 rounded-2xl border border-green-700/40 bg-green-900/20 p-4 text-green-200 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
          >
            {{ t('contact.success') }}
          </div>
        </div>
      </Container>
    </section>

    <Container
      class="content-visibility-auto contain-intrinsic-size-[800px] relative z-10 -mt-32 pb-20 md:-mt-48"
    >
      <section class="grid gap-8 md:grid-cols-2">
        <div
          class="group relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/60 p-6 shadow-2xl backdrop-blur-xl transition-all hover:border-brand-500/30 hover:shadow-[0_0_40px_rgba(245,181,72,0.05)] md:p-8"
        >
          <div
            class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />

          <div class="space-y-6">
            <div class="space-y-3">
              <h2
                class="font-display text-xl font-semibold tracking-[0.06em] text-zinc-100"
              >
                {{ t('contact.form_title', 'Kirim Pesan') }}
              </h2>
              <div
                class="h-px w-16 bg-gradient-to-r from-brand-500/50 to-transparent"
              />
              <p class="text-sm text-zinc-400">
                {{
                  t('contact.form_subtitle', 'Kami akan membalas secepatnya.')
                }}
              </p>
            </div>

            <form
              name="contact"
              method="POST"
              action="/contact/success/"
              data-netlify="true"
              netlify-honeypot="bot-field"
              class="space-y-5"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p class="hidden">
                <label>Don’t fill this out: <input name="bot-field" /></label>
              </p>

              <div class="space-y-1.5">
                <label
                  class="text-xs font-medium uppercase tracking-wider text-zinc-500"
                  for="name"
                >
                  {{ t('contact.name', 'Nama') }}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autocomplete="name"
                  required
                  class="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-brand-500/50 focus:bg-zinc-900 focus:ring-1 focus:ring-brand-500/50"
                  :placeholder="t('contact.name_placeholder', 'Nama Lengkap')"
                />
              </div>

              <div class="space-y-1.5">
                <label
                  class="text-xs font-medium uppercase tracking-wider text-zinc-500"
                  for="email"
                >
                  {{ t('contact.email', 'Email') }}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-brand-500/50 focus:bg-zinc-900 focus:ring-1 focus:ring-brand-500/50"
                  :placeholder="
                    t('contact.email_placeholder', 'nama@email.com')
                  "
                />
              </div>

              <div class="space-y-1.5">
                <label
                  class="text-xs font-medium uppercase tracking-wider text-zinc-500"
                  for="message"
                >
                  {{ t('contact.message', 'Pesan') }}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  required
                  class="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-brand-500/50 focus:bg-zinc-900 focus:ring-1 focus:ring-brand-500/50"
                  :placeholder="
                    t(
                      'contact.message_placeholder',
                      'Tulis pesan Anda di sini...'
                    )
                  "
                ></textarea>
              </div>

              <div class="pt-2">
                <BaseButton
                  type="submit"
                  size="lg"
                  variant="primary"
                  class="w-full justify-center shadow-lg shadow-brand-500/10"
                >
                  {{ t('contact.submit', 'Kirim Pesan') }}
                </BaseButton>
                <p class="mt-3 text-center text-xs text-zinc-600">
                  {{
                    t('contact.privacy_note', 'Data Anda aman bersama kami.')
                  }}
                </p>
              </div>
            </form>
          </div>
        </div>

        <div
          class="group relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-900/60 p-6 shadow-2xl backdrop-blur-xl transition-all hover:border-jade-500/30 hover:shadow-[0_0_40px_rgba(52,211,153,0.05)] md:p-8"
        >
          <div
            class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />

          <div class="space-y-6">
            <div class="space-y-3">
              <h2
                class="font-display text-xl font-semibold tracking-[0.06em] text-zinc-100"
              >
                {{ t('contact.location', 'Lokasi') }}
              </h2>
              <div
                class="h-px w-16 bg-gradient-to-r from-jade-500/50 to-transparent"
              />
            </div>

            <div class="space-y-4">
              <div
                class="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-4 transition hover:bg-zinc-950/60"
              >
                <div class="flex gap-4">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-brand-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      class="text-xs font-medium uppercase tracking-wider text-zinc-500"
                    >
                      {{ t('contact.address_label', 'Alamat') }}
                    </p>
                    <p class="mt-1 text-sm leading-relaxed text-zinc-200">
                      {{ address }}
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-4 transition hover:bg-zinc-950/60"
              >
                <div class="flex items-center gap-4">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-jade-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="size-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      class="text-xs font-medium uppercase tracking-wider text-zinc-500"
                    >
                      {{ t('contact.phone_label', 'Telepon') }}
                    </p>
                    <a
                      :href="`tel:${phoneHref}`"
                      class="mt-1 block text-lg font-medium text-zinc-100 transition hover:text-jade-300"
                    >
                      {{ phoneDisplay }}
                    </a>
                  </div>
                </div>
              </div>

              <div class="pt-2">
                <a
                  class="group mb-4 inline-flex items-center gap-2 text-sm text-zinc-300 transition hover:text-brand-200"
                  :href="mapsOpenUrl"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span
                    class="underline decoration-zinc-600 underline-offset-4 group-hover:decoration-brand-300"
                  >
                    {{ t('contact.open_maps', 'Buka di Google Maps') }}
                  </span>
                  <span
                    aria-hidden="true"
                    class="transition-transform group-hover:translate-x-0.5"
                    >→</span
                  >
                </a>

                <div
                  class="aspect-video w-full overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-800 shadow-lg"
                >
                  <iframe
                    class="h-full w-full opacity-80 grayscale-[20%] transition-all duration-500 hover:opacity-100 hover:grayscale-0"
                    :src="mapsEmbedUrl"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    :title="t('contact.map_title', 'Peta lokasi vihara')"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="mt-6 md:mt-8">
        <FollowUsSection />
      </div>
    </Container>
  </main>
</template>

<style scoped>
/* Performance Helper: Helps browser skip rendering off-screen content */
.content-visibility-auto {
  content-visibility: auto;
  contain-intrinsic-size: 800px;
}
</style>
