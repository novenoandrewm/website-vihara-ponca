import { fetchJson } from '@/utils/fetchJson'
import { getAuthHeader } from '@/services/auth'

export type EventItem = {
  id: string
  title: string
  date: string
  location: string
  description?: string
  category: string
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

/** PUBLIC: ambil events dari API, fallback ke public JSON */
export async function getUpcomingEvents(): Promise<EventItem[]> {
  const base = baseUrl()

  try {
    const api = await fetchJson<EventItem[]>(`${base}api/events`)
    if (Array.isArray(api)) return sortByDate(api)
  } catch {
    // fallback
  }

  const data = await fetchJson<EventItem[]>(`${base}data/events.json`)
  return sortByDate(data)
}

/** PUBLIC: ambil event by id */
export async function getEventById(id: string): Promise<EventItem | null> {
  const base = baseUrl()

  try {
    return await fetchJson<EventItem>(
      `${base}api/events/${encodeURIComponent(id)}`
    )
  } catch {
    // fallback
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
