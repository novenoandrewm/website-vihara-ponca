import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import NavBar from '@/components/NavBar.vue'
import { useAuthStore } from '@/store/auth'

// Import messages i18n (pastikan path ini sesuai struktur project kamu)
import id from '@/i18n/id.json'
import en from '@/i18n/en.json'

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
      stubs: {
        RouterLink: { template: '<a><slot /></a>' },
      },
    },
  })
}

describe('NavBar', () => {
  beforeEach(() => {
    localStorage.clear()
    // reset locale tiap test biar konsisten
    i18n.global.locale.value = 'id'
  })

  it('toggle bahasa dan set aria-expanded di hamburger', async () => {
    const wrapper = mountNavBar()

    const burger = wrapper.get('#menu-button')
    expect(burger.attributes('aria-expanded')).toBe('false')

    await burger.trigger('click')
    expect(burger.attributes('aria-expanded')).toBe('true')

    // klik EN
    const btnEN = wrapper
      .findAll('button')
      .find((b) => b.text().trim() === 'EN')
    expect(btnEN).toBeTruthy()

    await btnEN!.trigger('click')
    await flushPromises()
    expect(i18n.global.locale.value).toBe('en')
    expect(localStorage.getItem('locale')).toBe('en')

    // klik ID
    const btnID = wrapper
      .findAll('button')
      .find((b) => b.text().trim() === 'ID')
    expect(btnID).toBeTruthy()

    await btnID!.trigger('click')
    await flushPromises()
    expect(i18n.global.locale.value).toBe('id')
    expect(localStorage.getItem('locale')).toBe('id')
  })
})
