// netlify/functions/_lib/response.ts
import type { HandlerResponse } from '@netlify/functions'

export function json(
  statusCode: number,
  body: unknown,
  headers: Record<string, string> = {}
): HandlerResponse {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...headers,
    },
    body: JSON.stringify(body),
  }
}

export function badRequest(message = 'Bad Request') {
  return json(400, { error: message })
}

export function unauthorized(message = 'Unauthorized') {
  return json(401, { error: message })
}

export function forbidden(message = 'Forbidden') {
  return json(403, { error: message })
}

export function notFound(message = 'Not Found') {
  return json(404, { error: message })
}

export function serverError(message = 'Server error') {
  return json(500, { error: message })
}

/**
 * Safe JSON parse for Netlify event.body.
 * Supports base64 body.
 */
export function parseJsonBody<T>(
  raw: string | null,
  isBase64Encoded = false
): T | null {
  if (!raw) return null
  try {
    const text = isBase64Encoded
      ? Buffer.from(raw, 'base64').toString('utf8')
      : raw
    return JSON.parse(text) as T
  } catch {
    return null
  }
}
