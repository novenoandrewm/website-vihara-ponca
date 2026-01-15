<!-- src/components/layout/NavBar.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue' // nextTick dihapus
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { logout as logoutService } from '@/services/auth'

import Container from '@/components/ui/Container.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t, locale } = useI18n({ useScope: 'global' })
const route = useRoute()

const auth = useAuthStore()
const isLoggedIn = computed(() => !!auth.user)
const role = computed(() => auth.user?.role)

// Permissions
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
const canManageQuotes = computed(
  () =>
    isLoggedIn.value &&
    (role.value === 'superadmin' || role.value === 'quotes_admin')
)

const open = ref(false)

// UX: Lock body scroll when mobile menu is open
watch(open, (isOpen) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})

// UX: Close menu automatically when route changes
watch(
  () => route.path,
  () => {
    open.value = false
  }
)

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
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  // Ensure scroll is unlocked if component unmounts
  if (typeof document !== 'undefined') document.body.style.overflow = ''
})

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
  // Increased vertical padding for better touch targets on mobile
  return 'block w-full rounded-xl px-4 py-3 text-base text-zinc-200 transition hover:bg-zinc-900/60 hover:text-zinc-50 active:bg-zinc-800'
}
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-zinc-950/60"
    aria-label="Navigasi utama"
  >
    <Container>
      <div class="flex h-16 items-center justify-between gap-3">
        <router-link
          to="/"
          class="group relative z-50 flex items-center gap-3"
          @click="close"
        >
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
            <div
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

            <div class="hidden text-[11px] text-zinc-400 sm:block">
              {{ t('nav.tagline') }}
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
            <span :class="linkClass(isActive)">{{
              t('nav.general', 'Umum')
            }}</span>
          </router-link>

          <router-link v-slot="{ isActive }" to="/contact">
            <span :class="linkClass(isActive)">{{ t('nav.contact') }}</span>
          </router-link>

          <div v-if="isLoggedIn" class="mx-2 h-6 w-px bg-zinc-800/80" />

          <template v-if="isLoggedIn">
            <router-link
              v-if="canManagePmv"
              to="/admin/pmv"
              :class="linkClass(false)"
              >{{ t('nav.admin_pmv') }}</router-link
            >
            <router-link
              v-if="canManageGabi"
              to="/admin/gabi"
              :class="linkClass(false)"
              >{{ t('nav.admin_gabi') }}</router-link
            >
            <router-link
              v-if="canManageSchedule"
              to="/admin/schedule"
              :class="linkClass(false)"
              >{{ t('nav.admin_schedule') }}</router-link
            >
            <router-link
              v-if="canManageQuotes"
              to="/admin/quotes"
              :class="linkClass(false)"
              >{{ t('nav.admin_quotes', 'Kelola Quotes') }}</router-link
            >
          </template>
        </nav>

        <div class="relative z-50 flex items-center gap-2">
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
            class="grid min-h-[44px] min-w-[44px] place-items-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-100 shadow-insetSoft transition hover:bg-zinc-900 md:hidden"
            aria-controls="mobile-menu"
            :aria-expanded="open"
            aria-label="Toggle navigation"
            type="button"
            @click="toggle"
          >
            <span class="text-xl" aria-hidden="true">{{
              open ? '✕' : '☰'
            }}</span>
          </button>
        </div>
      </div>

      <Transition name="collapse">
        <div
          v-if="open"
          id="mobile-menu"
          class="fixed inset-x-0 bottom-0 top-[64px] z-40 flex flex-col overflow-y-auto border-t border-zinc-800/70 bg-zinc-950/95 backdrop-blur-xl md:hidden"
        >
          <Container class="flex flex-1 flex-col py-6">
            <div class="flex flex-col gap-2">
              <router-link to="/" :class="mobileLinkClass()" @click="close">
                {{ t('nav.home') }}
              </router-link>
              <router-link
                to="/about"
                :class="mobileLinkClass()"
                @click="close"
              >
                {{ t('nav.about') }}
              </router-link>
              <router-link to="/pmv" :class="mobileLinkClass()" @click="close">
                {{ t('nav.pmv') }}
              </router-link>
              <router-link to="/gabi" :class="mobileLinkClass()" @click="close">
                {{ t('nav.gabi') }}
              </router-link>
              <router-link
                to="/schedule"
                :class="mobileLinkClass()"
                @click="close"
              >
                {{ t('nav.general', 'Umum') }}
              </router-link>
              <router-link
                to="/contact"
                :class="mobileLinkClass()"
                @click="close"
              >
                {{ t('nav.contact') }}
              </router-link>

              <template v-if="isLoggedIn">
                <div class="my-2 h-px bg-zinc-800/70" />
                <p
                  class="px-4 text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                  Admin
                </p>
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
              </template>

              <div class="my-2 h-px bg-zinc-800/70" />

              <div class="grid grid-cols-2 gap-3 px-4">
                <button
                  type="button"
                  :class="[
                    'rounded-lg px-3 py-2 text-sm font-medium transition',
                    locale === 'id'
                      ? 'bg-brand-500/20 text-brand-200 ring-1 ring-brand-500/50'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200',
                  ]"
                  @click="setLocale('id')"
                >
                  Bahasa Indonesia
                </button>
                <button
                  type="button"
                  :class="[
                    'rounded-lg px-3 py-2 text-sm font-medium transition',
                    locale === 'en'
                      ? 'bg-brand-500/20 text-brand-200 ring-1 ring-brand-500/50'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200',
                  ]"
                  @click="setLocale('en')"
                >
                  English
                </button>
              </div>

              <div class="mt-4 px-4">
                <router-link
                  v-if="!isLoggedIn"
                  to="/login"
                  class="flex w-full items-center justify-center rounded-xl bg-brand-500 px-4 py-3 font-semibold text-white shadow-lg shadow-brand-500/20 transition active:scale-95"
                  @click="close"
                >
                  {{ t('nav.login') }}
                </router-link>

                <button
                  v-else
                  type="button"
                  class="flex w-full items-center justify-center rounded-xl bg-zinc-800 px-4 py-3 font-semibold text-zinc-200 transition hover:bg-zinc-700 active:scale-95"
                  @click="handleLogout"
                >
                  {{ t('nav.logout') }}
                </button>
              </div>
            </div>
          </Container>
        </div>
      </Transition>
    </Container>
  </header>
</template>

<style scoped>
.collapse-enter-active,
.collapse-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  transform: translateY(-8px) scaleY(0.98);
}

.collapse-enter-to,
.collapse-leave-from {
  opacity: 1;
  transform: translateY(0) scaleY(1);
}

@media (prefers-reduced-motion: reduce) {
  .collapse-enter-active,
  .collapse-leave-active {
    transition: none;
  }
}
</style>
