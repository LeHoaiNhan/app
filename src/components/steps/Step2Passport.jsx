import { useRef, useState } from 'react'
import { api, getToken, apiError } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'
import { ErrorBanner, TrustStrip, Field, ERROR_STYLE } from './_StepBits'

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
  if (!d.passportImgURL)           e.passportImg = 'Please upload a photo of your passport info page'
  return e
}

export default function Step2Passport({ data, onChange, onNext, onBack }) {
  const { setShowLoginModal } = useAuth()
  const fileRef = useRef()
  const [errors, setErrors] = useState({})
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)

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

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setUploadError('Please choose an image file (JPG, PNG)'); return }
    if (file.size > 5 * 1024 * 1024) { setUploadError('Image too large! Max 5MB'); return }

    setUploadError(null)
    if (errors.passportImg) setErrors(prev => ({ ...prev, passportImg: undefined }))
    onChange('passportImg', file)
    onChange('passportImgURL', URL.createObjectURL(file))

    if (!getToken()) {
      setUploadError('Please sign in before uploading your passport photo')
      setShowLoginModal(true)
      return
    }

    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('kind', 'passport_scan')
      const { data: res } = await api.post('/uploads/photo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onChange('passportImgURL', res.url)
      onChange('passportImgDocId', res.id)
    } catch (err) {
      setUploadError(apiError(err, 'Passport photo upload failed'))
    } finally {
      setUploading(false)
    }
  }

  const errCount = Object.keys(errors).filter(k => errors[k]).length

  return (
    <form className="step-body" onSubmit={(e) => { e.preventDefault(); if (!uploading) handleNext() }} noValidate>
      {errCount > 0 && <ErrorBanner count={errCount} />}
      <div className="section-bar">Passport details</div>
      <div className="form-grid-2">
        <Field label="Passport number" required error={errors.passportNo}>
          <input className="field-input" type="text" placeholder="B1234567"
            autoComplete="off" autoCapitalize="characters" spellCheck={false}
            data-error={!!errors.passportNo}
            style={errors.passportNo ? ERROR_STYLE : undefined}
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
            style={errors.issueDate ? ERROR_STYLE : undefined}
            value={data.issueDate} onChange={e => setField('issueDate', e.target.value)} />
        </Field>
        <Field label="Expiry date" required error={errors.expiryDate}
          hint="Must be valid for at least 6 months from your entry date">
          <input className="field-input" type="date"
            min={new Date().toISOString().slice(0,10)}
            data-error={!!errors.expiryDate}
            style={errors.expiryDate ? ERROR_STYLE : undefined}
            value={data.expiryDate} onChange={e => setField('expiryDate', e.target.value)} />
        </Field>
        <Field label="Place of issue" required error={errors.issuePlace}>
          <input className="field-input" type="text" placeholder="New York Passport Agency"
            data-error={!!errors.issuePlace}
            style={errors.issuePlace ? ERROR_STYLE : undefined}
            value={data.issuePlace} onChange={e => setField('issuePlace', e.target.value)} />
        </Field>
        <Field label="Issuing country" required error={errors.issueCountry}>
          <select className="field-input" value={data.issueCountry} onChange={e => setField('issueCountry', e.target.value)}>
            {['United States','United Kingdom','Australia','Canada','Germany','France','Japan'].map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <div style={{ height:1, background:'#F3F4F6', margin:'8px 0 20px' }} />
      <div className="section-bar">Passport info-page photo <span className="req">*</span></div>

      <div
        role="button"
        tabIndex={0}
        aria-label={data.passportImgURL ? 'Replace passport photo' : 'Upload passport info page'}
        aria-invalid={!!errors.passportImg}
        data-error={!!errors.passportImg}
        className={`upload-zone ${data.passportImgURL ? 'has-file' : ''}`}
        style={errors.passportImg ? ERROR_STYLE : undefined}
        onClick={() => fileRef.current.click()}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileRef.current.click() } }}
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
        onDragOver={e => e.preventDefault()}
      >
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/jpg,image/webp"
          style={{ display:'none' }} onChange={e => handleFile(e.target.files[0])} />
        {data.passportImgURL ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <img src={data.passportImgURL} alt="passport"
              style={{ height:120, maxWidth:'100%', objectFit:'contain', borderRadius:8, border:`2px solid ${uploading ? 'var(--blue)' : 'var(--green)'}`, boxShadow:'0 2px 8px rgba(0,0,0,0.1)', opacity: uploading ? 0.7 : 1 }} />
            <p style={{ fontSize:13, fontWeight:700, color: uploading ? 'var(--blue)' : 'var(--green)' }}>
              {uploading ? '⏳ Uploading…' : '✓ Photo uploaded'}
            </p>
            {!uploading && <p style={{ fontSize:11, color:'#9CA3AF' }}>Click to change</p>}
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

      {(uploadError || errors.passportImg) && (
        <div style={{ marginTop:8, background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#991B1B' }}>
          {uploadError || errors.passportImg}
        </div>
      )}

      <div className="form-actions" style={{ marginTop:24, marginLeft:-28, marginRight:-28, marginBottom:0 }}>
        <button type="button" className="btn-secondary" onClick={onBack}>← Back</button>
        <button type="submit" className="btn-primary" disabled={uploading}>
          Continue to Trip details
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      <TrustStrip />
    </form>
  )
}
