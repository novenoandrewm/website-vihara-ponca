// src/utils/seo.ts
type MetaSpec = {
  title: string
  description?: string
  image?: string
}

export function setPageMeta({ title, description, image }: MetaSpec) {
  if (typeof document === 'undefined') return

  document.title = title ? `${title} — Vihara` : 'Vihara'

  const url = typeof location !== 'undefined' ? location.href : ''

  upsert('meta[name="description"]', 'name', 'description', description ?? '')

  // OG
  upsert('meta[property="og:title"]', 'property', 'og:title', title)
  upsert(
    'meta[property="og:description"]',
    'property',
    'og:description',
    description ?? ''
  )
  if (url) upsert('meta[property="og:url"]', 'property', 'og:url', url)

  // image
  if (image) {
    const abs = toAbsolute(image)
    upsert('meta[property="og:image"]', 'property', 'og:image', abs)
    upsert(
      'meta[name="twitter:card"]',
      'name',
      'twitter:card',
      'summary_large_image'
    )
    upsert('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    if (description)
      upsert(
        'meta[name="twitter:description"]',
        'name',
        'twitter:description',
        description
      )
    upsert('meta[name="twitter:image"]', 'name', 'twitter:image', abs)
  }

  // canonical link
  if (url) upsertLink('link[rel="canonical"]', 'canonical', url)
}

export function setOgLocale(locale: string) {
  if (typeof document === 'undefined') return
  upsert('meta[property="og:locale"]', 'property', 'og:locale', locale)
}

// -- helpers --
function upsert(
  sel: string,
  attr: 'name' | 'property',
  key: string,
  val: string
) {
  let el = document.querySelector<HTMLMetaElement>(sel)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', val)
}

function upsertLink(sel: string, rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(sel)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function toAbsolute(path: string) {
  if (/^https?:\/\//i.test(path)) return path
  if (typeof location === 'undefined') return path
  return new URL(path, location.origin).toString()
}
