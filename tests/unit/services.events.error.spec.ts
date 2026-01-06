// tests/unit/services.events.error.spec.ts
import { mount, flushPromises } from '@vue/test-utils'
import Home from '@/pages/Home.vue'
import { vi, expect, it } from 'vitest'

vi.mock('@/services/events', () => ({
  // Ubah pesan error agar sesuai dengan matcher regex di bawah (/gagal memuat/i)
  getUpcomingEvents: vi.fn().mockRejectedValue(new Error('Gagal memuat data')),
}))

it('menampilkan pesan error saat gagal memuat event', async () => {
  const wrapper = mount(Home)
  await flushPromises()

  // Sekarang wrapper.text() akan berisi "Gagal memuat data", yang cocok dengan regex
  expect(wrapper.text()).toMatch(/gagal memuat/i)
})
