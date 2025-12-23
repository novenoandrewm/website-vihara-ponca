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

function sortByDate(items: EventItem[]) {
  return items
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export async function getUpcomingEvents(): Promise<EventItem[]> {
  const base = import.meta.env.BASE_URL ?? '/'

  try {
    const api = await fetchJson<EventItem[]>(`${base}api/events`)
    if (Array.isArray(api)) return sortByDate(api)
  } catch {
    // fallback
  }

  const data = await fetchJson<EventItem[]>(`${base}data/events.json`)
  return sortByDate(data)
}

export async function getEventById(id: string): Promise<EventItem | null> {
  const base = import.meta.env.BASE_URL ?? '/'

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
