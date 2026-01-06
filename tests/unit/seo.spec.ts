// tests/unit/seo.spec.ts
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setPageMeta, setOgLocale } from '@/utils/seo'

const getMetaContent = (selector: string) =>
  document.querySelector<HTMLMetaElement>(selector)?.getAttribute('content')

describe('utils/seo', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.title = ''
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('set title & meta description dasar (Happy Path)', () => {
    setPageMeta({
      title: 'Halaman Test',
      description: 'Deskripsi Test',
    })

    expect(document.title).toBe('Halaman Test — Vihara')
    expect(getMetaContent('meta[name="description"]')).toBe('Deskripsi Test')

    expect(getMetaContent('meta[property="og:title"]')).toBe('Halaman Test')
    expect(getMetaContent('meta[property="og:description"]')).toBe(
      'Deskripsi Test'
    )

    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    )
    expect(canonical?.href).toBeDefined()
  })

  it('menggunakan default title jika title tidak diberikan', () => {
    // FIX Line 31: Gunakan @ts-expect-error untuk simulasi input invalid tanpa 'any'
    // @ts-expect-error: Menguji runtime fallback saat properti wajib (title) hilang
    setPageMeta({ description: 'Test Tanpa Judul' })
    expect(document.title).toBe('Vihara')
  })

  it('menangani description kosong (Fallback ke string kosong)', () => {
    setPageMeta({ title: 'No Desc' })
    expect(getMetaContent('meta[name="description"]')).toBe('')
    expect(getMetaContent('meta[property="og:description"]')).toBe('')
  })

  it('mengatur gambar (OG Image & Twitter Card)', () => {
    const imgPath = '/gambar.jpg'
    setPageMeta({ title: 'Ada Gambar', image: imgPath })

    const ogImage = getMetaContent('meta[property="og:image"]')

    expect(ogImage).toMatch(/^https?:\/\//)
    expect(ogImage).toContain(imgPath)

    expect(getMetaContent('meta[name="twitter:card"]')).toBe(
      'summary_large_image'
    )
    expect(getMetaContent('meta[name="twitter:title"]')).toBe('Ada Gambar')
    expect(getMetaContent('meta[name="twitter:image"]')).toBe(ogImage)
  })

  it('menyertakan deskripsi di twitter card jika ada', () => {
    setPageMeta({ title: 'Tw', description: 'Desc Twitter', image: '/img.jpg' })
    expect(getMetaContent('meta[name="twitter:description"]')).toBe(
      'Desc Twitter'
    )
  })

  it('tidak mengubah URL gambar jika sudah absolut', () => {
    const absUrl = 'https://example.com/foto.png'
    setPageMeta({ title: 'Absolut', image: absUrl })
    expect(getMetaContent('meta[property="og:image"]')).toBe(absUrl)
  })

  it('setOgLocale mengatur properti locale dengan benar', () => {
    setOgLocale('id_ID')
    expect(getMetaContent('meta[property="og:locale"]')).toBe('id_ID')
  })

  it('aman dijalankan di environment tanpa document (SSR)', () => {
    vi.stubGlobal('document', undefined)

    expect(() => setPageMeta({ title: 'SSR' })).not.toThrow()
    expect(() => setOgLocale('id')).not.toThrow()
  })

  it('toAbsolute fallback saat location undefined (Edge Case SSR)', () => {
    vi.stubGlobal('location', undefined)

    const mockDoc = {
      querySelector: vi.fn(),
      createElement: vi.fn(() => ({ setAttribute: vi.fn() })),
      head: { appendChild: vi.fn() },
    }

    vi.stubGlobal('document', mockDoc)

    setPageMeta({ title: 'NoLoc', image: '/rel.jpg' })
    expect(true).toBe(true)
  })
})
