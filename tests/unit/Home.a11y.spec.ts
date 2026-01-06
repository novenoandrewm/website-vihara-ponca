// tests/unit/Home.a11y.spec.ts
import { mount } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { it, expect } from 'vitest'
import Home from '@/pages/Home.vue'

it('Home bebas pelanggaran a11y utama', async () => {
  const wrapper = mount(Home, { attachTo: document.body })
  const results = await axe(wrapper.element)
  expect(JSON.stringify(results.violations, null, 2)).toBe('[]')
})
