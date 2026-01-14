<!-- src/cpmponents/admin/AdminEventsManager.vue -->
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  type EventCategory,
  type EventItem,
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from '@/services/eventsApi'
import { uploadEventImage } from '@/services/events'

const props = defineProps<{
  category: EventCategory
  pageTitle: string
}>()

const { t } = useI18n({ useScope: 'global' })

const all = ref<EventItem[]>([])
const loading = ref(true)
const errorMsg = ref<string | null>(null)

const items = computed(() =>
  all.value
    .filter((e) => e.category === props.category)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
)

// form state
const editingId = ref<string | null>(null)
const title = ref('')
const date = ref('')
const time = ref('')
const location = ref('')
const description = ref('')
const image = ref('')

// State for upload file
const selectedFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

const isEditing = computed(() => editingId.value !== null)

function getErrMsg(err: unknown): string | null {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  if (err && typeof err === 'object') {
    const rec = err as Record<string, unknown>
    const msg = rec.message
    if (typeof msg === 'string' && msg.trim()) return msg
  }
  return null
}

function resetForm() {
  editingId.value = null
  title.value = ''
  date.value = ''
  time.value = ''
  location.value = ''
  description.value = ''
  image.value = ''

  // Reset state file upload
  selectedFile.value = null
  imagePreview.value = null
}

function startEdit(e: EventItem) {
  editingId.value = e.id
  title.value = e.title
  date.value = e.date
  time.value = e.time ?? ''
  location.value = e.location
  description.value = e.description
  image.value = e.image ?? ''

  // Set preview image if exists
  imagePreview.value = e.image ?? null
  selectedFile.value = null
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    selectedFile.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

// Handler to delete selected/existing image
function clearImage() {
  selectedFile.value = null
  imagePreview.value = null
  image.value = ''
}

async function refresh() {
  loading.value = true
  errorMsg.value = null
  try {
    all.value = await listEvents()
  } catch (e: unknown) {
    errorMsg.value = getErrMsg(e) ?? t('admin.error_generic')
  } finally {
    loading.value = false
  }
}

async function submit() {
  errorMsg.value = null

  try {
    let finalImagePath = image.value

    if (selectedFile.value) {
      finalImagePath = await uploadEventImage(selectedFile.value)
    }

    // Prepare the payload with the final image URL.
    const payload = {
      title: title.value.trim(),
      date: date.value,
      time: time.value.trim() || undefined,
      location: location.value.trim(),
      description: description.value.trim(),
      image: finalImagePath || undefined,
      category: props.category,
    }

    if (
      !payload.title ||
      !payload.date ||
      !payload.location ||
      !payload.description
    )
      return

    if (isEditing.value && editingId.value) {
      await updateEvent(editingId.value, payload)
    } else {
      await createEvent(payload)
    }
    await refresh()
    resetForm()
  } catch (e: unknown) {
    errorMsg.value = getErrMsg(e) ?? t('admin.error_generic')
  }
}

async function remove(id: string) {
  if (!confirm(t('admin.confirm_delete', 'Hapus item ini?'))) return
  errorMsg.value = null
  try {
    await deleteEvent(id)
    await refresh()
    if (editingId.value === id) resetForm()
  } catch (e: unknown) {
    errorMsg.value = getErrMsg(e) ?? t('admin.error_generic')
  }
}

onMounted(() => void refresh())
</script>

<template>
  <main id="main" tabindex="-1" class="mx-auto max-w-6xl space-y-6 p-6">
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold">{{ props.pageTitle }}</h1>
      <p class="text-zinc-300">
        {{ t('admin.events_desc', 'Tambah, edit, dan hapus event.') }}
      </p>
    </header>

    <div
      v-if="errorMsg"
      role="alert"
      class="rounded-xl border border-red-700/40 bg-red-900/20 p-4 text-red-200"
    >
      {{ errorMsg }}
    </div>

    <section class="grid gap-6 md:grid-cols-2">
      <form
        class="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
        @submit.prevent="() => void submit()"
      >
        <h2 class="text-lg font-semibold">
          {{ isEditing ? t('admin.edit', 'Edit') : t('admin.add', 'Tambah') }}
        </h2>

        <div>
          <label class="mb-1 block text-sm" for="title">{{
            t('admin.field_title', 'Judul')
          }}</label>
          <input
            id="title"
            v-model="title"
            type="text"
            class="w-full rounded border border-zinc-600 bg-zinc-800 p-2 text-zinc-200"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1 block text-sm" for="date">{{
              t('admin.field_date', 'Tanggal')
            }}</label>
            <input
              id="date"
              v-model="date"
              type="date"
              class="w-full rounded border border-zinc-600 bg-zinc-800 p-2 text-zinc-200"
              required
            />
          </div>

          <div>
            <label class="mb-1 block text-sm" for="time">{{
              t('admin.field_time', 'Waktu')
            }}</label>
            <input
              id="time"
              v-model="time"
              type="time"
              class="w-full rounded border border-zinc-600 bg-zinc-800 p-2 text-zinc-200"
            />
          </div>
        </div>

        <div>
          <label class="mb-1 block text-sm" for="location">{{
            t('admin.field_location', 'Lokasi')
          }}</label>
          <input
            id="location"
            v-model="location"
            type="text"
            class="w-full rounded border border-zinc-600 bg-zinc-800 p-2 text-zinc-200"
            required
          />
        </div>

        <div>
          <label class="mb-1 block text-sm" for="desc">{{
            t('admin.field_description', 'Deskripsi')
          }}</label>
          <textarea
            id="desc"
            v-model="description"
            rows="5"
            class="w-full rounded border border-zinc-600 bg-zinc-800 p-2 text-zinc-200"
            required
          />
        </div>

        <div>
          <label class="mb-1 block text-sm" for="imageFile">
            {{ t('admin.field_image', 'Gambar Event (opsional)') }}
          </label>

          <input
            id="imageFile"
            type="file"
            accept="image/*"
            class="w-full rounded border border-zinc-600 bg-zinc-800 p-2 text-zinc-200 file:mr-4 file:rounded file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-600"
            @change="handleFileChange"
          />

          <div v-if="imagePreview" class="mt-3">
            <div class="mb-1 flex items-center justify-between">
              <p class="text-xs text-zinc-400">Pratinjau:</p>
              <button
                type="button"
                class="text-xs text-red-400 hover:text-red-300 hover:underline"
                @click="clearImage"
              >
                Hapus Gambar
              </button>
            </div>
            <div
              class="relative h-48 w-full overflow-hidden rounded-lg border border-zinc-700 bg-black/50"
            >
              <img
                :src="imagePreview"
                alt="Preview"
                class="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>

        <div class="flex gap-2 pt-2">
          <button
            type="submit"
            class="rounded bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-50"
            :disabled="loading"
          >
            {{
              isEditing ? t('admin.save', 'Simpan') : t('admin.create', 'Buat')
            }}
          </button>

          <button
            type="button"
            class="rounded bg-zinc-800 px-4 py-2 text-zinc-100 hover:bg-zinc-700"
            @click="resetForm"
          >
            {{ t('admin.cancel', 'Batal') }}
          </button>
        </div>
      </form>

      <section
        class="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">{{ t('admin.list', 'Daftar') }}</h2>
          <button
            type="button"
            class="rounded bg-zinc-800 px-3 py-1 text-xs hover:bg-zinc-700"
            @click="() => void refresh()"
          >
            {{ t('admin.refresh', 'Refresh') }}
          </button>
        </div>

        <div v-if="loading" class="text-zinc-300">
          {{ t('admin.loading', 'Memuat...') }}
        </div>
        <div v-else-if="items.length === 0" class="text-zinc-300">
          {{ t('admin.empty', 'Belum ada data.') }}
        </div>

        <div v-else class="space-y-3">
          <article
            v-for="e in items"
            :key="e.id"
            class="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-semibold">{{ e.title }}</h3>
                <p class="mt-1 text-sm text-zinc-300">
                  {{ e.date }}
                  <span v-if="e.time" class="text-brand-300">
                    ({{ e.time }})
                  </span>
                  • {{ e.location }}
                </p>
                <p class="mt-2 line-clamp-3 text-sm text-zinc-300">
                  {{ e.description }}
                </p>
                <p v-if="e.image" class="mt-1 text-xs text-brand-400">
                  Has Image
                </p>
              </div>

              <div class="flex shrink-0 flex-col gap-2">
                <button
                  type="button"
                  class="rounded bg-zinc-800 px-3 py-1 text-xs hover:bg-zinc-700"
                  @click="startEdit(e)"
                >
                  {{ t('admin.edit', 'Edit') }}
                </button>
                <button
                  type="button"
                  class="rounded bg-red-900/40 px-3 py-1 text-xs text-red-200 hover:bg-red-900/60"
                  @click="() => void remove(e.id)"
                >
                  {{ t('admin.delete', 'Hapus') }}
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </section>
  </main>
</template>
