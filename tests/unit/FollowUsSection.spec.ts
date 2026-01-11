// tests/unit/FollowUsSection.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import FollowUsSection from '@/components/sections/FollowUsSection.vue'

// 1. Mock Data Config
vi.mock('@/config/social', () => ({
  SOCIAL_LINKS: [
    {
      key: 'whatsapp',
      labelKey: 'social.wa_admin',
      href: 'https://wa.me/628123',
      category: 'vihara',
    },
    {
      key: 'instagram',
      labelKey: 'social.vihara_ig',
      href: 'https://ig.com/vihara',
      category: 'vihara',
    },
    {
      key: 'facebook',
      labelKey: 'social.fb_vihara',
      href: 'https://fb.com/vihara',
      category: 'vihara',
    },
  ],
}))

// 2. Mock Helper i18n
const t = (key: string) => key

describe('FollowUsSection.vue', () => {
  const globalOptions = {
    mocks: { t },
    stubs: {
      BaseButton: { template: '<button><slot /></button>' },
      Icon: true,
    },
  }

  it('render judul dan subtitle default', () => {
    const wrapper = mount(FollowUsSection, { global: globalOptions })
    expect(wrapper.text()).toContain('follow_us.title')
    expect(wrapper.text()).toContain('follow_us.subtitle')
  })

  it('bisa mengubah judul dan subtitle via props', () => {
    const wrapper = mount(FollowUsSection, {
      global: globalOptions,
      props: {
        title: 'Hubungi Kami',
        subtitle: 'Silakan kontak admin',
      },
    })
    expect(wrapper.text()).toContain('Hubungi Kami')
    expect(wrapper.text()).toContain('Silakan kontak admin')
  })

  it('memisahkan WhatsApp ke bagian kiri (tombol besar)', () => {
    const wrapper = mount(FollowUsSection, { global: globalOptions })
    const waLink = wrapper.find('a[href="https://wa.me/628123"]')
    expect(waLink.exists()).toBe(true)
    expect(waLink.text()).toContain('follow_us.wa_btn')
  })

  it('menampilkan sisa sosial media di grid kanan', () => {
    const wrapper = mount(FollowUsSection, { global: globalOptions })
    const gridLinks = wrapper.findAll('.grid.gap-3 a')

    expect(gridLinks.length).toBe(2)

    const hrefs = gridLinks.map((l) => l.attributes('href'))
    expect(hrefs).toContain('https://ig.com/vihara')
    expect(hrefs).toContain('https://fb.com/vihara')
    expect(hrefs).not.toContain('https://wa.me/628123')
  })
})
