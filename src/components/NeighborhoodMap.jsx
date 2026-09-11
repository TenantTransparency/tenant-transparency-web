// NeighborhoodMap.jsx
//
// REQUIRES: npm install maplibre-gl
// Add to index.html <head> (or import in this file):
//   <link rel="stylesheet" href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css" />
//
// Uses a free public tile source (OpenFreeMap) — no API key needed.
// Community area boundaries come from /community_areas.geojson in public/.
// Stats (violations, reports, crime) come live from /api/map/community-areas.

import { useEffect, useRef, useState, useCallback } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { getCommunityAreaStats } from '../api.js'

// Chicago center
const CHICAGO_CENTER = [-87.6298, 41.8781]
const CHICAGO_ZOOM = 10.5

// Color ramps for each overlay mode.
// Each entry is [threshold, hex]. Applied as a step expression.
// Thresholds are tuned to the rough distribution of Chicago data —
// adjust if the actual data skews the scale badly.
const RAMPS = {
  violations: {
    label: 'Building Violations',
    stops: [
      [0,   '#e6f4f1'],
      [10,  '#b2ddd7'],
      [50,  '#7fc4bf'],
      [150, '#4aabaa'],
      [300, '#2a7d6e'],
      [600, '#1f5e52'],
    ],
  },
  reports: {
    label: 'Renter Reports',
    stops: [
      [0,  '#fdf0e6'],
      [1,  '#f9d4b0'],
      [5,  '#f4b37a'],
      [15, '#ee9244'],
      [30, '#e07b39'],
      [60, '#c4621e'],
    ],
  },
  crime_violent: {
    label: 'Violent Crime (24 mo.)',
    stops: [
      [0,    '#f7f0f8'],
      [100,  '#e0c4e3'],
      [300,  '#c494ca'],
      [700,  '#a064b0'],
      [1200, '#7a3a8a'],
      [2000, '#521060'],
    ],
  },
  crime_property: {
    label: 'Property Crime (24 mo.)',
    stops: [
      [0,    '#f0f4ff'],
      [200,  '#c5d5f7'],
      [600,  '#90aeee'],
      [1200, '#5a87e5'],
      [2000, '#2a5fcc'],
      [3500, '#0a3899'],
    ],
  },
}

const OVERLAY_KEYS = Object.keys(RAMPS)

function buildFillColor(ramp, statsById) {
  // MapLibre step expression: ['step', ['get', 'fill_value'], fallback, t1, c1, t2, c2 ...]
  // We embed the lookup value directly into the GeoJSON feature properties
  // before setting the source, so we don't need a complex expression here.
  const stops = ramp.stops
  const expr = ['step', ['get', 'stat_value'], stops[0][1]]
  for (let i = 1; i < stops.length; i++) {
    expr.push(stops[i][0], stops[i][1])
  }
  return expr
}

function buildLegendStops(ramp) {
  return ramp.stops.map(([threshold, color]) => ({ threshold, color }))
}

export default function NeighborhoodMap() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const popup = useRef(null)

  const [overlay, setOverlay] = useState('violations')
  const [stats, setStats] = useState(null)  // Map<area_id, row>
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedArea, setSelectedArea] = useState(null)
  const [mapReady, setMapReady] = useState(false)

  // Load stats once on mount
  useEffect(() => {
    getCommunityAreaStats()
      .then((rows) => {
        const byId = new Map(rows.map((r) => [r.community_area_id, r]))
        setStats(byId)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Init map once container is mounted.
  // Note: React StrictMode double-invokes effects in development. The
  // cleanup return removes the map instance so the second mount gets a
  // clean container. The map.current guard prevents double-init within
  // a single mount cycle.
  useEffect(() => {
    if (!mapContainer.current) return
    // If a previous instance exists (StrictMode teardown), remove it first.
    if (map.current) {
      map.current.remove()
      map.current = null
    }

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      // Primary: OpenFreeMap positron (no key, community-hosted OSM)
      // Fallback handled by the error event below.
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: CHICAGO_CENTER,
      zoom: CHICAGO_ZOOM,
      minZoom: 9,
      maxZoom: 16,
    })

    // Surface tile load errors so we can see the real reason in the UI
    // rather than a silent grey canvas.
    map.current.on('error', (e) => {
      console.error('MapLibre error:', e.error)
      // If the style itself failed to load, try the liberty fallback.
      // Any other error (tile 404, network timeout) just gets logged.
      if (e.error?.message?.toLowerCase().includes('style')) {
        try {
          map.current.setStyle('https://tiles.openfreemap.org/styles/liberty')
        } catch (_) {}
      }
    })

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.current.addControl(
      new maplibregl.ScaleControl({ unit: 'imperial' }),
      'bottom-right'
    )

    popup.current = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'map-popup',
    })

    map.current.on('load', () => setMapReady(true))

    return () => {
      map.current?.remove()
      map.current = null
      setMapReady(false)
    }
  }, [])

  // Merge stats into GeoJSON and set/update the source + layer
  // whenever the map is ready, stats load, or the overlay changes.
  useEffect(() => {
    if (!mapReady || !stats || !map.current) return

    const ramp = RAMPS[overlay]

    // Fetch the boundary GeoJSON (served from public/) and annotate each
    // feature with the stat value for the current overlay so MapLibre's
    // step expression can read it directly off the feature properties.
    fetch('/community_areas.geojson')
      .then((r) => r.json())
      .then((geojson) => {
        const annotated = {
          ...geojson,
          features: geojson.features.map((f) => {
            // The GeoJSON from Chicago Data Portal uses area_numbe (no 'r')
            const areaId = parseInt(f.properties.area_numbe ?? f.properties.area_num_1 ?? 0, 10)
            const row = stats.get(areaId)
            // Overlay keys ('violations', 'reports', 'crime_violent', 'crime_property')
            // don't match the API's field names 1:1 - map them explicitly rather than
            // indexing row[overlay] directly (that silently returned 0 for the
            // 'violations' and 'reports' overlays since the API returns
            // violation_count/report_count, not violations/reports).
            const STAT_FIELD = {
              violations: 'violation_count',
              reports: 'report_count',
              crime_violent: 'crime_violent',
              crime_property: 'crime_property',
            }
            const statValue = row ? (row[STAT_FIELD[overlay]] ?? 0) : 0
            return {
              ...f,
              properties: {
                ...f.properties,
                area_id: areaId,
                stat_value: statValue,
                community_name: row?.community_area_name ?? f.properties.community ?? '',
                property_count: row?.property_count ?? 0,
                violation_count: row?.violation_count ?? 0,
                report_count: row?.report_count ?? 0,
                crime_violent: row?.crime_violent ?? 0,
                crime_property: row?.crime_property ?? 0,
                crime_other: row?.crime_other ?? 0,
              },
            }
          }),
        }

        if (map.current.getSource('community-areas')) {
          map.current.getSource('community-areas').setData(annotated)
        } else {
          map.current.addSource('community-areas', {
            type: 'geojson',
            data: annotated,
          })
        }

        const fillColor = buildFillColor(ramp, stats)

        if (map.current.getLayer('community-fill')) {
          map.current.setPaintProperty('community-fill', 'fill-color', fillColor)
        } else {
          map.current.addLayer({
            id: 'community-fill',
            type: 'fill',
            source: 'community-areas',
            paint: {
              'fill-color': fillColor,
              'fill-opacity': 0.72,
            },
          })

          map.current.addLayer({
            id: 'community-outline',
            type: 'line',
            source: 'community-areas',
            paint: {
              'line-color': '#ffffff',
              'line-width': 1.2,
              'line-opacity': 0.7,
            },
          })

          map.current.addLayer({
            id: 'community-outline-selected',
            type: 'line',
            source: 'community-areas',
            paint: {
              'line-color': '#1f5e52',
              'line-width': 2.5,
              'line-opacity': 1,
            },
            filter: ['==', ['get', 'area_id'], -1], // nothing selected initially
          })

          // Hover tooltip
          map.current.on('mousemove', 'community-fill', (e) => {
            if (!e.features?.length) return
            map.current.getCanvas().style.cursor = 'pointer'
            const props = e.features[0].properties
            popup.current
              .setLngLat(e.lngLat)
              .setHTML(`
                <div class="map-popup-inner">
                  <strong>${props.community_name}</strong>
                  <div>${props.violation_count} violations · ${props.report_count} reports</div>
                  <div>${props.crime_violent} violent · ${props.crime_property} property crimes</div>
                </div>
              `)
              .addTo(map.current)
          })

          map.current.on('mouseleave', 'community-fill', () => {
            map.current.getCanvas().style.cursor = ''
            popup.current.remove()
          })

          // Click to select
          map.current.on('click', 'community-fill', (e) => {
            if (!e.features?.length) return
            const props = e.features[0].properties
            setSelectedArea(props)
            map.current.setFilter('community-outline-selected', [
              '==', ['get', 'area_id'], props.area_id,
            ])
          })
        }
      })
      .catch((err) => setError(`Failed to load map boundaries: ${err.message}`))
  }, [mapReady, stats, overlay])

  const ramp = RAMPS[overlay]
  const legendStops = buildLegendStops(ramp)

  return (
    <div className="map-page">
      <div className="map-header">
        <div>
          <span className="section-eyebrow">Chicago Neighborhood Hub</span>
          <h1>Explore Chicago by neighborhood</h1>
          <p className="map-subhead">
            Click any neighborhood to see property violations, renter reports,
            and crime data. Data updates daily from public sources.
          </p>
        </div>
        <div className="map-overlay-tabs" role="tablist" aria-label="Map overlay">
          {OVERLAY_KEYS.map((key) => (
            <button
              key={key}
              role="tab"
              aria-selected={overlay === key}
              className={`map-overlay-tab${overlay === key ? ' active' : ''}`}
              onClick={() => { setSelectedArea(null); setOverlay(key) }}
            >
              {RAMPS[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="map-body">
        <div className="map-wrap">
          {loading && (
            <div className="map-loading">
              <div className="map-spinner" />
              Loading neighborhood data&hellip;
            </div>
          )}
          {error && (
            <div className="map-error">
              Could not load map data: {error}
            </div>
          )}
          <div ref={mapContainer} className="map-canvas" aria-label="Chicago neighborhood map" />

          {/* Legend */}
          <div className="map-legend" aria-label="Map legend">
            <div className="map-legend-title">{ramp.label}</div>
            <div className="map-legend-scale">
              {legendStops.map(({ threshold, color }) => (
                <div className="map-legend-row" key={threshold}>
                  <span className="map-legend-swatch" style={{ background: color }} />
                  <span className="map-legend-label">
                    {threshold === 0 ? 'None' : `${threshold.toLocaleString()}+`}
                  </span>
                </div>
              ))}
            </div>
            <div className="map-legend-note">24-month window · public records</div>
          </div>
        </div>

        {/* Side panel */}
        <div className="map-panel">
          {!selectedArea ? (
            <div className="map-panel-placeholder">
              <div className="map-panel-placeholder-icon">🗺️</div>
              <p>Click any neighborhood on the map to see details.</p>
            </div>
          ) : (
            <div className="map-panel-detail">
              <button
                className="map-panel-close"
                onClick={() => {
                  setSelectedArea(null)
                  map.current?.setFilter('community-outline-selected', [
                    '==', ['get', 'area_id'], -1,
                  ])
                }}
                aria-label="Close panel"
              >
                ✕
              </button>

              <h2>{selectedArea.community_name}</h2>

              <div className="map-stat-grid">
                <div className="map-stat-card">
                  <div className="map-stat-value">{Number(selectedArea.property_count).toLocaleString()}</div>
                  <div className="map-stat-label">Properties on record</div>
                </div>
                <div className="map-stat-card violations">
                  <div className="map-stat-value">{Number(selectedArea.violation_count).toLocaleString()}</div>
                  <div className="map-stat-label">Building violations</div>
                </div>
                <div className="map-stat-card reports">
                  <div className="map-stat-value">{Number(selectedArea.report_count).toLocaleString()}</div>
                  <div className="map-stat-label">Renter reports</div>
                </div>
              </div>

              <div className="map-crime-section">
                <div className="map-crime-title">Crime (last 24 months)</div>
                {[
                  { label: 'Violent', value: selectedArea.crime_violent, color: '#7a3a8a' },
                  { label: 'Property', value: selectedArea.crime_property, color: '#2a5fcc' },
                  { label: 'Other', value: selectedArea.crime_other, color: '#6b7280' },
                ].map(({ label, value, color }) => {
                  const total = Number(selectedArea.crime_violent) +
                                Number(selectedArea.crime_property) +
                                Number(selectedArea.crime_other)
                  const pct = total > 0 ? Math.round((Number(value) / total) * 100) : 0
                  return (
                    <div className="map-crime-row" key={label}>
                      <div className="map-crime-row-top">
                        <span>{label}</span>
                        <span>{Number(value).toLocaleString()}</span>
                      </div>
                      <div className="map-crime-track">
                        <div
                          className="map-crime-fill"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </div>
                  )
                })}
                <div className="map-crime-note">
                  Source: Chicago Data Portal · CPD Crimes dataset
                </div>
              </div>

              <a
                href={`/search?neighborhood=${encodeURIComponent(selectedArea.community_name)}`}
                className="cta-primary"
                style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
              >
                Search properties in {selectedArea.community_name}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
