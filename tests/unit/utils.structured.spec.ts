// tests/unit/utils.structured.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import {
  upsertJsonLd,
  orgSchema,
  eventsItemListSchema,
} from '@/utils/structured'

describe('utils/structured', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
  })

  describe('upsertJsonLd', () => {
    it('membuat script tag baru jika belum ada', () => {
      const data = { '@type': 'Test' }
      upsertJsonLd('test-id', data)

      const el = document.getElementById('jsonld-test-id') as HTMLScriptElement
      expect(el).not.toBeNull()
      expect(el.type).toBe('application/ld+json')
      expect(JSON.parse(el.textContent!)).toEqual(data)
    })

    it('mengupdate script tag jika sudah ada', () => {
      const data1 = { version: 1 }
      const data2 = { version: 2 }

      upsertJsonLd('update-test', data1)
      const el = document.getElementById('jsonld-update-test')
      expect(JSON.parse(el!.textContent!)).toEqual(data1)

      upsertJsonLd('update-test', data2)
      expect(JSON.parse(el!.textContent!)).toEqual(data2)

      expect(document.querySelectorAll('#jsonld-update-test').length).toBe(1)
    })
  })

  describe('orgSchema', () => {
    it('mengembalikan struktur schema organisasi yang valid', () => {
      const schema = orgSchema()

      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Organization')
      expect(schema.name).toBe('Vihara Avalokitesvara')

      expect(schema.url).toBeDefined()
      expect(schema.logo).toContain('social-card.png')

      expect(Array.isArray(schema.sameAs)).toBe(true)
      expect(schema.sameAs.length).toBeGreaterThan(0)
    })
  })

  describe('eventsItemListSchema', () => {
    it('memetakan array events ke schema ItemList', () => {
      const events = [
        {
          id: 1,
          title: 'Event A',
          date: '2023-01-01',
          location: 'Vihara',
          description: 'Deskripsi A',
          image: '/img-a.jpg',
        },
        {
          id: '2',
          title: 'Event B',
          date: '2023-02-01',
          location: 'Aula',
        },
      ]

      const schema = eventsItemListSchema(events)

      expect(schema['@type']).toBe('ItemList')
      expect(schema.itemListElement).toHaveLength(2)

      const item1 = schema.itemListElement[0]
      expect(item1.position).toBe(1)
      expect(item1.item.name).toBe('Event A')
      expect(item1.item.description).toBe('Deskripsi A')
      expect(item1.item.image).toEqual(['/img-a.jpg'])
      expect(item1.item.url).toContain('#event-1')

      const item2 = schema.itemListElement[1]
      expect(item2.position).toBe(2)
      expect(item2.item.name).toBe('Event B')
      expect(item2.item.description).toBeUndefined()
      expect(item2.item.image).toBeUndefined()
    })
  })
})
