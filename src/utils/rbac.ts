import type { Role } from '@/services/auth'

export function hasRole(userRole: Role | undefined, allowed: Role[]): boolean {
  if (!userRole) return false
  if (userRole === 'superadmin') return true
  return allowed.includes(userRole)
}
