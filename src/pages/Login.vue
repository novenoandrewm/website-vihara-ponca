<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/services/auth'
import { useAuthStore } from '@/store/auth'
import { useI18n } from 'vue-i18n'

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
    // set user di store jika backend mengembalikan profil
    const tokenUser = JSON.parse(
      atob(localStorage.getItem('token')!.split('.')[1])
    )
    auth.setUser(tokenUser)
    router.push({ name: 'dashboard' })
  } catch (e) {
    errorMsg.value = t('login.error', 'Login gagal. Cek email dan sandi.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="mx-auto max-w-md space-y-4 p-6">
    <h1 class="text-2xl font-semibold">{{ t('login.title', 'Login') }}</h1>
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="mb-1 block">{{ t('login.email', 'Email') }}</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full rounded border border-zinc-600 bg-zinc-800 p-2"
        />
      </div>
      <div>
        <label class="mb-1 block">{{ t('login.password', 'Password') }}</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full rounded border border-zinc-600 bg-zinc-800 p-2"
        />
      </div>
      <p v-if="errorMsg" class="text-red-300">{{ errorMsg }}</p>
      <button
        :disabled="loading"
        type="submit"
        class="rounded bg-brand-500 px-4 py-2 text-white"
      >
        {{ t('login.submit', 'Login') }}
      </button>
    </form>
  </main>
</template>
