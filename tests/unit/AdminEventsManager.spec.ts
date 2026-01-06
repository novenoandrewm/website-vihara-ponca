// tests/unit/AdminEventsManager.spec.ts
import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminEventsManager from '@/components/admin/AdminEventsManager.vue'
import * as itemsApi from '@/services/eventsApi'
import type { EventItem } from '@/services/eventsApi'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string, def: string) => def || key,
  }),
}))

const mockEvents: EventItem[] = [
  {
    id: '1',
    title: 'Event A',
    date: '2025-03-01',
    location: 'Aula',
    category: 'pmv',
    description: 'Desc A',
  },
  {
    id: '2',
    title: 'Event B',
    date: '2025-02-01',
    location: 'Vihara',
    category: 'pmv',
    description: 'Desc B',
  },
]

const mockNewEvent: EventItem = {
  id: '3',
  title: 'Event Baru',
  date: '2025-12-12',
  location: 'Dharmasala',
  category: 'pmv',
  description: 'Deskripsi Baru',
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
    expect(wrapper.text()).toContain('Memuat...')
    await flushPromises()
    expect(wrapper.text()).not.toContain('Memuat...')
    expect(wrapper.text()).toContain('Event A')
    expect(listSpy).toHaveBeenCalled()
  })

  it('menampilkan pesan kosong jika data tidak ada', async () => {
    listSpy.mockResolvedValue([])
    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.text()).toContain('Belum ada data.')
  })

  it('fitur tambah event (Create)', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    await wrapper.find('#title').setValue('Event Baru')
    await wrapper.find('#date').setValue('2025-12-12')
    await wrapper.find('#location').setValue('Dharmasala')
    await wrapper.find('#desc').setValue('Deskripsi Baru')
    await wrapper.find('form').trigger('submit')

    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Event Baru', category: 'pmv' })
    )
    await flushPromises()
    expect(listSpy).toHaveBeenCalledTimes(2)
    const inputTitle = wrapper.find('#title').element as HTMLInputElement
    expect(inputTitle.value).toBe('')
  })

  it('fitur edit event (Update)', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const buttons = wrapper.findAll('article button')
    const editBtn = buttons.find((b) => b.text() === 'Edit')
    await editBtn?.trigger('click')

    expect((wrapper.find('#title').element as HTMLInputElement).value).toBe(
      'Event A'
    )
    expect(wrapper.find('form h2').text()).toBe('Edit')

    await wrapper.find('#title').setValue('Event A Revisi')
    await wrapper.find('form').trigger('submit')

    expect(updateSpy).toHaveBeenCalledWith(
      '1', // ID Event A
      expect.objectContaining({ title: 'Event A Revisi' })
    )
    await flushPromises()
    expect((wrapper.find('#title').element as HTMLInputElement).value).toBe('')
  })

  it('fitur hapus event (Delete)', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const buttons = wrapper.findAll('article button')
    const delBtn = buttons.find((b) => b.text() === 'Hapus')
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
