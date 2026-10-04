// Build step: after `vite build`, render the static pages to HTML so crawlers
// that do not run JavaScript see real content.
//
// Output goes to dist/_prerender/<name>/index.html, NOT over dist/index.html:
// that file must stay a clean shell because it is the fallback for every
// other route. functions/_middleware.js serves these copies (with each page's
// head tags) for the matching routes. A failure here must never fail the
// deploy, so it logs and exits 0; the middleware falls back to the shell plus
// a short summary.

import { build } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const ROUTES = {
  home: '/',
  search: '/search',
  'report-issue': '/report-issue',
  resources: '/resources',
  about: '/about',
  founder: '/founder',
  support: '/support',
  privacy: '/privacy',
  terms: '/terms',
}

const root = process.cwd()
const dist = path.join(root, 'dist')
const ssrOut = path.join(root, 'dist-ssr')

try {
  const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
  if (!template.includes('<div id="root"></div>')) throw new Error('root placeholder not found in dist/index.html')

  await build({
    logLevel: 'warn',
    build: { ssr: 'src/entry-server.jsx', outDir: ssrOut, emptyOutDir: true, copyPublicDir: false },
  })

  const entry = fs.readdirSync(ssrOut).find((f) => f.startsWith('entry-server') && /\.m?js$/.test(f))
  const { render } = await import(pathToFileURL(path.join(ssrOut, entry)).href)

  // The noscript fallback only matters when nothing is rendered.
  const base = template.replace(/<noscript>[\s\S]*?<\/noscript>/, '')

  let done = 0
  for (const [name, route] of Object.entries(ROUTES)) {
    try {
      const html = render(route)
      if (!html || html.length < 200) throw new Error('empty render')
      const out = base.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
      const dir = path.join(dist, '_prerender', name)
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path.join(dir, 'index.html'), out)
      done += 1
    } catch (err) {
      console.warn(`prerender: skipped ${route}: ${err.message}`)
    }
  }
  console.log(`prerender: wrote ${done}/${Object.keys(ROUTES).length} pages`)
} catch (err) {
  console.warn(`prerender: failed, continuing without it: ${err.message}`)
} finally {
  fs.rmSync(ssrOut, { recursive: true, force: true })
}
