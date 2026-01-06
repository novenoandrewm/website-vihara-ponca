// tests/unit/FollowUsSection.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import FollowUsSection from '@/components/sections/FollowUsSection.vue'

vi.mock('@/config/social', () => ({
  SOCIAL_LINKS: [
    { key: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/628123' },
    { key: 'instagram', label: 'Instagram', href: 'https://ig.com/vihara' },
    { key: 'facebook', label: 'Facebook', href: 'https://fb.com/vihara' },
  ],
}))

describe('FollowUsSection.vue', () => {
  it('render judul dan subtitle default', () => {
    const wrapper = mount(FollowUsSection)
    expect(wrapper.text()).toContain('Ikuti Kami')
    expect(wrapper.text()).toContain('Temukan kanal resmi vihara')
  })

  it('bisa mengubah judul dan subtitle via props', () => {
    const wrapper = mount(FollowUsSection, {
      props: {
        title: 'Hubungi Kami',
        subtitle: 'Silakan kontak admin',
      },
    })
    expect(wrapper.text()).toContain('Hubungi Kami')
    expect(wrapper.text()).toContain('Silakan kontak admin')
  })

  it('memisahkan WhatsApp ke bagian kiri (tombol besar)', () => {
    const wrapper = mount(FollowUsSection)
    const waLink = wrapper.find('a[href="https://wa.me/628123"]')
    expect(waLink.exists()).toBe(true)
    expect(waLink.text()).toContain('Kontak Cepat via WhatsApp')
  })

  it('menampilkan sisa sosial media di grid kanan', () => {
    const wrapper = mount(FollowUsSection)

    const gridLinks = wrapper.findAll('.grid.gap-3 a')

    expect(gridLinks.length).toBe(2)

    const hrefs = gridLinks.map((l) => l.attributes('href'))
    expect(hrefs).toContain('https://ig.com/vihara')
    expect(hrefs).not.toContain('https://wa.me/628123')
  })
})
