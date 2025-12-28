import { fetchJson } from '@/utils/fetchJson'

export type EventItem = {
  id: string
  title: string
  date: string
  location: string
  description?: string
  category: string
  image?: string
}

function sortByDate(items: EventItem[]): EventItem[] {
  return items
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/**
 * Public: ambil daftar event.
 * Prioritas: API -> fallback JSON static.
 */
export async function getUpcomingEvents(): Promise<EventItem[]> {
  const base = import.meta.env.BASE_URL ?? '/'

  // ✅ API (public)
  try {
    const api = await fetchJson<EventItem[]>('/api/events', { auth: false })
    if (Array.isArray(api)) return sortByDate(api)
  } catch {
    // fallback ke static
  }

  // ✅ fallback JSON static (public folder)
  const data = await fetchJson<EventItem[]>(`${base}data/events.json`, {
    auth: false,
  })
  return sortByDate(data)
}

/**
 * Public: ambil event by id.
 * Prioritas: API -> fallback cari di list.
 */
export async function getEventById(id: string): Promise<EventItem | null> {
  try {
    return await fetchJson<EventItem>(`/api/events/${encodeURIComponent(id)}`, {
      auth: false,
    })
  } catch {
    // fallback
  }

  const events = await getUpcomingEvents()
  return events.find((e) => e.id === id) ?? null
}
