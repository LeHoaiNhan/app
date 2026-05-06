export default function Step3Trip({ data, onChange, onNext, onBack }) {
  return (
    <div style={{ padding:'24px 28px' }}>
      <div className="section-bar">Trip details</div>
      <div className="form-grid-2">
        <div>
          <label className="field-label">Destination country <span className="req">*</span></label>
          <select className="field-input" value={data.destination} onChange={e => onChange('destination', e.target.value)}>
            {['Thailand','Japan','Singapore','Indonesia','South Korea','Vietnam','Turkey','Australia','India','Dubai (UAE)','Egypt'].map(d =>
              <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Trip purpose <span className="req">*</span></label>
          <select className="field-input" value={data.purpose} onChange={e => onChange('purpose', e.target.value)}>
            <option>Tourism</option>
            <option>Business / Work</option>
            <option>Visiting family</option>
            <option>Study / Research</option>
            <option>Medical treatment</option>
            <option>Transit</option>
          </select>
        </div>
        <div>
          <label className="field-label">Entry date <span className="req">*</span></label>
          <input className="field-input" type="date"
            value={data.entryDate} onChange={e => onChange('entryDate', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Exit date <span className="req">*</span></label>
          <input className="field-input" type="date"
            value={data.exitDate} onChange={e => onChange('exitDate', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Visa type</label>
          <select className="field-input" value={data.visaType} onChange={e => onChange('visaType', e.target.value)}>
            <option>E-Visa (electronic)</option>
            <option>Visa on Arrival</option>
            <option>Sticker visa at embassy</option>
          </select>
        </div>
        <div>
          <label className="field-label">Processing speed</label>
          <select className="field-input" value={data.processing} onChange={e => onChange('processing', e.target.value)}>
            <option value="normal">Standard — 5-7 business days</option>
            <option value="fast">Fast — 2-3 days (+$20)</option>
            <option value="express">Express — 24 hours (+$50)</option>
          </select>
        </div>
        <div style={{ gridColumn:'span 2' }}>
          <label className="field-label">Accommodation address at destination</label>
          <input className="field-input" type="text" placeholder="Hotel name or full address"
            value={data.accommodation} onChange={e => onChange('accommodation', e.target.value)} />
        </div>
        <div style={{ gridColumn:'span 2' }}>
          <label className="field-label">Additional notes</label>
          <textarea className="field-input" rows={3} placeholder="Any extra information..."
            value={data.notes} onChange={e => onChange('notes', e.target.value)} />
        </div>
      </div>

      <div className="form-actions" style={{ marginTop:8, marginLeft:-28, marginRight:-28, marginBottom:-24 }}>
        <button className="btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={onNext}>
          Review & Pay
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
