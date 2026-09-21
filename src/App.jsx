import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Homepage from './components/Homepage.jsx'
import PropertySearch from './components/PropertySearch.jsx'
import PropertyDetail from './components/PropertyDetail.jsx'
import SiteChrome from './components/SiteChrome.jsx'
import ReportIssue from './components/ReportIssue.jsx'
import ResourceCenter from './components/ResourceCenter.jsx'
import About from './components/About.jsx'
import Founder from './components/Founder.jsx'
import SupportTT from './components/SupportTT.jsx'
import BetaTester from './components/BetaTester.jsx'
import FoundingCommunity from './components/FoundingCommunity.jsx'
import NeighborhoodMap from './components/NeighborhoodMap.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import TermsOfUse from './components/TermsOfUse.jsx'
import AdminApp from './AdminApp.jsx'

// Handles in-app anchor links (e.g. /about#contact, /#housing-news) since
// react-router doesn't scroll to a hash target on its own the way a plain
// <a> would. Plain top-of-page scroll on hash-less navigations too.
function ScrollToHash() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])
  return null
}

function RenterSearchFlow() {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null)

  return selectedPropertyId ? (
    <PropertyDetail propertyId={selectedPropertyId} onBack={() => setSelectedPropertyId(null)} />
  ) : (
    <PropertySearch onSelectProperty={setSelectedPropertyId} />
  )
}

// "/" and all public-facing routes get full site chrome (nav + footer).
// "/admin" is deliberately bare — it's a back-office tool, not a renter page.
// "/beta" and "/founding-community" get full site chrome too (so someone
// filling them out can jump back to the rest of the site if they need to
// recheck something) but stay direct-link-only — Sheenita asked that they
// not appear as links anywhere in the main navigation itself.
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<SiteChrome><Homepage /></SiteChrome>} />
        <Route path="/search" element={<SiteChrome><div className="page-content"><RenterSearchFlow /></div></SiteChrome>} />
        <Route path="/report-issue" element={<SiteChrome><div className="page-content"><ReportIssue /></div></SiteChrome>} />
        <Route path="/resources" element={<SiteChrome><ResourceCenter /></SiteChrome>} />
        <Route path="/about" element={<SiteChrome><About /></SiteChrome>} />
        <Route path="/founder" element={<SiteChrome><Founder /></SiteChrome>} />
        <Route path="/support" element={<SiteChrome><SupportTT /></SiteChrome>} />
        <Route path="/map" element={<SiteChrome hideFooter><NeighborhoodMap /></SiteChrome>} />
        <Route path="/privacy" element={<SiteChrome><PrivacyPolicy /></SiteChrome>} />
        <Route path="/terms" element={<SiteChrome><TermsOfUse /></SiteChrome>} />
        <Route path="/beta" element={<SiteChrome><BetaTester /></SiteChrome>} />
        <Route path="/founding-community" element={<SiteChrome><FoundingCommunity /></SiteChrome>} />
        <Route
          path="/admin"
          element={
            <div className="admin-shell">
              <header className="admin-shell-header">
                <Link to="/" className="brand-link">
                  TENANT TRANSPARENCY — Admin
                </Link>
              </header>
              <main className="app-main page-content">
                <AdminApp />
              </main>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
