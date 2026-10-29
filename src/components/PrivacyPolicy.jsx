// PrivacyPolicy.jsx
// IMPORTANT: This is a starting-point template and not legal advice.
// Have a licensed attorney review this before the site goes live, particularly
// regarding CCPA/CPRA, Illinois BIPA (if biometric data is ever collected),
// and any state-specific requirements for your operating jurisdictions.

import { Link } from 'react-router-dom'

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <h1>Privacy Policy</h1>
      <span className="legal-date">Effective date: July 2026</span>

      <p>
        Tenant Transparency (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the Tenant Transparency
        platform at tenanttransparency.com (the &ldquo;Platform&rdquo;). This Privacy Policy describes how we collect,
        use, disclose, and protect information about you when you use the Platform.
      </p>
      <p>
        By accessing or using the Platform, you agree to this Privacy Policy. If you do not agree,
        please do not use the Platform.
      </p>

      <h2>1. Information We Collect</h2>
      <p>We collect information in the following ways:</p>
      <ul>
        <li>
          <strong>Information you provide directly.</strong> When you submit a renter report,
          join our waitlist, contact us, or otherwise interact with the Platform, you may
          provide your email address, the address of a property, and a description of your
          experience. You are never required to provide your name.
        </li>
        <li>
          <strong>Usage information.</strong> We automatically collect certain technical
          information when you visit the Platform, including your IP address, browser type,
          operating system, pages visited, and timestamps. This information is used for
          security, analytics, and platform improvement.
        </li>
        <li>
          <strong>Public records.</strong> The Platform displays information derived from
          publicly available government databases, including the Chicago Data Portal, Cook
          County Assessor records, and municipal building violation databases. This
          information is not collected from you.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To operate, maintain, and improve the Platform.</li>
        <li>To review, moderate, and (if approved) publish renter reports.</li>
        <li>To send you updates and newsletters you have subscribed to.</li>
        <li>To respond to your inquiries and support requests.</li>
        <li>To detect, investigate, and prevent fraudulent or harmful activity.</li>
        <li>To comply with applicable law and legal process.</li>
      </ul>

      <h2>3. Renter Reports — Anonymization</h2>
      <p>
        Renter reports submitted through the Platform are processed to remove personally
        identifiable information (PII) before storage and before publication. We apply both
        automated pattern-matching and human moderation review before any report is made
        visible on the Platform. Published reports do not display your name, email address,
        IP address, or any other information that identifies you personally.
      </p>
      <p>
        We retain a pseudonymous reporter identifier (&ldquo;reporter ID&rdquo;) to detect
        duplicate or abusive submissions. This identifier is generated locally on your device
        and is not linked to your email address or any other personally identifying information
        unless you have voluntarily provided both in the same interaction.
      </p>

      <h2>4. Sharing and Disclosure</h2>
      <p>We do not sell your personal information. We may share your information with:</p>
      <ul>
        <li>
          <strong>Service providers.</strong> Third-party vendors who assist us in operating
          the Platform (hosting, analytics, email delivery) under contracts that restrict
          their use of your information to providing services to us.
        </li>
        <li>
          <strong>Legal requirements.</strong> If required by law, court order, or other
          legal process, or if we believe disclosure is necessary to protect the rights,
          property, or safety of Tenant Transparency, our users, or the public.
        </li>
        <li>
          <strong>Business transfers.</strong> In connection with a merger, acquisition,
          or sale of all or substantially all of our assets, your information may be
          transferred as part of that transaction. We will notify you of any such change.
        </li>
      </ul>

      <h2>5. Data Retention</h2>
      <p>
        We retain your information for as long as necessary to provide the Platform and
        fulfill the purposes described in this Policy, unless a longer retention period
        is required by law. You may request deletion of your personal information by
        contacting us at{' '}
        <a href="mailto:info@tenanttransparency.com">info@tenanttransparency.com</a>.
        Note that published renter reports, once approved and stripped of PII, are
        retained as part of the public record and may not be deleted at individual request.
      </p>

      <h2>6. Cookies and Tracking</h2>
      <p>
        We use essential cookies to keep you logged in (for admin users only) and to
        maintain session state. We do not use third-party advertising cookies or tracking
        pixels. We may use anonymized analytics tools to understand aggregate usage
        patterns. You may disable cookies in your browser settings; doing so may affect
        the functionality of admin-only features but will not affect public access to
        the Platform.
      </p>

      <h2>7. Security</h2>
      <p>
        We implement reasonable technical and organizational measures to protect your
        information from unauthorized access, disclosure, alteration, or destruction.
        These measures include encrypted transmission (HTTPS), hashed credential storage,
        and automated PII scrubbing on report intake. However, no security system is
        impenetrable and we cannot guarantee absolute security.
      </p>

      <h2>8. Children</h2>
      <p>
        The Platform is not directed to children under 13. We do not knowingly collect
        personal information from children under 13. If you believe we have inadvertently
        collected such information, please contact us and we will promptly delete it.
      </p>

      <h2>9. Your Rights</h2>
      <p>
        Depending on your location, you may have certain rights regarding your personal
        information, including the right to access, correct, or delete it. Illinois
        residents may have additional rights under applicable state law. To exercise
        your rights, contact us at{' '}
        <a href="mailto:info@tenanttransparency.com">info@tenanttransparency.com</a>.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of
        material changes by posting the updated Policy on this page with a new effective
        date. Your continued use of the Platform after any changes constitutes your
        acceptance of the updated Policy.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions or concerns about this Privacy Policy? Contact us at{' '}
        <a href="mailto:info@tenanttransparency.com">info@tenanttransparency.com</a>.
      </p>
    </div>
  )
}
