<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import {
  getUpcomingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  type EventItem,
} from '@/services/events'

const { t } = useI18n({ useScope: 'global' })
const auth = useAuthStore()

const fixedCategory = 'pmv'
const canAccess = computed(
  () => auth.user?.role === 'superadmin' || auth.user?.role === 'pmv_admin'
)

const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const items = ref<EventItem[]>([])

const editingId = ref<string | null>(null)
const form = ref({
  title: '',
  date: '',
  location: '',
  description: '',
  image: '',
})

function resetForm() {
  editingId.value = null
  form.value = { title: '', date: '', location: '', description: '', image: '' }
}

async function load() {
  loading.value = true
  error.value = null
  try {
    const all = await getUpcomingEvents()
    items.value = all.filter((x) => x.category === fixedCategory)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Failed to load'
  } finally {
    loading.value = false
  }
}

function startEdit(x: EventItem) {
  editingId.value = x.id
  form.value = {
    title: x.title,
    date: x.date,
    location: x.location,
    description: x.description ?? '',
    image: x.image ?? '',
  }
}

async function submit() {
  saving.value = true
  error.value = null
  try {
    const payload = {
      title: form.value.title.trim(),
      date: form.value.date.trim(),
      location: form.value.location.trim(),
      category: fixedCategory,
      description: form.value.description.trim() || undefined,
      image: form.value.image.trim() || undefined,
    }

    if (!payload.title || !payload.date || !payload.location) {
      throw new Error('title, date, location wajib diisi')
    }

    if (editingId.value) {
      await updateEvent(editingId.value, payload)
    } else {
      await createEvent(payload)
    }

    await load()
    resetForm()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Save failed'
  } finally {
    saving.value = false
  }
}

async function remove(id: string) {
  const ok = confirm('Hapus item ini?')
  if (!ok) return
  saving.value = true
  error.value = null
  try {
    await deleteEvent(id)
    await load()
    if (editingId.value === id) resetForm()
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Delete failed'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (canAccess.value) load()
  else {
    loading.value = false
    error.value = 'Forbidden'
  }
})
</script>

<template>
  <main class="mx-auto max-w-5xl space-y-6 p-6">
    <h1 class="text-2xl font-semibold">
      {{ t('admin.pmv.title', 'Kelola Kegiatan PMV') }}
    </h1>

    <p
      v-if="error"
      class="rounded border border-red-900 bg-red-950 p-3 text-sm"
    >
      {{ error }}
    </p>

    <section class="rounded border border-zinc-800 bg-zinc-900 p-4">
      <h2 class="mb-3 font-medium">
        {{ editingId ? 'Edit Event' : 'Tambah Event' }}
      </h2>

      <form class="grid gap-3 sm:grid-cols-2" @submit.prevent="submit">
        <label class="text-sm">
          Judul
          <input
            v-model="form.title"
            class="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 p-2"
            required
          />
        </label>

        <label class="text-sm">
          Tanggal
          <input
            v-model="form.date"
            type="date"
            class="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 p-2"
            required
          />
        </label>

        <label class="text-sm sm:col-span-2">
          Lokasi
          <input
            v-model="form.location"
            class="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 p-2"
            required
          />
        </label>

        <label class="text-sm sm:col-span-2">
          Deskripsi
          <textarea
            v-model="form.description"
            rows="4"
            class="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 p-2"
          />
        </label>

        <label class="text-sm sm:col-span-2">
          Image URL (opsional)
          <input
            v-model="form.image"
            class="mt-1 w-full rounded border border-zinc-700 bg-zinc-800 p-2"
            placeholder="/images/pmv.jpg"
          />
        </label>

        <div class="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            :disabled="saving"
            class="rounded bg-brand-500 px-4 py-2 text-white disabled:opacity-60"
          >
            {{ saving ? '...' : 'Simpan' }}
          </button>
          <button
            type="button"
            class="rounded border border-zinc-700 px-4 py-2"
            @click="resetForm"
          >
            Batal
          </button>
        </div>
      </form>
    </section>

    <section class="space-y-3">
      <h2 class="font-medium">Daftar Event</h2>

      <p v-if="loading" class="text-sm text-zinc-400">Loading...</p>

      <div v-else class="overflow-x-auto rounded border border-zinc-800">
        <table class="w-full text-left text-sm">
          <thead class="bg-zinc-900 text-zinc-300">
            <tr>
              <th class="p-3">Tanggal</th>
              <th class="p-3">Judul</th>
              <th class="p-3">Lokasi</th>
              <th class="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="x in items" :key="x.id" class="border-t border-zinc-800">
              <td class="p-3">{{ x.date }}</td>
              <td class="p-3">{{ x.title }}</td>
              <td class="p-3">{{ x.location }}</td>
              <td class="p-3">
                <div class="flex gap-2">
                  <button class="underline" type="button" @click="startEdit(x)">
                    Edit
                  </button>
                  <button
                    class="text-red-300 underline"
                    type="button"
                    @click="remove(x.id)"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="items.length === 0">
              <td class="p-3 text-zinc-400" colspan="4">Belum ada data.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>
