import { Link } from 'react-router-dom'

const PHASES = [
  {
    label: 'Phase 1 — Live Now',
    items: [
      'Property search and public records lookup',
      'Report a Housing Concern (anonymous, moderated)',
      'Housing Resource Center with free interactive guides',
      'Newsletter and waitlist signup',
    ],
  },
  {
    label: 'Phase 2 — Coming Soon',
    items: [
      'Transparency Score™ for every property',
      'Property and property manager profiles',
      'Tenant dashboard and saved properties',
      'AI Housing Assistant',
    ],
  },
  {
    label: 'Phase 3 — On the Horizon',
    items: [
      'Interactive Chicago Housing Map',
      'Housing Data Dashboard for policymakers and journalists',
      'Research portal and annual transparency report',
      'Mobile app and API for researchers',
    ],
  },
]

export default function About() {
  return (
    <div className="about-page">

      <section className="about-hero">
        <div>
          <span className="section-eyebrow">Our Story</span>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'center' }}>
            <Link to="/search" className="cta-primary">Search Properties</Link>
            <Link to="/#join-movement" className="cta-secondary">
              Join the Movement
            </Link>
            <Link to="/founder" className="cta-primary">Meet the Founder</Link>
          </div>
          <h1>Built for renters, by someone who's been one.</h1>
          <p>
            Tenant Transparency was founded in Chicago with one belief: every
            renter deserves access to the same information landlords already
            have before a lease is signed.
          </p>
          <p>
            We built the platform we wish had existed — one that surfaces
            verified property records, renter experiences, and tenant rights
            in plain language, all in one place and always free for renters.
          </p>
        </div>
        <div style={{ background: 'var(--bg-warm)', borderRadius: 'var(--radius-xl)', padding: '40px', border: '1px solid var(--border)' }}>
          <div className="section-eyebrow" style={{ marginBottom: '20px' }}>Who we serve</div>
          {[
            'Working individuals and families',
            'Single parents navigating tight budgets',
            'Seniors on fixed incomes',
            'Students renting for the first time',
            'Veterans transitioning to civilian housing',
            'Anyone who has ever faced hidden fees, poor conditions, or an unresponsive landlord',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', gap: '10px', marginBottom: '14px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>✓</span>
              <span style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 'var(--space-16)' }}>
        <span className="section-eyebrow">Mission &amp; Vision</span>
        <div className="about-mission-grid">
          <div className="about-mission-card">
            <h3>Our Mission</h3>
            <p>
              Empowering renters through technology, education, research, and
              transparency so they can make informed housing decisions before
              they sign a lease.
            </p>
          </div>
          <div className="about-mission-card">
            <h3>Our Vision</h3>
            <p>
              A future where housing transparency is the standard, renters are
              informed before they lease, and trust is restored throughout the
              rental process.
            </p>
          </div>
          <div className="about-mission-card">
            <h3>How We Verify</h3>
            <p>
              Every property record is checked against public data sources
              including the Chicago Data Portal, Cook County Assessor, and
              municipal violation databases. Renter reports are reviewed by
              a moderation team before publication. We never display
              unverified claims.
            </p>
          </div>
          <div className="about-mission-card">
            <h3>Our Commitment to Privacy</h3>
            <p>
              Renter reports are anonymous. We strip personally identifiable
              information before storage. We do not sell user data. Read our{' '}
              <Link to="/privacy">full Privacy Policy</Link> for details.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 'var(--space-16)' }}>
        <span className="section-eyebrow">Roadmap</span>
        <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-8)' }}>
          Where we're going
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {PHASES.map((phase, i) => (
            <div
              key={phase.label}
              style={{
                background: i === 0 ? 'var(--teal-light)' : 'var(--bg-warm)',
                border: `1px solid ${i === 0 ? 'rgba(42,125,110,0.25)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-8)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <span className={`phase-tag${i > 0 ? ' coming' : ''}`}>
                  {i === 0 ? 'Live Now' : i === 1 ? 'Coming Soon' : 'On the Horizon'}
                </span>
                <strong style={{ fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{phase.label}</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
                {phase.items.map((item) => (
                  <div key={item} style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0, fontSize: 'var(--text-sm)' }}>→</span>
                    <span style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" style={{ background: 'var(--teal)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12)', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--white)', marginBottom: 'var(--space-3)' }}>Get in touch</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-md)', marginBottom: 'var(--space-6)' }}>
          Questions, partnerships, press inquiries, or feedback — we want to hear from you.
        </p>
        <a href="mailto:info@tenanttransparency.com" className="cta-secondary">
          info@tenanttransparency.com
        </a>
        <address style={{ marginTop: 'var(--space-6)', color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', fontStyle: 'normal', lineHeight: 1.6 }}>
          Tenant Transparency<br />
          1 E Erie St, Suite 525-3114<br />
          Chicago, IL 60611
        </address>
      </section>

    </div>
  )
}
