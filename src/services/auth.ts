// src/services/auth.ts
import { ref } from 'vue'

export type Role =
  | 'superadmin'
  | 'pmv_admin'
  | 'gabi_admin'
  | 'schedule_admin'
  | 'quotes_admin'

export type User = {
  id: string
  name: string
  email?: string
  role: Role
}

type LoginResponse = {
  token: string
  user: User
}

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

const hasStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function getToken(): string | null {
  if (!hasStorage()) return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): User | null {
  if (!hasStorage()) return null
  return safeJsonParse<User>(localStorage.getItem(USER_KEY))
}

export function setSession(token: string, user: User): void {
  if (!hasStorage()) return
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession(): void {
  if (!hasStorage()) return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getAuthHeader(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const currentUser = ref<User | null>(getStoredUser())
export function useCurrentUser() {
  return currentUser
}

/** Perform login; persist JWT + user into localStorage */
export async function login(email: string, password: string): Promise<User> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const errJson = safeJsonParse<{ error?: string }>(await res.text())
    throw new Error(errJson?.error || 'Login failed')
  }

  const data = (await res.json()) as LoginResponse

  setSession(data.token, data.user)
  currentUser.value = data.user
  return data.user
}

/** Logout: clear token + user from storage */
export function logout(): void {
  clearSession()
  currentUser.value = null
}
