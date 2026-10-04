import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PAGES } from './seoPages.js'

// The site is a single-page app: index.html (and its <title>/description) is
// served for every route, so without this every page looks identical to a
// crawler. Updates the head on each navigation. Googlebot renders JS and
// picks these up. The static guides in /public carry their own head tags.

export const SITE = 'https://tenanttransparency.com'
export const DEFAULT_IMAGE = `${SITE}/logo.png`

export function setMeta(selector, create, value) {
  let el = document.head.querySelector(selector)
  if (value == null) {
    el?.remove()
    return
  }
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(el.tagName === 'LINK' ? 'href' : 'content', value)
}

export const metaTag = (attr, key) => () => {
  const el = document.createElement('meta')
  el.setAttribute(attr, key)
  return el
}

export default function SeoHead() {
  const { pathname } = useLocation()

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
    // Property pages set their own title, description and canonical once the
    // property has loaded (PropertyDetail.jsx).
    if (path.startsWith('/property/') || path.startsWith('/neighborhood')) return
    const page = PAGES[path] || PAGES['/']
    const url = `${SITE}${path === '/' ? '/' : path}`

    document.title = page.title
    const desc = page.description ?? null

    setMeta('meta[name="description"]', metaTag('name', 'description'), desc)
    setMeta('meta[name="robots"]', metaTag('name', 'robots'), page.noindex ? 'noindex, nofollow' : null)
    setMeta('meta[property="og:title"]', metaTag('property', 'og:title'), page.title)
    setMeta('meta[property="og:description"]', metaTag('property', 'og:description'), desc)
    setMeta('meta[property="og:url"]', metaTag('property', 'og:url'), url)
    setMeta('meta[property="og:type"]', metaTag('property', 'og:type'), 'website')
    setMeta('meta[property="og:image"]', metaTag('property', 'og:image'), DEFAULT_IMAGE)
    setMeta('meta[name="twitter:card"]', metaTag('name', 'twitter:card'), 'summary')

    setMeta(
      'link[rel="canonical"]',
      () => {
        const el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        return el
      },
      page.noindex ? null : url,
    )
  }, [pathname])

  return null
}
