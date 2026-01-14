// netlify/functions/_lib/github.ts
type GitHubContentResponse = {
  sha: string
  content: string
  encoding: 'base64'
}

const GH_API = 'https://api.github.com'

function mustEnv(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`${name} is not set`)
  return v
}

function encodeGitHubPath(path: string): string {
  return path
    .split('/')
    .filter(Boolean)
    .map((seg) => encodeURIComponent(seg))
    .join('/')
}

function ghHeaders(): Record<string, string> {
  const token = mustEnv('GITHUB_TOKEN')
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'vihara-website-netlify-functions',
  }
}

export function getRepoConfig() {
  let repo = mustEnv('GITHUB_REPO')
  let owner = process.env.GITHUB_OWNER

  // Handle format "username/repo"
  if (repo.includes('/')) {
    const parts = repo.split('/')
    owner = parts[0]
    repo = parts[1]
  }

  if (!owner) {
    throw new Error(
      'GITHUB_OWNER is not set and GITHUB_REPO does not contain owner/repo format'
    )
  }

  const branch = process.env.GITHUB_BRANCH || 'main'

  return { owner, repo, branch }
}

export async function readRepoJson<T>(
  path: string
): Promise<{ data: T; sha: string }> {
  const { owner, repo, branch } = getRepoConfig()

  const encodedPath = encodeGitHubPath(path)
  const url =
    `${GH_API}/repos/${owner}/${repo}/contents/${encodedPath}` +
    `?ref=${encodeURIComponent(branch)}`

  const res = await fetch(url, { headers: ghHeaders() })

  if (!res.ok) {
    const text = await res.text()
    console.error(`GitHub Read Error (${res.status}): ${url}`, text)
    throw new Error(`GitHub read failed: ${res.status} ${text}`)
  }

  const json = (await res.json()) as GitHubContentResponse
  const decoded = Buffer.from(json.content, 'base64').toString('utf8')
  return { data: JSON.parse(decoded) as T, sha: json.sha }
}

export async function writeRepoJson(
  path: string,
  data: unknown,
  sha: string,
  message: string
): Promise<unknown> {
  const { owner, repo, branch } = getRepoConfig()

  const encodedPath = encodeGitHubPath(path)
  const url = `${GH_API}/repos/${owner}/${repo}/contents/${encodedPath}`

  const contentStr = JSON.stringify(data, null, 2) + '\n'
  const contentB64 = Buffer.from(contentStr, 'utf8').toString('base64')

  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: contentB64,
      sha,
      branch,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`GitHub Write Error (${res.status}): ${url}`, text)
    throw new Error(`GitHub write failed: ${res.status} ${text}`)
  }

  return res.json()
}
