// tests/unit/AppFooter.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import AppFooter from '@/components/layout/AppFooter.vue'

// 1. Mock Vue Router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/',
  }),
  RouterLink: {
    template: '<a><slot /></a>',
  },
}))

// 2. Mock i18n
const t = (key: string) => key

describe('AppFooter.vue', () => {
  it('menampilkan nama vihara & tahun', () => {
    const wrapper = mount(AppFooter, {
      global: {
        mocks: { t },
        stubs: {
          Container: { template: '<div><slot /></div>' },
          DividerLotus: true,
          Icon: true,
        },
      },
    })

    // Assertions
    expect(wrapper.text()).toContain('Vihara Avalokitesvara')
    expect(wrapper.text()).toContain(new Date().getFullYear().toString())
  })
})
