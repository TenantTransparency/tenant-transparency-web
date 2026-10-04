import data from '../sponsors.json'

// One labeled sponsor panel. Renders nothing unless an approved sponsorship
// is active for this placement, so pages look exactly the same until a
// sponsor is signed.
//
// Rules this component enforces (see AD_AND_SPONSORSHIP_DESIGN.md):
//  - Only the placements listed below can show a sponsor. Report forms,
//    moderation, admin, account pages and property pages are deliberately
//    absent, so a sponsor cannot be placed there by editing sponsors.json.
//  - The label is fixed text ("Sponsored") and cannot be changed per sponsor,
//    so a sponsor cannot make itself look like TT information.
//  - No tracking: no scripts, no pixels, no cookies. The link is
//    rel="sponsored".
//  - Sponsors never touch scores, verification or reports; nothing here
//    reads or writes that data.
const ALLOWED_PLACEMENTS = new Set([
  'news_inline',
  'resource_footer',
  'neighborhood_panel',
  'directory_featured',
])

const isHttps = (u) => /^https:\/\//i.test(String(u || ''))

function activeSponsorship(placement, today = new Date()) {
  if (!ALLOWED_PLACEMENTS.has(placement)) return null
  const day = today.toISOString().slice(0, 10)
  return (
    (data.sponsorships || []).find(
      (s) =>
        s.approved === true &&
        s.placement === placement &&
        s.advertiser &&
        s.headline &&
        isHttps(s.url) &&
        (!s.startDate || s.startDate <= day) &&
        (!s.endDate || s.endDate >= day),
    ) || null
  )
}

export default function SponsoredSlot({ placement }) {
  const s = activeSponsorship(placement)
  if (!s) return null

  return (
    <aside className="sponsored-slot" aria-label={`Sponsored by ${s.advertiser}`}>
      <p className="sponsored-label">Sponsored by {s.advertiser}</p>
      <h3>
        <a href={s.url} target="_blank" rel="sponsored noopener noreferrer">
          {s.headline}
        </a>
      </h3>
      {s.body && <p>{s.body}</p>}
      <p className="sponsored-disclosure">
        Tenant Transparency does not verify or endorse sponsors. Sponsorship never affects
        property information, reports or any score.
      </p>
    </aside>
  )
}
