import type { Handler } from '@netlify/functions'
import { json, unauthorized } from './_lib/response'
import { requireAuth } from './_lib/auth'

export const handler: Handler = async (event) => {
  const authHeader = (event.headers.authorization ??
    event.headers.Authorization ??
    null) as string | null

  const user = requireAuth(authHeader)
  if (!user) return unauthorized()

  return json(200, { user })
}
