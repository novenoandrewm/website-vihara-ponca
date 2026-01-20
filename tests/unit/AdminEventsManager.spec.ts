// tests/unit/AdminEventsManager.spec.ts
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminEventsManager from '@/components/admin/AdminEventsManager.vue'
import * as itemsApi from '@/services/eventsApi'
import type { EventItem } from '@/services/eventsApi'

// Mock i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string, def: string) => def || key,
  }),
}))

// Mock uploadEventImage from services/events
vi.mock('@/services/events', () => ({
  uploadEventImage: vi.fn().mockResolvedValue('https://fake-url.com/image.jpg'),
}))

const mockEvents: EventItem[] = [
  {
    id: '1',
    title: 'Event A',
    date: '2025-03-01',
    time: '10:00',
    location: 'Aula',
    category: 'pmv',
    description: 'Desc A',
    isRoutine: false,
  },
  {
    id: '2',
    title: 'Event B',
    date: '2025-02-01',
    time: '14:00',
    location: 'Vihara',
    category: 'pmv',
    description: 'Desc B',
    isRoutine: true,
  },
]

const mockNewEvent: EventItem = {
  id: '3',
  title: 'Event Baru',
  date: '2025-12-12',
  time: '09:00',
  location: 'Dharmasala',
  category: 'pmv',
  description: 'Deskripsi Baru',
  isRoutine: true,
}

const listSpy = vi.spyOn(itemsApi, 'listEvents')
const createSpy = vi.spyOn(itemsApi, 'createEvent')
const updateSpy = vi.spyOn(itemsApi, 'updateEvent')
const deleteSpy = vi.spyOn(itemsApi, 'deleteEvent')

describe('AdminEventsManager.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    listSpy.mockResolvedValue([...mockEvents])
    createSpy.mockResolvedValue(mockNewEvent)
    updateSpy.mockResolvedValue(mockEvents[0])
    deleteSpy.mockResolvedValue({ ok: true })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  const createWrapper = () =>
    mount(AdminEventsManager, {
      props: { category: 'pmv', pageTitle: 'Kelola PMV' },
    })

  it('render awal: loading state lalu menampilkan daftar data', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.text()).not.toContain('Memuat...')
    expect(wrapper.text()).toContain('Event A')

    // Note: Event B isRoutine=true
    expect(wrapper.text()).toContain('Event B')
    expect(listSpy).toHaveBeenCalled()
  })

  it('menampilkan pesan kosong jika data tidak ada', async () => {
    listSpy.mockResolvedValue([])
    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.text()).toContain('Belum ada data.')
  })

  it('fitur tambah event (Create) dengan isRoutine', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    await wrapper.find('#title').setValue('Event Baru')
    await wrapper.find('#date').setValue('2025-12-12')
    await wrapper.find('#time').setValue('09:00')
    await wrapper.find('#location').setValue('Dharmasala')
    await wrapper.find('#desc').setValue('Deskripsi Baru')

    const checkbox = wrapper.find('#isRoutine')
    await checkbox.setValue(true)

    // Submit
    await wrapper.find('form').trigger('submit')

    // Assert Payload
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Event Baru',
        category: 'pmv',
        isRoutine: true,
        time: '09:00',
      })
    )
    await flushPromises()
    expect(listSpy).toHaveBeenCalledTimes(2)

    const inputTitle = wrapper.find('#title').element as HTMLInputElement
    expect(inputTitle.value).toBe('')
  })

  it('fitur edit event (Update) dan memuat data existing', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const articles = wrapper.findAll('article')
    const editBtn = articles[0]
      .findAll('button')
      .find((b) => b.text() === 'Edit')
    await editBtn?.trigger('click')

    expect((wrapper.find('#title').element as HTMLInputElement).value).toBe(
      'Event A'
    )
    expect(
      (wrapper.find('#isRoutine').element as HTMLInputElement).checked
    ).toBe(false)
    expect(wrapper.find('form h2').text()).toBe('Edit')

    await wrapper.find('#title').setValue('Event A Revisi')
    await wrapper.find('#isRoutine').setValue(true)

    // Submit update
    await wrapper.find('form').trigger('submit')

    expect(updateSpy).toHaveBeenCalledWith(
      '1', // ID Event A
      expect.objectContaining({
        title: 'Event A Revisi',
        isRoutine: true,
      })
    )
    await flushPromises()

    expect((wrapper.find('#title').element as HTMLInputElement).value).toBe('')
  })

  it('fitur hapus event (Delete)', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const articles = wrapper.findAll('article')
    const delBtn = articles[0]
      .findAll('button')
      .find((b) => b.text() === 'Hapus')
    await delBtn?.trigger('click')

    expect(window.confirm).toHaveBeenCalled()
    expect(deleteSpy).toHaveBeenCalledWith('1') // ID Event A
    await flushPromises()
    expect(listSpy).toHaveBeenCalledTimes(2)
  })

  it('menangani error API dengan menampilkan alert', async () => {
    listSpy.mockRejectedValueOnce(new Error('Koneksi Gagal'))
    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.text()).toContain('Koneksi Gagal')
  })
})
