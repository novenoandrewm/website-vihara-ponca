import { ref } from 'vue'

export type User = {
  id: string
  name: string
  role: 'superadmin' | 'pmv_admin' | 'gabi_admin' | 'schedule_admin'
}

const currentUser = ref<User | null>(null)

export async function login(email: string, password: string) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Invalid credentials')
  const data = await res.json()
  // backend harus mengembalikan token dan user info
  localStorage.setItem('token', data.token)
  currentUser.value = data.user
}

export function logout() {
  localStorage.removeItem('token')
  currentUser.value = null
}

export function useCurrentUser() {
  return currentUser
}
