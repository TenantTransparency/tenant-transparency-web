import { useEffect, useState } from 'react'
import { getPropertyDetail } from '../api.js'

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
                  <span>{r.incident_date}</span>
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
        </>
      )}
    </div>
  )
}
