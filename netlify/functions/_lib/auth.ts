// netlify/functions/_lib/auth.ts

import jwt from 'jsonwebtoken'

export type Role = 'superadmin' | 'pmv_admin' | 'gabi_admin' | 'schedule_admin'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: Role
}

function mustEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`${name} is not set`)
  return v
}

export function signToken(user: AuthUser): string {
  const secret = mustEnv('JWT_SECRET')
  return jwt.sign(user, secret, {
    expiresIn: '7d',
    algorithm: 'HS256',
  })
}

export function verifyToken(token: string): AuthUser {
  const secret = mustEnv('JWT_SECRET')
  return jwt.verify(token, secret, { algorithms: ['HS256'] }) as AuthUser
}

export function getBearerToken(authHeader?: string | null): string | null {
  if (!authHeader) return null
  const m = authHeader.match(/^Bearer\s+(.+)$/i)
  return m?.[1] ?? null
}

export function requireAuth(authHeader?: string | null): AuthUser | null {
  const token = getBearerToken(authHeader)
  if (!token) return null
  try {
    return verifyToken(token)
  } catch {
    return null
  }
}

/**
 * RBAC: siapa boleh edit kategori event apa
 * NOTE: kalau "schedule_admin" TIDAK boleh edit event umum,
 * ubah return-nya jadi false.
 */
export function canManageEventCategory(role: Role, category: string): boolean {
  if (role === 'superadmin') return true
  if (role === 'pmv_admin') return category === 'pmv'
  if (role === 'gabi_admin') return category === 'gabi'
  if (role === 'schedule_admin') return category === 'general'
  return false
}
