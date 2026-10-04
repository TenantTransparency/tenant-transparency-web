// Cloudflare Pages Function for /property/<address-slug>-<uuid>.
//
// The site is a single-page app, so without this every property URL would
// return the same empty shell. This fetches the property from the API and
// returns that shell with the property's own <title>, description,
// canonical URL, structured data and a plain-HTML summary inside #root, so
// crawlers and link previews see real content. React then takes over in the
// browser exactly as before. Any API failure falls back to the plain shell:
// this function must never be the reason a page does not load.

import { propertyIdFromSlug, propertyPath, propertySeo } from '../../src/propertyUrl.js'
import { SITE, esc, shell, apiJson, renderPage, notFound } from '../../src/edgeShared.js'

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
<p><a href="/search">Search Chicago properties</a> &middot; <a href="/neighborhoods">Browse Chicago neighborhoods</a></p>
</main>`
}

export async function onRequest({ request, env, params }) {
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug || ''
  const id = propertyIdFromSlug(slug)
  if (!id) return notFound(request, env)

  const res = await apiJson(env, `/api/properties/${id}`)
  if (res.status === 404) return notFound(request, env)
  if (!res.ok) {
    // API asleep or down: serve the normal app shell and let the browser load it.
    return shell(request, env, { headers: { 'cache-control': 'no-store' } })
  }
  const detail = res.data

  const canonicalPath = propertyPath(detail.property_id, detail.address)
  const url = new URL(request.url)
  if (url.pathname !== canonicalPath) {
    return Response.redirect(`${SITE}${canonicalPath}${url.search}`, 301)
  }

  const seo = propertySeo(detail)
  const canonical = `${SITE}${canonicalPath}`
  return renderPage(request, env, {
    title: seo.title,
    description: seo.description,
    canonical,
    noindex: !seo.indexable,
    bodyHtml: summaryHtml(detail, seo),
    jsonLd: {
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
    },
  })
}
