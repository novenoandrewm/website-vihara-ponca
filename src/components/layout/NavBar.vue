<!-- src/components/layout/NavBar.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import { logout as logoutService } from '@/services/auth'

import Container from '@/components/ui/Container.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

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

// --- PERUBAHAN 1: Logika akses Quotes Admin ---
const canManageQuotes = computed(
  () =>
    isLoggedIn.value &&
    (role.value === 'superadmin' || role.value === 'quotes_admin')
)
// ---------------------------------------------

const open = ref(false)
const toggle = () => (open.value = !open.value)
const close = () => (open.value = false)

watch(locale, (v) => localStorage.setItem('locale', String(v)))

function setLocale(v: 'id' | 'en') {
  locale.value = v
}

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

function linkClass(isActive: boolean) {
  const base =
    'rounded-xl px-3 py-2 text-sm transition ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950'
  return isActive
    ? `${base} bg-zinc-900/60 text-brand-200`
    : `${base} text-zinc-200 hover:bg-zinc-900/50 hover:text-zinc-50`
}

function mobileLinkClass() {
  return 'rounded-xl px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-900/60 hover:text-zinc-50'
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-zinc-800/70 bg-zinc-950/65 backdrop-blur"
    aria-label="Navigasi utama"
  >
    <Container>
      <div class="flex h-16 items-center justify-between gap-3">
        <router-link to="/" class="group flex items-center gap-3">
          <div
            class="relative grid h-9 w-9 place-items-center rounded-xl border border-zinc-800 bg-zinc-900/60 shadow-insetSoft"
            aria-hidden="true"
          >
            <span
              class="font-display text-base font-semibold tracking-[0.06em] text-brand-300"
            >
              ॐ
            </span>

            <span
              class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-brand-400/10"
            />
            <span
              class="pointer-events-none absolute -inset-3 rounded-2xl bg-brand-500/10 opacity-0 blur-xl transition group-hover:opacity-100"
            />
          </div>

          <div class="leading-tight">
            <div
              class="font-display text-[15px] font-semibold tracking-[0.08em] text-zinc-100 transition group-hover:text-brand-200 md:text-base"
            >
              Vihara Avalokitesvara
            </div>

            <div class="mt-0.5 flex items-center gap-2">
              <span class="h-px w-8 bg-brand-400/35" />
              <span class="h-1 w-1 rounded-full bg-brand-300/70" />
              <span class="h-px w-10 bg-zinc-700/70" />
            </div>

            <div class="text-[11px] text-zinc-400">
              Calm • Modern • Community
            </div>
          </div>
        </router-link>

        <nav class="hidden items-center gap-1 md:flex">
          <router-link v-slot="{ isActive }" to="/">
            <span :class="linkClass(isActive)">{{ t('nav.home') }}</span>
          </router-link>

          <router-link v-slot="{ isActive }" to="/about">
            <span :class="linkClass(isActive)">{{ t('nav.about') }}</span>
          </router-link>

          <router-link v-slot="{ isActive }" to="/pmv">
            <span :class="linkClass(isActive)">{{ t('nav.pmv') }}</span>
          </router-link>

          <router-link v-slot="{ isActive }" to="/gabi">
            <span :class="linkClass(isActive)">{{ t('nav.gabi') }}</span>
          </router-link>

          <router-link v-slot="{ isActive }" to="/schedule">
            <span :class="linkClass(isActive)">{{ t('nav.schedule') }}</span>
          </router-link>

          <router-link v-slot="{ isActive }" to="/contact">
            <span :class="linkClass(isActive)">{{ t('nav.contact') }}</span>
          </router-link>

          <div v-if="isLoggedIn" class="mx-2 h-6 w-px bg-zinc-800/80" />

          <router-link
            v-if="canManagePmv"
            to="/admin/pmv"
            class="rounded-xl px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-900/60 hover:text-brand-200"
          >
            {{ t('nav.admin_pmv') }}
          </router-link>
          <router-link
            v-if="canManageGabi"
            to="/admin/gabi"
            class="rounded-xl px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-900/60 hover:text-brand-200"
          >
            {{ t('nav.admin_gabi') }}
          </router-link>
          <router-link
            v-if="canManageSchedule"
            to="/admin/schedule"
            class="rounded-xl px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-900/60 hover:text-brand-200"
          >
            {{ t('nav.admin_schedule') }}
          </router-link>

          <router-link
            v-if="canManageQuotes"
            to="/admin/quotes"
            class="rounded-xl px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-900/60 hover:text-brand-200"
          >
            {{ t('nav.admin_quotes', 'Kelola Quotes') }}
          </router-link>
        </nav>

        <div class="flex items-center gap-2">
          <div class="hidden items-center gap-2 md:flex">
            <BaseButton
              size="sm"
              :variant="locale === 'id' ? 'primary' : 'ghost'"
              @click="setLocale('id')"
            >
              ID
            </BaseButton>
            <BaseButton
              size="sm"
              :variant="locale === 'en' ? 'primary' : 'ghost'"
              @click="setLocale('en')"
            >
              EN
            </BaseButton>
          </div>

          <router-link v-if="!isLoggedIn" to="/login" class="hidden md:block">
            <BaseButton size="sm">{{ t('nav.login') }}</BaseButton>
          </router-link>

          <BaseButton
            v-else
            size="sm"
            variant="secondary"
            class="hidden md:inline-flex"
            @click="handleLogout"
          >
            {{ t('nav.logout') }}
          </BaseButton>

          <button
            id="menu-button"
            class="rounded-xl border border-zinc-800 bg-zinc-900/60 p-2 text-zinc-100 shadow-insetSoft transition hover:bg-zinc-900 md:hidden"
            aria-controls="mobile-menu"
            :aria-expanded="open"
            aria-label="Toggle navigation"
            type="button"
            @click="toggle"
          >
            ☰
          </button>
        </div>
      </div>

      <Transition name="collapse">
        <div
          v-if="open"
          id="mobile-menu"
          class="border-t border-zinc-800/70 pb-4 md:hidden"
        >
          <div class="mt-3 grid gap-2">
            <router-link to="/" :class="mobileLinkClass()" @click="close">{{
              t('nav.home')
            }}</router-link>

            <router-link
              to="/about"
              :class="mobileLinkClass()"
              @click="close"
              >{{ t('nav.about') }}</router-link
            >

            <router-link to="/pmv" :class="mobileLinkClass()" @click="close">{{
              t('nav.pmv')
            }}</router-link>

            <router-link to="/gabi" :class="mobileLinkClass()" @click="close">{{
              t('nav.gabi')
            }}</router-link>

            <router-link
              to="/schedule"
              :class="mobileLinkClass()"
              @click="close"
              >{{ t('nav.schedule') }}</router-link
            >

            <router-link
              to="/contact"
              :class="mobileLinkClass()"
              @click="close"
              >{{ t('nav.contact') }}</router-link
            >

            <div v-if="isLoggedIn" class="my-1 h-px bg-zinc-800/70" />

            <router-link
              v-if="canManagePmv"
              to="/admin/pmv"
              :class="mobileLinkClass()"
              @click="close"
            >
              {{ t('nav.admin_pmv') }}
            </router-link>
            <router-link
              v-if="canManageGabi"
              to="/admin/gabi"
              :class="mobileLinkClass()"
              @click="close"
            >
              {{ t('nav.admin_gabi') }}
            </router-link>
            <router-link
              v-if="canManageSchedule"
              to="/admin/schedule"
              :class="mobileLinkClass()"
              @click="close"
            >
              {{ t('nav.admin_schedule') }}
            </router-link>

            <router-link
              v-if="canManageQuotes"
              to="/admin/quotes"
              :class="mobileLinkClass()"
              @click="close"
            >
              {{ t('nav.admin_quotes', 'Kelola Quotes') }}
            </router-link>
            <div class="my-1 h-px bg-zinc-800/70" />

            <router-link
              v-if="!isLoggedIn"
              to="/login"
              :class="mobileLinkClass()"
              @click="close"
            >
              {{ t('nav.login') }}
            </router-link>

            <button
              v-else
              type="button"
              class="rounded-xl px-3 py-2 text-left text-sm text-zinc-200 transition hover:bg-zinc-900/60 hover:text-zinc-50"
              @click="handleLogout"
            >
              {{ t('nav.logout') }}
            </button>

            <div class="mt-2 flex gap-2">
              <BaseButton
                size="sm"
                :variant="locale === 'id' ? 'primary' : 'ghost'"
                @click="setLocale('id')"
              >
                ID
              </BaseButton>
              <BaseButton
                size="sm"
                :variant="locale === 'en' ? 'primary' : 'ghost'"
                @click="setLocale('en')"
              >
                EN
              </BaseButton>
            </div>
          </div>
        </div>
      </Transition>
    </Container>
  </header>
</template>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition:
    max-height 220ms ease,
    opacity 180ms ease;
  overflow: hidden;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
.collapse-enter-to,
.collapse-leave-from {
  max-height: 560px;
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .collapse-enter-active,
  .collapse-leave-active {
    transition: none;
  }
}
</style>
