// src/store/auth.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  login as apiLogin,
  logout as apiLogout,
  getToken,
  getStoredUser,
} from '@/services/auth'
import type { Role, User } from '@/services/auth'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

const hasStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isLoggedIn = computed(() => !!user.value && !!token.value)
  const role = computed<Role | null>(() => user.value?.role ?? null)

  function loadFromLocalStorage(): void {
    user.value = getStoredUser()
    token.value = getToken()
  }

  function setUser(u: User | null): void {
    user.value = u
    if (!hasStorage()) return
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u))
    else localStorage.removeItem(USER_KEY)
  }

  function setToken(t: string | null): void {
    token.value = t
    if (!hasStorage()) return
    if (t) localStorage.setItem(TOKEN_KEY, t)
    else localStorage.removeItem(TOKEN_KEY)
  }

  function setSession(next: { user: User; token: string } | null): void {
    if (!next) {
      setUser(null)
      setToken(null)
      return
    }
    setUser(next.user)
    setToken(next.token)
  }

  function logout(): void {
    apiLogout()
    setSession(null)
  }

  async function login(email: string, password: string): Promise<User> {
    const u = await apiLogin(email, password)
    loadFromLocalStorage()
    return u
  }

  function hasAnyRole(roles: Role[]): boolean {
    if (!user.value) return false
    if (user.value.role === 'superadmin') return true
    return roles.includes(user.value.role)
  }

  loadFromLocalStorage()

  return {
    user,
    token,
    isLoggedIn,
    role,
    setUser,
    setToken,
    setSession,
    loadFromLocalStorage,
    login,
    logout,
    hasAnyRole,
  }
})
