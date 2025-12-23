<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })

type PmvPost = {
  id: string
  title: string
  content: string
  updatedAt: string
}

const STORAGE_KEY = 'admin_pmv_posts_v1'

const items = ref<PmvPost[]>([])
const loading = ref(true)
const errorMsg = ref<string | null>(null)

// form state
const editingId = ref<string | null>(null)
const title = ref('')
const content = ref('')

const isEditing = computed(() => editingId.value !== null)

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    items.value = raw ? (JSON.parse(raw) as PmvPost[]) : []
  } catch {
    items.value = []
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
}

function resetForm() {
  editingId.value = null
  title.value = ''
  content.value = ''
}

function startEdit(post: PmvPost) {
  editingId.value = post.id
  title.value = post.title
  content.value = post.content
}

function remove(id: string) {
  items.value = items.value.filter((x) => x.id !== id)
  save()
  if (editingId.value === id) resetForm()
}

function submit() {
  const now = new Date().toISOString()

  if (!title.value.trim() || !content.value.trim()) return

  if (isEditing.value) {
    const idx = items.value.findIndex((x) => x.id === editingId.value)
    if (idx !== -1) {
      items.value[idx] = {
        ...items.value[idx],
        title: title.value.trim(),
        content: content.value.trim(),
        updatedAt: now,
      }
      save()
      resetForm()
    }
    return
  }

  const newItem: PmvPost = {
    id: crypto.randomUUID(),
    title: title.value.trim(),
    content: content.value.trim(),
    updatedAt: now,
  }
  items.value = [newItem, ...items.value]
  save()
  resetForm()
}

onMounted(() => {
  try {
    load()
  } catch (_e) {
    errorMsg.value = t('admin.error_generic', 'Terjadi kesalahan.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main id="main" tabindex="-1" class="mx-auto max-w-6xl space-y-6 p-6">
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold">
        {{ t('admin.pmv.title', 'Kelola Kegiatan PMV') }}
      </h1>
      <p class="text-zinc-300">
        {{
          t('admin.pmv.desc', 'Tambah atau perbarui informasi kegiatan PMV.')
        }}
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
      <!-- Form -->
      <form
        class="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
        @submit.prevent="submit"
      >
        <h2 class="text-lg font-semibold">
          {{ isEditing ? t('admin.edit', 'Edit') : t('admin.add', 'Tambah') }}
        </h2>

        <div>
          <label class="mb-1 block text-sm" for="title">
            {{ t('admin.field_title', 'Judul') }}
          </label>
          <input
            id="title"
            v-model="title"
            type="text"
            class="w-full rounded border border-zinc-600 bg-zinc-800 p-2 text-zinc-200"
            required
          />
        </div>

        <div>
          <label class="mb-1 block text-sm" for="content">
            {{ t('admin.field_content', 'Konten') }}
          </label>
          <textarea
            id="content"
            v-model="content"
            rows="6"
            class="w-full rounded border border-zinc-600 bg-zinc-800 p-2 text-zinc-200"
            required
          ></textarea>
        </div>

        <div class="flex gap-2">
          <button
            type="submit"
            class="rounded bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
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

        <p class="text-xs text-zinc-400">
          {{
            t(
              'admin.note_local',
              'Catatan: sementara tersimpan di browser (localStorage).'
            )
          }}
        </p>
      </form>

      <!-- List -->
      <section
        class="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
      >
        <h2 class="text-lg font-semibold">
          {{ t('admin.list', 'Daftar') }}
        </h2>

        <div v-if="loading" class="text-zinc-300">
          {{ t('admin.loading', 'Memuat...') }}
        </div>

        <div v-else-if="items.length === 0" class="text-zinc-300">
          {{ t('admin.empty', 'Belum ada data.') }}
        </div>

        <div v-else class="space-y-3">
          <article
            v-for="p in items"
            :key="p.id"
            class="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-semibold">{{ p.title }}</h3>
                <p class="mt-1 line-clamp-3 text-sm text-zinc-300">
                  {{ p.content }}
                </p>
                <p class="mt-2 text-xs text-zinc-500">
                  {{ t('admin.updated', 'Diperbarui') }}: {{ p.updatedAt }}
                </p>
              </div>

              <div class="flex shrink-0 flex-col gap-2">
                <button
                  type="button"
                  class="rounded bg-zinc-800 px-3 py-1 text-xs hover:bg-zinc-700"
                  @click="startEdit(p)"
                >
                  {{ t('admin.edit', 'Edit') }}
                </button>
                <button
                  type="button"
                  class="rounded bg-red-900/40 px-3 py-1 text-xs text-red-200 hover:bg-red-900/60"
                  @click="remove(p.id)"
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
