// tests/unit/EventCard.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import EventCard from '@/components/cards/EventCard.vue'

describe('EventCard.vue', () => {
  it('renders props.title when passed', () => {
    const props = {
      title: 'Perayaan Waisak',
      date: '2025-05-12',
      location: 'Main Hall',
      category: 'general' as const,
      to: '/events/1',
    }

    const wrapper = mount(EventCard, {
      props,
      global: {
        stubs: {
          RouterLink: {
            template: '<a><slot /></a>',
          },
          Badge: {
            template: '<span><slot /></span>',
          },
        },
        mocks: {
          t: (key: string) => key,
          locale: 'id',
        },
      },
    })

    expect(wrapper.text()).toContain('Perayaan Waisak')
    expect(wrapper.text()).toContain('Main Hall')
  })
})
