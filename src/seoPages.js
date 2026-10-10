// Head tags and a short crawlable summary for each main route. Used twice:
// by SeoHead.jsx (updates the head as people navigate in the app) and by
// functions/_middleware.js (puts the same head and summary into the HTML a
// crawler or link preview receives, so they do not depend on running JS).
//
// `h1` and `intro` are plain text shown inside #root until React loads.
// Keep them consistent with what the page actually says.

export const PAGES = {
  '/': {
    title: 'Tenant Transparency — Know Before You Lease',
    description:
      'Public property records, renter reports, and tenant rights for Chicago renters. Know Before You Lease.',
    h1: 'Tenant Transparency: Know Before You Lease',
    intro:
      'Tenant Transparency gives Chicago renters public property records, tenant-rights information and a way to report housing concerns before signing a lease. Launching in Chicago. Built to scale nationally.',
    links: [
      ['/search', 'Search Chicago properties'],
      ['/neighborhoods', 'Browse Chicago neighborhoods'],
      ['/resources', 'Housing resource center'],
      ['/report-issue', 'Report a housing concern'],
    ],
  },
  '/neighborhoods': {
    title: 'Chicago Neighborhoods: Renter Guides for All 77 Community Areas | Tenant Transparency',
    description:
      'Browse all 77 Chicago community areas. See public building violation counts, renter reports and tenant-rights resources for each neighborhood before you lease.',
    h1: 'Chicago Neighborhoods',
    intro:
      'Pick a community area to see what public records show for renters there, then search a specific building before you lease.',
    links: [['/map', 'View the interactive map']],
  },
  '/search': {
    title: 'Search Chicago Properties and Landlords | Tenant Transparency',
    description:
      'Look up a Chicago property or landlord and see public building violation history before you sign a lease.',
    h1: 'Search Chicago Properties',
    intro:
      'Look up a Chicago address, landlord or property manager to see public building violations, ownership records and moderated renter reports before you sign.',
    links: [['/neighborhoods', 'Browse by neighborhood']],
  },
  '/report-issue': {
    title: 'Report a Housing Concern | Tenant Transparency',
    description:
      'Report a housing concern at a Chicago property. Every report is reviewed by a person before it is published.',
    h1: 'Report a Housing Concern',
    intro:
      'Tell us what happened at a specific Chicago address. Published reports never show who wrote them, and every report is reviewed by a person before it may go live.',
    links: [['/privacy', 'How we handle your information']],
  },
  '/resources': {
    title: 'Chicago Housing Resource Center | Tenant Transparency',
    description:
      'Free guides and tools on Chicago tenant rights: lease red flags, security deposits, habitability, heat, landlord entry, retaliation, eviction, and move-out documentation.',
    h1: 'Chicago Housing Resource Center',
    intro:
      'Free, plain-language guides and tools on Chicago tenant rights, including lease red flags, security deposits, habitability, heat and utilities, landlord entry, retaliation, eviction, and move-out documentation.',
    links: [
      ['/chicago-renters-rights-guide/', 'Chicago renters’ rights: the complete guide'],
      ['/chicago-security-deposit-law/', 'Security deposit law'],
      ['/chicago-habitability-violations/', 'Habitability violations'],
      ['/chicago-heat-law-utility-complaints/', 'Heat law and utility complaints'],
      ['/cook-county-eviction-process/', 'Cook County eviction process'],
      ['/chicago-move-out-documentation/', 'Move-out documentation'],
      ['/chicago-deposit-not-returned/', 'Deposit not returned'],
      ['/chicago-lease-red-flags/', 'Chicago lease red flags'],
      ['/chicago-landlord-entry-retaliation/', 'Landlord entry and retaliation'],
    ],
  },
  '/about': {
    title: 'About Tenant Transparency | Know Before You Lease',
    description:
      'Tenant Transparency gives Chicago renters public records, tenant-rights information, and a way to report housing concerns.',
    h1: 'About Tenant Transparency',
    intro:
      'Landlords often know a great deal about renters before a lease is signed. Tenant Transparency exists to help even that out with public records, tenant education and a moderated way for renters to share what happened.',
    links: [['/founder', 'Meet the founder']],
  },
  '/founder': {
    title: 'Meet the Founder | Tenant Transparency',
    description: 'Meet Sheenita Robinson, founder of Tenant Transparency, and why she built it.',
    h1: 'Meet the Founder',
    intro: 'Sheenita Robinson is the founder and CEO of Tenant Transparency.',
    links: [['/about', 'About Tenant Transparency']],
  },
  '/support': {
    title: 'Support Tenant Transparency',
    description: 'Ways to support Tenant Transparency and help Chicago renters know before they lease.',
    h1: 'Support Tenant Transparency',
    intro: 'Ways to support Tenant Transparency and help Chicago renters know before they lease.',
    links: [['/about', 'About Tenant Transparency']],
  },
  '/map': {
    title: 'Chicago Neighborhood Map | Tenant Transparency',
    description:
      'Explore Chicago community areas on a map with public housing and neighborhood data.',
    h1: 'Chicago Neighborhood Map',
    intro:
      'An interactive map of Chicago’s 77 community areas with public building violation counts, published renter reports and police-reported incident totals.',
    links: [['/neighborhoods', 'Browse neighborhoods as a list']],
  },
  '/privacy': {
    title: 'Privacy Policy | Tenant Transparency',
    description: 'How Tenant Transparency collects, uses, and protects information.',
    h1: 'Privacy Policy',
    intro: 'How Tenant Transparency collects, uses and protects information.',
    links: [['/terms', 'Terms of use']],
  },
  '/terms': {
    title: 'Terms of Use | Tenant Transparency',
    description: 'The terms for using Tenant Transparency.',
    h1: 'Terms of Use',
    intro: 'The terms for using Tenant Transparency.',
    links: [['/privacy', 'Privacy policy']],
  },
  // Direct-link-only or back-office routes: keep out of search results.
  '/beta': { title: 'Beta Tester | Tenant Transparency', noindex: true },
  '/founding-community': { title: 'Founding Community | Tenant Transparency', noindex: true },
  '/auth/callback': { title: 'Signing in | Tenant Transparency', noindex: true },
  '/admin': { title: 'Admin | Tenant Transparency', noindex: true },
}
