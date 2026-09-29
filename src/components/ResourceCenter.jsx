// Articles are plain static HTML in public/<slug>/index.html — full page
// loads via <a href>, not React Router <Link>, so crawlers get the
// pre-rendered HTML and schema markup directly.

const GUIDES = [
  {
    slug: 'chicago-renters-rights-guide',
    label: 'Start Here',
    icon: '⚖️',
    title: "Chicago Renters' Rights: A General Guide",
    description: 'A general overview of the RLTO — deposits, habitability, heat, eviction — plus a free rights checker tool.',
    tool: 'RLTO Coverage Checker',
  },
  {
    slug: 'chicago-security-deposit-law',
    label: 'Deposits',
    icon: '💰',
    title: 'Chicago Security Deposit Law',
    description: 'Typical deadlines, interest, and potential penalties, with a free interest calculator and demand letter generator.',
    tool: 'Deposit Interest Calculator',
  },
  {
    slug: 'chicago-habitability-violations',
    label: 'Repairs',
    icon: '🔧',
    title: 'What Counts as a Habitability Violation',
    description: 'What landlords may be legally required to fix, and how to document a possible violation.',
    tool: 'Violation Checklist',
  },
  {
    slug: 'chicago-heat-law-utility-complaints',
    label: 'Heat & Utilities',
    icon: '🌡️',
    title: 'Heat Law and Utility Complaints',
    description: "Chicago's general minimum temperature requirements and how to report a concern to the city.",
    tool: 'Complaint Letter Generator',
  },
  {
    slug: 'cook-county-eviction-process',
    label: 'Eviction',
    icon: '🏛️',
    title: 'How Eviction Generally Works in Cook County',
    description: 'An overview of the court process, notice requirements, and why self-help evictions are generally not allowed.',
    tool: 'Eviction Timeline Guide',
  },
  {
    slug: 'chicago-move-out-documentation',
    label: 'Moving Out',
    icon: '📷',
    title: 'How to Document Issues Before Moving Out',
    description: 'Ways to help protect your deposit with photos, timestamps, and written notice.',
    tool: 'Move-Out Checklist',
  },
  {
    slug: 'chicago-deposit-not-returned',
    label: 'Disputes',
    icon: '📋',
    title: "What to Do If Your Landlord Won't Return Your Deposit",
    description: 'General steps to consider when the 45-day deadline has already passed.',
    tool: 'Demand Letter Template',
  },
]

export default function ResourceCenter() {
  return (
    <div className="resource-center-page">

      <div className="resource-center-hero">
        <span className="section-eyebrow">Free for all renters</span>
        <h1>Housing Resource Center</h1>
        <p>
          General-information guides to Chicago tenant rights — every one free,
          no signup required, each with an interactive tool you can use and
          download right now.
        </p>
        <div className="resource-center-trust">
          <span>✓ No account required</span>
          <span>✓ Free to download</span>
          <span>✓ Last reviewed 2026</span>
        </div>
      </div>

      <div className="resource-center-grid">
        {GUIDES.map((g) => (
          <a key={g.slug} className="resource-center-card" href={`/${g.slug}`}>
            <div className="resource-center-card-top">
              <div className="resource-center-card-icon">{g.icon}</div>
              <span className="guide-label">{g.label}</span>
            </div>
            <h2>{g.title}</h2>
            <p>{g.description}</p>
            <div className="resource-center-card-tool">
              <span className="resource-tool-badge">Free tool</span>
              {g.tool}
            </div>
            <span className="resource-center-card-cta">Read guide &rarr;</span>
          </a>
        ))}
      </div>

      <div className="resource-center-callout">
        <div className="resource-center-callout-text">
          <h3>Facing a specific issue right now?</h3>
          <p>
            Search your address to see public violation records and renter reports,
            or submit a report about your property.
          </p>
        </div>
        <div className="resource-center-callout-actions">
          <a href="/search" className="cta-primary">Search Properties</a>
          <a href="/report-issue" className="cta-secondary">Report an Issue</a>
        </div>
      </div>

    </div>
  )
}
