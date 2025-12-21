import { fetchJson } from '@/utils/fetchJson'

export type ScheduleDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
export type ScheduleCategory = 'general' | 'pmv' | 'gabi'

export type ScheduleItem = {
  id: string
  title: string
  day: ScheduleDay
  start: string // "HH:mm"
  end?: string // "HH:mm"
  category: ScheduleCategory
  location?: string
  description?: string
}

const dayOrder: Record<ScheduleDay, number> = {
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
  sun: 7,
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map((x) => Number(x))
  return h * 60 + m
}

export async function getWeeklySchedule(): Promise<ScheduleItem[]> {
  const base = import.meta.env.BASE_URL ?? '/'
  const data = await fetchJson<ScheduleItem[]>(`${base}data/schedule.json`)

  return data.slice().sort((a, b) => {
    const d = dayOrder[a.day] - dayOrder[b.day]
    if (d !== 0) return d
    return timeToMinutes(a.start) - timeToMinutes(b.start)
  })
}
