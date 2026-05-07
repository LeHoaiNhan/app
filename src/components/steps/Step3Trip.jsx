import { useEffect, useMemo, useState } from 'react'
import { useCountries } from '../../lib/useCountries'
import { describeStay, describeValidity, findVariant, purposesForCountry, validateTrip, variantsForApplicant } from '../../lib/visaRules'
import { ErrorBanner, TrustStrip, Field, ERROR_STYLE } from './_StepBits'

function validateStep3Local(d) {
  const e = {}
  if (!d.destination) e.destination = 'Destination is required'
  if (!d.purpose)     e.purpose     = 'Trip purpose is required'
  if (!d.entryDate)   e.entryDate   = 'Entry date is required'
  else if (new Date(d.entryDate) < new Date(new Date().toDateString())) e.entryDate = 'Entry date cannot be in the past'
  if (!d.exitDate)    e.exitDate    = 'Exit date is required'
  else if (d.entryDate && new Date(d.exitDate) <= new Date(d.entryDate)) e.exitDate = 'Exit date must be after entry date'
  return e
}

export default function Step3Trip({ data, onChange, onNext, onBack, personal = {}, passport = {} }) {
  const { countries } = useCountries()
  const [errors, setErrors] = useState({})
  const [ruleErrors, setRuleErrors] = useState([])

  const country = useMemo(() => countries.find(c => c.name === data.destination) || null, [countries, data.destination])
  const allowedVariants = useMemo(
    () => variantsForApplicant(country, { nationalityIso: personal.nationalityIso, purpose: data.purpose }),
    [country, personal.nationalityIso, data.purpose]
  )
  const variant = useMemo(() => findVariant(country, data.variantKey), [country, data.variantKey])
  const purposes = useMemo(() => purposesForCountry(country), [country])

  // Auto-pick first allowed variant when destination/purpose change.
  useEffect(() => {
    if (!country) return
    const stillAllowed = allowedVariants.some(v => v.key === data.variantKey)
    if (!stillAllowed && allowedVariants[0]) {
      onChange('variantKey', allowedVariants[0].key)
      onChange('visaType', allowedVariants[0].label)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country?.name, data.purpose, allowedVariants.length])

  // Snap purpose to one supported by the country.
  useEffect(() => {
    if (!country) return
    if (data.purpose && !purposes.includes(data.purpose)) onChange('purpose', purposes[0] || 'Tourism')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country?.name])

  const setField = (field, value) => {
    onChange(field, value)
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleVariant = (key) => {
    const v = allowedVariants.find(x => x.key === key)
    onChange('variantKey', key)
    if (v) onChange('visaType', v.label)
  }

  const handleNext = () => {
    const e = validateStep3Local(data)
    setErrors(e)
    const rule = validateTrip({ country, variant, personal, passport, trip: data })
    setRuleErrors(rule)
    if (Object.keys(e).length > 0 || rule.length > 0) {
      document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onNext()
  }

  const errCount = Object.keys(errors).filter(k => errors[k]).length + ruleErrors.length

  return (
    <form className="step-body" onSubmit={(e) => { e.preventDefault(); handleNext() }} noValidate>
      {errCount > 0 && <ErrorBanner count={errCount} />}

      {ruleErrors.length > 0 && (
        <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:13, color:'#991B1B' }}>
          <ul style={{ margin:0, paddingLeft:18 }}>
            {ruleErrors.map((m, i) => <li key={i} style={{ marginBottom:4 }}>{m}</li>)}
          </ul>
        </div>
      )}

      <h3 className="section-bar">Trip details</h3>
      <div className="form-grid-2">
        <Field label="Destination country" required error={errors.destination}>
          <select className="field-input" value={data.destination} onChange={e => setField('destination', e.target.value)}>
            {countries.length === 0 && <option>{data.destination || 'Loading…'}</option>}
            {countries.map(c => (
              <option key={c.id || c.name} value={c.name}>{c.flag} {c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Trip purpose" required error={errors.purpose}>
          <select className="field-input" value={data.purpose} onChange={e => setField('purpose', e.target.value)}>
            {purposes.map(p => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Entry date" required error={errors.entryDate}>
          <input className="field-input" type="date"
            min={new Date().toISOString().slice(0,10)}
            data-error={!!errors.entryDate}
            style={errors.entryDate ? ERROR_STYLE : undefined}
            value={data.entryDate} onChange={e => setField('entryDate', e.target.value)} />
        </Field>
        <Field label="Exit date" required error={errors.exitDate}>
          <input className="field-input" type="date"
            min={data.entryDate || new Date().toISOString().slice(0,10)}
            data-error={!!errors.exitDate}
            style={errors.exitDate ? ERROR_STYLE : undefined}
            value={data.exitDate} onChange={e => setField('exitDate', e.target.value)} />
        </Field>
        <div style={{ gridColumn:'span 2' }}>
          <Field label="Visa type" required hint={variant ? `${describeValidity(variant)} · stay ${describeStay(variant)} · gov fee $${variant.govFee}` : undefined}>
            {allowedVariants.length > 0 ? (
              <select className="field-input" value={data.variantKey || ''} onChange={e => handleVariant(e.target.value)}>
                {allowedVariants.map(v => <option key={v.key} value={v.key}>{v.label}</option>)}
              </select>
            ) : (
              <div className="field-input" style={{ color:'#9CA3AF', cursor:'not-allowed' }}>
                No visa option available for the selected nationality / purpose.
              </div>
            )}
          </Field>
        </div>
        <Field label="Processing speed">
          <select className="field-input" value={data.processing} onChange={e => setField('processing', e.target.value)}>
            <option value="normal">Standard — 5-7 business days</option>
            <option value="fast">Fast — 2-3 days (+$20)</option>
            <option value="express">Express — 24 hours (+$50)</option>
          </select>
        </Field>
        <div style={{ gridColumn:'span 2' }}>
          <Field label="Accommodation address at destination">
            <input className="field-input" type="text" placeholder="Hotel name or full address"
              value={data.accommodation} onChange={e => setField('accommodation', e.target.value)} />
          </Field>
        </div>
        <div style={{ gridColumn:'span 2' }}>
          <Field label="Additional notes">
            <textarea className="field-input" rows={3} placeholder="Any extra information..."
              value={data.notes} onChange={e => setField('notes', e.target.value)} />
          </Field>
        </div>
      </div>

      <div className="form-actions" style={{ marginTop:8, marginLeft:-28, marginRight:-28, marginBottom:0 }}>
        <button type="button" className="btn-secondary" onClick={onBack}>← Back</button>
        <button type="submit" className="btn-primary">
          Review &amp; Pay
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      <TrustStrip />
    </form>
  )
}
