// src/services/eventsApi.ts
import { fetchJson } from '@/services/http'

export type EventCategory = 'pmv' | 'gabi' | 'general'

export type EventItem = {
  id: string
  title: string
  date: string
  time?: string
  location: string
  category: EventCategory
  description: string
  image?: string
}

export async function listEvents(): Promise<EventItem[]> {
  return fetchJson<EventItem[]>('/api/events')
}

export async function createEvent(
  payload: Omit<EventItem, 'id'> & { id?: string }
) {
  return fetchJson<EventItem>('/api/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateEvent(
  id: string,
  payload: Partial<Omit<EventItem, 'id'>>
) {
  return fetchJson<EventItem>(`/api/events/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteEvent(id: string) {
  return fetchJson<{ ok: true }>(`/api/events/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}
