import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo.jsx'

const WAITLIST_URL = 'https://forms.office.com/r/KDtrZz26ga'

const TABS = [
  { label: 'Home',       icon: '🏠', to: '/' },
  { label: 'Search',     icon: '🔍', to: '/search' },
  { label: 'Report',     icon: '➕', to: '/report-issue' },
  { label: 'Resources',  icon: '📚', to: '/resources' },
  { label: 'Account',    icon: '👤', href: WAITLIST_URL },
]

export default function SiteChrome({ children, hideFooter = false }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="site-chrome">
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="brand-link" onClick={() => setMenuOpen(false)}>
            <Logo className="brand-logo" />
          </Link>

          <nav className="main-nav" aria-label="Primary navigation">
            <Link to="/">Home</Link>
            <Link to="/search">Search Properties</Link>
            <Link to="/map">Neighborhoods</Link>
            <Link to="/resources">Resource Center</Link>
            <Link to="/about">About</Link>
            <Link to="/support">Get Involved</Link>
          </nav>

          <div className="header-right">
            <Link to="/report-issue" className="cta-primary" style={{ padding: '9px 18px', fontSize: '0.85rem' }}>
              Report a Concern
            </Link>
            <Link
              className="header-icon-btn"
              to="/#join-movement"
              aria-label="Get notified — join the waitlist"
              title="Get notified"
              onClick={() => setMenuOpen(false)}
            >
              🔔
            </Link>
            <button
              className="header-icon-btn menu-toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="mobile-menu" aria-label="Mobile navigation">
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/search" onClick={() => setMenuOpen(false)}>Search Properties</Link>
            <Link to="/map" onClick={() => setMenuOpen(false)}>Neighborhoods</Link>
            <Link to="/resources" onClick={() => setMenuOpen(false)}>Resource Center</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link to="/report-issue" onClick={() => setMenuOpen(false)}>Report a Concern</Link>
            <Link to="/support" onClick={() => setMenuOpen(false)}>Get Involved</Link>
            <Link to="/privacy" onClick={() => setMenuOpen(false)}>Privacy Policy</Link>
            <Link to="/terms" onClick={() => setMenuOpen(false)}>Terms of Use</Link>
          </nav>
        )}
      </header>

      <main className="app-main" id="main-content">
        {children}
      </main>

      {!hideFooter && (
        <footer className="site-footer" role="contentinfo">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="footer-logo-card">
                <Logo className="footer-logo" />
              </div>
              <p>
                Founded in Chicago. Building a future where housing transparency
                is the standard and every renter knows before they lease.
              </p>
            </div>
            <div className="footer-col">
              <h4>Platform</h4>
              <Link to="/">Home</Link>
              <Link to="/search">Search Properties</Link>
              <Link to="/resources">Resource Center</Link>
              <Link to="/report-issue">Report a Concern</Link>
              <Link to="/support">Support TT</Link>
              <a href="/#join-movement">Join the Waitlist</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <Link to="/about">About</Link>
              <Link to="/about#contact">Contact</Link>
              <a href="mailto:info@tenanttransparency.com">Partners</a>
              <a href="/#housing-news">Housing News</a>
              <a href="/#research-data">Research</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="copyright">
              &copy; {new Date().getFullYear()} Tenant Transparency. All rights reserved.
            </p>
            <div className="footer-legal-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Use</Link>
              <Link to="/about#contact">Contact</Link>
            </div>
          </div>
        </footer>
      )}

      <nav className="bottom-tab-bar" aria-label="Mobile tab bar">
        {TABS.map((tab) =>
          tab.to ? (
            <Link
              key={tab.label}
              to={tab.to}
              className={`tab-item${location.pathname === tab.to ? ' active' : ''}`}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </Link>
          ) : (
            <a
              key={tab.label}
              href={tab.href}
              target="_blank"
              rel="noopener noreferrer"
              className="tab-item"
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </a>
          )
        )}
      </nav>
    </div>
  )
}
