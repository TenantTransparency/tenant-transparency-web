// Sitemap of property pages, built from the API's list of properties that
// have public violation history or a published report (thin pages are left
// out). Cached at the edge for a day. Linked from robots.txt.

import { propertyPath } from '../src/propertyUrl.js'

const DEFAULT_API = 'https://tenanttransparency-api.onrender.com'
const SITE = 'https://tenanttransparency.com'

export async function onRequest({ env }) {
  const apiBase = (env.VITE_API_BASE_URL || DEFAULT_API).replace(/\/+$/, '')
  try {
    const res = await fetch(`${apiBase}/api/sitemap/properties`, {
      signal: AbortSignal.timeout(25000),
      cf: { cacheEverything: true, cacheTtl: 86400 },
    })
    if (!res.ok) throw new Error(`api ${res.status}`)
    const rows = await res.json()
    const urls = rows
      .map((r) => `<url><loc>${SITE}${propertyPath(r.property_id, r.address)}</loc></url>`)
      .join('')
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
    return new Response(xml, {
      headers: {
        'content-type': 'application/xml; charset=utf-8',
        'cache-control': 'public, max-age=3600, s-maxage=86400',
      },
    })
  } catch {
    return new Response('sitemap temporarily unavailable', { status: 503, headers: { 'retry-after': '3600' } })
  }
}
