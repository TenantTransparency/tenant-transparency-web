// TermsOfUse.jsx
// IMPORTANT: This is a starting-point template and not legal advice.
// Have a licensed attorney review this before the site goes live, particularly
// regarding Section 230 protections, defamation liability, landlord dispute
// and takedown procedures, and any jurisdiction-specific requirements.

import { Link } from 'react-router-dom'

export default function TermsOfUse() {
  return (
    <div className="legal-page">
      <h1>Terms of Use</h1>
      <span className="legal-date">Effective date: July 2026</span>

      <p>
        These Terms of Use (&ldquo;Terms&rdquo;) govern your access to and use of the Tenant
        Transparency platform at tenanttransparency.com (the &ldquo;Platform&rdquo;), operated by
        Tenant Transparency (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
        By accessing or using the Platform, you agree to these Terms. If you do not agree, do
        not use the Platform.
      </p>

      <h2>1. The Platform</h2>
      <p>
        Tenant Transparency is a housing transparency resource that aggregates publicly available
        property records and facilitates the submission of anonymous renter reports. The Platform
        is intended to provide educational information and community-sourced insights to help
        renters make informed decisions. It is not a legal advice service, a real estate brokerage,
        or a tenant advocacy organization.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years of age to use the Platform. By using the Platform, you
        represent that you meet this requirement.
      </p>

      <h2>3. Renter Reports — Submission Rules</h2>
      <p>
        When submitting a renter report, you agree that:
      </p>
      <ul>
        <li>Your report describes an experience you personally had as a renter or tenant at the reported address.</li>
        <li>The information you provide is truthful and accurate to the best of your knowledge.</li>
        <li>You will not submit false, misleading, defamatory, or malicious reports.</li>
        <li>You will not submit reports on behalf of a landlord, property manager, or competitor with the intent to harm a third party.</li>
        <li>You will not include personal information (names, contact information, government IDs) of private individuals in your report.</li>
        <li>You will not submit the same report multiple times or use multiple accounts to circumvent moderation decisions.</li>
      </ul>
      <p>
        All submitted reports are subject to moderation review before publication. We reserve the
        right to reject, edit for PII, or remove any report that violates these Terms or that we
        determine, in our sole discretion, to be harmful, false, or otherwise inappropriate.
      </p>

      <h2>4. Public Records Content</h2>
      <p>
        Property violation data, ownership records, and related information displayed on the
        Platform are derived from publicly available government sources. We do not guarantee the
        accuracy, completeness, or timeliness of this data. Public records may contain errors;
        information may be outdated; and records may not reflect recent developments. You should
        independently verify any information obtained from the Platform before relying on it to
        make a housing decision.
      </p>

      <h2>5. No Legal Advice</h2>
      <p>
        Nothing on the Platform constitutes legal advice. The Resource Center guides, tenant
        rights information, and all other content on the Platform are provided for general
        educational purposes only. No attorney-client relationship is created by your use of
        the Platform. For legal advice specific to your situation, consult a licensed attorney.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        The Platform and its original content, features, design, and functionality are owned
        by Tenant Transparency and are protected by applicable intellectual property law.
        &ldquo;Know Before You Lease&trade;&rdquo; and &ldquo;Transparency Score&trade;&rdquo;
        are trademarks of Tenant Transparency. You may not use our trademarks, logos, or
        brand assets without prior written permission.
      </p>
      <p>
        Public records data displayed on the Platform originates from government sources and
        is not proprietary to Tenant Transparency. Community-submitted renter reports remain
        the expression of the individual submitter; by submitting a report you grant Tenant
        Transparency a perpetual, irrevocable, royalty-free license to display, reproduce,
        and distribute that report (in anonymized, PII-scrubbed form) on the Platform and
        in related publications.
      </p>

      <h2>7. Prohibited Conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Platform for any unlawful purpose or in violation of any applicable law or regulation.</li>
        <li>Submit false or fraudulent renter reports or misrepresent your identity or affiliation.</li>
        <li>Attempt to access, scrape, or harvest Platform data in bulk without prior written authorization.</li>
        <li>Attempt to reverse-engineer, decompile, or interfere with any part of the Platform.</li>
        <li>Use the Platform to harass, defame, or harm any individual or organization.</li>
        <li>Attempt to circumvent the moderation system or submit reports under multiple identities.</li>
        <li>Transmit any malicious code, virus, or other harmful software through the Platform.</li>
      </ul>

      <h2>8. Dispute and Takedown Requests</h2>
      <p>
        Property owners or managers who believe a published report is false or defamatory may
        submit a dispute request to{' '}
        <a href="mailto:info@tenanttransparency.com">info@tenanttransparency.com</a>. We will
        review dispute requests and may remove or edit reports if we determine, in our sole
        discretion, that the content violates these Terms. Submission of a dispute request does
        not guarantee removal. We are not a neutral arbitrator of disputes between landlords
        and tenants.
      </p>

      <h2>9. Disclaimer of Warranties</h2>
      <p>
        THE PLATFORM IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
        WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, ACCURACY, OR NON-INFRINGEMENT. WE
        DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL
        COMPONENTS.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, TENANT TRANSPARENCY WILL NOT BE
        LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
        ARISING OUT OF OR RELATED TO YOUR USE OF THE PLATFORM, INCLUDING BUT NOT LIMITED TO
        LOSSES ARISING FROM RELIANCE ON INFORMATION DISPLAYED ON THE PLATFORM. OUR TOTAL
        LIABILITY TO YOU FOR ANY CLAIM ARISING FROM THESE TERMS OR YOUR USE OF THE PLATFORM
        WILL NOT EXCEED ONE HUNDRED DOLLARS ($100).
      </p>

      <h2>11. Section 230</h2>
      <p>
        Tenant Transparency is an interactive computer service provider under 47 U.S.C. &sect; 230.
        We are not the publisher or speaker of third-party content submitted by users. We are not
        liable for any third-party content displayed on the Platform, including community-submitted
        renter reports, to the extent permitted by applicable law.
      </p>

      <h2>12. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the State of Illinois without regard to its
        conflict of law provisions. Any dispute arising from these Terms or your use of the
        Platform will be subject to the exclusive jurisdiction of the courts located in Cook
        County, Illinois.
      </p>

      <h2>13. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. We will notify you of material changes
        by posting the updated Terms on this page with a new effective date. Your continued
        use of the Platform after any changes constitutes your acceptance of the updated Terms.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these Terms? Contact us at{' '}
        <a href="mailto:info@tenanttransparency.com">info@tenanttransparency.com</a>.
      </p>
    </div>
  )
}
