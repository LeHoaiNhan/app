import { useRef } from 'react'

export default function Step2Passport({ data, onChange, onNext, onBack }) {
  const fileRef = useRef()

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) { alert('File too large! Max 5MB'); return }
    onChange('passportImg', file)
    onChange('passportImgURL', URL.createObjectURL(file))
  }

  return (
    <div style={{ padding:'24px 28px' }}>
      <div className="section-bar">Passport details</div>
      <div className="form-grid-2">
        <div>
          <label className="field-label">Passport number <span className="req">*</span></label>
          <input className="field-input" type="text" placeholder="B1234567"
            value={data.passportNo} onChange={e => onChange('passportNo', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Passport type <span className="req">*</span></label>
          <select className="field-input" value={data.passportType} onChange={e => onChange('passportType', e.target.value)}>
            <option>Regular passport</option>
            <option>Diplomatic passport</option>
            <option>Official passport</option>
          </select>
        </div>
        <div>
          <label className="field-label">Issue date <span className="req">*</span></label>
          <input className="field-input" type="date"
            value={data.issueDate} onChange={e => onChange('issueDate', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Expiry date <span className="req">*</span></label>
          <input className="field-input" type="date"
            value={data.expiryDate} onChange={e => onChange('expiryDate', e.target.value)} />
          <p className="field-hint">Must be valid for at least 6 months from your entry date</p>
        </div>
        <div>
          <label className="field-label">Place of issue <span className="req">*</span></label>
          <input className="field-input" type="text" placeholder="New York Passport Agency"
            value={data.issuePlace} onChange={e => onChange('issuePlace', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Issuing country <span className="req">*</span></label>
          <select className="field-input" value={data.issueCountry} onChange={e => onChange('issueCountry', e.target.value)}>
            {['United States','United Kingdom','Australia','Canada','Germany','France','Japan'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
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

      <div className="form-actions" style={{ marginTop:24, marginLeft:-28, marginRight:-28, marginBottom:-24 }}>
        <button className="btn-secondary" onClick={onBack}>← Back</button>
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
