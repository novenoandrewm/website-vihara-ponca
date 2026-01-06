// tests/unit/utils.rbac.spec.ts
import { describe, it, expect } from 'vitest'
import { hasRole } from '@/utils/rbac'

describe('utils/rbac', () => {
  it('mengembalikan false jika userRole undefined (belum login)', () => {
    expect(hasRole(undefined, ['pmv_admin'])).toBe(false)
  })

  it('mengembalikan true jika userRole adalah superadmin (bypass)', () => {
    expect(hasRole('superadmin', ['pmv_admin'])).toBe(true)
    expect(hasRole('superadmin', [])).toBe(true)
  })

  it('mengembalikan true jika userRole ada di dalam list allowed', () => {
    expect(hasRole('pmv_admin', ['pmv_admin', 'gabi_admin'])).toBe(true)
  })

  it('mengembalikan false jika userRole tidak ada di dalam list allowed', () => {
    expect(hasRole('gabi_admin', ['pmv_admin'])).toBe(false)
  })
})
