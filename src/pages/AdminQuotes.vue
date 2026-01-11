<!-- src/pages/AdminQuotes.vue -->
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'

import Container from '@/components/ui/Container.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

import {
  getLatestQuote,
  adminUpdateLatestQuote,
  type QuoteItem,
} from '@/services/quotes'

const { t } = useI18n({ useScope: 'global' })
const authStore = useAuthStore()

const loading = ref(true)
const saving = ref(false)

const errorMsg = ref<string | null>(null)
const successMsg = ref<string | null>(null)

const current = ref<QuoteItem | null>(null)

const text = ref('')
const source = ref('')

const previewText = computed(() => text.value.trim() || '...')
const previewSource = computed(() => source.value.trim() || '...')

function toErrMsg(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string' && err.trim()) return err
  return t('admin.error_generic', 'Terjadi kesalahan.')
}

async function load(): Promise<void> {
  loading.value = true
  errorMsg.value = null
  successMsg.value = null

  try {
    const q = await getLatestQuote()
    current.value = q
    text.value = q.text ?? ''
    source.value = q.source ?? ''
  } catch (e: unknown) {
    errorMsg.value = toErrMsg(e)
  } finally {
    loading.value = false
  }
}

async function save(): Promise<void> {
  errorMsg.value = null
  successMsg.value = null

  const tVal = text.value.trim()
  const sVal = source.value.trim()

  const token = authStore.token

  if (!token) {
    errorMsg.value = t(
      'admin.quotes.error_session',
      'Sesi habis. Silakan login kembali.'
    )
    return
  }
  if (!tVal) {
    errorMsg.value = t(
      'admin.quotes.error_text_req',
      'Teks kutipan wajib diisi.'
    )
    return
  }
  if (!sVal) {
    errorMsg.value = t(
      'admin.quotes.error_source_req',
      'Sumber kutipan wajib diisi.'
    )
    return
  }

  saving.value = true
  try {
    const updated = await adminUpdateLatestQuote(
      { text: tVal, source: sVal },
      token
    )
    current.value = updated
    successMsg.value = t(
      'admin.quotes.success_update',
      'Kutipan mingguan berhasil diperbarui.'
    )
  } catch (e: unknown) {
    errorMsg.value = toErrMsg(e)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  void load()
})
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
          class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/70 to-transparent"
          aria-hidden="true"
        />
      </div>

      <Container>
        <SectionHeader
          as="h1"
          :showDot="false"
          :title="t('admin.quotes.title', 'Kelola Kutipan Mingguan')"
          :subtitle="
            t(
              'admin.quotes.subtitle',
              'Tugas admin quotes: update kutipan yang tampil di halaman Home setiap minggu.'
            )
          "
        />
      </Container>
    </section>

    <Container>
      <section class="grid gap-6 py-10 md:grid-cols-2 md:py-14">
        <BaseCard hover>
          <template #header>
            <div class="space-y-2">
              <h2
                class="font-display text-lg font-semibold tracking-[0.06em] text-zinc-100"
              >
                {{ t('admin.quotes.section_update', 'Update Kutipan') }}
              </h2>
              <div
                class="h-px w-full bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent"
                aria-hidden="true"
              />
              <p class="text-sm text-zinc-400">
                {{
                  t(
                    'admin.quotes.login_note',
                    'Pastikan Anda login sebagai admin untuk melakukan update.'
                  )
                }}
              </p>
            </div>
          </template>

          <div v-if="loading" class="text-sm text-zinc-400">
            {{ t('admin.loading', 'Memuat...') }}
          </div>

          <div v-else class="space-y-4">
            <div
              v-if="errorMsg"
              role="alert"
              class="rounded-2xl border border-red-700/40 bg-red-900/20 p-4 text-red-200"
            >
              {{ errorMsg }}
            </div>

            <div
              v-if="successMsg"
              role="status"
              aria-live="polite"
              class="rounded-2xl border border-green-700/40 bg-green-900/20 p-4 text-green-200"
            >
              {{ successMsg }}
            </div>

            <div>
              <label class="mb-1 block text-sm text-zinc-200">
                {{ t('admin.quotes.label_text', 'Teks Kutipan') }}
              </label>
              <textarea
                v-model="text"
                rows="5"
                class="w-full rounded-xl border border-zinc-700 bg-zinc-900/40 p-2.5 text-zinc-100 outline-none transition focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/20"
                :placeholder="
                  t(
                    'admin.quotes.placeholder_text',
                    'Contoh: Jangan menunda kebaikan...'
                  )
                "
              />
            </div>

            <div>
              <label class="mb-1 block text-sm text-zinc-200">
                {{ t('admin.quotes.label_source', 'Sumber') }}
              </label>
              <input
                v-model="source"
                type="text"
                class="w-full rounded-xl border border-zinc-700 bg-zinc-900/40 p-2.5 text-zinc-100 outline-none transition focus:border-brand-400/60 focus:ring-2 focus:ring-brand-400/20"
                :placeholder="
                  t(
                    'admin.quotes.placeholder_source',
                    'Contoh: Sangha Agung Indonesia'
                  )
                "
              />
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <BaseButton size="lg" :disabled="saving" @click="save">
                {{
                  saving
                    ? t('admin.saving', 'Menyimpan...')
                    : t('admin.save', 'Simpan')
                }}
              </BaseButton>

              <BaseButton
                size="lg"
                variant="secondary"
                :disabled="saving"
                @click="load"
              >
                {{ t('admin.refresh', 'Refresh') }}
              </BaseButton>
            </div>

            <p v-if="current?.updatedAt" class="text-xs text-zinc-500">
              {{ t('admin.quotes.last_update', 'Terakhir update:') }}
              <span class="text-zinc-300">{{ current.updatedAt }}</span>
            </p>
          </div>
        </BaseCard>

        <BaseCard hover>
          <template #header>
            <div class="space-y-2">
              <h2
                class="font-display text-lg font-semibold tracking-[0.06em] text-zinc-100"
              >
                {{ t('admin.quotes.section_preview', 'Preview (Home)') }}
              </h2>
              <div
                class="h-px w-full bg-gradient-to-r from-transparent via-zinc-800/80 to-transparent"
                aria-hidden="true"
              />
            </div>
          </template>

          <div class="space-y-4 text-center">
            <div
              class="font-display text-base font-semibold tracking-[0.08em] text-zinc-100"
            >
              {{ t('admin.quotes.preview_title', 'Kutipan Mingguan') }}
            </div>

            <div class="flex items-center justify-center gap-4">
              <div class="h-px w-24 bg-gold-line opacity-90 md:w-44" />
              <span class="text-brand-300/80" aria-hidden="true">☸</span>
              <div class="h-px w-24 bg-gold-line opacity-90 md:w-44" />
            </div>

            <blockquote
              class="font-sutra text-lg leading-relaxed text-zinc-200 md:text-xl"
            >
              “{{ previewText }}”
            </blockquote>

            <div class="mt-2 font-sutra text-base text-zinc-400">
              — {{ previewSource }}
            </div>
          </div>
        </BaseCard>
      </section>
    </Container>
  </main>
</template>
