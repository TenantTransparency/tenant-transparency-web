// Cloudflare Pages Function for /neighborhood/<community-area-slug>.
// Same approach as functions/property: server-render the page's head and a
// plain-HTML summary for crawlers, fall back to the normal shell if the API
// is unavailable.

import {
  areaDisplayName,
  findAreaBySlug,
  neighborhoodPath,
  neighborhoodSeo,
  violationsPer100,
} from '../../src/neighborhoods.js'
import { propertyPath, titleCaseAddress } from '../../src/propertyUrl.js'
import { SITE, esc, shell, apiJson, renderPage, notFound } from '../../src/edgeShared.js'

const num = (v) => Number(v || 0).toLocaleString('en-US')

function summaryHtml(area, name, top) {
  const crimeTotal = area.crime_violent + area.crime_property + area.crime_other
  const list = (top || [])
    .map(
      (p) =>
        `<li><a href="${esc(propertyPath(p.property_id, p.address))}">${esc(titleCaseAddress(p.address))}</a> &mdash; ${num(p.violation_count)} violations on record</li>`,
    )
    .join('')
  return `<main style="font-family:Arial,Helvetica,sans-serif;max-width:760px;margin:32px auto;padding:0 20px;line-height:1.6">
<h1>Renting in ${esc(name)}, Chicago</h1>
<p>What public records show for renters in ${esc(name)}, and how to check a building before you sign.</p>
<h2>${esc(name)} at a glance</h2>
<ul>
<li>${num(area.property_count)} properties in our records</li>
<li>${num(area.violation_count)} building violations on public record (${num(violationsPer100(area))} per 100 properties)</li>
<li>${num(area.report_count)} published renter reports</li>
<li>${num(crimeTotal)} police-reported incidents in the last 24 months (${num(area.crime_violent)} violent, ${num(area.crime_property)} property, ${num(area.crime_other)} other)</li>
</ul>
<p>Violation counts come from City of Chicago building records. Incident counts come from Chicago Police Department data for the whole community area. They describe the area, not any one building or landlord, and are not a safety rating. For general reference only; not legal advice.</p>
${list ? `<h2>Buildings in ${esc(name)} with the most violations on record</h2><ul>${list}</ul>` : ''}
<p><a href="/neighborhoods">All Chicago neighborhoods</a> &middot; <a href="/search">Search an address</a></p>
</main>`
}

export async function onRequest({ request, env, params }) {
  const slug = (Array.isArray(params.slug) ? params.slug.join('/') : params.slug || '').replace(/\/+$/, '')

  const areasRes = await apiJson(env, '/api/map/community-areas', 1800)
  if (!areasRes.ok) return shell(request, env, { headers: { 'cache-control': 'no-store' } })

  const area = findAreaBySlug(areasRes.data, slug)
  if (!area) return notFound(request, env)

  const canonicalPath = neighborhoodPath(area.community_area_name)
  if (new URL(request.url).pathname !== canonicalPath) {
    return Response.redirect(`${SITE}${canonicalPath}`, 301)
  }

  const topRes = await apiJson(env, `/api/map/community-areas/${area.community_area_id}/properties`, 3600)
  const seo = neighborhoodSeo(area)
  const name = areaDisplayName(area.community_area_name)
  const canonical = `${SITE}${canonicalPath}`

  return renderPage(request, env, {
    title: seo.title,
    description: seo.description,
    canonical,
    bodyHtml: summaryHtml(area, name, topRes.ok ? topRes.data : []),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seo.title,
      description: seo.description,
      url: canonical,
      about: { '@type': 'Place', name: `${name}, Chicago, IL` },
    },
  })
}
