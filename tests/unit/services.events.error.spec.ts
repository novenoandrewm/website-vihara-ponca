// tests/unit/services.events.error.spec.ts
import { mount, flushPromises } from '@vue/test-utils'
import Home from '@/pages/Home.vue'
import { vi, expect, it } from 'vitest'

vi.mock('@/services/events', () => ({
  getUpcomingEvents: vi.fn().mockRejectedValue(new Error('Gagal memuat data')),
}))

it('menampilkan pesan error saat gagal memuat event', async () => {
  const wrapper = mount(Home)
  await flushPromises()
  expect(wrapper.text()).toMatch(/gagal memuat/i)
})
