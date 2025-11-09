import { fetchJson } from '@/utils/fetchJson'
export type EventItem = {
  id: string
  title: string
  date: string
  location: string
  description?: string
}

export function getUpcomingEvents(): Promise<EventItem[]> {
  const base = import.meta.env.BASE_URL ?? '/'
  return fetchJson<EventItem[]>(`${base}data/events.json`)
}
