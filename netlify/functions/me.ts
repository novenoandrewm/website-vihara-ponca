import type { Handler } from '@netlify/functions'
import { json, unauthorized } from './_lib/response'
import { requireAuth } from './_lib/auth'

export const handler: Handler = async (event) => {
  const user = requireAuth(
    (event.headers.authorization || event.headers.Authorization || null) as
      | string
      | null
  )
  if (!user) return unauthorized()
  return json(200, { user })
}
