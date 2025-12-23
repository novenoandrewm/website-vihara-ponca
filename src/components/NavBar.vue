<!-- src/components/NavBar.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import { logout as logoutService } from '@/services/auth'

const { t, locale } = useI18n({ useScope: 'global' })

const auth = useAuthStore()
const isLoggedIn = computed(() => !!auth.user)
const role = computed(() => auth.user?.role)

const canManagePmv = computed(
  () =>
    isLoggedIn.value &&
    (role.value === 'superadmin' || role.value === 'pmv_admin')
)
const canManageGabi = computed(
  () =>
    isLoggedIn.value &&
    (role.value === 'superadmin' || role.value === 'gabi_admin')
)
const canManageSchedule = computed(
  () =>
    isLoggedIn.value &&
    (role.value === 'superadmin' || role.value === 'schedule_admin')
)

const open = ref(false)
const toggle = () => (open.value = !open.value)
const close = () => (open.value = false)

// persist bahasa
watch(locale, (v) => localStorage.setItem('locale', String(v)))

// Tutup menu ketika tekan ESC (aksesibilitas)
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

function handleLogout() {
  logoutService()
  auth.setUser(null)
  close()
}
</script>

<template>
  <nav class="bg-zinc-950 text-zinc-100" aria-label="Navigasi utama">
    <div class="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
      <router-link to="/" class="font-semibold"
        >Vihara Avalokitesvara</router-link
      >

      <!-- DESKTOP -->
      <div class="hidden gap-4 text-sm md:flex">
        <router-link v-slot="{ isActive }" to="/">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">
            {{ t('nav.home') }}
          </span>
        </router-link>

        <router-link v-slot="{ isActive }" to="/pmv">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">
            {{ t('nav.pmv') }}
          </span>
        </router-link>

        <router-link v-slot="{ isActive }" to="/gabi">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">
            {{ t('nav.gabi') }}
          </span>
        </router-link>

        <router-link v-slot="{ isActive }" to="/schedule">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">
            {{ t('nav.schedule') }}
          </span>
        </router-link>

        <router-link v-slot="{ isActive }" to="/contact">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">
            {{ t('nav.contact') }}
          </span>
        </router-link>

        <!-- ADMIN links (Desktop) -->
        <router-link v-if="canManagePmv" to="/admin/pmv">
          {{ t('nav.admin_pmv', 'Kelola PMV') }}
        </router-link>

        <router-link v-if="canManageGabi" to="/admin/gabi">
          {{ t('nav.admin_gabi', 'Kelola GABI') }}
        </router-link>

        <router-link v-if="canManageSchedule" to="/admin/schedule">
          {{ t('nav.admin_schedule', 'Kelola Jadwal') }}
        </router-link>

        <!-- login/logout -->
        <router-link v-if="!isLoggedIn" to="/login">
          {{ t('nav.login', 'Login') }}
        </router-link>

        <button
          v-else
          type="button"
          class="text-sm underline"
          @click="handleLogout"
        >
          {{ t('nav.logout', 'Keluar') }}
        </button>
      </div>

      <!-- spacer -->
      <div class="flex-1"></div>

      <!-- language (desktop) -->
      <div class="hidden items-center gap-2 md:flex">
        <button
          type="button"
          class="rounded bg-zinc-800 px-2 py-1 text-xs"
          @click="locale = 'id'"
        >
          ID
        </button>
        <button
          type="button"
          class="rounded bg-zinc-800 px-2 py-1 text-xs"
          @click="locale = 'en'"
        >
          EN
        </button>
      </div>

      <!-- mobile hamburger -->
      <button
        id="menu-button"
        class="rounded bg-zinc-800 p-2 md:hidden"
        aria-controls="mobile-menu"
        :aria-expanded="open"
        aria-label="Toggle navigation"
        type="button"
        @click="toggle"
      >
        ☰
      </button>
    </div>

    <!-- MOBILE -->
    <div
      v-show="open"
      id="mobile-menu"
      class="border-t border-zinc-800 px-4 pb-3 md:hidden"
    >
      <div class="flex flex-col gap-2 py-3 text-sm">
        <router-link v-slot="{ isActive }" to="/" @click="close">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">
            {{ t('nav.home') }}
          </span>
        </router-link>

        <router-link v-slot="{ isActive }" to="/pmv" @click="close">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">
            {{ t('nav.pmv') }}
          </span>
        </router-link>

        <router-link v-slot="{ isActive }" to="/gabi" @click="close">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">
            {{ t('nav.gabi') }}
          </span>
        </router-link>

        <router-link v-slot="{ isActive }" to="/schedule" @click="close">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">
            {{ t('nav.schedule') }}
          </span>
        </router-link>

        <router-link v-slot="{ isActive }" to="/contact" @click="close">
          <span :class="isActive ? 'font-medium text-brand-500' : ''">
            {{ t('nav.contact') }}
          </span>
        </router-link>

        <!-- ADMIN links (Mobile) -->
        <router-link v-if="canManagePmv" to="/admin/pmv" @click="close">
          {{ t('nav.admin_pmv', 'Kelola PMV') }}
        </router-link>

        <router-link v-if="canManageGabi" to="/admin/gabi" @click="close">
          {{ t('nav.admin_gabi', 'Kelola GABI') }}
        </router-link>

        <router-link
          v-if="canManageSchedule"
          to="/admin/schedule"
          @click="close"
        >
          {{ t('nav.admin_schedule', 'Kelola Jadwal') }}
        </router-link>

        <!-- login/logout (Mobile) -->
        <router-link v-if="!isLoggedIn" to="/login" @click="close">
          {{ t('nav.login', 'Login') }}
        </router-link>

        <button
          v-else
          type="button"
          class="text-left underline"
          @click="handleLogout"
        >
          {{ t('nav.logout', 'Keluar') }}
        </button>
      </div>

      <div class="flex gap-2">
        <button
          type="button"
          class="rounded bg-zinc-800 px-2 py-1 text-xs"
          @click="locale = 'id'"
        >
          ID
        </button>
        <button
          type="button"
          class="rounded bg-zinc-800 px-2 py-1 text-xs"
          @click="locale = 'en'"
        >
          EN
        </button>
      </div>
    </div>
  </nav>
</template>
