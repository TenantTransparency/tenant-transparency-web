// Sitemap of the neighborhood index plus one page per Chicago community area.

import { neighborhoodPath } from '../src/neighborhoods.js'
import { SITE, apiJson } from '../src/edgeShared.js'

export async function onRequest({ env }) {
  const res = await apiJson(env, '/api/map/community-areas', 86400)
  if (!res.ok) {
    return new Response('sitemap temporarily unavailable', { status: 503, headers: { 'retry-after': '3600' } })
  }
  const paths = ['/neighborhoods', ...res.data.map((a) => neighborhoodPath(a.community_area_name))]
  const urls = paths.map((p) => `<url><loc>${SITE}${p}</loc></url>`).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
