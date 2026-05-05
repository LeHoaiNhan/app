export default function Step3Trip({ data, onChange, onNext, onBack }) {
  return (
    <div style={{ padding:'24px 28px' }}>
      <div className="section-bar">Chi tiết chuyến đi</div>
      <div className="form-grid-2">
        <div>
          <label className="field-label">Quốc gia đến <span className="req">*</span></label>
          <select className="field-input" value={data.destination} onChange={e => onChange('destination', e.target.value)}>
            {['Thái Lan','Nhật Bản','Singapore','Indonesia','Hàn Quốc','Mỹ','Anh','Úc','Pháp','Đức','Dubai','Ấn Độ'].map(d =>
              <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Mục đích chuyến đi <span className="req">*</span></label>
          <select className="field-input" value={data.purpose} onChange={e => onChange('purpose', e.target.value)}>
            <option>Du lịch</option>
            <option>Công tác / Kinh doanh</option>
            <option>Thăm thân nhân</option>
            <option>Học tập / Nghiên cứu</option>
            <option>Chữa bệnh</option>
            <option>Quá cảnh</option>
          </select>
        </div>
        <div>
          <label className="field-label">Ngày nhập cảnh <span className="req">*</span></label>
          <input className="field-input" type="date"
            value={data.entryDate} onChange={e => onChange('entryDate', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Ngày xuất cảnh <span className="req">*</span></label>
          <input className="field-input" type="date"
            value={data.exitDate} onChange={e => onChange('exitDate', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Loại visa</label>
          <select className="field-input" value={data.visaType} onChange={e => onChange('visaType', e.target.value)}>
            <option>E-Visa (điện tử)</option>
            <option>Visa on Arrival</option>
            <option>Visa dán tại đại sứ quán</option>
          </select>
        </div>
        <div>
          <label className="field-label">Tốc độ xử lý</label>
          <select className="field-input" value={data.processing} onChange={e => onChange('processing', e.target.value)}>
            <option value="normal">Thường — 5-7 ngày làm việc</option>
            <option value="fast">Nhanh — 2-3 ngày (+$20)</option>
            <option value="express">Siêu nhanh — 24 giờ (+$50)</option>
          </select>
        </div>
        <div style={{ gridColumn:'span 2' }}>
          <label className="field-label">Địa chỉ lưu trú tại điểm đến</label>
          <input className="field-input" type="text" placeholder="Tên khách sạn hoặc địa chỉ cụ thể"
            value={data.accommodation} onChange={e => onChange('accommodation', e.target.value)} />
        </div>
        <div style={{ gridColumn:'span 2' }}>
          <label className="field-label">Ghi chú thêm</label>
          <textarea className="field-input" rows={3} placeholder="Thông tin bổ sung nếu có..."
            value={data.notes} onChange={e => onChange('notes', e.target.value)} />
        </div>
      </div>

      <div className="form-actions" style={{ marginTop:8, marginLeft:-28, marginRight:-28, marginBottom:-24 }}>
        <button className="btn-secondary" onClick={onBack}>← Quay lại</button>
        <button className="btn-primary" onClick={onNext}>
          Xem xác nhận & Thanh toán
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
