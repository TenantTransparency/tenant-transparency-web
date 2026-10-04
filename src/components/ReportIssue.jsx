import { useState } from 'react'
import { Link } from 'react-router-dom'
import { submitReport } from '../api.js'

const CATEGORY_TAGS = [
  { value: 'security_deposit',  label: 'Security Deposit' },
  { value: 'habitability',      label: 'Habitability / Repairs' },
  { value: 'heat_utilities',    label: 'Heat & Utilities' },
  { value: 'eviction',          label: 'Eviction' },
  { value: 'harassment',        label: 'Harassment' },
  { value: 'lease_violation',   label: 'Lease Violation' },
  { value: 'other',             label: 'Other' },
]

const RESOLUTION_STATUSES = [
  { value: 'unresolved',        label: 'Unresolved' },
  { value: 'resolved_landlord', label: 'Resolved with landlord' },
  { value: 'resolved_legal',    label: 'Resolved through legal action' },
  { value: 'ongoing',           label: 'Ongoing' },
]

const HOUSING_ASSISTANCE_TYPES = [
  { value: 'market_rate',       label: 'Market-rate renter' },
  { value: 'hcv_section8',      label: 'Housing Choice Voucher / Section 8' },
  { value: 'cha_pbv',           label: 'CHA Project-Based Voucher' },
  { value: 'public_housing',    label: 'Public housing resident' },
  { value: 'other_assistance',  label: 'Other housing assistance' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

// Shown only when housing_assistance_type is one of these — market-rate
// renters and "prefer not to say" never see this sub-form, per Sheenita's
// request to not lengthen the experience for renters it doesn't apply to.
const ASSISTED_TYPES = ['hcv_section8', 'cha_pbv', 'public_housing', 'other_assistance']

const ASSISTANCE_QUESTIONS = [
  { key: 'assistanceResponsive',                 label: 'Was the landlord or property manager responsive during the CHA or voucher process?' },
  { key: 'assistanceInspectionDelays',           label: 'Were there delays related to inspections, paperwork, or unit approval?' },
  { key: 'assistanceMaintainedAfterInspection',  label: 'Did management continue maintaining the property after the unit passed inspection?' },
  { key: 'assistanceRepairsCompleted',           label: 'Were repairs completed when residents reported problems?' },
  { key: 'assistanceChargesExplained',           label: 'Were rent, deposits, fees, utilities, and other charges clearly explained?' },
  { key: 'assistanceUnexplainedCharges',         label: 'Were you ever asked to pay charges you did not understand or believe were outside your required tenant portion?' },
  { key: 'assistanceCommunicatedClearly',        label: 'Did management communicate clearly with you about CHA or voucher-related issues?' },
  { key: 'assistanceTreatedDifferently',         label: 'Did you feel you were treated differently because you used housing assistance?' },
  { key: 'assistanceTransferBarriers',           label: 'Were there barriers when attempting to transfer, move, or resolve a housing issue?' },
  { key: 'assistanceWouldChooseAgain',           label: 'If you knew then what you know now, would you still have chosen this property?' },
]

// Mirrors REQUIRES_CITY_RECORD in the API's handlers.rs -- serious,
// inspectable claims must carry a city case / violation number.
const REQUIRES_CITY_RECORD = ['heat_utilities', 'habitability']

function triToBool(value) {
  if (value === 'yes') return true
  if (value === 'no') return false
  return null
}

export default function ReportIssue() {
  const [submittedAddress, setSubmittedAddress] = useState('')
  const [reporterName, setReporterName] = useState('')
  const [reporterEmail, setReporterEmail] = useState('')

  const [sentiment, setSentiment] = useState('negative')
  const [tags, setTags] = useState([])
  const [description, setDescription] = useState('')
  const [incidentDate, setIncidentDate] = useState('')
  const [reportedToCity, setReportedToCity] = useState(false)
  const [cityCaseNumber, setCityCaseNumber] = useState('')
  const [resolutionStatus, setResolutionStatus] = useState('unresolved')
  const [wouldRentAgain, setWouldRentAgain] = useState('')

  const [housingAssistanceType, setHousingAssistanceType] = useState('market_rate')
  const [assistanceAnswers, setAssistanceAnswers] = useState({})
  const [assistanceAdvice, setAssistanceAdvice] = useState('')

  const [submitStatus, setSubmitStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  // 'resolved' | 'pending_address' — set after a successful submit
  const [confirmationType, setConfirmationType] = useState(null)

  function toggleTag(value) {
    setTags((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    )
  }

  function setAssistanceAnswer(key, value) {
    setAssistanceAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const showAssistanceQuestions = ASSISTED_TYPES.includes(housingAssistanceType)
  const needsCaseNumber = tags.some((t) => REQUIRES_CITY_RECORD.includes(t))
  const showCaseNumber = reportedToCity || needsCaseNumber

  async function handleSubmit(e) {
    e.preventDefault()

    if (submittedAddress.trim().length < 5) {
      setSubmitStatus('error')
      setSubmitError('Please enter a full street address.')
      return
    }
    if (!reporterName.trim()) {
      setSubmitStatus('error')
      setSubmitError('Please enter your name. It is kept private and never shown with your report.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporterEmail.trim())) {
      setSubmitStatus('error')
      setSubmitError('Please enter a valid email address.')
      return
    }
    if (tags.length === 0) {
      setSubmitStatus('error')
      setSubmitError('Select at least one issue category.')
      return
    }
    if (needsCaseNumber && !cityCaseNumber.trim()) {
      setSubmitStatus('error')
      setSubmitError(
        'Heat, utility, and habitability reports need the 311 or building violation number so the claim can be verified.'
      )
      return
    }
    if (description.trim().length < 50) {
      setSubmitStatus('error')
      setSubmitError(
        `Description needs at least 50 characters (${description.trim().length} so far).`
      )
      return
    }
    if (!incidentDate) {
      setSubmitStatus('error')
      setSubmitError('Incident date is required.')
      return
    }

    setSubmitStatus('loading')
    setSubmitError('')

    try {
      const result = await submitReport({
        submitted_address: submittedAddress.trim(),
        entity_id: null,
        reporter_name: reporterName.trim(),
        reporter_email: reporterEmail.trim(),
        report_sentiment: sentiment,
        category_tags: tags,
        description: description.trim(),
        incident_date: incidentDate,
        reported_to_city: showCaseNumber && !!cityCaseNumber.trim(),
        city_case_number: showCaseNumber && cityCaseNumber.trim() ? cityCaseNumber.trim() : null,
        resolution_status: resolutionStatus,
        would_rent_again: wouldRentAgain === '' ? null : wouldRentAgain === 'yes',
        evidence_file_refs: null,
        housing_assistance_type: housingAssistanceType,
        assistance_responsive: showAssistanceQuestions ? triToBool(assistanceAnswers.assistanceResponsive) : null,
        assistance_inspection_delays: showAssistanceQuestions ? triToBool(assistanceAnswers.assistanceInspectionDelays) : null,
        assistance_maintained_after_inspection: showAssistanceQuestions ? triToBool(assistanceAnswers.assistanceMaintainedAfterInspection) : null,
        assistance_repairs_completed: showAssistanceQuestions ? triToBool(assistanceAnswers.assistanceRepairsCompleted) : null,
        assistance_charges_explained: showAssistanceQuestions ? triToBool(assistanceAnswers.assistanceChargesExplained) : null,
        assistance_unexplained_charges: showAssistanceQuestions ? triToBool(assistanceAnswers.assistanceUnexplainedCharges) : null,
        assistance_communicated_clearly: showAssistanceQuestions ? triToBool(assistanceAnswers.assistanceCommunicatedClearly) : null,
        assistance_treated_differently: showAssistanceQuestions ? triToBool(assistanceAnswers.assistanceTreatedDifferently) : null,
        assistance_transfer_barriers: showAssistanceQuestions ? triToBool(assistanceAnswers.assistanceTransferBarriers) : null,
        assistance_would_choose_again: showAssistanceQuestions ? triToBool(assistanceAnswers.assistanceWouldChooseAgain) : null,
        assistance_advice: showAssistanceQuestions && assistanceAdvice.trim() ? assistanceAdvice.trim() : null,
      })
      // 201 = address matched a known property; 202 = saved but pending
      setConfirmationType(result._status === 202 ? 'pending_address' : 'resolved')
      setSubmitStatus('done')
    } catch (err) {
      setSubmitStatus('error')
      setSubmitError(err.message)
    }
  }

  if (submitStatus === 'done' && confirmationType === 'resolved') {
    return (
      <div className="report-panel">
        <div className="report-success">
          <div className="report-success-icon">&#10003;</div>
          <h1>Report submitted</h1>
          <p>
            Thank you for helping keep Chicago renters informed. Your report
            goes through moderation and personal-information review before it
            may appear publicly &mdash; typically within a couple of days,
            though timing can vary.
          </p>
          <p>
            Reports are designed to be anonymous, and we work to keep personal
            information from your submission off the property page.
          </p>
          <div className="report-success-actions">
            <Link to="/search" className="cta-primary">Search another property</Link>
            <Link to="/resources" className="cta-ghost">Read tenant rights guides</Link>
          </div>
        </div>
      </div>
    )
  }

  if (submitStatus === 'done' && confirmationType === 'pending_address') {
    return (
      <div className="report-panel">
        <div className="report-success">
          <div className="report-success-icon">&#10003;</div>
          <h1>Report received</h1>
          <p>
            Your report has been saved. The address you provided
            &mdash; <strong>{submittedAddress}</strong> &mdash; is not yet
            in our database, so our team will review it before the report
            may go live. This can take a little longer than a standard
            review, sometimes a few business days.
          </p>
          <p>
            Everything else about your submission is already in the moderation
            queue. No action needed on your end.
          </p>
          <p>
            Reports are designed to be anonymous, and we work to keep personal
            information from your submission from appearing publicly.
          </p>
          <div className="report-success-actions">
            <Link to="/search" className="cta-primary">Search properties</Link>
            <Link to="/resources" className="cta-ghost">Read tenant rights guides</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="report-panel">
      <div className="report-panel-header">
        <h1>Report an Issue</h1>
        <p className="subhead">
          Tell us what happened at a specific address. Published reports
          never show who wrote them, and every report is reviewed before it
          may go live &mdash; no account required.
        </p>
        <div className="report-privacy-note">
          <span>&#128274;</span>
          We ask for your name and email so we can stand behind your report
          if it is ever challenged. They are stored separately from the
          report and are never displayed publicly.
        </div>
      </div>

      <form className="report-form" onSubmit={handleSubmit} noValidate>
        <label className="field-label">
          Property address
          <span className="field-hint">
            Enter the full street address. If it is not in our database yet,
            we will review it after you submit.
          </span>
          <input
            type="text"
            placeholder="e.g. 123 N Main St, Chicago, IL"
            value={submittedAddress}
            onChange={(e) => setSubmittedAddress(e.target.value)}
            aria-label="Property address"
            autoFocus
          />
        </label>

        <label className="field-label">
          Your name
          <span className="field-hint">Private &mdash; never shown on the report</span>
          <input
            type="text"
            autoComplete="name"
            maxLength={200}
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
          />
        </label>

        <label className="field-label">
          Your email
          <span className="field-hint">Private &mdash; only used if we need to follow up</span>
          <input
            type="email"
            autoComplete="email"
            maxLength={320}
            value={reporterEmail}
            onChange={(e) => setReporterEmail(e.target.value)}
          />
        </label>

        <label className="field-label">
          Overall experience
          <select value={sentiment} onChange={(e) => setSentiment(e.target.value)}>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
            <option value="positive">Positive</option>
          </select>
        </label>

        <div className="field-label">
          Issue category
          <span className="field-hint">Select all that apply</span>
          <div className="tag-checkbox-list">
            {CATEGORY_TAGS.map((t) => (
              <label key={t.value} className="tag-checkbox">
                <input
                  type="checkbox"
                  checked={tags.includes(t.value)}
                  onChange={() => toggleTag(t.value)}
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        <label className="field-label">
          What happened?
          <span className="field-hint">
            Minimum 50 characters &mdash; {description.trim().length < 50
              ? `${50 - description.trim().length} more needed`
              : '✓ good to go'}
          </span>
          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in your own words. What happened, when, and how did it affect you? The more detail, the more useful your report is to other renters."
          />
        </label>

        <label className="field-label">
          When did this happen?
          <input
            type="date"
            value={incidentDate}
            onChange={(e) => setIncidentDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </label>

        <label className="field-label">
          Current status
          <select
            value={resolutionStatus}
            onChange={(e) => setResolutionStatus(e.target.value)}
          >
            {RESOLUTION_STATUSES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </label>

        <label className="field-label">
          Would you rent here again?
          <select
            value={wouldRentAgain}
            onChange={(e) => setWouldRentAgain(e.target.value)}
          >
            <option value="">Prefer not to say</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        <label className="field-checkbox">
          <input
            type="checkbox"
            checked={reportedToCity}
            onChange={(e) => setReportedToCity(e.target.checked)}
          />
          I also reported this to the City of Chicago
        </label>

        {showCaseNumber && (
          <label className="field-label">
            City case number
            <span className="field-hint">
              {needsCaseNumber
                ? <>Required for heat, utility, and habitability reports &mdash; the 311 service request or building violation number. We check it against city records before the report can go live.</>
                : <>Optional &mdash; reports backed by a city record are marked as verified</>}
            </span>
            <input
              type="text"
              value={cityCaseNumber}
              onChange={(e) => setCityCaseNumber(e.target.value)}
              placeholder="e.g. 24-000123"
            />
          </label>
        )}

        <label className="field-label">
          Is this a market-rate rental, or are you navigating housing assistance?
          <span className="field-hint">Optional &mdash; helps us understand assisted-housing experiences separately</span>
          <select
            value={housingAssistanceType}
            onChange={(e) => setHousingAssistanceType(e.target.value)}
          >
            {HOUSING_ASSISTANCE_TYPES.map((h) => (
              <option key={h.value} value={h.value}>{h.label}</option>
            ))}
          </select>
        </label>

        {showAssistanceQuestions && (
          <div className="field-label">
            A few more questions about your experience
            <span className="field-hint">
              These help us understand what renting with CHA, a voucher, or
              other assistance is actually like at this property &mdash; all optional.
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              {ASSISTANCE_QUESTIONS.map((q) => (
                <label key={q.key} className="field-label" style={{ fontWeight: 400 }}>
                  {q.label}
                  <select
                    value={assistanceAnswers[q.key] || ''}
                    onChange={(e) => setAssistanceAnswer(q.key, e.target.value)}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
              ))}
              <label className="field-label" style={{ fontWeight: 400 }}>
                What do you wish another CHA or voucher renter knew before leasing here?
                <textarea
                  rows={3}
                  value={assistanceAdvice}
                  onChange={(e) => setAssistanceAdvice(e.target.value)}
                />
              </label>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <p className="status-line error">{submitError}</p>
        )}

        <button
          type="submit"
          className="cta-primary"
          disabled={submitStatus === 'loading'}
          style={{ alignSelf: 'flex-start' }}
        >
          {submitStatus === 'loading' ? 'Submitting…' : 'Submit Report'}
        </button>

        <p className="report-disclaimer">
          By submitting, you confirm this is an honest account of your
          experience. False reports violate our{' '}
          <Link to="/terms">Terms of Use</Link>.
        </p>
      </form>
    </div>
  )
}
