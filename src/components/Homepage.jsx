import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { submitNewsletterSignup } from '../api.js'
// Link is used in neighborhood chips, voices CTA, resource cards, and footer CTAs

const NEIGHBORHOODS = [
  'Lakeview', 'Pilsen', 'Hyde Park', 'Logan Square',
  'Bronzeville', 'West Loop', 'Woodlawn', 'Wicker Park',
  'South Shore', 'Humboldt Park', 'Bridgeport', 'Edgewater',
]

// Popular names -> the official Chicago community area page that covers them.
// Bronzeville spans several community areas, so it goes to the full list.
const NEIGHBORHOOD_LINKS = {
  Lakeview: '/neighborhood/lake-view',
  Pilsen: '/neighborhood/lower-west-side',
  'West Loop': '/neighborhood/near-west-side',
  'Wicker Park': '/neighborhood/west-town',
  Bronzeville: '/neighborhoods',
}
const neighborhoodLink = (name) =>
  NEIGHBORHOOD_LINKS[name] || `/neighborhood/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

const VOICES = [
  {
    quote: "I found out about a lead violation before I ever toured the unit. This site saved me from making a huge mistake.",
    name: 'Chicago Renter',
    location: 'Logan Square',
  },
  {
    quote: "The fee breakdown alone saved me $400. I went in knowing exactly what to push back on before I even sat down.",
    name: 'Chicago Renter',
    location: 'Pilsen',
  },
  {
    quote: "Finally a place to put concerns on the record. My landlord can't pretend the mold reports don't exist anymore.",
    name: 'Chicago Renter',
    location: 'Bronzeville',
  },
]

const NEWS = [
  {
    tag: 'Policy',
    title: 'The Protecting Renters Ordinance (PRO): What Chicago Tenants Need to Know',
    date: 'Jul 2026',
    href: '/chicago-tenant-ordinances-updates/chicago-protecting-renters-ordinance.html',
    image: '/chicago-tenant-ordinances-updates/pro.png',
    imageAlt: 'Chicago City Hall during an ordinance committee hearing',
  },
  {
    tag: 'Policy',
    title: 'The FAIR Ordinance: What Chicago Tenants Need to Know',
    date: 'Jul 2026',
    href: '/chicago-tenant-ordinances-updates/chicago-fair-ordinance.html',
    image: '/chicago-tenant-ordinances-updates/fair.png',
    imageAlt: 'Chicago City Council members reviewing the FAIR ordinance',
  },
  {
    tag: 'Rights',
    title: 'Chicago Renters: Your Landlord May Have Fixed Your Rent. Here\'s What You May Be Owed.',
    date: 'Aug 2026',
    href: '/chicago-class-action-realpages/realpage-chicago-renters-guide.html',
    image: '/chicago-class-action-realpages/settlement.png',
    imageAlt: 'Illinois Attorney General Kwame Raoul at a press conference announcing Illinois joins the DOJ lawsuit against RealPage rent-fixing defendants',
  },
]

const RESOURCES = [
  { icon: '⚖️', title: "Tenant Rights Guide", desc: "An overview of tenant protections under Chicago law, in plain language.", href: '/chicago-renters-rights-guide' },
  { icon: '💸', title: "Hidden Fees", desc: "Common fees landlords may not lead with.", href: '/chicago-security-deposit-law' },
  { icon: '🚩', title: "Lease Red Flags", desc: "Know it before you sign it.", href: '/chicago-habitability-violations' },
  { icon: '❓', title: "FAQ", desc: "Answers to common renter questions.", href: '/resources' },
]

function SearchBar({ navigate, neighborhoods }) {
  const [q, setQ] = useState('')
  const [neighborhood, setNeighborhood] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (neighborhood) params.set('neighborhood', neighborhood)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <form className="search-bar" role="search" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Address or ZIP code"
        aria-label="Address or ZIP code"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <select
        aria-label="Neighborhood"
        value={neighborhood}
        onChange={(e) => setNeighborhood(e.target.value)}
      >
        <option value="">Neighborhood</option>
        {neighborhoods.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
      <button type="submit">Search</button>
    </form>
  )
}

export default function Homepage() {
  const [heroQuery, setHeroQuery] = useState('')
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [signupStatus, setSignupStatus] = useState('idle')
  const [signupError, setSignupError] = useState('')
  const navigate = useNavigate()

  function handleHeroSearch(e) {
    e.preventDefault()
    const q = heroQuery.trim()
    navigate(q.length >= 3 ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  async function handleEmailSignup(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSignupStatus('loading')
    setSignupError('')
    try {
      await submitNewsletterSignup({ email: email.trim() })
      setEmailSubmitted(true)
      setSignupStatus('done')
    } catch (err) {
      setSignupStatus('error')
      setSignupError(err.message)
    }
  }

  return (
    <div className="homepage">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-image-side">
          <img
            src="/hero-original.png"
            alt="A family and community members gathered around a table outside a Chicago brick apartment building, smiling as a woman signs a lease"
            className="hero-photo"
          />
          <div className="hero-image-overlay" />
        </div>

        <div className="hero-content-side">
          <div className="hero-eyebrow">
            <span /> Built for Chicago Renters
          </div>
          <h1>
            Know Before<br />
            <em>You Lease.</em>
          </h1>
          <p className="hero-sub">
            Landlords often know a lot about you. It&rsquo;s time you could
            learn more about them &mdash; public property records, renter
            reports, and tenant rights information, all in one place.
          </p>

          <form className="hero-search" onSubmit={handleHeroSearch}>
            <input
              type="text"
              placeholder="Search address, landlord, or ZIP code..."
              value={heroQuery}
              onChange={(e) => setHeroQuery(e.target.value)}
              aria-label="Property or landlord search"
            />
            <button type="submit" className="cta-primary">Search</button>
          </form>

          <div className="hero-ctas">
            <Link to="/report-issue" className="cta-secondary">Report a Concern</Link>
            <a href="#join-movement" className="cta-ghost">
              Join the Movement &rarr;
            </a>
          </div>

          <div className="hero-trust">
            <div className="trust-item">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1L9 5.5H13.5L9.75 8.5L11 13L7 10.25L3 13L4.25 8.5L0.5 5.5H5L7 1Z" fill="currentColor"/>
              </svg>
              Public Records
            </div>
            <div className="trust-item">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              Privacy-Focused
            </div>
            <div className="trust-item">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1.5C3.96 1.5 1.5 3.96 1.5 7S3.96 12.5 7 12.5 12.5 10.04 12.5 7 10.04 1.5 7 1.5zm-1 7.5L3.5 6.5l1.06-1.06L6 6.88l3.44-3.44L10.5 4.5 6 9z" fill="currentColor"/>
              </svg>
              Always Free for Renters
            </div>
          </div>
        </div>
      </section>

      {/* ── Value Props ── */}
      <section className="value-props">
        <div className="value-props-inner">
          <div className="value-props-header">
            <span className="section-eyebrow">Why Tenant Transparency</span>
            <h2>Not a listings site. A transparency resource.</h2>
            <p>
              We built the platform we wish renters had &mdash; one that
              puts public-record information, not landlord marketing copy, at the center.
            </p>
          </div>
          <div className="value-props-grid">
            <div className="value-card">
              <div className="value-card-icon">✓</div>
              <h3>Grounded in public records</h3>
              <p>
                We draw on public records and review renter reports before
                they are published. Information is provided for general
                reference, may be incomplete or out of date, and is not a
                substitute for your own research.
              </p>
            </div>
            <div className="value-card">
              <div className="value-card-icon">📋</div>
              <h3>Rights, in plain English</h3>
              <p>
                The fees, clauses, and protections landlords hope you never
                look up &mdash; explained clearly before you sign anything.
              </p>
            </div>
            <div className="value-card">
              <div className="value-card-icon">🏛️</div>
              <h3>A public record</h3>
              <p>
                Renters share their experiences, and reports that meet our
                guidelines are kept on the property&rsquo;s page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search Section ── */}
      <section className="search-section" id="property-search">
        <div className="search-section-inner">
          <div className="search-section-header">
            <h2>Search Properties</h2>
            <span className="phase-tag">Live &mdash; Phase 1</span>
          </div>
          <SearchBar navigate={navigate} neighborhoods={NEIGHBORHOODS} />
        </div>
      </section>

      {/* ── Transparency Score Teaser ── */}
      <section className="score-teaser" id="transparency-score">
        <div className="score-teaser-inner">
          <div className="score-visual">
            <div className="score-ring-wrap">
              <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#e2e5eb" strokeWidth="16" />
                <circle
                  cx="100" cy="100" r="80"
                  fill="none"
                  stroke="#2a7d6e"
                  strokeWidth="16"
                  strokeDasharray={`${2 * Math.PI * 80 * 0.82} ${2 * Math.PI * 80}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="score-ring-value">
                <span className="score-num">82</span>
                <span className="score-label">Transparency<br/>Score</span>
              </div>
            </div>
            <div className="score-breakdown">
              {[
                { label: 'Violations', pct: 65, warn: true },
                { label: 'Reports', pct: 90, warn: false },
                { label: 'Reviewed', pct: 80, warn: false },
                { label: 'Response', pct: 70, warn: false },
              ].map((b) => (
                <div className="score-bar-row" key={b.label}>
                  <span className="score-bar-label">{b.label}</span>
                  <div className="score-bar-track">
                    <div
                      className={`score-bar-fill${b.warn ? ' warn' : ''}`}
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                  <span>{b.pct}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="score-content">
            <span className="phase-tag coming">Coming Phase 2</span>
            <h2>The Transparency Score&trade;</h2>
            <p>
              A single at-a-glance indicator, based on public records and
              renter reports, that may help you compare properties as one
              part of your research. Scores are informational only. The
              example shown is illustrative.
            </p>
            <ul className="score-features">
              <li>Building code violations from public records</li>
              <li>Moderated renter reports and sentiment</li>
              <li>Reported landlord responsiveness</li>
              <li>Ownership information, including LLC structures where available</li>
            </ul>
            <a href="#join-movement" className="cta-primary">
              Get notified at launch
            </a>
          </div>
        </div>
      </section>

      {/* ── Housing News ── */}
      <section className="news-section" id="housing-news">
        <div className="news-section-inner">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Housing News</span>
              <h2>What renters need to know.</h2>
            </div>
            <a href="#join-movement" className="cta-ghost">
              Get updates &rarr;
            </a>
          </div>
          <div className="news-grid">
            {NEWS.map((n) => (
              n.href
                ? (
                  <a key={n.title} href={n.href} className="news-card">
                    {n.image
                      ? <img src={n.image} alt={n.imageAlt} className="news-card-image" style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                      : <div className="news-card-image">Article image</div>
                    }
                    <div className="news-card-body">
                      <div className="news-card-tag">{n.tag}</div>
                      <h3>{n.title}</h3>
                      <div className="news-card-date">{n.date}</div>
                    </div>
                  </a>
                )
                : (
                  <a key={n.title} href="#join-movement" className="news-card">
                    <div className="news-card-image">Article image</div>
                    <div className="news-card-body">
                      <div className="news-card-tag">{n.tag}</div>
                      <h3>{n.title}</h3>
                      <div className="news-card-date">{n.date}</div>
                    </div>
                  </a>
                )
            ))}
          </div>
        </div>
      </section>

      {/* ── Resource Center ── */}
      <section className="resource-section" id="resource-center">
        <div className="resource-section-inner">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Free Guides</span>
              <h2>Housing Resource Center</h2>
              <p>Plain-language guides to Chicago tenant rights &mdash; each with a free interactive tool.</p>
            </div>
            <Link to="/resources" className="cta-ghost">View all guides &rarr;</Link>
          </div>
          <div className="resource-grid">
            {RESOURCES.map((r) => (
              <a key={r.title} href={r.href} className="resource-card">
                <div className="resource-card-icon">{r.icon}</div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
                <span className="resource-card-cta">Read guide &rarr;</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Neighborhood Hub ── */}
      <section className="neighborhood-section" id="neighborhoods">
        <div className="neighborhood-section-inner">
          <img
            src="/neighborhood-original.png"
            alt="A quiet Chicago residential street at golden hour with brick three-flats, mature trees, and a bicycle leaning against a fence"
            className="neighborhood-photo"
          />
          <div className="neighborhood-content">
            <span className="section-eyebrow">Chicago Neighborhood Hub</span>
            <h2>Find your neighborhood.</h2>
            <p>
              Browse by neighborhood to see what public records show in your
              area, then search a specific building before you lease.
            </p>
            <div className="neighborhood-chips">
              {NEIGHBORHOODS.map((n) => (
                <Link key={n} to={neighborhoodLink(n)} className="neighborhood-chip">
                  {n}
                </Link>
              ))}
            </div>
            <Link to="/neighborhoods" className="cta-primary">Explore all neighborhoods</Link>
          </div>
        </div>
      </section>

      {/* ── Community Voices ── */}
      <section className="voices-section" id="community-voices">
        <div className="voices-section-inner">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Community Voices</span>
              <h2>Renter voices.</h2>
            </div>
            <Link to="/report-issue" className="cta-secondary">Share your experience</Link>
          </div>
          <div className="voices-grid">
            {VOICES.map((v, i) => (
              <div className="voice-card" key={i}>
                <div className="voice-quote-mark">&ldquo;</div>
                <blockquote>{v.quote}</blockquote>
                <div className="voice-meta">
                  <strong>{v.name}</strong>
                  <span>{v.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Research & Data Teaser ── */}
      <section className="research-teaser" id="research-data">
        <div className="research-teaser-inner">
          <div className="research-content">
            <span className="phase-tag coming">Coming Phase 3</span>
            <h2>Research &amp; Data</h2>
            <p>
              A planned data dashboard for policymakers and journalists
              &mdash; aggregated, anonymized, and built on public records.
            </p>
            <a href="#join-movement" className="cta-secondary">
              Join the waitlist
            </a>
          </div>
          <div className="research-preview" aria-hidden="true">
            {[
              { label: 'Average violations per property', pct: 62 },
              { label: 'Reports resolved within 90 days', pct: 44 },
              { label: 'Properties with LLC ownership', pct: 78 },
              { label: 'Renters with prior issue history', pct: 55 },
            ].map((b) => (
              <div className="research-preview-bar" key={b.label}>
                <div className="research-preview-label">{b.label}</div>
                <div className="research-preview-track">
                  <div className="research-preview-fill" style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Join the Movement ── */}
      <section className="join-section" id="join-movement">
        <div className="join-section-inner">
          <h2>Join the Movement</h2>
          <p>
            Chicago&rsquo;s rental market is changing. Get updates on new
            features, policy changes, and tenant rights in your neighborhood
            before everyone else does.
          </p>
          {emailSubmitted ? (
            <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
              Thanks &mdash; you're on the list.
            </p>
          ) : (
            <form className="join-form" onSubmit={handleEmailSignup}>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                required
              />
              <button type="submit" disabled={signupStatus === 'loading'}>
                {signupStatus === 'loading' ? 'Signing up…' : 'Sign Up'}
              </button>
            </form>
          )}
          {signupStatus === 'error' && (
            <p className="status-line error" style={{ marginTop: '12px' }}>{signupError}</p>
          )}
        </div>
      </section>

    </div>
  )
}
