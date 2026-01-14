// netlify/functions/upload.mts
import type { Handler } from '@netlify/functions'
import { json, badRequest, serverError, unauthorized } from './_lib/response'
import { requireAuth } from './_lib/auth'
import { getRepoConfig } from './_lib/github'

export const handler: Handler = async (event) => {
  // 1. Check Method & Auth
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' })
  }

  const user = requireAuth(event.headers.authorization)
  if (!user) return unauthorized()

  // 2. Parse Body (JSON)
  let body
  try {
    body = JSON.parse(event.body || '{}')
  } catch {
    return badRequest('Invalid JSON body')
  }

  const { filename, content } = body

  if (!filename || !content) {
    return badRequest('Filename and content are required')
  }

  // 3. GitHub Configuration
  let config
  try {
    config = getRepoConfig()
  } catch (e: any) {
    console.error('Config Error:', e.message)
    return serverError('Server misconfiguration: ' + e.message)
  }

  const { owner, repo, branch } = config
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN

  if (!GITHUB_TOKEN) {
    return serverError('Server misconfiguration: Missing GITHUB_TOKEN')
  }

  // 4. Generate Unique File Name
  const timestamp = Date.now()
  const cleanFilename = filename.replace(/\s+/g, '-').toLowerCase()
  const uniqueFilename = `${timestamp}-${cleanFilename}`
  const path = `public/uploads/${uniqueFilename}`

  try {
    // 5. Upload to GitHub via API
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`

    console.log(
      `[Upload] Target: ${owner}/${repo} | Branch: ${branch} | Path: ${path}`
    )

    const githubRes = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Netlify-Function-Upload',
      },
      body: JSON.stringify({
        message: `Upload image: ${uniqueFilename}`,
        content: content,
        branch: branch,
      }),
    })

    if (!githubRes.ok) {
      const errText = await githubRes.text()
      console.error('[GitHub Error Response]:', errText)
      return serverError(
        `Failed to upload to GitHub. Status: ${githubRes.status}`
      )
    }

    // 6. Return RAW URL
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`

    return json(200, {
      url: rawUrl,
      message: 'Upload success. Image live via GitHub Raw.',
    })
  } catch (err: unknown) {
    console.error(err)
    return serverError('Internal Upload Error')
  }
}
