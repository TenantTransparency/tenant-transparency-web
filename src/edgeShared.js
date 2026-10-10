// Helpers shared by the Cloudflare Pages Functions that server-render pages
// for crawlers (functions/property, functions/neighborhood). Not used by the
// React app.

export const SITE = 'https://tenanttransparency.com'
export const DEFAULT_API = 'https://tenanttransparency-api.onrender.com'

export const apiBase = (env) => (env.VITE_API_BASE_URL || DEFAULT_API).replace(/\/+$/, '')

export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

// The normal app shell (index.html), optionally with a different status.
export async function shell(request, env, init = {}) {
  const res = await env.ASSETS.fetch(new URL('/', request.url))
  return new Response(res.body, {
    status: init.status ?? 200,
    headers: { 'content-type': 'text/html; charset=utf-8', ...(init.headers || {}) },
  })
}

// Fetch JSON from the API through Cloudflare's cache. Returns
// { ok, status, data }; never throws (an asleep or failing API must not
// take the page down).
export async function apiJson(env, path, ttl = 3600) {
  try {
    const res = await fetch(`${apiBase(env)}${path}`, {
      signal: AbortSignal.timeout(25000),
      cf: { cacheEverything: true, cacheTtl: ttl },
    })
    if (!res.ok) return { ok: false, status: res.status, data: null }
    return { ok: true, status: res.status, data: await res.json() }
  } catch {
    return { ok: false, status: 0, data: null }
  }
}

// Take the app shell and give it a page's own head tags and a plain-HTML
// body inside #root. React replaces #root on load, so visitors see the app;
// crawlers and link previews see the content.
export async function renderPage(request, env, { title, description, canonical, noindex, jsonLd, bodyHtml }) {
  const headExtra = [
    `<link rel="canonical" href="${esc(canonical)}">`,
    noindex ? '<meta name="robots" content="noindex, follow">' : '',
    '<meta property="og:type" content="website">',
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${esc(canonical)}">`,
    `<meta property="og:image" content="${SITE}/tt-logo-icon.png">`,
    '<meta name="twitter:card" content="summary">',
    jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : '',
  ].join('')

  const base = await shell(request, env, {
    headers: { 'cache-control': 'public, max-age=300, s-maxage=3600' },
  })

  return new HTMLRewriter()
    .on('title', { element: (e) => e.setInnerContent(title) })
    .on('meta[name="description"]', { element: (e) => e.setAttribute('content', description) })
    .on('head', { element: (e) => e.append(headExtra, { html: true }) })
    .on('div#root', { element: (e) => e.setInnerContent(bodyHtml, { html: true }) })
    .transform(base)
}

export const notFound = (request, env) =>
  shell(request, env, { status: 404, headers: { 'x-robots-tag': 'noindex' } })
