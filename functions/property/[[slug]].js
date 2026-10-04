// Cloudflare Pages Function for /property/<address-slug>-<uuid>.
//
// The site is a single-page app, so without this every property URL would
// return the same empty shell. This fetches the property from the API and
// returns that shell with the property's own <title>, description,
// canonical URL, structured data and a plain-HTML summary inside #root, so
// crawlers and link previews see real content. React then takes over in the
// browser exactly as before. Any failure falls back to the plain shell:
// this function must never be the reason a page does not load.

import { propertyIdFromSlug, propertyPath, propertySeo } from '../../src/propertyUrl.js'

const DEFAULT_API = 'https://tenanttransparency-api.onrender.com'
const SITE = 'https://tenanttransparency.com'

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

async function shell(request, env, init = {}) {
  const res = await env.ASSETS.fetch(new URL('/', request.url))
  return new Response(res.body, {
    status: init.status ?? 200,
    headers: { 'content-type': 'text/html; charset=utf-8', ...(init.headers || {}) },
  })
}

function summaryHtml(detail, seo) {
  const owners = (detail.owners || []).slice(0, 5).map((o) => `<li>${esc(o.entity_name)}</li>`).join('')
  const recent = (detail.violations || [])
    .slice(0, 10)
    .map((v) => `<li>${esc(v.violation_date || 'date unknown')}: ${esc(v.description || 'violation')}${v.status ? ` (${esc(v.status)})` : ''}</li>`)
    .join('')
  return `<main style="font-family:Arial,Helvetica,sans-serif;max-width:760px;margin:32px auto;padding:0 20px;line-height:1.6">
<h1>${esc(seo.addr)}, Chicago</h1>
<p>${esc(seo.description)}</p>
${owners ? `<h2>Ownership on file</h2><ul>${owners}</ul>` : ''}
<h2>Building violations (${seo.violations})</h2>${recent ? `<ul>${recent}</ul>` : '<p>No violations appear in the public records we reviewed.</p>'}
<h2>Renter reports (${seo.reports})</h2>
<p>Information is compiled from public records and moderated renter reports for general reference only. It may be incomplete or out of date and is not legal advice.</p>
<p><a href="/search">Search Chicago properties</a></p>
</main>`
}

export async function onRequest({ request, env, params }) {
  const apiBase = (env.VITE_API_BASE_URL || DEFAULT_API).replace(/\/+$/, '')
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug || ''
  const id = propertyIdFromSlug(slug)

  if (!id) {
    return shell(request, env, { status: 404, headers: { 'x-robots-tag': 'noindex' } })
  }

  let detail
  try {
    const res = await fetch(`${apiBase}/api/properties/${id}`, {
      signal: AbortSignal.timeout(25000),
      cf: { cacheEverything: true, cacheTtl: 3600 },
    })
    if (res.status === 404) {
      return shell(request, env, { status: 404, headers: { 'x-robots-tag': 'noindex' } })
    }
    if (!res.ok) throw new Error(`api ${res.status}`)
    detail = await res.json()
  } catch {
    // API asleep or down: serve the normal app shell and let the browser load it.
    return shell(request, env, { headers: { 'cache-control': 'no-store' } })
  }

  const canonicalPath = propertyPath(detail.property_id, detail.address)
  const url = new URL(request.url)
  if (url.pathname !== canonicalPath) {
    return Response.redirect(`${SITE}${canonicalPath}${url.search}`, 301)
  }

  const seo = propertySeo(detail)
  const canonical = `${SITE}${canonicalPath}`
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seo.title,
    description: seo.description,
    url: canonical,
    about: {
      '@type': 'Place',
      name: seo.addr,
      address: {
        '@type': 'PostalAddress',
        streetAddress: seo.addr,
        addressLocality: 'Chicago',
        addressRegion: 'IL',
        addressCountry: 'US',
      },
      ...(detail.latitude != null && detail.longitude != null
        ? { geo: { '@type': 'GeoCoordinates', latitude: detail.latitude, longitude: detail.longitude } }
        : {}),
    },
  }
  const headExtra = [
    `<link rel="canonical" href="${esc(canonical)}">`,
    seo.indexable ? '' : '<meta name="robots" content="noindex, follow">',
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${esc(seo.title)}">`,
    `<meta property="og:description" content="${esc(seo.description)}">`,
    `<meta property="og:url" content="${esc(canonical)}">`,
    `<meta property="og:image" content="${SITE}/logo.png">`,
    `<meta name="twitter:card" content="summary">`,
    `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\u003c')}</script>`,
  ].join('')

  const base = await shell(request, env, {
    headers: { 'cache-control': 'public, max-age=300, s-maxage=3600' },
  })

  return new HTMLRewriter()
    .on('title', { element: (e) => e.setInnerContent(seo.title) })
    .on('meta[name="description"]', { element: (e) => e.setAttribute('content', seo.description) })
    .on('head', { element: (e) => e.append(headExtra, { html: true }) })
    .on('div#root', { element: (e) => e.setInnerContent(summaryHtml(detail, seo), { html: true }) })
    .transform(base)
}
