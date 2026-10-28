// GET /data/property/<uuid>: a property's detail JSON from the R2 snapshot
// (same payload as the API's /api/properties/:id). The app tries this
// first when opening a property in-app, so browsing property pages does
// not wake the database. 404 when there is no snapshot; the app then
// falls back to the API.

import { snapshotJson } from '../../../src/edgeShared.js'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function onRequest({ env, params }) {
  const id = String(params.id || '').toLowerCase()
  const detail = UUID.test(id) ? await snapshotJson(env, `properties/${id}.json`) : null
  if (!detail) {
    return new Response('no snapshot', { status: 404, headers: { 'cache-control': 'no-store' } })
  }
  return new Response(JSON.stringify(detail), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  })
}
