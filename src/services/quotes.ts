import { fetchJson } from '@/utils/fetchJson'

export type QuoteItem = {
  id: string
  date: string
  text: string
  source: string
}

export async function getLatestQuote(): Promise<QuoteItem | null> {
  const base = import.meta.env.BASE_URL ?? '/'
  const quotes = await fetchJson<QuoteItem[]>(`${base}data/quotes.json`)
  if (!quotes || quotes.length === 0) return null
  return quotes.reduce((latest, current) =>
    new Date(current.date) > new Date(latest.date) ? current : latest
  )
}
