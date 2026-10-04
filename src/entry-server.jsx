// Server entry used only by scripts/prerender.mjs at build time. Renders the
// real React page for a route to an HTML string, so crawlers that do not run
// JavaScript get the full content. Not part of the browser bundle.

import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { AppRoutes } from './App.jsx'

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>,
  )
}
