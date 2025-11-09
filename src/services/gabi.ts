import { fetchJson } from '@/utils/fetchJson'
export type GabiActivity = {
  id: string
  title: string
  date: string
  location: string
  desc?: string
}

export function getGabiActivities(): Promise<GabiActivity[]> {
  const base = import.meta.env.BASE_URL ?? '/'
  return fetchJson<GabiActivity[]>(`${base}data/gabi.json`)
}
