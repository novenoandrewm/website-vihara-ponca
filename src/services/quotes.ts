// src/services/quotes.ts
export type QuoteItem = {
  text: string
  source: string
  updatedAt?: string
}

function toErrMsg(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'Terjadi kesalahan.'
}

export async function getLatestQuote(): Promise<QuoteItem> {
  const res = await fetch('/.netlify/functions/quotes', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  if (!res.ok) {
    throw new Error(`Gagal memuat quotes (${res.status})`)
  }

  const data = (await res.json()) as { latest?: QuoteItem }
  if (!data?.latest?.text || !data?.latest?.source) {
    throw new Error('Format quote tidak valid.')
  }

  return data.latest
}

export async function adminUpdateLatestQuote(
  input: Pick<QuoteItem, 'text' | 'source'>,
  adminSecret: string
): Promise<QuoteItem> {
  const res = await fetch('/.netlify/functions/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Admin-Secret': adminSecret,
    },
    body: JSON.stringify({
      text: input.text,
      source: input.source,
    }),
  })

  if (!res.ok) {
    let msg = `Gagal update quote (${res.status})`
    try {
      const j = (await res.json()) as { error?: string }
      if (j?.error) msg = j.error
    } catch {
      // ignore
    }
    throw new Error(msg)
  }

  try {
    const data = (await res.json()) as { latest: QuoteItem }
    return data.latest
  } catch (e: unknown) {
    throw new Error(toErrMsg(e))
  }
}
