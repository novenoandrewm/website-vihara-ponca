import { mount, flushPromises } from '@vue/test-utils'
import Home from '@/pages/Home.vue'
import { vi, it, expect } from 'vitest'

vi.mock('@/services/events', () => ({
  getUpcomingEvents: vi.fn().mockResolvedValue([
    {
      id: 'e1',
      title: 'Puja Bakti Umum Mingguan',
      date: '2025-11-02',
      location: 'Aula Bakti Sala',
    },
    {
      id: 'e2',
      title: 'Kegiatan PMV',
      date: '2025-11-05',
      location: 'Aula Bakti Sala',
    },
  ]),
}))

it('menyembunyikan skeleton dan menampilkan dua kartu', async () => {
  const wrapper = mount(Home)
  await flushPromises()
  expect(wrapper.html()).not.toMatch(/skeleton/i)
  expect(wrapper.text()).toContain('Puja Bakti Umum Mingguan')
  expect(wrapper.text()).toContain('Kegiatan PMV')
})
