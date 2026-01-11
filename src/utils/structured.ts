// src/utils/structured.ts
export function upsertJsonLd(id: string, data: unknown) {
  const elId = `jsonld-${id}`
  let el = document.getElementById(elId) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = elId
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

const siteUrl = () =>
  import.meta.env.VITE_SITE_URL ??
  (typeof window !== 'undefined'
    ? window.location.origin
    : 'https://viharaavalokitesvara.netlify.app')

// --- Organization schema
export function orgSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vihara Avalokitesvara',
    url: siteUrl(),
    sameAs: [
      'https://www.instagram.com/avalokitesvaraponca/',
      'https://www.instagram.com/pmvavalokitesvaraponca/',
      'https://www.instagram.com/gabi_avalokitesvaraponca/',
    ],
    logo: `${siteUrl()}/social-card.png`,
  }
}

// --- Event list
export type EventItem = {
  id: string | number
  title: string
  date: string // ISO / yyyy-mm-dd
  location: string
  description?: string
  image?: string
}

export function eventsItemListSchema(events: EventItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: events.map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Event',
        name: e.title,
        startDate: new Date(e.date).toISOString(),
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        description: e.description,
        image: e.image ? [e.image] : undefined,
        location: { '@type': 'Place', name: e.location },
        url: `${siteUrl()}/#event-${e.id}`,
      },
    })),
  }
}
