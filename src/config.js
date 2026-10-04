// Single source of truth for the backend URL, shared by api.js and
// adminApi.js so the two can't drift apart.
//
// The localhost fallback is dev-only. A production build without
// VITE_API_BASE_URL set would otherwise ship pointing at the visitor's own
// localhost:3000 and fail silently for every user -- so in a prod build a
// missing value is logged loudly instead of guessed at.
const configured = import.meta.env.VITE_API_BASE_URL

if (!configured && import.meta.env.PROD) {
  console.error(
    'VITE_API_BASE_URL was not set at build time; API calls will fail. ' +
      'Set it as a repo Variable for the deploy workflow.',
  )
}

export const API_BASE = (configured || (import.meta.env.DEV ? 'http://localhost:3000' : '')).replace(
  /\/+$/,
  '',
)
