import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  function setUser(u: User | null) {
    user.value = u
  }

  function loadFromLocalStorage() {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }

  return { user, setUser, loadFromLocalStorage }
})
