import { useEffect, useState } from 'react'
import { listPendingReports, approveReport, rejectReport, clearTokens } from '../adminApi.js'

export default function AdminModerationQueue({ onLoggedOut }) {
  const [reports, setReports] = useState(null)
  const [status, setStatus] = useState('loading') // loading | error | ready
  const [errorMessage, setErrorMessage] = useState('')
  // Per-report notes text and per-report "working" state, keyed by
  // report_id, so approving one report doesn't disable the whole list.
  const [notesByReport, setNotesByReport] = useState({})
  const [workingReportId, setWorkingReportId] = useState(null)
  const [verifiedByReport, setVerifiedByReport] = useState({})

  async function loadQueue() {
    setStatus('loading')
    try {
      const data = await listPendingReports()
      setReports(data)
      setStatus('ready')
    } catch (err) {
      setErrorMessage(err.message)
      setStatus('error')
      if (err.message === 'not logged in' || err.message === 'session expired') {
        clearTokens()
        onLoggedOut()
      }
    }
  }

  useEffect(() => {
    loadQueue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleDecision(reportId, decision) {
    setWorkingReportId(reportId)
    try {
      if (decision === 'approve') {
        await approveReport(reportId, notesByReport[reportId], !!verifiedByReport[reportId])
      } else {
        await rejectReport(reportId, notesByReport[reportId])
      }
      // Remove it from the list on success rather than re-fetching the
      // whole queue — the queue can be long, and the decision already
      // tells us what changed.
      setReports((prev) => prev.filter((r) => r.report_id !== reportId))
    } catch (err) {
      setErrorMessage(`Could not ${decision} this report: ${err.message}`)
    } finally {
      setWorkingReportId(null)
    }
  }

  function handleLogout() {
    clearTokens()
    onLoggedOut()
  }

  return (
    <div className="admin-queue">
      <div className="admin-queue-header">
        <h1>Reports Awaiting Review</h1>
        <button className="logout-link" onClick={handleLogout}>
          Log out
        </button>
      </div>

      {status === 'loading' && <p className="status-line">Loading queue…</p>}
      {status === 'error' && <p className="status-line error">{errorMessage}</p>}

      {status === 'ready' && reports && reports.length === 0 && (
        <p className="empty-state">Nothing waiting on review right now.</p>
      )}

      {status === 'ready' && reports && reports.length > 0 && (
        <div className="queue-list">
          {reports.map((r) => (
            <div className="queue-card" key={r.report_id}>
              <div className="queue-card-top">
                <div>
                  <div className="address">{r.address}</div>
                  {r.entity_name && <div className="entity-name">{r.entity_name}</div>}
                </div>
                <div className="submitted-meta">
                  {r.report_sentiment} · incident {r.incident_date}
                  {r.pii_scrub_status === 'flagged_pending_review' && (
                    <span className="pii-flag"> · PII was auto-redacted, please double check</span>
                  )}
                </div>
              </div>

              <div className="tag-list">
                {r.category_tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <p className="description">{r.description_clean}</p>

              <div className="evidence-block">
                {r.city_case_number ? (
                  <>
                    City case number: <strong>{r.city_case_number}</strong>
                    {r.evidence_status === 'verified_city_record' ? (
                      <span className="evidence-ok"> · matched automatically against this property&rsquo;s violation records</span>
                    ) : (
                      <label className="evidence-verify">
                        <input
                          type="checkbox"
                          checked={!!verifiedByReport[r.report_id]}
                          onChange={(e) =>
                            setVerifiedByReport((prev) => ({ ...prev, [r.report_id]: e.target.checked }))
                          }
                        />
                        I looked this number up on the city portal and it matches this address
                      </label>
                    )}
                  </>
                ) : (
                  <span>No city case number &mdash; will publish as a firsthand account.</span>
                )}
                {r.requires_city_record && r.evidence_status !== 'verified_city_record' && !verifiedByReport[r.report_id] && (
                  <div className="pii-flag">Heat/habitability claim: can&rsquo;t publish until the case number is verified.</div>
                )}
              </div>

              <label className="notes-label">
                Moderator notes (optional)
                <textarea
                  rows={2}
                  value={notesByReport[r.report_id] || ''}
                  onChange={(e) =>
                    setNotesByReport((prev) => ({ ...prev, [r.report_id]: e.target.value }))
                  }
                  placeholder="Reason for this decision, if any"
                />
              </label>

              <div className="decision-buttons">
                <button
                  className="approve-button"
                  disabled={workingReportId === r.report_id}
                  onClick={() => handleDecision(r.report_id, 'approve')}
                >
                  {workingReportId === r.report_id ? 'Working…' : 'Approve & Publish'}
                </button>
                <button
                  className="reject-button"
                  disabled={workingReportId === r.report_id}
                  onClick={() => handleDecision(r.report_id, 'reject')}
                >
                  {workingReportId === r.report_id ? 'Working…' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
