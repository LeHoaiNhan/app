export default function Step3Trip({ data, onChange, onNext, onBack }) {
  return (
    <div className="p-5 md:p-7">
      <div className="section-bar">Chi tiết chuyến đi</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="field-label">Quốc gia đến <span className="req">*</span></label>
          <select className="field-input" value={data.destination} onChange={e => onChange('destination', e.target.value)}>
            {['Thái Lan','Nhật Bản','Singapore','Indonesia','Mỹ','Anh','Úc','Hàn Quốc','Pháp'].map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Mục đích <span className="req">*</span></label>
          <select className="field-input" value={data.purpose} onChange={e => onChange('purpose', e.target.value)}>
            <option>Du lịch</option><option>Công tác / Kinh doanh</option>
            <option>Thăm thân</option><option>Học tập</option><option>Chữa bệnh</option>
          </select>
        </div>
        <div>
          <label className="field-label">Ngày nhập cảnh <span className="req">*</span></label>
          <input className="field-input" type="date" value={data.entryDate} onChange={e => onChange('entryDate', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Ngày xuất cảnh <span className="req">*</span></label>
          <input className="field-input" type="date" value={data.exitDate} onChange={e => onChange('exitDate', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Loại visa</label>
          <select className="field-input" value={data.visaType} onChange={e => onChange('visaType', e.target.value)}>
            <option>E-Visa (điện tử)</option><option>Visa on Arrival</option><option>Visa dán</option>
          </select>
        </div>
        <div>
          <label className="field-label">Tốc độ xử lý</label>
          <select className="field-input" value={data.processing} onChange={e => onChange('processing', e.target.value)}>
            <option>Thường — 5-7 ngày</option>
            <option>Nhanh — 2-3 ngày (+$20)</option>
            <option>Siêu nhanh — 24h (+$50)</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="field-label">Địa chỉ lưu trú tại điểm đến</label>
          <input className="field-input" type="text" placeholder="Tên khách sạn hoặc địa chỉ cụ thể" value={data.accommodation} onChange={e => onChange('accommodation', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="field-label">Ghi chú thêm</label>
          <textarea className="field-input" rows={3} placeholder="Thông tin bổ sung nếu có..." value={data.notes} onChange={e => onChange('notes', e.target.value)} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-5 border-t border-gray-100">
        <button onClick={onBack} className="text-sm font-semibold text-gray-600 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">← Quay lại</button>
        <button onClick={onNext} className="flex items-center gap-2 text-sm font-bold text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-all" style={{background:'var(--blue)'}}>
          Xem lại & Thanh toán <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  )
}
