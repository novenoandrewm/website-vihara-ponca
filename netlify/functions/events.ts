import type { Handler } from '@netlify/functions'
import {
  json,
  badRequest,
  forbidden,
  notFound,
  unauthorized,
  serverError,
  parseJsonBody,
} from './_lib/response'
import { requireAuth, canManageEventCategory } from './_lib/auth'
import { readRepoJson, writeRepoJson } from './_lib/github'

type EventItem = {
  id: string
  title: string
  date: string
  location: string
  description?: string
  category: string
  image?: string
}

const EVENTS_PATH = 'public/data/events.json'

function getIdFromPath(path: string) {
  const m = path.match(/\/events\/([^/]+)$/)
  return m?.[1] ? decodeURIComponent(m[1]) : null
}

function sortByDate(items: EventItem[]) {
  return items
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'Server error'
}

export const handler: Handler = async (event) => {
  try {
    const method = event.httpMethod
    const id = getIdFromPath(event.path)

    // ===== PUBLIC GET =====
    if (method === 'GET') {
      const { data } = await readRepoJson<EventItem[]>(EVENTS_PATH)
      const list = sortByDate(Array.isArray(data) ? data : [])

      if (!id) {
        return json(200, list, {
          'Cache-Control': 'public, max-age=0, s-maxage=60',
        })
      }

      const one = list.find((x) => x.id === id)
      if (!one) return notFound('Event not found')
      return json(200, one, {
        'Cache-Control': 'public, max-age=0, s-maxage=60',
      })
    }

    // ===== ADMIN MUTATIONS =====
    const user = requireAuth(
      (event.headers.authorization || event.headers.Authorization || null) as
        | string
        | null
    )
    if (!user) return unauthorized()

    const { data, sha } = await readRepoJson<EventItem[]>(EVENTS_PATH)
    const list = Array.isArray(data) ? data.slice() : []

    if (method === 'POST') {
      const body = parseJsonBody<Partial<EventItem>>(event.body)
      if (!body?.title || !body?.date || !body?.location || !body?.category) {
        return badRequest('title, date, location, category are required')
      }

      const category = String(body.category)
      if (!canManageEventCategory(user.role, category)) {
        return forbidden('You cannot create events in this category')
      }

      const newItem: EventItem = {
        id: crypto.randomUUID(),
        title: String(body.title),
        date: String(body.date),
        location: String(body.location),
        category,
        description: body.description ? String(body.description) : undefined,
        image: body.image ? String(body.image) : undefined,
      }

      const next = sortByDate([newItem, ...list])
      await writeRepoJson(
        EVENTS_PATH,
        next,
        sha,
        `chore(events): create ${newItem.id} by ${user.email}`
      )
      return json(201, newItem)
    }

    if (method === 'PUT') {
      if (!id) return badRequest('Missing event id')

      const body = parseJsonBody<Partial<EventItem>>(event.body)
      if (!body) return badRequest('Invalid JSON')

      const idx = list.findIndex((x) => x.id === id)
      if (idx === -1) return notFound('Event not found')

      const current = list[idx]
      const nextCategory = body.category
        ? String(body.category)
        : current.category

      if (
        !canManageEventCategory(user.role, current.category) ||
        !canManageEventCategory(user.role, nextCategory)
      ) {
        return forbidden('You cannot update events in this category')
      }

      const updated: EventItem = {
        ...current,
        ...body,
        id: current.id,
        category: nextCategory,
      }

      const next = sortByDate(list.map((x) => (x.id === id ? updated : x)))
      await writeRepoJson(
        EVENTS_PATH,
        next,
        sha,
        `chore(events): update ${id} by ${user.email}`
      )
      return json(200, updated)
    }

    if (method === 'DELETE') {
      if (!id) return badRequest('Missing event id')

      const current = list.find((x) => x.id === id)
      if (!current) return notFound('Event not found')

      if (!canManageEventCategory(user.role, current.category)) {
        return forbidden('You cannot delete events in this category')
      }

      const next = list.filter((x) => x.id !== id)
      await writeRepoJson(
        EVENTS_PATH,
        next,
        sha,
        `chore(events): delete ${id} by ${user.email}`
      )
      return json(200, { ok: true })
    }

    return json(405, { error: 'Method Not Allowed' })
  } catch (err: unknown) {
    return serverError(getErrorMessage(err))
  }
}
