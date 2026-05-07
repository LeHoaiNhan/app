import { useRef, useState } from 'react'
import { api, getToken, apiError } from '../../lib/api'

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateStep1(d) {
  const e = {}
  if (!d.lastName?.trim())   e.lastName   = 'Last name is required'
  if (!d.firstName?.trim())  e.firstName  = 'First name is required'
  if (!d.gender)             e.gender     = 'Gender is required'
  if (!d.dob)                e.dob        = 'Date of birth is required'
  else if (new Date(d.dob) > new Date()) e.dob = 'Date of birth must be in the past'
  if (!d.email?.trim())      e.email      = 'Email is required'
  else if (!EMAIL_RX.test(d.email)) e.email = 'Please enter a valid email'
  if (!d.phone?.trim())      e.phone      = 'Phone number is required'
  if (!d.nationality)        e.nationality= 'Nationality is required'
  if (!d.birthPlace?.trim()) e.birthPlace = 'Place of birth is required'
  if (!d.photoURL)           e.photo      = 'Please upload your portrait photo'
  return e
}

export default function Step1Personal({ data, onChange, onNext }) {
  const photoRef = useRef()
  const [drag, setDrag] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [errors, setErrors] = useState({})

  const handleNext = () => {
    const e = validateStep1(data)
    setErrors(e)
    if (Object.keys(e).length > 0) {
      const firstField = document.querySelector('[data-error="true"]')
      firstField?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onNext()
  }

  const setField = (field, value) => {
    onChange(field, value)
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setUploadError('Please choose an image file (JPG, PNG)'); return }
    if (file.size > 5 * 1024 * 1024) { setUploadError('Image too large! Max 5MB'); return }

    setUploadError(null)
    if (errors.photo) setErrors(prev => ({ ...prev, photo: undefined }))
    onChange('photo', file)
    onChange('photoURL', URL.createObjectURL(file)) // local preview while uploading

    if (!getToken()) {
      setUploadError('Please sign in before uploading your photo')
      return
    }

    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('kind', 'applicant_photo')
      const { data: res } = await api.post('/uploads/photo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange('photoURL', res.url)
      onChange('photoDocId', res.id)
    } catch (err) {
      setUploadError(apiError(err, 'Photo upload failed'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="step-body">
      <div className="section-bar">Name & Gender</div>
      <div className="form-grid-2">
        <Field label="Last name" required error={errors.lastName}>
          <input className="field-input" type="text" placeholder="e.g. SMITH"
            autoComplete="family-name" autoCapitalize="characters"
            data-error={!!errors.lastName}
            style={errors.lastName ? errorStyle : undefined}
            value={data.lastName} onChange={e => setField('lastName', e.target.value)} />
        </Field>
        <Field label="First & middle name" required error={errors.firstName}>
          <input className="field-input" type="text" placeholder="e.g. JOHN"
            autoComplete="given-name" autoCapitalize="characters"
            data-error={!!errors.firstName}
            style={errors.firstName ? errorStyle : undefined}
            value={data.firstName} onChange={e => setField('firstName', e.target.value)} />
        </Field>
        <Field label="Gender" required error={errors.gender}>
          <div className="gender-group" data-error={!!errors.gender}>
            {['Male','Female','Other'].map(g => (
              <label key={g} className={`gender-opt ${data.gender===g?'active':''}`}>
                <input type="radio" name="gender" checked={data.gender===g} onChange={() => setField('gender', g)} />
                {g}
              </label>
            ))}
          </div>
        </Field>
        <Field label="Date of birth" required error={errors.dob}>
          <input className="field-input" type="date"
            autoComplete="bday" max={new Date().toISOString().slice(0,10)}
            data-error={!!errors.dob}
            style={errors.dob ? errorStyle : undefined}
            value={data.dob} onChange={e => setField('dob', e.target.value)} />
        </Field>
      </div>

      <div style={{ height:1, background:'#F3F4F6', margin:'8px 0 20px' }} />

      <div className="section-bar">Contact information</div>
      <div className="form-grid-2">
        <Field label="Email" required error={errors.email} hint="Your e-visa will be sent to this email">
          <input className="field-input" type="email" placeholder="email@example.com"
            autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false}
            data-error={!!errors.email}
            style={errors.email ? errorStyle : undefined}
            value={data.email} onChange={e => setField('email', e.target.value)} />
        </Field>
        <Field label="Phone number" required error={errors.phone}>
          <input className="field-input" type="tel" placeholder="+1 555 123 4567"
            autoComplete="tel" inputMode="tel"
            data-error={!!errors.phone}
            style={errors.phone ? errorStyle : undefined}
            value={data.phone} onChange={e => setField('phone', e.target.value)} />
        </Field>
        <Field label="Nationality" required error={errors.nationality}>
          <select className="field-input" autoComplete="country-name"
            value={data.nationality} onChange={e => setField('nationality', e.target.value)}>
            {['United States','United Kingdom','Australia','Canada','Germany','France','Japan','South Korea','Singapore'].map(n =>
              <option key={n}>{n}</option>)}
          </select>
        </Field>
        <Field label="Place of birth" required error={errors.birthPlace}>
          <input className="field-input" type="text" placeholder="New York, USA"
            autoComplete="address-level2"
            data-error={!!errors.birthPlace}
            style={errors.birthPlace ? errorStyle : undefined}
            value={data.birthPlace} onChange={e => setField('birthPlace', e.target.value)} />
        </Field>
      </div>

      <div style={{ height:1, background:'#F3F4F6', margin:'8px 0 20px' }} />

      <div className="section-bar">Portrait photo <span className="req">*</span></div>
      <div className="photo-row">
        <div
          data-error={!!errors.photo}
          className={`upload-zone ${data.photoURL ? 'has-file' : ''}`}
          style={{ flex:1, minWidth:200, ...(errors.photo ? { borderColor: '#DC2626', background: '#FEF2F2' } : {}) }}
          onClick={() => photoRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}
        >
          <input ref={photoRef} type="file" accept="image/jpeg,image/png,image/jpg"
            style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />

          {data.photoURL ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
              <img src={data.photoURL} alt="preview"
                style={{ width:96, height:96, objectFit:'cover', borderRadius:10, border:`2px solid ${uploading ? 'var(--blue)' : 'var(--green)'}`, boxShadow:'0 2px 8px rgba(0,0,0,0.1)', opacity: uploading ? 0.7 : 1 }} />
              <p style={{ fontSize:13, fontWeight:700, color: uploading ? 'var(--blue)' : 'var(--green)' }}>
                {uploading ? '⏳ Uploading…' : '✓ Photo uploaded'}
              </p>
              {!uploading && <p style={{ fontSize:11, color:'#9CA3AF' }}>Click to change photo</p>}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <div style={{ width:48, height:48, background:'var(--blue-light)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:4 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                </svg>
              </div>
              <p style={{ fontSize:14, fontWeight:600, color:'#374151' }}>
                {drag ? 'Drop photo here...' : 'Drag & drop or click to upload'}
              </p>
              <p style={{ fontSize:12, color:'#9CA3AF' }}>JPG, PNG · White background, face front · Max 5MB</p>
            </div>
          )}
        </div>

        {(uploadError || errors.photo) && (
          <div style={{ width:'100%', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#991B1B' }}>
            {uploadError || errors.photo}
          </div>
        )}

        <div className="photo-tips" style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:10, padding:'14px 16px', width:220, flexShrink:0 }}>
          <p style={{ fontSize:13, fontWeight:700, color:'#92400E', marginBottom:8 }}>📋 Photo requirements</p>
          <ul style={{ fontSize:12, color:'#78350F', lineHeight:1.8, paddingLeft:0, listStyle:'none' }}>
            {['Plain white background','Face camera straight on','No hat, no glasses','Taken in last 6 months','At least 400 × 400px'].map(r => (
              <li key={r}>✓ {r}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="form-actions" style={{ marginTop:24, marginLeft:-28, marginRight:-28, marginBottom:-24 }}>
        <div className="secure-note">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Encrypted with SSL 256-bit
        </div>
        <button className="btn-primary" onClick={handleNext} disabled={uploading}>
          Next
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
