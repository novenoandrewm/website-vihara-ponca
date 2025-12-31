export class HttpError extends Error {
  status: number
  statusText: string
  bodyText: string

  constructor(status: number, statusText: string, bodyText: string) {
    super(bodyText || `HTTP ${status} ${statusText}`)
    this.name = 'HttpError'
    this.status = status
    this.statusText = statusText
    this.bodyText = bodyText
  }
}

function safeJsonParse<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T
  } catch {
    return null
  }
}

export async function fetchJson<T>(
  url: string,
  init: RequestInit = {}
): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase()
  const res = await fetch(url, {
    cache: method === 'GET' ? 'no-store' : init.cache,
    ...init,
  })

  const text = await res.text()

  if (!res.ok) {
    const maybe = safeJsonParse<{ error?: string; message?: string }>(text)
    const msg = maybe?.error || maybe?.message || text || `${res.statusText}`
    throw new HttpError(res.status, res.statusText, msg)
  }

  // kalau body kosong
  if (!text) return undefined as T

  const parsed = safeJsonParse<T>(text)
  if (parsed === null) {
    throw new Error('Response is not valid JSON')
  }
  return parsed
}
