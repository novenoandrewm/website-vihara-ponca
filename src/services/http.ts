import { getAuthHeader, logout } from '@/services/auth'

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}

function getErrorMessage(payload: unknown): string | null {
  if (payload && typeof payload === 'object') {
    const rec = payload as Record<string, unknown>
    const err = rec.error
    if (typeof err === 'string' && err.trim()) return err
  }
  if (typeof payload === 'string' && payload.trim()) return payload
  return null
}

export async function fetchJson<T>(
  url: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers)

  headers.set('Accept', 'application/json')

  // set Content-Type
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  // inject Authorization
  const authHeaders = getAuthHeader()
  for (const [k, v] of Object.entries(authHeaders)) {
    headers.set(k, v)
  }

  const res = await fetch(url, { ...init, headers })
  const text = await res.text()
  const data: unknown = text ? safeParse(text) : null

  if (!res.ok) {
    if (res.status === 401) logout()
    const msg = getErrorMessage(data) ?? res.statusText ?? 'Request failed'
    throw new Error(msg)
  }

  return data as T
}
