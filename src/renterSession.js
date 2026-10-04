// Renter session storage. Kept apart from adminApi.js's keys on purpose:
// renter and admin sessions are separate identity systems server-side
// (different JWT secrets, different tables), so they don't share storage
// here either.

const ACCESS_TOKEN_KEY = 'tt_renter_access_token'
const REFRESH_TOKEN_KEY = 'tt_renter_refresh_token'

export function storeRenterTokens({ access_token, refresh_token }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access_token)
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token)
}

export function getRenterTokens() {
  return {
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
  }
}

export function clearRenterTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}
