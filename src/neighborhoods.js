// Neighborhood (Chicago Community Area) pages live at /neighborhood/<slug>.
// Shared by the React page and the edge function that server-renders it for
// crawlers (functions/neighborhood/[[slug]].js).

export function areaSlug(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// "ROGERS PARK" -> "Rogers Park", "O'HARE" -> "O'Hare"
export function areaDisplayName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/(^|[\s'-])([a-z])/g, (_, sep, c) => sep + c.toUpperCase())
}

export const neighborhoodPath = (name) => `/neighborhood/${areaSlug(name)}`

export function findAreaBySlug(areas, slug) {
  return (areas || []).find((a) => areaSlug(a.community_area_name) === slug) || null
}

const n = (v) => Number(v || 0).toLocaleString('en-US')

// Violations per 100 properties on record: a rough comparable across areas of
// different size. Says nothing about any one landlord.
export function violationsPer100(area) {
  return area.property_count > 0 ? Math.round((area.violation_count / area.property_count) * 100) : 0
}

export function neighborhoodSeo(area) {
  const name = areaDisplayName(area.community_area_name)
  return {
    name,
    title: `Renting in ${name}, Chicago: Building Violations & Renter Info | Tenant Transparency`,
    description: `${name} renter guide: ${n(area.violation_count)} building violations across ${n(area.property_count)} properties in public records, plus tenant rights and how to check a building before you lease.`,
  }
}
