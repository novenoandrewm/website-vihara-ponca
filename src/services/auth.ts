import { ref } from 'vue'

/*
 * Authentication and user-session helper. This service is responsible for
 * performing login requests against the API, persisting the resulting
 * JSON Web Token (JWT) and user profile to localStorage, and exposing a
 * reactive currentUser ref. Storing the user profile alongside the token
 * ensures that on subsequent page refreshes the application can restore
 * the authenticated state without needing to re‑decode the JWT or re‑fetch
 * profile information from the server.
 */
export type User = {
  id: string
  name: string
  role: 'superadmin' | 'pmv_admin' | 'gabi_admin' | 'schedule_admin'
}

// A ref that holds the current authenticated user.
const currentUser = ref<User | null>(null)

// Immediately attempt to hydrate currentUser from localStorage
const storedUser = localStorage.getItem('user')
if (storedUser) {
  try {
    currentUser.value = JSON.parse(storedUser) as User
  } catch {
    currentUser.value = null
  }
}

/** Perform login; persist both JWT and user to localStorage. */
export async function login(email: string, password: string): Promise<void> {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Invalid credentials')
  const data = await res.json()
  // Persist token and user profile to localStorage
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))
  currentUser.value = data.user as User
}

/** Logout: clear token and user from storage. */
export function logout(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  currentUser.value = null
}

/** Return the reactive currentUser ref. */
export function useCurrentUser() {
  return currentUser
}
