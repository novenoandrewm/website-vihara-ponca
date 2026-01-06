// netlify/functions/quotes.ts
import { getStore } from '@netlify/blobs'

export type QuoteItem = {
  text: string
  source: string
  updatedAt?: string
}

const STORE_NAME = 'quotes'
const KEY = 'latest'

const DEFAULT_QUOTE: QuoteItem = {
  text: 'Tanpa kebijaksanaan, kebaikan bisa menjadi kebingungan. Tanpa welas asih, kebenaran bisa menjadi keras.',
  source: 'Dhamma (contoh)',
  updatedAt: new Date().toISOString(),
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function isQuoteItem(v: unknown): v is QuoteItem {
  if (!isRecord(v)) return false
  return (
    typeof v.text === 'string' &&
    typeof v.source === 'string' &&
    (v.updatedAt === undefined || typeof v.updatedAt === 'string')
  )
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function readAdminSecret(req: Request): string {
  return req.headers.get('X-Admin-Secret')?.trim() ?? ''
}

export default async function handler(req: Request): Promise<Response> {
  const store = getStore({ name: STORE_NAME, consistency: 'strong' })

  try {
    if (req.method === 'GET') {
      const stored = await store.get(KEY, { type: 'json' })
      const latest = isQuoteItem(stored) ? stored : DEFAULT_QUOTE
      return json({ latest })
    }

    if (req.method === 'POST') {
      const expected = process.env.QUOTES_ADMIN_SECRET?.trim() ?? ''
      const provided = readAdminSecret(req)

      if (!expected) {
        return json(
          {
            error:
              'Server belum dikonfigurasi (QUOTES_ADMIN_SECRET belum diset).',
          },
          500
        )
      }

      if (!provided || provided !== expected) {
        return json({ error: 'Unauthorized.' }, 401)
      }

      const body = (await req.json().catch(() => null)) as unknown
      if (!isRecord(body)) {
        return json({ error: 'Body JSON tidak valid.' }, 400)
      }

      const text = typeof body.text === 'string' ? body.text.trim() : ''
      const source = typeof body.source === 'string' ? body.source.trim() : ''

      if (!text) return json({ error: 'Teks kutipan wajib diisi.' }, 400)
      if (!source) return json({ error: 'Sumber kutipan wajib diisi.' }, 400)

      const latest: QuoteItem = {
        text,
        source,
        updatedAt: new Date().toISOString(),
      }

      await store.setJSON(KEY, latest)
      return json({ latest })
    }

    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'GET, POST' },
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Internal Server Error'
    return json({ error: msg }, 500)
  }
}
