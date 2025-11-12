// scripts/generate-sitemap.mjs
import process from 'node:process'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const SITE_URL = (
  process.env.SITE_URL || 'https://viharaavalokitesvara.netlify.app'
).replace(/\/+$/, '')

// List of SPA public routes
const routes = ['/', '/pmv', '/gabi']

const lastmod = new Date().toISOString().slice(0, 10) // yyyy-mm-dd
const urls = routes
  .map(
    (p) => `
  <url>
    <loc>${SITE_URL}${p}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

// write to dist after build
const outDir = resolve('dist')
mkdirSync(outDir, { recursive: true })
writeFileSync(resolve(outDir, 'sitemap.xml'), xml, 'utf8')
console.log('✓ sitemap.xml generated')
