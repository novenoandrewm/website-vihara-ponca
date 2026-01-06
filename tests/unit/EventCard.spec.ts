// tests/unit/EventCard.spec.ts
import { mount } from '@vue/test-utils'
import EventCard from '@/components/cards/EventCard.vue'
import { formatDate } from '@/utils/formatDate'
import { describe, it, expect } from 'vitest'

describe('EventCard', () => {
  it('menampilkan judul, tanggal, dan lokasi', () => {
    const props = { title: 'Puja Bakti', date: '2025-11-02', location: 'Aula' }
    const wrapper = mount(EventCard, { props })

    expect(wrapper.text()).toContain('Puja Bakti')
    expect(wrapper.text()).toContain(formatDate(props.date))
    expect(wrapper.text()).toContain('Aula')
  })
})
