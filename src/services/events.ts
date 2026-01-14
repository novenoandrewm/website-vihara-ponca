// src/services/events.ts
import { fetchJson } from '@/utils/fetchJson'
import { getAuthHeader } from '@/services/auth'

export type EventItem = {
  id: string
  title: string
  date: string
  time?: string
  location: string
  description?: string
  category: 'pmv' | 'gabi' | 'general' | string
  image?: string
}

export type EventCreateInput = Omit<EventItem, 'id'>
export type EventUpdateInput = Partial<Omit<EventItem, 'id'>>

function sortByDate(items: EventItem[]): EventItem[] {
  return items
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function baseUrl(): string {
  return import.meta.env.BASE_URL ?? '/'
}

export async function getUpcomingEvents(): Promise<EventItem[]> {
  const base = baseUrl()
  let apiData: EventItem[] = []

  try {
    const res = await fetchJson<EventItem[]>(`${base}api/events`)
    if (Array.isArray(res)) apiData = res
  } catch {
    try {
      const fallback = await fetchJson<EventItem[]>(`${base}data/events.json`)
      if (Array.isArray(fallback)) apiData = fallback
    } catch {
      apiData = []
    }
  }

  return sortByDate(apiData)
}

export async function getEventById(id: string): Promise<EventItem | null> {
  const base = baseUrl()

  try {
    return await fetchJson<EventItem>(
      `${base}api/events/${encodeURIComponent(id)}`
    )
  } catch {
    // ignore error
  }

  const events = await getUpcomingEvents()
  return events.find((e) => e.id === id) ?? null
}

/** ADMIN: create */
export async function createEvent(input: EventCreateInput): Promise<EventItem> {
  const base = baseUrl()
  return fetchJson<EventItem>(`${base}api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(input),
  })
}

/** ADMIN: update */
export async function updateEvent(
  id: string,
  patch: EventUpdateInput
): Promise<EventItem> {
  const base = baseUrl()
  return fetchJson<EventItem>(`${base}api/events/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(patch),
  })
}

/** ADMIN: delete */
export async function deleteEvent(id: string): Promise<{ ok: true }> {
  const base = baseUrl()
  return fetchJson<{ ok: true }>(
    `${base}api/events/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
      },
    }
  )
}

// --- Helper to convert File to Base64 ---
function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

/* ADMIN: upload image (UPDATED: Sends JSON Base64) */
export async function uploadEventImage(file: File): Promise<string> {
  const base = baseUrl()

  // 1. Convert physical file to Base64 string
  const base64String = await toBase64(file)
  const content = base64String.split(',')[1]

  // 2. Send to endpoint as JSON
  const res = await fetch(`${base}api/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({
      filename: file.name,
      filetype: file.type,
      content: content,
    }),
  })

  if (!res.ok) {
    let msg = 'Gagal mengunggah gambar'
    try {
      const errData = await res.json()
      if (errData.error) msg = errData.error
    } catch {
      // ignore json parse error
    }
    throw new Error(msg)
  }

  const data = await res.json()
  return data.url
}
