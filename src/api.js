// Thin fetch wrapper against the search API (Admin_Auth's public read
// routes — see Admin_Auth/search_handlers.rs). Base URL is configurable
// via VITE_API_BASE_URL so dev (localhost:3000) and prod (wherever the
// API actually deploys to) don't require code changes.

import { API_BASE } from './config.js'

async function request(path) {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText}${body ? `: ${body}` : ''}`)
  }
  return res.json()
}

async function postJson(path, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText}${body ? `: ${body}` : ''}`)
  }
  const data = await res.json()
  return { ...data, _status: res.status }
}

export function searchProperties(query) {
  return request(`/api/properties/search?q=${encodeURIComponent(query)}`)
}

export function getPropertyDetail(propertyId) {
  return request(`/api/properties/${propertyId}`)
}

export function searchEntities(query) {
  return request(`/api/entities/search?q=${encodeURIComponent(query)}`)
}

export function getCommunityAreaStats() {
  return request('/api/map/community-areas')
}

export async function submitReport(payload) {
  // Surfaces the status code so callers can distinguish 201 (resolved) from
  // 202 (saved but address is pending admin verification).
  return postJson('/api/reports', payload)
}

export function submitBetaFeedback(payload) {
  return postJson('/api/beta-feedback', payload)
}

export function submitFoundingCommunityResponse(payload) {
  return postJson('/api/founding-community', payload)
}

export function submitNewsletterSignup(payload) {
  return postJson('/api/newsletter-signup', payload)
}
