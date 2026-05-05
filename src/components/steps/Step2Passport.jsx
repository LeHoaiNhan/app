import { useRef, useState } from 'react'

export default function Step2Passport({ data, onChange, onNext, onBack }) {
  const fileRef = useRef()
  const [preview, setPreview] = useState(null)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setPreview(URL.createObjectURL(file))
    onChange('passportImg', file)
  }

  return (
    <div className="p-5 md:p-7">
      <div className="section-bar">Chi tiết hộ chiếu</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="field-label">Số hộ chiếu <span className="req">*</span></label>
          <input className="field-input" type="text" placeholder="B1234567" value={data.passportNo} onChange={e => onChange('passportNo', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Loại hộ chiếu <span className="req">*</span></label>
          <select className="field-input" value={data.passportType} onChange={e => onChange('passportType', e.target.value)}>
            <option>Hộ chiếu phổ thông</option>
            <option>Hộ chiếu ngoại giao</option>
            <option>Hộ chiếu công vụ</option>
          </select>
        </div>
        <div>
          <label className="field-label">Ngày cấp <span className="req">*</span></label>
          <input className="field-input" type="date" value={data.issueDate} onChange={e => onChange('issueDate', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Ngày hết hạn <span className="req">*</span></label>
          <input className="field-input" type="date" value={data.expiryDate} onChange={e => onChange('expiryDate', e.target.value)} />
          <p className="field-hint">Phải còn hiệu lực ít nhất 6 tháng</p>
        </div>
        <div>
          <label className="field-label">Nơi cấp <span className="req">*</span></label>
          <input className="field-input" type="text" placeholder="Cục Xuất nhập cảnh TP.HCM" value={data.issuePlace} onChange={e => onChange('issuePlace', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Quốc gia cấp <span className="req">*</span></label>
          <select className="field-input" value={data.issueCountry} onChange={e => onChange('issueCountry', e.target.value)}>
            {['Việt Nam','Mỹ','Nhật Bản','Hàn Quốc'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="h-px bg-gray-100 my-5" />
      <div className="section-bar">Ảnh trang thông tin hộ chiếu</div>
      <div
        className={`upload-zone ${preview ? 'has-file' : ''}`}
        onClick={() => fileRef.current.click()}
        onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
        onDragOver={e => e.preventDefault()}
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
        {preview ? (
          <div className="flex flex-col items-center gap-2">
            <img src={preview} alt="passport" className="h-32 object-contain rounded-lg border-2 border-green-300 shadow" />
            <p className="text-sm font-semibold text-green-600">✓ Ảnh đã tải lên</p>
            <p className="text-xs text-gray-400">Nhấn để đổi ảnh</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-1" style={{background:'var(--blue-light)'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600">Tải ảnh trang thông tin hộ chiếu</p>
            <p className="text-xs text-gray-400">Ảnh rõ nét, đủ 4 góc · JPG, PNG · Tối đa 5MB</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
        <button onClick={onBack} className="text-sm font-semibold text-gray-600 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">← Quay lại</button>
        <button onClick={onNext} className="flex items-center gap-2 text-sm font-bold text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-all" style={{background:'var(--blue)'}}>
          Tiếp theo <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  )
}
