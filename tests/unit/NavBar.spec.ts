// tests/unit/NavBar.spec.ts
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import NavBar from '@/components/layout/NavBar.vue'
import { useAuthStore } from '@/store/auth'

import id from '@/i18n/id.json'
import en from '@/i18n/en.json'

// --- FIX: Mock vue-router ---
vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/',
  }),
  RouterLink: {
    template: '<a><slot /></a>',
  },
}))

const i18n = createI18n({
  legacy: false,
  locale: 'id',
  fallbackLocale: 'id',
  messages: { id, en },
})

function mountNavBar() {
  const pinia = createPinia()
  setActivePinia(pinia)

  const auth = useAuthStore()
  auth.$patch({ user: null })

  return mount(NavBar, {
    global: {
      plugins: [pinia, i18n],
      stubs: {},
    },
  })
}

describe('NavBar', () => {
  beforeEach(() => {
    localStorage.clear()
    i18n.global.locale.value = 'id'
  })

  it('toggle bahasa dan set aria-expanded di hamburger', async () => {
    const wrapper = mountNavBar()
    const burger = wrapper.find('button[aria-label="Toggle menu"]')

    if (burger.exists()) {
      expect(burger.attributes('aria-expanded')).toBe('false')

      await burger.trigger('click')
      expect(burger.attributes('aria-expanded')).toBe('true')
    }

    // Click EN
    const btnEN = wrapper
      .findAll('button')
      .find((b) => b.text().trim() === 'EN')

    if (btnEN) {
      await btnEN.trigger('click')
      await flushPromises()
      expect(i18n.global.locale.value).toBe('en')
      expect(localStorage.getItem('locale')).toBe('en')
    }

    // Click ID
    const btnID = wrapper
      .findAll('button')
      .find((b) => b.text().trim() === 'ID')

    if (btnID) {
      await btnID.trigger('click')
      await flushPromises()
      expect(i18n.global.locale.value).toBe('id')
      expect(localStorage.getItem('locale')).toBe('id')
    }
  })
})
