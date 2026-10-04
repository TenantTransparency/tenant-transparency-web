import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { searchProperties } from '../api.js'

export default function PropertySearch({ onSelectProperty }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [results, setResults] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [errorMessage, setErrorMessage] = useState('')

  const runSearch = useCallback(async (term) => {
    const trimmed = term.trim()
    if (trimmed.length < 3) {
      setStatus('error')
      setErrorMessage('Enter at least 3 characters to search.')
      return
    }
    setStatus('loading')
    setResults(null)
    try {
      const data = await searchProperties(trimmed)
      setResults(data)
      setStatus('idle')
      // keep the URL in sync so the browser back button works
      setSearchParams({ q: trimmed }, { replace: true })
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message)
    }
  }, [setSearchParams])

  // Auto-search if the page loaded with ?q= already set (e.g. from the
  // homepage hero search bar or a neighborhood chip link)
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && q.trim().length >= 3) {
      runSearch(q)
    }
    // only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    runSearch(query)
  }

  return (
    <div className="search-panel">
      <h1>Search Properties</h1>
      <p className="subhead">
        Look up a Chicago address, landlord, or property manager to see
        violations, ownership records, and renter reports before you sign.
      </p>

      <form className="search-box" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Address, landlord name, or ZIP code"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search properties"
          autoFocus
        />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Searching…' : 'Search'}
        </button>
      </form>

      {status === 'error' && (
        <p className="status-line error">{errorMessage}</p>
      )}

      {status === 'loading' && (
        <p className="status-line">Searching public records…</p>
      )}

      {results && results.length === 0 && (
        <div className="search-empty">
          <p className="empty-state">
            No properties matched that search yet. Public records may not
            cover this building — it may be added as data syncs.
          </p>
          <p className="empty-state-sub">
            You can still{' '}
            <Link to="/report-issue" className="empty-report-link">
              report an issue at any address
            </Link>
            {' '}— it doesn't need to be in our database first.
          </p>
        </div>
      )}

      {results && results.length > 0 && (
        <>
          <p className="results-count">
            {results.length} propert{results.length === 1 ? 'y' : 'ies'} found
          </p>
          <div className="result-list">
            {results.map((p) => (
              <div
                key={p.property_id}
                className="result-card"
                onClick={() => onSelectProperty(p.property_id, p.address)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectProperty(p.property_id, p.address)}
              >
                <div className="address">{p.address}</div>
                <div className="meta">
                  <span className={`badge violations${p.violation_count === 0 ? ' clean' : ''}`}>
                    {p.violation_count} violation{p.violation_count === 1 ? '' : 's'}
                  </span>
                  <span className={`badge reports${p.published_report_count === 0 ? ' clean' : ''}`}>
                    {p.published_report_count} renter report{p.published_report_count === 1 ? '' : 's'}
                  </span>
                  <span className="property-type">
                    {p.property_type.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
