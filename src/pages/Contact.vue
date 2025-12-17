<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
const route = useRoute()

const address =
  'Jl. Pd. Cabe Raya No.64, Pd. Cabe Udik, Kec. Pamulang, Kota Tangerang Selatan, Banten 15148, Indonesia'

const phoneDisplay = '+62 21 7401177'
const phoneHref = phoneDisplay.replace(/[^0-9+]/g, '')

// Plus code untuk embed (lebih presisi daripada alamat)
const plusCode = 'MQ34+9Q'
const mapsQuery = `${plusCode} Pd. Cabe Udik, Kota Tangerang Selatan, Banten, Indonesia`

// Link buka maps
const mapsOpenUrl = 'https://maps.app.goo.gl/8rog6mKrPTjqBBFh8'

// Embed maps (pakai query/plus code)
const mapsEmbedUrl = computed(() => {
  const q = encodeURIComponent(mapsQuery)
  return `https://www.google.com/maps?q=${q}&output=embed`
})

const showSuccess = computed(() => route.query.success === '1')
</script>

<template>
  <main id="main" tabindex="-1" class="mx-auto max-w-6xl space-y-6 p-6">
    <h1 class="text-2xl font-semibold">{{ t('contact.title') }}</h1>
    <p class="text-zinc-300">{{ t('contact.description') }}</p>

    <!-- Success message setelah submit -->
    <div
      v-if="showSuccess"
      role="status"
      aria-live="polite"
      class="rounded-xl border border-green-700/40 bg-green-900/20 p-4 text-green-200"
    >
      {{ t('contact.success', 'Terima kasih! Pesan Anda sudah terkirim.') }}
    </div>

    <!-- Netlify Form -->
    <form
      name="contact"
      method="POST"
      action="/contact/success/"
      data-netlify="true"
      netlify-honeypot="bot-field"
      class="max-w-md space-y-4"
    >
      <input type="hidden" name="form-name" value="contact" />

      <p class="hidden">
        <label>
          Don’t fill this out if you’re human: <input name="bot-field" />
        </label>
      </p>

      <div>
        <label class="mb-1 block text-sm" for="name">{{
          t('contact.name')
        }}</label>
        <input
          id="name"
          name="name"
          type="text"
          autocomplete="name"
          required
          class="w-full rounded border border-zinc-600 bg-zinc-800 p-2 text-zinc-200"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm" for="email">{{
          t('contact.email')
        }}</label>
        <input
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          class="w-full rounded border border-zinc-600 bg-zinc-800 p-2 text-zinc-200"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm" for="message">{{
          t('contact.message')
        }}</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          required
          class="w-full rounded border border-zinc-600 bg-zinc-800 p-2 text-zinc-200"
        ></textarea>
      </div>

      <button
        type="submit"
        class="rounded bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
      >
        {{ t('contact.submit') }}
      </button>
    </form>

    <!-- Lokasi -->
    <section class="space-y-2">
      <h2 class="text-xl font-semibold">{{ t('contact.location') }}</h2>

      <p class="text-zinc-300">
        <span class="font-medium"
          >{{ t('contact.address_label', 'Alamat') }}:</span
        >
        {{ address }}
      </p>

      <p class="text-zinc-300">
        <span class="font-medium"
          >{{ t('contact.phone_label', 'Telepon') }}:</span
        >
        <a class="underline" :href="`tel:${phoneHref}`">
          {{ phoneDisplay }}
        </a>
      </p>

      <a
        class="inline-block text-zinc-200 underline"
        :href="mapsOpenUrl"
        target="_blank"
        rel="noreferrer"
      >
        {{ t('contact.open_maps', 'Buka di Google Maps') }}
      </a>

      <div
        class="mt-3 aspect-video w-full overflow-hidden rounded bg-zinc-700/50"
      >
        <iframe
          class="h-full w-full"
          :src="mapsEmbedUrl"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          :title="t('contact.map_title', 'Peta lokasi vihara')"
        ></iframe>
      </div>
    </section>
  </main>
</template>
