// netlify/functions/quotes.ts
import { getStore } from '@netlify/blobs'
import jwt from 'jsonwebtoken'

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

// --- Helpers Type Guards ---
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

// --- Helper Auth ---
function checkAuth(req: Request): {
  ok: boolean
  role?: string
  error?: string
} {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { ok: false, error: 'Token tidak ditemukan (Unauthorized).' }
  }

  const token = authHeader.split(' ')[1]
  const secret = process.env.JWT_SECRET

  if (!secret) {
    return { ok: false, error: 'Server Error: JWT_SECRET belum diset.' }
  }

  try {
    const decoded = jwt.verify(token, secret) as { role: string }
    return { ok: true, role: decoded.role }
  } catch (e) {
    console.error('JWT Verification Error:', e)
    return { ok: false, error: 'Token tidak valid atau kadaluarsa.' }
  }
}

// --- Main Handler ---
export default async function handler(req: Request): Promise<Response> {
  const store = getStore({ name: STORE_NAME, consistency: 'strong' })

  try {
    // 1. GET: Public
    if (req.method === 'GET') {
      const stored = await store.get(KEY, { type: 'json' })
      const latest = isQuoteItem(stored) ? stored : DEFAULT_QUOTE
      return json({ latest })
    }

    // 2. POST: Protected
    if (req.method === 'POST') {
      // Verifikasi Token
      const { ok, role, error } = checkAuth(req)
      if (!ok) {
        return json({ error: error || 'Unauthorized' }, 401)
      }

      // Cek Role
      if (role !== 'superadmin' && role !== 'quotes_admin') {
        return json(
          { error: 'Forbidden: Anda tidak memiliki akses quotes admin.' },
          403
        )
      }

      // Proses Data
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
