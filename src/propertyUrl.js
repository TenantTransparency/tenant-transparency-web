// Property pages live at /property/<address-slug>-<property uuid>. The uuid
// is the only part that is looked up; the slug is for people and search
// engines, so a stale or mistyped slug still resolves (and canonicalises).
// The same slug rules are duplicated in functions/property/[[slug]].js and
// functions/sitemap-properties.xml.js -- keep the three in sync.

const UUID_TAIL = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i

export function slugify(address) {
  return String(address || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function propertyPath(propertyId, address) {
  const slug = slugify(address)
  return `/property/${slug ? `${slug}-` : ''}${propertyId}`
}

export function propertyIdFromSlug(slug) {
  const m = UUID_TAIL.exec(slug || '')
  return m ? m[1].toLowerCase() : null
}

// "171 N STATE ST" -> "171 N State St" (addresses are stored upper-case)
export function titleCaseAddress(address) {
  return String(address || '')
    .toLowerCase()
    .replace(/\b([a-z])/g, (c) => c.toUpperCase())
    .replace(/\b(N|S|E|W|Ne|Nw|Se|Sw)\b/g, (d) => d.toUpperCase())
}

// Title, description and indexability for a property page. Shared by the
// client (PropertyDetail.jsx) and the edge function that server-renders the
// same page for crawlers. Properties with no public record and no published
// report are thin pages: still viewable, but kept out of search results.
export function propertySeo(detail) {
  const addr = titleCaseAddress(detail.address)
  const violations = detail.violations?.length ?? 0
  const reports = detail.published_reports?.length ?? 0
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`
  const description =
    violations > 0 || reports > 0
      ? `Public building violation history for ${addr}, Chicago: ${plural(violations, 'violation')} on record and ${plural(reports, 'published renter report')}. Know before you lease.`
      : `Public records and renter reports for ${addr}, Chicago. No violations appear in the public records we reviewed. Know before you lease.`
  return {
    addr,
    title: `${addr}, Chicago: Violations & Renter Reports | Tenant Transparency`,
    description,
    indexable: violations > 0 || reports > 0,
    violations,
    reports,
  }
}
