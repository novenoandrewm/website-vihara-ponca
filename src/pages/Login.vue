<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { login } from '@/services/auth'
import { useAuthStore } from '@/store/auth'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()
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
    // refresh store from localStorage after login
    auth.loadFromLocalStorage()
    router.push({ name: 'dashboard' })
  } catch (_e) {
    errorMsg.value = t('login.error', 'Login gagal. Cek email dan kata sandi.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main id="main" tabindex="-1" class="mx-auto max-w-md space-y-4 p-6">
    <h1 class="text-2xl font-semibold">{{ t('login.title') }}</h1>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="mb-1 block text-sm" for="email">
          {{ t('login.email') }}
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
          class="w-full rounded border border-zinc-600 bg-zinc-800 p-2 text-zinc-200"
        />
      </div>

      <div>
        <label class="mb-1 block text-sm" for="password">
          {{ t('login.password') }}
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          class="w-full rounded border border-zinc-600 bg-zinc-800 p-2 text-zinc-200"
        />
      </div>

      <p v-if="errorMsg" role="alert" class="text-sm text-red-300">
        {{ errorMsg }}
      </p>

      <button
        type="submit"
        :disabled="loading"
        class="rounded bg-brand-500 px-4 py-2 text-white hover:bg-brand-600 disabled:opacity-60"
      >
        {{ loading ? '...' : t('login.submit') }}
      </button>
    </form>
  </main>
</template>
