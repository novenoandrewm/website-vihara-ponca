import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/services/auth'

/**
 * Pinia store for authentication state. This store holds the current user
 * and provides helpers to persist and restore the profile from localStorage.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  /** Set the user in state and persist to localStorage. */
  function setUser(u: User | null): void {
    user.value = u
    if (u) {
      localStorage.setItem('user', JSON.stringify(u))
    } else {
      localStorage.removeItem('user')
    }
  }

  /** Load the user from localStorage. Call during startup. */
  function loadFromLocalStorage(): void {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        user.value = JSON.parse(stored) as User
      } catch {
        user.value = null
      }
    }
  }

  // Hydrate automatically on store creation
  loadFromLocalStorage()

  return { user, setUser, loadFromLocalStorage }
})
