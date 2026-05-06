import { useRef, useState } from 'react'

export default function Step1Personal({ data, onChange, onNext }) {
  const photoRef = useRef()
  const [drag, setDrag] = useState(false)

  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Please choose an image file (JPG, PNG)'); return }
    if (file.size > 5 * 1024 * 1024) { alert('Image too large! Max 5MB'); return }
    onChange('photo', file)
    onChange('photoURL', URL.createObjectURL(file))
  }

  const s = { padding:'24px 28px' }

  return (
    <div style={s}>
      <div className="section-bar">Name & Gender</div>
      <div className="form-grid-2">
        <div>
          <label className="field-label">Last name <span className="req">*</span></label>
          <input className="field-input" type="text" placeholder="e.g. SMITH"
            value={data.lastName} onChange={e => onChange('lastName', e.target.value)} />
        </div>
        <div>
          <label className="field-label">First & middle name <span className="req">*</span></label>
          <input className="field-input" type="text" placeholder="e.g. JOHN"
            value={data.firstName} onChange={e => onChange('firstName', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Gender <span className="req">*</span></label>
          <div className="gender-group">
            {['Male','Female','Other'].map(g => (
              <label key={g} className={`gender-opt ${data.gender===g?'active':''}`}>
                <input type="radio" name="gender" checked={data.gender===g} onChange={() => onChange('gender', g)} />
                {g}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="field-label">Date of birth <span className="req">*</span></label>
          <input className="field-input" type="date"
            value={data.dob} onChange={e => onChange('dob', e.target.value)} />
        </div>
      </div>

      <div style={{ height:1, background:'#F3F4F6', margin:'8px 0 20px' }} />

      <div className="section-bar">Contact information</div>
      <div className="form-grid-2">
        <div>
          <label className="field-label">Email <span className="req">*</span></label>
          <input className="field-input" type="email" placeholder="email@example.com"
            value={data.email} onChange={e => onChange('email', e.target.value)} />
          <p className="field-hint">Your e-visa will be sent to this email</p>
        </div>
        <div>
          <label className="field-label">Phone number <span className="req">*</span></label>
          <input className="field-input" type="tel" placeholder="+1 555 123 4567"
            value={data.phone} onChange={e => onChange('phone', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Nationality <span className="req">*</span></label>
          <select className="field-input" value={data.nationality} onChange={e => onChange('nationality', e.target.value)}>
            {['United States','United Kingdom','Australia','Canada','Germany','France','Japan','South Korea','Singapore'].map(n =>
              <option key={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Place of birth <span className="req">*</span></label>
          <input className="field-input" type="text" placeholder="New York, USA"
            value={data.birthPlace} onChange={e => onChange('birthPlace', e.target.value)} />
        </div>
      </div>

      <div style={{ height:1, background:'#F3F4F6', margin:'8px 0 20px' }} />

      <div className="section-bar">Portrait photo</div>
      <div style={{ display:'flex', gap:16, alignItems:'flex-start', flexWrap:'wrap' }}>
        <div
          className={`upload-zone ${data.photoURL ? 'has-file' : ''}`}
          style={{ flex:1, minWidth:200 }}
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
                style={{ width:96, height:96, objectFit:'cover', borderRadius:10, border:'2px solid var(--green)', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }} />
              <p style={{ fontSize:13, fontWeight:700, color:'var(--green)' }}>✓ Photo uploaded</p>
              <p style={{ fontSize:11, color:'#9CA3AF' }}>Click to change photo</p>
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

        <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:10, padding:'14px 16px', width:220, flexShrink:0 }}>
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
        <button className="btn-primary" onClick={onNext}>
          Next
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
