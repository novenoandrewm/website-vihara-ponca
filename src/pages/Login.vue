<!-- src/pages/Login.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { login } from '@/services/auth'
import { useAuthStore } from '@/store/auth'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  loading.value = true
  errorMsg.value = ''

  try {
    await login(email.value, password.value)
    auth.loadFromLocalStorage()

    const redirect =
      typeof route.query.redirect === 'string' ? route.query.redirect : null

    if (redirect) {
      await router.push(redirect)
      return
    }
    await router.push({ name: 'dashboard' })
  } catch (_e) {
    errorMsg.value = t('login.error', 'Login gagal. Cek email dan kata sandi.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main
    id="main"
    tabindex="-1"
    class="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-zinc-950 px-4 pt-12 md:pt-20"
  >
    <div
      class="pointer-events-none absolute inset-0 transform-gpu overflow-hidden"
    >
      <div class="absolute inset-0 flex items-center justify-center">
        <div
          class="transform-gpu select-none font-display text-[400px] leading-none text-brand-500/[0.08] blur-[1px] will-change-transform md:text-[700px]"
          aria-hidden="true"
        >
          ☸
        </div>
      </div>

      <div
        class="absolute -left-40 -top-40 h-[600px] w-[600px] transform-gpu rounded-full bg-brand-500/10 blur-[100px] will-change-transform"
      />
      <div
        class="absolute -right-40 bottom-0 h-[600px] w-[600px] transform-gpu rounded-full bg-jade-500/10 blur-[100px] will-change-transform"
      />

      <div
        class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>

    <div class="relative z-10 w-full max-w-md animate-fadeUp space-y-8">
      <div class="space-y-4 text-center">
        <h1
          class="font-display text-4xl font-bold uppercase tracking-widest text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)] md:text-5xl"
        >
          {{ t('login.title') }}
        </h1>

        <div class="flex items-center justify-center gap-4 opacity-90">
          <div
            class="h-px w-16 bg-gradient-to-r from-transparent to-brand-300"
          ></div>
          <div
            class="h-2 w-2 rotate-45 border border-brand-300 bg-zinc-950"
          ></div>
          <div
            class="h-px w-16 bg-gradient-to-l from-transparent to-brand-300"
          ></div>
        </div>
      </div>

      <form
        class="space-y-6 rounded-3xl border border-white/10 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-brand-500/30 hover:bg-zinc-900/70"
        @submit.prevent="handleSubmit"
      >
        <div class="space-y-2">
          <label
            class="text-xs font-bold uppercase tracking-widest text-zinc-400"
            for="email"
          >
            {{ t('login.email') }}
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            class="w-full rounded-xl border border-zinc-700/50 bg-zinc-950/50 p-3.5 text-base text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-300 focus:border-brand-500/50 focus:bg-zinc-950/80 focus:ring-2 focus:ring-brand-500/20"
            :placeholder="t('login.email_placeholder', 'nama@email.com')"
          />
        </div>

        <div class="space-y-2">
          <label
            class="text-xs font-bold uppercase tracking-widest text-zinc-400"
            for="password"
          >
            {{ t('login.password') }}
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="w-full rounded-xl border border-zinc-700/50 bg-zinc-950/50 p-3.5 text-base text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-300 focus:border-brand-500/50 focus:bg-zinc-950/80 focus:ring-2 focus:ring-brand-500/20"
            :placeholder="
              t('login.password_placeholder', 'Masukkan kata sandi')
            "
          />
        </div>

        <div
          v-if="errorMsg"
          role="alert"
          class="animate-pulse rounded-lg border border-red-500/20 bg-red-900/10 p-4 text-center text-sm font-medium text-red-200"
        >
          {{ errorMsg }}
        </div>

        <div class="pt-2">
          <BaseButton
            type="submit"
            :disabled="loading"
            variant="primary"
            size="lg"
            class="w-full justify-center text-base font-semibold shadow-xl shadow-brand-500/10 hover:shadow-brand-500/20"
          >
            {{ loading ? t('admin.loading', 'Memuat...') : t('login.submit') }}
          </BaseButton>
        </div>
      </form>
    </div>
  </main>
</template>
