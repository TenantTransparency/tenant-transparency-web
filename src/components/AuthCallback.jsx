import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { storeRenterTokens } from '../renterSession.js'

// Landing page for Google sign-in. The API's oauth_callback redirects here
// with the session tokens in the URL #fragment (never sent to any server).
// Read them once, then scrub them from the address bar and history right
// away so they can't be copied, bookmarked, or reopened from history.
export default function AuthCallback() {
  const navigate = useNavigate()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1))
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    window.history.replaceState(null, '', window.location.pathname)

    if (!access_token || !refresh_token) {
      setFailed(true)
      return
    }
    storeRenterTokens({ access_token, refresh_token })
    navigate('/', { replace: true })
  }, [navigate])

  return (
    <div className="page-content">
      {failed ? (
        <p className="status-line error">
          Sign-in didn&rsquo;t complete. <Link to="/">Return home</Link> and try again.
        </p>
      ) : (
        <p className="status-line">Signing you in…</p>
      )}
    </div>
  )
}
