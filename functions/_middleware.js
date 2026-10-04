// Gives each main route its own head tags and a crawlable summary in the HTML
// it is served as, instead of the generic app shell. Property and
// neighborhood pages have their own functions; this covers the fixed routes
// listed in src/seoPages.js. Anything else passes through untouched, and any
// failure here falls back to the unmodified response.

import { PAGES } from '../src/seoPages.js'
import { SITE, esc } from '../src/edgeShared.js'

const SKIP = new Set(['/admin', '/auth/callback'])

const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Tenant Transparency',
  url: SITE,
  logo: `${SITE}/logo.png`,
  slogan: 'Know Before You Lease',
  areaServed: { '@type': 'City', name: 'Chicago' },
}

function bodyHtml(page) {
  const links = (page.links || [])
    .map(([href, text]) => `<li><a href="${esc(href)}">${esc(text)}</a></li>`)
    .join('')
  return `<main style="font-family:Arial,Helvetica,sans-serif;max-width:760px;margin:32px auto;padding:0 20px;line-height:1.6">
<h1>${esc(page.h1)}</h1>
<p>${esc(page.intro)}</p>${links ? `<ul>${links}</ul>` : ''}
</main>`
}

export async function onRequest({ request, next }) {
  const res = await next()
  try {
    if (request.method !== 'GET' || !res.ok) return res
    if (!(res.headers.get('content-type') || '').includes('text/html')) return res

    const url = new URL(request.url)
    const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname
    const page = PAGES[path]
    if (!page || SKIP.has(path)) return res

    const rewriter = new HTMLRewriter().on('title', { element: (e) => e.setInnerContent(page.title) })

    if (page.noindex) {
      return rewriter
        .on('head', { element: (e) => e.append('<meta name="robots" content="noindex, nofollow">', { html: true }) })
        .transform(res)
    }

    const canonical = `${SITE}${path === '/' ? '/' : path}`
    const headExtra = [
      `<link rel="canonical" href="${esc(canonical)}">`,
      '<meta property="og:type" content="website">',
      `<meta property="og:title" content="${esc(page.title)}">`,
      `<meta property="og:description" content="${esc(page.description)}">`,
      `<meta property="og:url" content="${esc(canonical)}">`,
      `<meta property="og:image" content="${SITE}/logo.png">`,
      '<meta name="twitter:card" content="summary">',
      path === '/'
        ? `<script type="application/ld+json">${JSON.stringify(ORGANIZATION).replace(/</g, '\\u003c')}</script>`
        : '',
    ].join('')

    return rewriter
      .on('meta[name="description"]', { element: (e) => e.setAttribute('content', page.description) })
      .on('head', { element: (e) => e.append(headExtra, { html: true }) })
      .on('div#root', { element: (e) => e.setInnerContent(bodyHtml(page), { html: true }) })
      .transform(res)
  } catch {
    return res
  }
}
