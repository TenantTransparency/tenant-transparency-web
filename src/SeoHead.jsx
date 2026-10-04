import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// The site is a single-page app: index.html (and its <title>/description) is
// served for every route, so without this every page looks identical to a
// crawler. Updates the head on each navigation. Googlebot renders JS and
// picks these up. The static guides in /public carry their own head tags.

export const SITE = 'https://tenanttransparency.com'
export const DEFAULT_IMAGE = `${SITE}/logo.png`

const PAGES = {
  '/': {
    title: 'Tenant Transparency — Know Before You Lease',
    description:
      'Public property records, renter reports, and tenant rights for Chicago renters. Know Before You Lease.',
  },
  '/search': {
    title: 'Search Chicago Properties and Landlords | Tenant Transparency',
    description:
      'Look up a Chicago property or landlord and see public building violation history before you sign a lease.',
  },
  '/report-issue': {
    title: 'Report a Housing Concern | Tenant Transparency',
    description:
      'Report a housing concern at a Chicago property. Every report is reviewed by a person before it is published.',
  },
  '/resources': {
    title: 'Chicago Housing Resource Center | Tenant Transparency',
    description:
      'Free guides and tools on Chicago tenant rights: security deposits, habitability, heat, eviction, and move-out documentation.',
  },
  '/about': {
    title: 'About Tenant Transparency | Know Before You Lease',
    description:
      'Tenant Transparency gives Chicago renters public records, tenant-rights information, and a way to report housing concerns.',
  },
  '/founder': {
    title: 'Meet the Founder | Tenant Transparency',
    description: 'Meet Sheenita Robinson, founder of Tenant Transparency, and why she built it.',
  },
  '/support': {
    title: 'Support Tenant Transparency',
    description: 'Ways to support Tenant Transparency and help Chicago renters know before they lease.',
  },
  '/map': {
    title: 'Chicago Neighborhood Map | Tenant Transparency',
    description:
      'Explore Chicago community areas on a map with public housing and neighborhood data.',
  },
  '/privacy': {
    title: 'Privacy Policy | Tenant Transparency',
    description: 'How Tenant Transparency collects, uses, and protects information.',
  },
  '/terms': {
    title: 'Terms of Use | Tenant Transparency',
    description: 'The terms for using Tenant Transparency.',
  },
  // Direct-link-only or back-office routes: keep out of search results.
  '/beta': { title: 'Beta Tester | Tenant Transparency', noindex: true },
  '/founding-community': { title: 'Founding Community | Tenant Transparency', noindex: true },
  '/auth/callback': { title: 'Signing in | Tenant Transparency', noindex: true },
  '/admin': { title: 'Admin | Tenant Transparency', noindex: true },
}

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
    if (path.startsWith('/property/')) return
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
