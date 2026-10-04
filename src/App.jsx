import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom'
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
import PrivacyPolicy from './components/PrivacyPolicy.jsx'
import TermsOfUse from './components/TermsOfUse.jsx'
import AuthCallback from './components/AuthCallback.jsx'
import SeoHead from './SeoHead.jsx'
import Neighborhood, { NeighborhoodIndex } from './components/Neighborhoods.jsx'
import { propertyPath, propertyIdFromSlug } from './propertyUrl.js'

// Code-split: MapLibre is most of the bundle weight and only /map needs
// it; the admin console is only ever opened by moderators. Neither should
// be downloaded by every visitor to the homepage.
const NeighborhoodMap = lazy(() => import('./components/NeighborhoodMap.jsx'))
const AdminApp = lazy(() => import('./AdminApp.jsx'))
const routeFallback = <p className="status-line">Loading…</p>

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
  const navigate = useNavigate()
  // Each property has its own URL so it can be bookmarked, shared and indexed.
  return <PropertySearch onSelectProperty={(id, address) => navigate(propertyPath(id, address))} />
}

function PropertyPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const propertyId = propertyIdFromSlug(slug)
  if (!propertyId) {
    return (
      <div className="detail-panel">
        <p className="status-line error">That property link is not valid.</p>
        <Link to="/search">Search properties</Link>
      </div>
    )
  }
  return <PropertyDetail propertyId={propertyId} onBack={() => navigate('/search')} />
}

// "/" and all public-facing routes get full site chrome (nav + footer).
// "/admin" is deliberately bare — it's a back-office tool, not a renter page.
// "/beta" and "/founding-community" get full site chrome too (so someone
// filling them out can jump back to the rest of the site if they need to
// recheck something) but stay direct-link-only — Sheenita asked that they
// not appear as links anywhere in the main navigation itself.
// Routes only, so the build-time prerender (entry-server.jsx) can render the
// same tree inside a StaticRouter.
export function AppRoutes() {
  return (
    <>
      <ScrollToHash />
      <SeoHead />
      <Routes>
        <Route path="/" element={<SiteChrome><Homepage /></SiteChrome>} />
        <Route path="/search" element={<SiteChrome><div className="page-content"><RenterSearchFlow /></div></SiteChrome>} />
        <Route path="/property/:slug" element={<SiteChrome><div className="page-content"><PropertyPage /></div></SiteChrome>} />
        <Route path="/neighborhoods" element={<SiteChrome><NeighborhoodIndex /></SiteChrome>} />
        <Route path="/neighborhood/:slug" element={<SiteChrome><Neighborhood /></SiteChrome>} />
        <Route path="/report-issue" element={<SiteChrome><div className="page-content"><ReportIssue /></div></SiteChrome>} />
        <Route path="/resources" element={<SiteChrome><ResourceCenter /></SiteChrome>} />
        <Route path="/about" element={<SiteChrome><About /></SiteChrome>} />
        <Route path="/founder" element={<SiteChrome><Founder /></SiteChrome>} />
        <Route path="/support" element={<SiteChrome><SupportTT /></SiteChrome>} />
        <Route path="/map" element={<SiteChrome hideFooter><Suspense fallback={routeFallback}><NeighborhoodMap /></Suspense></SiteChrome>} />
        <Route path="/privacy" element={<SiteChrome><PrivacyPolicy /></SiteChrome>} />
        <Route path="/terms" element={<SiteChrome><TermsOfUse /></SiteChrome>} />
        <Route path="/beta" element={<SiteChrome><BetaTester /></SiteChrome>} />
        <Route path="/founding-community" element={<SiteChrome><FoundingCommunity /></SiteChrome>} />
        <Route path="/auth/callback" element={<SiteChrome><AuthCallback /></SiteChrome>} />
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
                <Suspense fallback={routeFallback}>
                  <AdminApp />
                </Suspense>
              </main>
            </div>
          }
        />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  )
}
