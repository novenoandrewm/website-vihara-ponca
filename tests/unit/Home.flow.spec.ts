// tests/unit/Home.flow.spec.ts
import { mount, flushPromises } from '@vue/test-utils'
import Home from '@/pages/Home.vue'
import { vi, it, expect } from 'vitest'

// Mock Events Service
vi.mock('@/services/events', () => ({
  getUpcomingEvents: vi.fn().mockResolvedValue([
    {
      id: 'e1',
      title: 'Puja Bakti Umum Mingguan',
      date: '2025-11-02',
      location: 'Aula Bakti Sala',
      category: 'general',
      time: '09:00',
      description: 'Desc',
      image: 'img.jpg',
    },
    {
      id: 'e2',
      title: 'Kegiatan PMV',
      date: '2025-11-05',
      location: 'Aula Bakti Sala',
      category: 'pmv',
      time: '19:00',
      description: 'Desc',
      image: 'img.jpg',
    },
  ]),
}))

// Mock Quotes Service
vi.mock('@/services/quotes', () => ({
  getLatestQuote: vi.fn().mockResolvedValue({
    id: 'q1',
    text: 'Sabbe Satta Bhavantu Sukhitatta',
    source: 'Metta Sutta',
  }),
}))

it('menyembunyikan skeleton dan menampilkan dua kartu', async () => {
  const wrapper = mount(Home, {
    global: {
      stubs: {
        HeroSection: true,
        SectionHeader: true,
        BaseButton: true,
        SkeletonCard: true,
        Container: { template: '<div><slot /></div>' },
        EventCard: {
          template: '<div class="event-card-stub">{{ title }}</div>',
          props: [
            'title',
            'category',
            'date',
            'time',
            'location',
            'description',
            'image',
            'to',
          ],
        },
      },
      mocks: {
        t: (msg: string) => msg,
      },
    },
  })

  await flushPromises()

  expect(wrapper.find('skeleton-card-stub').exists()).toBe(false)
  expect(wrapper.text()).toContain('Puja Bakti Umum Mingguan')
  expect(wrapper.text()).toContain('Kegiatan PMV')
})
