// Gives each main route its own head tags and real HTML content in the page
// it is served as, so crawlers that do not run JavaScript can read the site.
// Property and neighborhood pages have their own functions; this covers the
// fixed routes listed in src/seoPages.js:
//   1. If the build produced a prerendered copy (scripts/prerender.mjs), serve
//      that: the full React page rendered to HTML.
//   2. Otherwise serve the app shell with a short summary in #root.
// /neighborhoods is rendered here from the API so the list is always current.
// Anything else passes through untouched, and any failure falls back to the
// unmodified response.

import { PAGES } from '../src/seoPages.js'
import { areaDisplayName, neighborhoodPath } from '../src/neighborhoods.js'
import { SITE, esc, apiJson } from '../src/edgeShared.js'

const SKIP = new Set(['/admin', '/auth/callback'])

// route -> folder name under /_prerender/ (see scripts/prerender.mjs)
const PRERENDERED = {
  '/': 'home',
  '/search': 'search',
  '/report-issue': 'report-issue',
  '/resources': 'resources',
  '/about': 'about',
  '/founder': 'founder',
  '/support': 'support',
  '/privacy': 'privacy',
  '/terms': 'terms',
}

const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Tenant Transparency',
  url: SITE,
  logo: `${SITE}/tt-logo-icon.png`,
  slogan: 'Know Before You Lease',
  areaServed: { '@type': 'City', name: 'Chicago' },
}

function summaryHtml(page, extra = '') {
  const links = (page.links || [])
    .map(([href, text]) => `<li><a href="${esc(href)}">${esc(text)}</a></li>`)
    .join('')
  return `<main style="font-family:Arial,Helvetica,sans-serif;max-width:760px;margin:32px auto;padding:0 20px;line-height:1.6">
<h1>${esc(page.h1)}</h1>
<p>${esc(page.intro)}</p>${links ? `<ul>${links}</ul>` : ''}${extra}
</main>`
}

async function neighborhoodList(env) {
  const res = await apiJson(env, '/api/map/community-areas', 1800)
  if (!res.ok) return ''
  const items = res.data
    .map((a) => `<li><a href="${esc(neighborhoodPath(a.community_area_name))}">${esc(areaDisplayName(a.community_area_name))}</a></li>`)
    .join('')
  return `<h2>All 77 Chicago community areas</h2><ul>${items}</ul>`
}

export async function onRequest({ request, env, next }) {
  const res = await next()
  try {
    if (request.method !== 'GET' || !res.ok) return res
    if (!(res.headers.get('content-type') || '').includes('text/html')) return res

    const url = new URL(request.url)
    const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname
    const page = PAGES[path]
    if (!page || SKIP.has(path)) return res

    if (page.noindex) {
      return new HTMLRewriter()
        .on('title', { element: (e) => e.setInnerContent(page.title) })
        .on('head', { element: (e) => e.append('<meta name="robots" content="noindex, nofollow">', { html: true }) })
        .transform(res)
    }

    // Prefer the build-time prerendered page for this route.
    let base = res
    let prerendered = false
    const folder = PRERENDERED[path]
    if (folder) {
      const pre = await env.ASSETS.fetch(new URL(`/_prerender/${folder}/`, request.url))
      if (pre.ok && pre.headers.get('x-prerendered') === '1') {
        base = new Response(pre.body, {
          status: 200,
          headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300, s-maxage=3600' },
        })
        prerendered = true
      }
    }

    const canonical = `${SITE}${path === '/' ? '/' : path}`
    const headExtra = [
      `<link rel="canonical" href="${esc(canonical)}">`,
      '<meta property="og:type" content="website">',
      `<meta property="og:title" content="${esc(page.title)}">`,
      `<meta property="og:description" content="${esc(page.description)}">`,
      `<meta property="og:url" content="${esc(canonical)}">`,
      `<meta property="og:image" content="${SITE}/tt-logo-icon.png">`,
      '<meta name="twitter:card" content="summary">',
      path === '/'
        ? `<script type="application/ld+json">${JSON.stringify(ORGANIZATION).replace(/</g, '\\u003c')}</script>`
        : '',
    ].join('')

    let rewriter = new HTMLRewriter()
      .on('title', { element: (e) => e.setInnerContent(page.title) })
      .on('meta[name="description"]', { element: (e) => e.setAttribute('content', page.description) })
      .on('head', { element: (e) => e.append(headExtra, { html: true }) })

    if (!prerendered) {
      const extra = path === '/neighborhoods' ? await neighborhoodList(env) : ''
      rewriter = rewriter.on('div#root', { element: (e) => e.setInnerContent(summaryHtml(page, extra), { html: true }) })
    }
    return rewriter.transform(base)
  } catch {
    return res
  }
}
