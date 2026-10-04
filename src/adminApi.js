// Auth-aware client for the admin routes (login/refresh + moderation
// queue). Kept separate from api.js since these calls carry a bearer
// token and 401s mean "log in again", not "show an error banner" —
// different failure handling than the public search endpoints.

import { API_BASE } from './config.js'

const ACCESS_TOKEN_KEY = 'tt_admin_access_token'
const REFRESH_TOKEN_KEY = 'tt_admin_refresh_token'

export function getStoredTokens() {
  return {
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  }
}

function storeTokens({ access_token, refresh_token }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access_token)
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    // Backend deliberately returns the same message for "no such user"
    // and "wrong password" — don't try to distinguish them here either.
    throw new Error(res.status === 401 ? 'Invalid email or password.' : `Login failed (${res.status}).`)
  }
  const data = await res.json()
  storeTokens(data)
  return data
}

async function refreshAccessToken() {
  const { refreshToken } = getStoredTokens()
  if (!refreshToken) throw new Error('not logged in')

  const res = await fetch(`${API_BASE}/api/admin/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  if (!res.ok) {
    clearTokens()
    throw new Error('session expired')
  }
  const data = await res.json()
  storeTokens(data)
  return data.access_token
}

/// Authenticated request helper. Access tokens are short-lived (15 min
/// server-side) — on a 401 this refreshes once and retries the request
/// exactly once, rather than looping. A second 401 after a fresh refresh
/// means the session is genuinely dead, so it surfaces as a real error
/// instead of retrying forever.
async function authedRequest(path, options = {}) {
  const { accessToken } = getStoredTokens()
  if (!accessToken) throw new Error('not logged in')

  const doFetch = (token) =>
    fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    })

  let res = await doFetch(accessToken)

  if (res.status === 401) {
    const newAccessToken = await refreshAccessToken()
    res = await doFetch(newAccessToken)
  }

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText}${body ? `: ${body}` : ''}`)
  }

  // 200 with no body (approve/reject) vs. 200 with a JSON body (the
  // pending list) — check before parsing so approve/reject don't throw
  // trying to JSON-parse an empty response.
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export function listPendingReports() {
  return authedRequest('/api/admin/reports/pending')
}

export function approveReport(reportId, notes, evidenceVerified = false) {
  return authedRequest(`/api/admin/reports/${reportId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes: notes || null, evidence_verified: evidenceVerified }),
  })
}

export function rejectReport(reportId, notes) {
  return authedRequest(`/api/admin/reports/${reportId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes: notes || null }),
  })
}
