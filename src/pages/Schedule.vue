<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import SkeletonCard from '@/components/SkeletonCard.vue'
import { getWeeklySchedule, type ScheduleItem } from '@/services/schedule'

const { t } = useI18n({ useScope: 'global' })

const items = ref<ScheduleItem[] | null>(null)
const errorMsg = ref<string | null>(null)

const selectedCategory = ref<'all' | 'general' | 'pmv' | 'gabi'>('all')

const filtered = computed(() => {
  if (!items.value) return []
  if (selectedCategory.value === 'all') return items.value
  return items.value.filter((x) => x.category === selectedCategory.value)
})

const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

const groupedByDay = computed(() => {
  const map: Record<string, ScheduleItem[]> = {}
  for (const d of dayKeys) map[d] = []
  for (const it of filtered.value) map[it.day].push(it)
  return map
})

function timeRange(start: string, end?: string) {
  return end ? `${start}–${end}` : start
}

onMounted(async () => {
  try {
    items.value = await getWeeklySchedule()
  } catch {
    errorMsg.value = t('schedule.error', 'Gagal memuat jadwal.')
    items.value = []
  }
})
</script>

<template>
  <main id="main" tabindex="-1" class="mx-auto max-w-6xl space-y-6 p-6">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold">{{ t('schedule.title') }}</h1>
      <p class="text-zinc-300">{{ t('schedule.description') }}</p>
    </header>

    <!-- Error -->
    <div
      v-if="errorMsg"
      role="alert"
      aria-live="polite"
      class="rounded-xl border border-red-700/40 bg-red-900/20 p-4 text-red-200"
    >
      {{ errorMsg }}
    </div>

    <!-- Loading -->
    <section v-else-if="items === null" class="grid gap-4 md:grid-cols-2">
      <SkeletonCard />
      <SkeletonCard />
    </section>

    <!-- Empty -->
    <section v-else-if="items.length === 0" class="text-zinc-300">
      {{ t('schedule.empty', 'Belum ada jadwal yang ditampilkan.') }}
    </section>

    <template v-else>
      <!-- Filter -->
      <section class="flex flex-wrap gap-2">
        <button
          v-for="cat in ['all', 'general', 'pmv', 'gabi']"
          :key="cat"
          class="rounded px-3 py-1 text-sm"
          :class="
            selectedCategory === (cat as any)
              ? 'bg-brand-500 text-white'
              : 'bg-zinc-700 text-zinc-200'
          "
          @click="selectedCategory = cat as any"
        >
          <!-- reuse label categories.* -->
          {{ t('categories.' + (cat === 'all' ? 'all' : cat), cat) }}
        </button>
      </section>

      <!-- Group by day -->
      <section class="space-y-6">
        <div v-for="d in dayKeys" :key="d" class="space-y-3">
          <h2 class="text-xl font-semibold">{{ t(`days.${d}`) }}</h2>

          <div v-if="groupedByDay[d].length === 0" class="text-zinc-400">
            {{ t('schedule.no_items_day', 'Tidak ada kegiatan.') }}
          </div>

          <div v-else class="grid gap-4 md:grid-cols-2">
            <article
              v-for="it in groupedByDay[d]"
              :key="it.id"
              class="rounded-2xl border border-zinc-700 bg-zinc-900 p-4"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="space-y-1">
                  <h3 class="text-lg font-semibold text-zinc-100">
                    {{ it.title }}
                  </h3>

                  <p class="text-sm text-zinc-300">
                    {{ timeRange(it.start, it.end) }}
                    <span v-if="it.location"> · {{ it.location }}</span>
                  </p>

                  <p class="text-sm text-zinc-400">
                    {{ t('categories.' + it.category) }}
                  </p>
                </div>
              </div>

              <p v-if="it.description" class="mt-3 text-zinc-200">
                {{ it.description }}
              </p>
            </article>
          </div>
        </div>
      </section>
    </template>
  </main>
</template>
