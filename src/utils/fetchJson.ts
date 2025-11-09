export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Fetch failed ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}
