<!-- src/pages/EventDetail.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import Container from '@/components/ui/Container.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Badge from '@/components/ui/Badge.vue'
import DividerLotus from '@/components/ui/DividerLotus.vue'

import { getEventById, type EventItem } from '@/services/events'
import { formatDate } from '@/utils/formatDate'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n({ useScope: 'global' })

const event = ref<EventItem | null>(null)
const loading = ref(true)
const errorMsg = ref<string | null>(null)

const categoryTone = computed(() => {
  if (!event.value) return 'neutral'
  const cat = event.value.category
  if (cat === 'pmv') return 'gold'
  if (cat === 'gabi') return 'jade'
  return 'neutral'
})

onMounted(async () => {
  const id = String(route.params.id)
  try {
    const data = await getEventById(id)
    if (!data) {
      errorMsg.value = t('event.not_found', 'Acara tidak ditemukan.')
    } else {
      event.value = data
    }
  } catch {
    errorMsg.value = t('event.error_load', 'Gagal memuat detail acara.')
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.back()
}
</script>

<template>
  <main
    id="main"
    tabindex="-1"
    class="relative min-h-[80vh] bg-zinc-950 pb-20 pt-24 md:pt-32"
  >
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        class="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-brand-500/10 blur-[100px]"
      />
      <div
        class="absolute right-0 top-40 h-[500px] w-[500px] rounded-full bg-jade-500/10 blur-[120px]"
      />
    </div>

    <Container class="relative z-10 max-w-4xl">
      <div v-if="loading" class="animate-pulse space-y-8">
        <div class="h-8 w-32 rounded bg-zinc-800"></div>
        <div class="aspect-video w-full rounded-2xl bg-zinc-800"></div>
        <div class="space-y-4">
          <div class="h-10 w-3/4 rounded bg-zinc-800"></div>
          <div class="h-4 w-1/2 rounded bg-zinc-800"></div>
          <div class="h-32 w-full rounded bg-zinc-800"></div>
        </div>
      </div>

      <div
        v-else-if="errorMsg"
        role="alert"
        class="rounded-2xl border border-red-500/20 bg-red-900/10 p-8 text-center"
      >
        <p class="text-lg text-red-200">{{ errorMsg }}</p>
        <BaseButton class="mt-4" variant="secondary" @click="goBack">
          {{ t('event.back', 'Kembali') }}
        </BaseButton>
      </div>

      <article v-else-if="event" class="animate-fadeUp space-y-8">
        <button
          class="group inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-brand-300"
          @click="goBack"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-5 w-5 transition-transform group-hover:-translate-x-1"
          >
            <path
              fill-rule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clip-rule="evenodd"
            />
          </svg>
          {{ t('event.back', 'Kembali') }}
        </button>

        <div
          class="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/60 shadow-2xl backdrop-blur-sm"
        >
          <div v-if="event.image" class="relative aspect-video w-full">
            <img
              :src="event.image"
              :alt="event.title"
              class="h-full w-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"
            />
          </div>

          <div class="px-6 py-8 md:px-10 md:py-12">
            <div class="space-y-6">
              <Badge :tone="categoryTone">
                {{ t('categories.' + event.category) }}
              </Badge>

              <h1
                class="text-balance font-display text-3xl font-bold leading-tight text-zinc-50 md:text-5xl"
              >
                {{ event.title }}
              </h1>

              <div
                class="flex flex-col gap-4 border-y border-white/5 py-6 sm:flex-row sm:flex-wrap sm:gap-8"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/50 text-brand-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-5 w-5"
                    >
                      <path
                        d="M5.25 2.25a.75.75 0 00-1.5 0v1.5h-1.5a3 3 0 00-3 3v9.75a3 3 0 003 3h15.5a3 3 0 003-3V6.75a3 3 0 00-3-3h-1.5v-1.5a.75.75 0 00-1.5 0v1.5h-9.75v-1.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs uppercase tracking-wider text-zinc-500">
                      {{ t('common.date') }}
                    </div>
                    <div class="text-sm font-medium text-zinc-200">
                      {{
                        formatDate(
                          event.date,
                          locale === 'en' ? 'en-US' : 'id-ID'
                        )
                      }}
                    </div>
                  </div>
                </div>

                <div v-if="event.time" class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/50 text-brand-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-5 w-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75l4 4a.75.75 0 101.06-1.06l-3.25-3.25V5.75z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs uppercase tracking-wider text-zinc-500">
                      {{ t('common.time') }}
                    </div>
                    <div class="text-sm font-medium text-zinc-200">
                      {{ event.time }}
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div
                    class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/50 text-brand-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="h-5 w-5"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.006.003.002.001.003.001a.75.75 0 01-.69 1.35H9.69zM10 12a3 3 0 100-6 3 3 0 000 6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div class="text-xs uppercase tracking-wider text-zinc-500">
                      {{ t('common.location') }}
                    </div>
                    <div class="text-sm font-medium text-zinc-200">
                      {{ event.location }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 space-y-6">
              <p
                class="whitespace-pre-line text-lg leading-relaxed text-zinc-300"
              >
                {{ event.description }}
              </p>
            </div>

            <DividerLotus
              size="h-10 w-10"
              lineColor="from-transparent via-zinc-700/50 to-transparent"
              class="my-10 text-zinc-700"
            />
          </div>
        </div>
      </article>
    </Container>
  </main>
</template>
