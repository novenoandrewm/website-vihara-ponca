// netlify/functions/login.ts
import type { Handler } from '@netlify/functions'
import bcrypt from 'bcryptjs'
import {
  json,
  badRequest,
  unauthorized,
  parseJsonBody,
  serverError,
} from './_lib/response'
import { signToken, type AuthUser, type Role } from './_lib/auth'

type AdminUserEnv = {
  id: string
  email: string
  name: string
  role: Role
  password_hash: string
}

function loadUsers(): AdminUserEnv[] {
  const raw = process.env.ADMIN_USERS
  if (!raw) return []
  try {
    return JSON.parse(raw) as AdminUserEnv[]
  } catch {
    return []
  }
}

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  return 'Server error'
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' })
  }

  const body = parseJsonBody<{ email?: string; password?: string }>(event.body)
  if (!body?.email || !body?.password) {
    return badRequest('Email & password required')
  }

  try {
    const users = loadUsers()
    const u = users.find(
      (x) => x.email.toLowerCase() === body.email!.toLowerCase()
    )
    if (!u) return unauthorized('Invalid credentials')

    const ok = await bcrypt.compare(body.password, u.password_hash)
    if (!ok) return unauthorized('Invalid credentials')

    const user: AuthUser = {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
    }
    const token = signToken(user)

    return json(200, { token, user })
  } catch (err: unknown) {
    return serverError(getErrorMessage(err))
  }
}
