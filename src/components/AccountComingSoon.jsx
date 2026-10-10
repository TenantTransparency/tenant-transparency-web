import { Link } from 'react-router-dom'

export default function AccountComingSoon() {
  return (
    <div className="page-content" style={{ textAlign: 'center', padding: '64px 16px' }}>
      <div style={{ fontSize: '2.5rem' }} aria-hidden="true">👤</div>
      <h1>Accounts are coming soon</h1>
      <p style={{ maxWidth: 480, margin: '12px auto 24px' }}>
        You don&rsquo;t need an account to search properties, read the guides, or
        report a concern. Accounts are on the way.
      </p>
      <Link to="/search" className="cta-primary">Search properties</Link>
    </div>
  )
}
