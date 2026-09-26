import { Link } from 'react-router-dom'

export default function Founder() {
  return (
    <div className="founder-page">

      <section className="founder-hero">
        <div>
          <span className="section-eyebrow">Founder &amp; CEO</span>
          <h1>Sheenita Robinson</h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-soft)', maxWidth: '600px' }}>
            Building the renter-centered housing transparency ecosystem that should have existed from the start.
          </p>
        </div>
      </section>

      <section className="founder-intro">
        <div className="founder-photo">
          <img src="/founder-sheenita.png" alt="Sheenita Robinson" />
        </div>
        <div className="founder-intro-text">
          <p>
            Sheenita Robinson is the Founder and CEO of Tenant Transparency, a housing technology company built around one simple belief: renters deserve to know before they lease.
          </p>
          <p>
            A Chicago native, she brings together lived experience, organizational leadership, operations, education, and community development to tackle one of the rental housing market's most overlooked problems: the information imbalance between landlords and renters. They get your full biography. You get their carefully curated brochure.
          </p>
          <p>
            Over the course of approximately 17 moves throughout Chicago, Sheenita experienced firsthand how little information renters can have before making one of the most consequential decisions for their families.
          </p>

          <div className="founder-stat-grid">
            <div className="founder-stat-card">
              <div className="founder-stat-num">17+</div>
              <div className="founder-stat-label">moves across Chicago</div>
            </div>
            <div className="founder-stat-card">
              <div className="founder-stat-num">1,000+</div>
              <div className="founder-stat-label">members in Report My Landlord</div>
            </div>
            <div className="founder-stat-card">
              <div className="founder-stat-num">2</div>
              <div className="founder-stat-label">graduate &amp; doctoral degrees in progress</div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-8)', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
              Quick facts
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <li style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                <strong>Chicago native</strong> who has moved 17+ times, experiencing the rental market firsthand
              </li>
              <li style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                Founded <strong>Report My Landlord</strong> on Nextdoor, which grew to 1,000+ members before becoming Tenant Transparency
              </li>
              <li style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                <strong>MBA in Human Resource Management</strong> from Roosevelt University
              </li>
              <li style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                <strong>Bachelor's degree in Communication and Education</strong> from Northeastern Illinois University (Cum Laude, McNair Scholar)
              </li>
              <li style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                Pursuing <strong>Doctorate in Interdisciplinary Leadership</strong> at Roosevelt University, with focus on housing equity and community development
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 'var(--space-8)' }}>
        <span className="section-eyebrow">The Problem She Lived</span>
        <div style={{ maxWidth: 'var(--content-max)' }}>
          <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.8, color: 'var(--ink)' }}>
            Throughout her moves, Sheenita and her family encountered mold, rodents, burst pipes, utility and water-service problems, unresponsive landlords, unexpected costs, and other challenges that made one thing increasingly clear: renters were being asked to disclose almost everything about themselves while having few meaningful ways to evaluate the home, landlord, or rental experience on the other side of the transaction.
          </p>
          <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.8, color: 'var(--ink)', marginTop: 'var(--space-6)' }}>
            This wasn't a gap in the market. It was a fundamental information imbalance that affected housing stability, employment, education access, and family security. Sheenita's insight didn't come from market research. It came from lived experience.
          </p>
        </div>
      </section>

      <div className="founder-pullquote">
        <p>
          "Housing is a human right, and when the housing system lacks transparency 
          and accountability, the people with the least power are often the ones 
          who bear the greatest burden. Tenant Transparency was created to give 
          renters access to information, a voice, and greater power to make informed 
          housing decisions."
        </p>
        <p>Sheenita Robinson</p>
      </div>

      <section className="founder-community-section">
        <div>
          <span className="section-eyebrow">From Report My Landlord to Tenant Transparency</span>
          <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.8, color: 'var(--ink)', marginTop: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
            Sheenita started with a simple Nextdoor group: <strong>Report My Landlord</strong>. It was a place for renters to share experiences and hold landlords accountable. It struck a nerve. The group grew to more than 1,000 members, all looking for the same thing: a way to know what they were walking into before they signed a lease.
          </p>
          <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.8, color: 'var(--ink)', marginBottom: 'var(--space-6)' }}>
            The more the community grew, the clearer the gap became. Renters didn't just need somewhere to report problems after they happened. They needed the information beforehand, before a bad landlord, a hidden fee, or an unsafe unit became their problem to deal with.
          </p>
          <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.8, color: 'var(--ink)' }}>
            That realization became Tenant Transparency: a broader solution built on the same foundation of renters helping renters, expanded into property intelligence, renter education, transparency tools, and resources that meet people before the lease is signed, not after.
          </p>
        </div>
        <img src="/meeting.png" alt="Sheenita with the Report My Landlord renter community" />
      </section>

      <section style={{ marginBottom: 'var(--space-16)' }}>
        <span className="section-eyebrow">Professional Background</span>
        <div className="about-mission-grid">
          <div className="about-mission-card">
            <h3>Community Leadership</h3>
            <p>
              Nonprofit and public sector operations, executive administration, and organizational development. Sheenita has built and scaled community programs, coordinated across stakeholders, and transformed systems thinking into real institutional change.
            </p>
          </div>
          <div className="about-mission-card">
            <h3>Education &amp; Training</h3>
            <p>
              Experience designing curriculum, mentoring, and creating pathways for others. A McNair Scholar who understands the barriers to education access and believes in building systems that open doors.
            </p>
          </div>
          <div className="about-mission-card">
            <h3>Project Management</h3>
            <p>
              Track record of managing complex initiatives across teams, timelines, and budgets. From initial concept through scaled implementation.
            </p>
          </div>
          <div className="about-mission-card">
            <h3>Community Engagement</h3>
            <p>
              Deep listening to what communities actually need, then building solutions that reflect that feedback. Relationships are the foundation.
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 'var(--space-16)' }}>
        <span className="section-eyebrow">What She Believes</span>
        <div style={{ background: 'var(--teal-light)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-10)', border: '1px solid rgba(42,125,110,0.25)' }}>
          <p style={{ fontSize: 'var(--text-lg)', lineHeight: 1.8, color: 'var(--teal-dark)', margin: 0 }}>
            Housing is not simply a transaction. It affects education, employment, transportation, financial security, family stability, and access to opportunity.
          </p>
          <p style={{ fontSize: 'var(--text-md)', lineHeight: 1.8, color: 'var(--ink-soft)', marginTop: 'var(--space-6)', marginBottom: 0 }}>
            Through Tenant Transparency, she is building toward a renter-centered housing information ecosystem designed to make transparency an expected standard in the rental housing market. One where the next renter doesn't have to find out the hard way.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--amber-light)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-12)', textAlign: 'center', marginBottom: 'var(--space-16)' }}>
        <h2 style={{ color: 'var(--amber-dark)', marginTop: 0 }}>Seventeen moves revealed the problem.</h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-lg)', marginBottom: 0 }}>
          Building Tenant Transparency is her answer.
        </p>
        <p style={{ color: 'var(--amber-dark)', fontSize: 'var(--text-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 'var(--space-6)' }}>
          Know Before You Lease™
        </p>
      </section>

      <section style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--text-md)', marginBottom: 'var(--space-6)' }}>
          Learn more about what we're building
        </p>
        <Link to="/about" className="cta-primary">
          About Tenant Transparency
        </Link>
      </section>

    </div>
  )
}
