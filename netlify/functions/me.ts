// netlify/functions/me.ts
import type { Handler } from '@netlify/functions'
import { json, unauthorized, serverError } from './_lib/response'
import { requireAuth } from './_lib/auth'

export const handler: Handler = async (event) => {
  try {
    // optional tapi bagus: batasi method
    if (event.httpMethod === 'OPTIONS') {
      return json(200, { ok: true }, { Allow: 'GET,OPTIONS' })
    }
    if (event.httpMethod !== 'GET') {
      return json(
        405,
        { error: 'Method Not Allowed' },
        { Allow: 'GET,OPTIONS' }
      )
    }

    const h = event.headers
    const authHeader =
      h.authorization ??
      h['authorization'] ??
      h.Authorization ??
      h['Authorization'] ??
      null

    const user = requireAuth(authHeader)
    if (!user) return unauthorized()

    return json(200, { user })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return serverError(msg)
  }
}
