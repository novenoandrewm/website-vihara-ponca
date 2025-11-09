import { fetchJson } from '@/utils/fetchJson'
export type PmvActivity = {
  id: string
  title: string
  date: string
  location: string
  desc?: string
}

export function getPmvActivities(): Promise<PmvActivity[]> {
  const base = import.meta.env.BASE_URL ?? '/'
  return fetchJson<PmvActivity[]>(`${base}data/pmv.json`)
}
