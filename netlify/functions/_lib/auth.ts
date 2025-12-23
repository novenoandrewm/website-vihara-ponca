import jwt from 'jsonwebtoken'

export type Role = 'superadmin' | 'pmv_admin' | 'gabi_admin' | 'schedule_admin'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: Role
}

const JWT_SECRET = process.env.JWT_SECRET || ''

export function signToken(user: AuthUser) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not set')
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): AuthUser {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not set')
  return jwt.verify(token, JWT_SECRET) as AuthUser
}

export function getBearerToken(authHeader?: string | null) {
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
 */
export function canManageEventCategory(role: Role, category: string) {
  if (role === 'superadmin') return true
  if (role === 'pmv_admin') return category === 'pmv'
  if (role === 'gabi_admin') return category === 'gabi'
  if (role === 'schedule_admin') return category === 'general'
  return false
}
