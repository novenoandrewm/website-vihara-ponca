<!-- src/pages/AdminDashboard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
const auth = useAuthStore()

const role = computed(() => auth.user?.role)

const canManagePmv = computed(
  () => role.value === 'superadmin' || role.value === 'pmv_admin'
)
const canManageGabi = computed(
  () => role.value === 'superadmin' || role.value === 'gabi_admin'
)
const canManageSchedule = computed(
  () => role.value === 'superadmin' || role.value === 'schedule_admin'
)
const canManageQuotes = computed(
  () => role.value === 'superadmin' || role.value === 'quotes_admin'
)
</script>

<template>
  <main id="main" tabindex="-1" class="mx-auto max-w-6xl space-y-6 p-6">
    <header class="space-y-1">
      <h1 class="text-2xl font-semibold">
        {{ t('admin.dashboard.title', 'Dashboard Admin') }}
      </h1>
      <p class="text-zinc-300">
        {{
          t('admin.dashboard.subtitle', 'Pilih modul yang ingin Anda kelola.')
        }}
      </p>

      <p v-if="auth.user" class="text-sm text-zinc-400">
        {{ t('admin.dashboard.signed_in_as', 'Masuk sebagai') }}:
        <span class="font-medium text-zinc-200">{{ auth.user.name }}</span>
        <span class="text-zinc-500">({{ auth.user.role }})</span>
      </p>
    </header>

    <section class="grid gap-4 md:grid-cols-3">
      <router-link
        v-if="canManagePmv"
        to="/admin/pmv"
        class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 hover:bg-zinc-900/70"
      >
        <h2 class="text-lg font-semibold">
          {{ t('nav.admin_pmv', 'Kelola PMV') }}
        </h2>
        <p class="mt-1 text-sm text-zinc-300">
          {{
            t('admin.dashboard.pmv_hint', 'Tambah/ubah informasi kegiatan PMV.')
          }}
        </p>
      </router-link>

      <router-link
        v-if="canManageGabi"
        to="/admin/gabi"
        class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 hover:bg-zinc-900/70"
      >
        <h2 class="text-lg font-semibold">
          {{ t('nav.admin_gabi', 'Kelola GABI') }}
        </h2>
        <p class="mt-1 text-sm text-zinc-300">
          {{
            t(
              'admin.dashboard.gabi_hint',
              'Tambah/ubah informasi kegiatan GABI.'
            )
          }}
        </p>
      </router-link>

      <router-link
        v-if="canManageSchedule"
        to="/admin/schedule"
        class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 hover:bg-zinc-900/70"
      >
        <h2 class="text-lg font-semibold">
          {{ t('nav.admin_schedule', 'Kelola Jadwal') }}
        </h2>
        <p class="mt-1 text-sm text-zinc-300">
          {{
            t(
              'admin.dashboard.schedule_hint',
              'Tambah/ubah jadwal kegiatan rutin.'
            )
          }}
        </p>
      </router-link>

      <router-link
        v-if="canManageQuotes"
        to="/admin/quotes"
        class="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 hover:bg-zinc-900/70"
      >
        <h2 class="text-lg font-semibold">
          {{ t('nav.admin_quotes', 'Kelola Kutipan') }}
        </h2>
        <p class="mt-1 text-sm text-zinc-300">
          {{
            t(
              'admin.dashboard.quotes_hint',
              'Update kutipan mingguan di halaman beranda.'
            )
          }}
        </p>
      </router-link>
    </section>

    <section
      v-if="
        !canManagePmv &&
        !canManageGabi &&
        !canManageSchedule &&
        !canManageQuotes
      "
      class="rounded-xl border border-yellow-700/40 bg-yellow-900/20 p-4 text-yellow-200"
      role="status"
    >
      {{
        t(
          'admin.dashboard.no_permissions',
          'Akun Anda belum memiliki akses modul admin.'
        )
      }}
    </section>
  </main>
</template>
