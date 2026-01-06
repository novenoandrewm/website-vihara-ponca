// tests/unit/AppFooter.spec.ts
import { mount } from '@vue/test-utils'
import AppFooter from '@/components/layout/AppFooter.vue'
import { it, expect } from 'vitest'

it('menampilkan nama vihara & tahun', () => {
  const w = mount(AppFooter)
  expect(w.text()).toMatch(/Vihara Avalokitesvara/i)
  expect(w.text()).toMatch(/20\d{2}/)
})
