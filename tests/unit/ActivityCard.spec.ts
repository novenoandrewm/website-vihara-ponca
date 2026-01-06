// tests/unit/ActivityCard.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ActivityCard from '@/components/cards/ActivityCard.vue'

describe('ActivityCard.vue', () => {
  const defaultProps = {
    title: 'Latihan Bersama',
    date: 'Minggu, 10 Jan',
    location: 'Dharmasala',
  }

  it('render informasi dasar (judul, tanggal, lokasi)', () => {
    const wrapper = mount(ActivityCard, { props: defaultProps })
    expect(wrapper.text()).toContain('Latihan Bersama')
    expect(wrapper.text()).toContain('Minggu, 10 Jan')
    expect(wrapper.text()).toContain('Dharmasala')
  })

  it('render badge jika properti badge diberikan', () => {
    const wrapper = mount(ActivityCard, {
      props: { ...defaultProps, badge: 'Baru' },
    })
    expect(wrapper.text()).toContain('Baru')
  })

  it('render deskripsi jika properti desc diberikan', () => {
    const wrapper = mount(ActivityCard, {
      props: { ...defaultProps, desc: 'Deskripsi kegiatan ini.' },
    })
    expect(wrapper.text()).toContain('Deskripsi kegiatan ini.')
  })

  it('render sebagai link (RouterLink) jika properti "to" ada', () => {
    const wrapper = mount(ActivityCard, {
      props: { ...defaultProps, to: '/detail-event' },
      global: {
        stubs: {
          RouterLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('/detail-event')
    expect(wrapper.text()).toContain('Detail →')
  })

  it('tidak render link detail jika properti "to" tidak ada', () => {
    const wrapper = mount(ActivityCard, { props: defaultProps })
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Detail →')
  })

  it('menerapkan kelas CSS sesuai tone (gold vs jade)', () => {
    const wrapperGold = mount(ActivityCard, {
      props: { ...defaultProps, tone: 'gold' },
    })
    const titleGold = wrapperGold.find('h3')
    expect(titleGold.classes().join(' ')).toContain('via-brand-100/95')

    const wrapperJade = mount(ActivityCard, {
      props: { ...defaultProps, tone: 'jade' },
    })
    const titleJade = wrapperJade.find('h3')
    expect(titleJade.classes().join(' ')).toContain('to-jade-200/85')
  })
})
