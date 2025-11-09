<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ActivityCard from '@/components/ActivityCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import { getGabiActivities, type GabiActivity } from '@/services/gabi'

const items = ref<GabiActivity[] | null>(null)
const errorMsg = ref<string | null>(null)

onMounted(async () => {
  try {
    items.value = await getGabiActivities()
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : 'Gagal memuat data'
    items.value = []
  }
})
</script>

<template>
  <main class="mx-auto max-w-6xl space-y-6 p-6">
    <h1 class="text-2xl font-semibold">GABI</h1>

    <div
      v-if="errorMsg"
      class="rounded-xl border border-red-700/40 bg-red-900/20 p-4 text-red-200"
    >
      {{ errorMsg }}
    </div>
    <section v-else-if="items === null" class="grid gap-4 md:grid-cols-2">
      <SkeletonCard /><SkeletonCard />
    </section>
    <section v-else-if="items.length === 0" class="text-zinc-300">
      Belum ada kegiatan GABI.
    </section>

    <section v-else class="grid gap-4 md:grid-cols-2">
      <ActivityCard
        v-for="a in items"
        :key="a.id"
        :title="a.title"
        :date="a.date"
        :location="a.location"
        :desc="a.desc"
      />
    </section>
  </main>
</template>
