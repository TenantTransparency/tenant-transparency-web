const NAVY = '#0e2540'
const NAVY_TEXT = '#14304f'
const ORANGE = '#f5751f'

// TEST MODE payment link — swap for the live link from Sheenita's activated
// Stripe account before launch (see her setup steps).
const STRIPE_PAYMENT_LINK = 'https://donate.stripe.com/test_bJe14nfZN1ox4797ogdIA00'

const FUNDS = [
  { title: 'Platform development', desc: 'Property records, renter experiences, and the tools that surface them.' },
  { title: 'Renter education', desc: 'Plain-language guides on rights, fees, and lease red flags.' },
  { title: 'Housing research', desc: 'Work that puts real numbers behind what renters experience.' },
  { title: 'Community outreach', desc: 'Bringing Know Before You Lease™ to more neighborhoods.' },
]

const s = {
  hero: { position: 'relative', minHeight: 340, display: 'flex', alignItems: 'flex-end', background: '#0b1412' },
  heroPhoto: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 1 },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(0deg,rgba(11,20,18,.95) 0%,rgba(11,20,18,.82) 45%,rgba(11,20,18,.6) 100%)' },
  heroInner: { position: 'relative', padding: '64px 56px 48px', maxWidth: 820, color: '#fff' },
  eyebrow: { font: "700 12px 'Inter',sans-serif", letterSpacing: '.14em', textTransform: 'uppercase', color: '#e6f4f1', marginBottom: 16 },
  h1: { font: "700 46px/1.1 'Lora',Georgia,serif", letterSpacing: '-.01em', margin: 0 },
  page: { maxWidth: 1000, margin: '0 auto', padding: '56px 56px 88px' },
  grid: { display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 48, alignItems: 'start' },
  lead: { font: "400 19px/1.65 'Inter',sans-serif", color: NAVY_TEXT },
  body: { font: "400 15px/1.75 'Inter',sans-serif", color: '#5c6b7c' },
  card: { display: 'flex', gap: 14, alignItems: 'flex-start', background: '#fff', border: '1px solid #e5e0d6', borderRadius: 10, padding: '18px 20px' },
  dot: { width: 8, height: 8, borderRadius: '50%', background: ORANGE, marginTop: 7, flexShrink: 0 },
  cardTitle: { font: "600 15px 'Inter',sans-serif", color: NAVY_TEXT, marginBottom: 3 },
  cardDesc: { font: "400 14px/1.6 'Inter',sans-serif", color: '#5c6b7c' },
  panel: { background: NAVY, borderRadius: 14, padding: '36px 34px', color: '#fff', position: 'sticky', top: 24 },
  panelTitle: { font: "700 22px 'Archivo','Inter',sans-serif", marginBottom: 10 },
  panelSub: { font: "400 14px/1.65 'Inter',sans-serif", color: '#cfdae6', marginBottom: 24 },
  cta: { display: 'block', background: ORANGE, color: '#fff', font: "600 15px 'Inter',sans-serif", padding: '16px 20px', borderRadius: 8, textAlign: 'center', textDecoration: 'none', border: 'none', width: '100%', cursor: 'pointer' },
  ctaDisabled: { background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.25)', color: '#a9bacb', font: "600 15px 'Inter',sans-serif", padding: '16px 20px', borderRadius: 8, textAlign: 'center', width: '100%' },
  note: { font: "400 12px 'Inter',sans-serif", color: '#8fa2b6', textAlign: 'center', marginTop: 12 },
  disclosure: { borderTop: '1px solid rgba(255,255,255,.14)', marginTop: 26, paddingTop: 20, font: "400 12px/1.7 'Inter',sans-serif", color: '#93a5b8' },
}

export default function SupportTT() {
  return (
    <>
      <section style={s.hero}>
        <img
          src="/youngwomenandchildren.jpg"
          alt="A woman walking toward a Chicago high-rise as movers carry furniture into her new building"
          style={s.heroPhoto}
        />
        <div style={s.heroOverlay} />
        <div style={s.heroInner}>
          <div style={s.eyebrow}>Support Tenant Transparency</div>
          <h1 style={s.h1}>Help build a more transparent rental market</h1>
        </div>
      </section>

      <div style={s.page}>
        <div style={s.grid}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p style={{ ...s.lead, margin: 0 }}>
              Tenant Transparency is building tools and resources designed to help renters
              access better information, understand their options, and make more informed
              decisions before signing a lease.
            </p>
            <p style={{ ...s.body, margin: 0 }}>
              Your support helps us continue developing the platform, expanding renter
              education and resources, conducting housing research, and bringing
              Know Before You Lease™ to more communities.
            </p>
            <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
              {FUNDS.map((f) => (
                <div key={f.title} style={s.card}>
                  <div style={s.dot} />
                  <div>
                    <div style={s.cardTitle}>{f.title}</div>
                    <div style={s.cardDesc}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside style={s.panel}>
            <div style={s.panelTitle}>Support Tenant Transparency</div>
            <div style={s.panelSub}>
              Voluntary contributions from renters, neighbors, and supporters who think
              this should exist.
            </div>
            {STRIPE_PAYMENT_LINK ? (
              <a href={STRIPE_PAYMENT_LINK} target="_blank" rel="noopener noreferrer" style={s.cta}>
                Contribute
              </a>
            ) : (
              <>
                <div style={s.ctaDisabled} aria-disabled="true">Contributions open soon</div>
                <div style={s.note}>Join the waitlist and we'll let you know.</div>
              </>
            )}
            <div style={s.disclosure}>
              Tenant Transparency is a for-profit business. Contributions made through this
              page are voluntary and are not tax-deductible charitable donations. Making a
              contribution does not provide an ownership or investment interest in Tenant
              Transparency.
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
