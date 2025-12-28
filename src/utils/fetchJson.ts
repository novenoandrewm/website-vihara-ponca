import { getToken } from '@/services/auth'

type FetchJsonInit = RequestInit & {
  /** default: true kalau url dimulai dengan /api/ */
  auth?: boolean
}

async function readErrorMessage(res: Response): Promise<string> {
  const text = await res.text()
  if (!text) return `Fetch failed ${res.status} ${res.statusText}`

  try {
    const j = JSON.parse(text) as { error?: string; message?: string }
    return (
      j.error || j.message || `Fetch failed ${res.status} ${res.statusText}`
    )
  } catch {
    return text
  }
}

export async function fetchJson<T>(
  url: string,
  init: FetchJsonInit = {}
): Promise<T> {
  const headers = new Headers(init.headers || {})
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')

  const shouldAuth = init.auth ?? url.startsWith('/api/')
  if (shouldAuth) {
    const token = getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(url, {
    cache: 'no-store',
    ...init,
    headers,
  })

  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }

  return (await res.json()) as T
}
