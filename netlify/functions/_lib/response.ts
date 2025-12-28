export function json(
  statusCode: number,
  body: unknown,
  headers: Record<string, string> = {}
) {
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

export function parseJsonBody<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}
