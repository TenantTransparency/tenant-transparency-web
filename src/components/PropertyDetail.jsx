import { useEffect, useState } from 'react'
import { getPropertyDetail } from '../api.js'
import { setMeta, metaTag, SITE, DEFAULT_IMAGE } from '../SeoHead.jsx'
import { propertyPath, propertySeo } from '../propertyUrl.js'

// Weight of a published report. Verified ones are backed by a city record
// someone can look up; firsthand accounts are real warnings that simply
// don't have a paper trail (e.g. inappropriate conduct).
const EVIDENCE_LABELS = {
  verified_city_record: 'Verified against city records',
  moderator_verified: 'City case number verified',
  none: 'Firsthand account',
}

export default function PropertyDetail({ propertyId, onBack }) {
  const [detail, setDetail] = useState(null)
  const [status, setStatus] = useState('loading') // loading | error | ready
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    getPropertyDetail(propertyId)
      .then((data) => {
        if (!cancelled) {
          setDetail(data)
          setStatus('ready')
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorMessage(err.message)
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [propertyId])

  // Head tags for this property. The edge function sets the same values in the
  // server-rendered HTML; this keeps them right when navigating in the app.
  useEffect(() => {
    if (!detail) return
    const seo = propertySeo(detail)
    const url = `${SITE}${propertyPath(detail.property_id, detail.address)}`
    document.title = seo.title
    setMeta('meta[name="description"]', metaTag('name', 'description'), seo.description)
    setMeta('meta[name="robots"]', metaTag('name', 'robots'), seo.indexable ? null : 'noindex, follow')
    setMeta('meta[property="og:title"]', metaTag('property', 'og:title'), seo.title)
    setMeta('meta[property="og:description"]', metaTag('property', 'og:description'), seo.description)
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
  }, [detail])

  return (
    <div className="detail-panel">
      <button className="detail-back" onClick={onBack}>
        ← Back to search
      </button>

      {status === 'loading' && <p className="status-line">Loading property…</p>}
      {status === 'error' && <p className="status-line error">{errorMessage}</p>}

      {status === 'ready' && detail && (
        <>
          <div className="detail-header">
            <h1>{detail.address}</h1>
            <p className="property-type">
              {detail.property_type.replace('_', ' ')}
              {detail.unit_count ? ` · ${detail.unit_count} units` : ''}
            </p>
            <p className="empty-state">
              Information is compiled from public records and renter reports
              for general reference only. It may be incomplete or out of date
              and is not legal advice.
            </p>
          </div>

          <section className="detail-section">
            <h2>Ownership</h2>
            {detail.owners.length === 0 && (
              <p className="empty-state">No ownership record on file yet.</p>
            )}
            {detail.owners.map((owner) => (
              <div className="owner-row" key={owner.entity_id}>
                <div className="name">{owner.entity_name}</div>
                <div>
                  {owner.entity_type} · {owner.relationship_type}
                  {' · '}
                  {owner.verification_status === 'verified' ? (
                    <span className="verified">Matches public record</span>
                  ) : (
                    <span className="pending">Not yet confirmed</span>
                  )}
                </div>
              </div>
            ))}
          </section>

          <section className="detail-section">
            <h2>Building Violations ({detail.violations.length})</h2>
            {detail.violations.length === 0 && (
              <p className="empty-state">No violations appear in the public records we have reviewed for this property. This may not reflect current or unreported conditions.</p>
            )}
            {detail.violations.map((v) => (
              <div className="violation-row" key={v.violation_id}>
                <div className="top-line">
                  <span>{v.source.replace(/_/g, ' ')}</span>
                  <span>{v.violation_date ?? 'date unknown'}</span>
                </div>
                {v.description && <div className="description">{v.description}</div>}
                {v.status && <div className="description">Status: {v.status}</div>}
              </div>
            ))}
          </section>

          <section className="detail-section">
            <h2>Renter Reports ({detail.published_reports.length})</h2>
            {detail.published_reports.length === 0 && (
              <p className="empty-state">
                No published renter reports yet. Reports are reviewed
                before appearing here.
              </p>
            )}
            {detail.published_reports.map((r) => (
              <div className="report-row" key={r.report_id}>
                <div className="top-line">
                  <span>{r.report_sentiment}</span>
                  <span>{r.incident_month}</span>
                  <span className={`evidence-badge evidence-${r.evidence_status}`}>
                    {EVIDENCE_LABELS[r.evidence_status] || EVIDENCE_LABELS.none}
                  </span>
                </div>
                <div className="description">{r.description_clean}</div>
                <div className="tag-list">
                  {r.category_tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Links out to the official registries rather than TT asserting
              anything itself: the renter searches this address and the
              landlord / manager names above against the source directly. */}
          <section className="detail-section safety-section">
            <h2>Safety Check</h2>
            <p>
              Before you sign, look up this address and the names of the landlord, property
              manager, and anyone else who will have access to your unit on the official
              sex offender registries:
            </p>
            <ul className="safety-links">
              <li>
                <a href="https://sor.isp.illinois.gov/" target="_blank" rel="noopener noreferrer">
                  Illinois State Police Sex Offender Registry
                </a>{' '}
                &mdash; search by name or by address and radius
              </li>
              <li>
                <a href="https://www.nsopw.gov/" target="_blank" rel="noopener noreferrer">
                  National Sex Offender Public Website (U.S. DOJ)
                </a>{' '}
                &mdash; searches every state, for owners or managers who live elsewhere
              </li>
            </ul>
            <p className="field-hint">
              You have the right to ask who holds keys to your unit and when they may enter.
              Chicago landlords generally must give notice before non-emergency entry.
            </p>
          </section>
        </>
      )}
    </div>
  )
}
