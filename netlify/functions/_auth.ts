// netlify/functions/_auth.ts
import jwt from 'jsonwebtoken'
import type { HandlerEvent } from '@netlify/functions'

export type JwtUser = {
  id: string
  role: string
}

function getAuthorizationHeader(
  headers: HandlerEvent['headers']
): string | null {
  return headers.authorization ?? headers.Authorization ?? null
}

export function requireRole(
  event: HandlerEvent,
  allowedRoles: readonly string[]
): JwtUser {
  const authHeader = getAuthorizationHeader(event.headers)

  if (!authHeader) {
    throw new Error('Unauthorized')
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized')
  }

  const token = authHeader.slice(7)

  const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtUser

  if (payload.role !== 'superadmin' && !allowedRoles.includes(payload.role)) {
    throw new Error('Forbidden')
  }

  return payload
}
