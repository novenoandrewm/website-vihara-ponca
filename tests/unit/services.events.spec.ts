// tests/unit/services.events.spec.ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { getUpcomingEvents } from '@/services/events'

const sample = [
  {
    id: '1',
    title: 'Puja Bakti',
    date: '2025-11-02',
    category: 'general',
    location: 'Aula',
  },
]

const fetchMock = vi.fn()
global.fetch = fetchMock

afterEach(() => vi.restoreAllMocks())

describe('services/events', () => {
  it('mengembalikan events ketika fetch OK', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify(sample),
      json: async () => sample,
    } as Response)

    const res = await getUpcomingEvents()
    expect(res).toEqual(sample)
  })

  it('mengembalikan array kosong (fallback) ketika status bukan 200', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Server Error',
      text: async () => 'Error',
    } as Response)

    fetchMock.mockResolvedValueOnce({
      ok: false,
    } as Response)

    const res = await getUpcomingEvents()
    expect(res).toEqual([])
  })
})
