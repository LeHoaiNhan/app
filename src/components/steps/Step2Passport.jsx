import { useRef, useState } from 'react'
import { ErrorBanner, TrustStrip } from './_StepBits'

function validateStep2(d) {
  const e = {}
  if (!d.passportNo?.trim())       e.passportNo  = 'Passport number is required'
  if (!d.passportType)             e.passportType= 'Passport type is required'
  if (!d.issueDate)                e.issueDate   = 'Issue date is required'
  else if (new Date(d.issueDate) > new Date()) e.issueDate = 'Issue date must be in the past'
  if (!d.expiryDate)               e.expiryDate  = 'Expiry date is required'
  else if (d.issueDate && new Date(d.expiryDate) <= new Date(d.issueDate)) e.expiryDate = 'Expiry must be after issue date'
  else if (new Date(d.expiryDate) <= new Date()) e.expiryDate = 'Passport has already expired'
  if (!d.issuePlace?.trim())       e.issuePlace  = 'Place of issue is required'
  if (!d.issueCountry)             e.issueCountry= 'Issuing country is required'
  return e
}

export default function Step2Passport({ data, onChange, onNext, onBack }) {
  const fileRef = useRef()
  const [errors, setErrors] = useState({})

  const setField = (field, value) => {
    onChange(field, value)
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleNext = () => {
    const e = validateStep2(data)
    setErrors(e)
    if (Object.keys(e).length > 0) {
      document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onNext()
  }

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) { alert('File too large! Max 5MB'); return }
    onChange('passportImg', file)
    onChange('passportImgURL', URL.createObjectURL(file))
  }

  const errCount = Object.keys(errors).filter(k => errors[k]).length

  return (
    <div className="step-body">
      {errCount > 0 && <ErrorBanner count={errCount} />}
      <div className="section-bar">Passport details</div>
      <div className="form-grid-2">
        <Field label="Passport number" required error={errors.passportNo}>
          <input className="field-input" type="text" placeholder="B1234567"
            autoComplete="off" autoCapitalize="characters" spellCheck={false}
            data-error={!!errors.passportNo}
            style={errors.passportNo ? errorStyle : undefined}
            value={data.passportNo} onChange={e => setField('passportNo', e.target.value)} />
        </Field>
        <Field label="Passport type" required error={errors.passportType}>
          <select className="field-input" value={data.passportType} onChange={e => setField('passportType', e.target.value)}>
            <option>Regular passport</option>
            <option>Diplomatic passport</option>
            <option>Official passport</option>
          </select>
        </Field>
        <Field label="Issue date" required error={errors.issueDate}>
          <input className="field-input" type="date"
            max={new Date().toISOString().slice(0,10)}
            data-error={!!errors.issueDate}
            style={errors.issueDate ? errorStyle : undefined}
            value={data.issueDate} onChange={e => setField('issueDate', e.target.value)} />
        </Field>
        <Field label="Expiry date" required error={errors.expiryDate}
          hint="Must be valid for at least 6 months from your entry date">
          <input className="field-input" type="date"
            min={new Date().toISOString().slice(0,10)}
            data-error={!!errors.expiryDate}
            style={errors.expiryDate ? errorStyle : undefined}
            value={data.expiryDate} onChange={e => setField('expiryDate', e.target.value)} />
        </Field>
        <Field label="Place of issue" required error={errors.issuePlace}>
          <input className="field-input" type="text" placeholder="New York Passport Agency"
            data-error={!!errors.issuePlace}
            style={errors.issuePlace ? errorStyle : undefined}
            value={data.issuePlace} onChange={e => setField('issuePlace', e.target.value)} />
        </Field>
        <Field label="Issuing country" required error={errors.issueCountry}>
          <select className="field-input" value={data.issueCountry} onChange={e => setField('issueCountry', e.target.value)}>
            {['United States','United Kingdom','Australia','Canada','Germany','France','Japan'].map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <div style={{ height:1, background:'#F3F4F6', margin:'8px 0 20px' }} />
      <div className="section-bar">Passport info-page photo</div>

      <div
        className={`upload-zone ${data.passportImgURL ? 'has-file' : ''}`}
        onClick={() => fileRef.current.click()}
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
        onDragOver={e => e.preventDefault()}
      >
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
          onChange={e => handleFile(e.target.files[0])} />
        {data.passportImgURL ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <img src={data.passportImgURL} alt="passport"
              style={{ height:120, maxWidth:'100%', objectFit:'contain', borderRadius:8, border:'2px solid var(--green)', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }} />
            <p style={{ fontSize:13, fontWeight:700, color:'var(--green)' }}>✓ Photo uploaded</p>
            <p style={{ fontSize:11, color:'#9CA3AF' }}>Click to change</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
            <div style={{ width:48, height:48, background:'var(--blue-light)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:4 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
            </div>
            <p style={{ fontSize:14, fontWeight:600, color:'#374151' }}>Upload your passport info page</p>
            <p style={{ fontSize:12, color:'#9CA3AF' }}>Sharp, all 4 corners visible · JPG, PNG · Max 5MB</p>
          </div>
        )}
      </div>

      <div className="form-actions" style={{ marginTop:24, marginLeft:-28, marginRight:-28, marginBottom:0 }}>
        <button className="btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={handleNext}>
          Continue to Trip details
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      <TrustStrip />
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
