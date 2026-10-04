import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCommunityAreaStats, getAreaTopProperties } from '../api.js'
import { setMeta, metaTag, SITE, DEFAULT_IMAGE } from '../SeoHead.jsx'
import { propertyPath, titleCaseAddress } from '../propertyUrl.js'
import SponsoredSlot from './SponsoredSlot.jsx'
import {
  areaDisplayName,
  findAreaBySlug,
  neighborhoodPath,
  neighborhoodSeo,
  violationsPer100,
} from '../neighborhoods.js'

const num = (v) => Number(v || 0).toLocaleString('en-US')

function useAreas() {
  const [areas, setAreas] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let cancelled = false
    getCommunityAreaStats()
      .then((d) => !cancelled && setAreas(d))
      .catch((e) => !cancelled && setError(e.message))
    return () => {
      cancelled = true
    }
  }, [])
  return { areas, error }
}

function setHead({ title, description, url }) {
  document.title = title
  setMeta('meta[name="description"]', metaTag('name', 'description'), description)
  setMeta('meta[name="robots"]', metaTag('name', 'robots'), null)
  setMeta('meta[property="og:title"]', metaTag('property', 'og:title'), title)
  setMeta('meta[property="og:description"]', metaTag('property', 'og:description'), description)
  setMeta('meta[property="og:url"]', metaTag('property', 'og:url'), url)
  setMeta('meta[property="og:image"]', metaTag('property', 'og:image'), DEFAULT_IMAGE)
  setMeta(
    'link[rel="canonical"]',
    () => {
      const el = document.createElement('link')
      el.setAttribute('rel', 'canonical')
      return el
    },
    url,
  )
}

export function NeighborhoodIndex() {
  const { areas, error } = useAreas()

  useEffect(() => {
    setHead({
      title: 'Chicago Neighborhoods: Renter Guides for All 77 Community Areas | Tenant Transparency',
      description:
        'Browse all 77 Chicago community areas. See public building violation counts, renter reports and tenant-rights resources for each neighborhood before you lease.',
      url: `${SITE}/neighborhoods`,
    })
  }, [])

  return (
    <div className="page-content neighborhood-page">
      <h1>Chicago Neighborhoods</h1>
      <p className="subhead">
        Pick a community area to see what public records show for renters there, then search a
        specific building before you lease.
      </p>
      {error && <p className="status-line error">{error}</p>}
      {!areas && !error && <p className="status-line">Loading neighborhoods…</p>}
      {areas && (
        <ul className="neighborhood-grid">
          {areas.map((a) => (
            <li key={a.community_area_id}>
              <Link to={neighborhoodPath(a.community_area_name)}>
                {areaDisplayName(a.community_area_name)}
              </Link>
              <span className="field-hint">{num(a.property_count)} properties</span>
            </li>
          ))}
        </ul>
      )}
      <p>
        <Link to="/map">View the interactive map</Link>
      </p>
    </div>
  )
}

export default function Neighborhood() {
  const { slug } = useParams()
  const { areas, error } = useAreas()
  const [top, setTop] = useState(null)
  const area = areas ? findAreaBySlug(areas, slug) : null

  useEffect(() => {
    if (!area) return
    const seo = neighborhoodSeo(area)
    setHead({
      title: seo.title,
      description: seo.description,
      url: `${SITE}${neighborhoodPath(area.community_area_name)}`,
    })
    let cancelled = false
    getAreaTopProperties(area.community_area_id)
      .then((d) => !cancelled && setTop(d))
      .catch(() => !cancelled && setTop([]))
    return () => {
      cancelled = true
    }
  }, [area])

  if (error) return <div className="page-content"><p className="status-line error">{error}</p></div>
  if (!areas) return <div className="page-content"><p className="status-line">Loading…</p></div>
  if (!area) {
    return (
      <div className="page-content neighborhood-page">
        <h1>Neighborhood not found</h1>
        <p><Link to="/neighborhoods">See all Chicago neighborhoods</Link></p>
      </div>
    )
  }

  const name = areaDisplayName(area.community_area_name)
  const crimeTotal = area.crime_violent + area.crime_property + area.crime_other

  return (
    <div className="page-content neighborhood-page">
      <p className="field-hint"><Link to="/neighborhoods">All neighborhoods</Link> › {name}</p>
      <h1>Renting in {name}, Chicago</h1>
      <p className="subhead">
        What public records show for renters in {name}, and how to check a building before you sign.
      </p>

      <section className="detail-section">
        <h2>{name} at a glance</h2>
        <ul className="neighborhood-stats">
          <li><strong>{num(area.property_count)}</strong> properties in our records</li>
          <li>
            <strong>{num(area.violation_count)}</strong> building violations on public record (
            {num(violationsPer100(area))} per 100 properties)
          </li>
          <li><strong>{num(area.report_count)}</strong> published renter reports</li>
          <li>
            <strong>{num(crimeTotal)}</strong> police-reported incidents in the last 24 months (
            {num(area.crime_violent)} violent, {num(area.crime_property)} property,{' '}
            {num(area.crime_other)} other)
          </li>
        </ul>
        <p className="empty-state">
          Violation counts come from City of Chicago building records and reflect inspections, not
          every condition a renter may face. Incident counts come from Chicago Police Department
          data for the whole community area. They describe the area, not any one building or
          landlord, and are not a safety rating. Information is for general reference only and is
          not legal advice.
        </p>
      </section>

      <SponsoredSlot placement="neighborhood_panel" />

      <section className="detail-section">
        <h2>Buildings in {name} with the most violations on record</h2>
        {!top && <p className="status-line">Loading…</p>}
        {top && top.length === 0 && (
          <p className="empty-state">No violation history is on file for this area yet.</p>
        )}
        {top && top.length > 0 && (
          <ul className="neighborhood-properties">
            {top.map((p) => (
              <li key={p.property_id}>
                <Link to={propertyPath(p.property_id, p.address)}>{titleCaseAddress(p.address)}</Link>{' '}
                &mdash; {num(p.violation_count)} violations on record
              </li>
            ))}
          </ul>
        )}
        <p>
          <Link to="/search" className="cta-primary">Search an address in {name}</Link>
        </p>
      </section>

      <section className="detail-section">
        <h2>Before you lease in {name}</h2>
        <ul>
          <li><a href="/chicago-renters-rights-guide/">Chicago renters&rsquo; rights: the complete guide</a></li>
          <li><a href="/chicago-security-deposit-law/">Security deposit law</a></li>
          <li><a href="/chicago-habitability-violations/">Habitability violations</a></li>
          <li><Link to="/report-issue">Report a housing concern in {name}</Link></li>
        </ul>
      </section>
    </div>
  )
}
