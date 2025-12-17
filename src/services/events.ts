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

// Ambil daftar acara dari JSON lalu urutkan berdasarkan tanggal
export async function getUpcomingEvents(): Promise<EventItem[]> {
  const base = import.meta.env.BASE_URL ?? '/'
  const data = await fetchJson<EventItem[]>(`${base}data/events.json`)
  return data
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// Ambil acara per ID, kembalikan null bila tidak ditemukan
export async function getEventById(id: string): Promise<EventItem | null> {
  const events = await getUpcomingEvents()
  return events.find((e) => e.id === id) ?? null
}
