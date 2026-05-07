import { useState } from 'react'

function validateStep3(d) {
  const e = {}
  if (!d.destination) e.destination = 'Destination is required'
  if (!d.purpose)     e.purpose     = 'Trip purpose is required'
  if (!d.entryDate)   e.entryDate   = 'Entry date is required'
  else if (new Date(d.entryDate) < new Date(new Date().toDateString())) e.entryDate = 'Entry date cannot be in the past'
  if (!d.exitDate)    e.exitDate    = 'Exit date is required'
  else if (d.entryDate && new Date(d.exitDate) <= new Date(d.entryDate)) e.exitDate = 'Exit date must be after entry date'
  return e
}

export default function Step3Trip({ data, onChange, onNext, onBack }) {
  const [errors, setErrors] = useState({})

  const setField = (field, value) => {
    onChange(field, value)
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleNext = () => {
    const e = validateStep3(data)
    setErrors(e)
    if (Object.keys(e).length > 0) {
      document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onNext()
  }

  return (
    <div className="step-body">
      <div className="section-bar">Trip details</div>
      <div className="form-grid-2">
        <Field label="Destination country" required error={errors.destination}>
          <select className="field-input" value={data.destination} onChange={e => setField('destination', e.target.value)}>
            {['Thailand','Japan','Singapore','Indonesia','South Korea','Vietnam','Turkey','Australia','India','Dubai (UAE)','Egypt'].map(d =>
              <option key={d}>{d}</option>)}
          </select>
        </Field>
        <Field label="Trip purpose" required error={errors.purpose}>
          <select className="field-input" value={data.purpose} onChange={e => setField('purpose', e.target.value)}>
            <option>Tourism</option>
            <option>Business / Work</option>
            <option>Visiting family</option>
            <option>Study / Research</option>
            <option>Medical treatment</option>
            <option>Transit</option>
          </select>
        </Field>
        <Field label="Entry date" required error={errors.entryDate}>
          <input className="field-input" type="date"
            min={new Date().toISOString().slice(0,10)}
            data-error={!!errors.entryDate}
            style={errors.entryDate ? errorStyle : undefined}
            value={data.entryDate} onChange={e => setField('entryDate', e.target.value)} />
        </Field>
        <Field label="Exit date" required error={errors.exitDate}>
          <input className="field-input" type="date"
            min={data.entryDate || new Date().toISOString().slice(0,10)}
            data-error={!!errors.exitDate}
            style={errors.exitDate ? errorStyle : undefined}
            value={data.exitDate} onChange={e => setField('exitDate', e.target.value)} />
        </Field>
        <Field label="Visa type">
          <select className="field-input" value={data.visaType} onChange={e => setField('visaType', e.target.value)}>
            <option>E-Visa (electronic)</option>
            <option>Visa on Arrival</option>
            <option>Sticker visa at embassy</option>
          </select>
        </Field>
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

      <div className="form-actions" style={{ marginTop:8, marginLeft:-28, marginRight:-28, marginBottom:-24 }}>
        <button className="btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={handleNext}>
          Review & Pay
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

const errorStyle = { borderColor: '#DC2626', background: '#FEF2F2' }

function Field({ label, required, error, hint, children }) {
  return (
    <div>
      <label className="field-label">
        {label}{required && <span className="req"> *</span>}
      </label>
      {children}
      {error ? (
        <p style={{ fontSize:11, color:'#DC2626', marginTop:4, fontWeight:500 }}>{error}</p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  )
}
