import { useRef, useState } from 'react'

export default function Step1Personal({ data, onChange, onNext }) {
  const photoRef = useRef()
  const [photoPreview, setPhotoPreview] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) { alert('Ảnh quá lớn! Tối đa 5MB'); return }
    const url = URL.createObjectURL(file)
    setPhotoPreview(url)
    onChange('photo', file)
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className="p-5 md:p-7">
      <div className="section-bar">Họ tên & Giới tính</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="field-label">Họ <span className="req">*</span></label>
          <input className="field-input" type="text" placeholder="VD: NGUYEN" value={data.lastName} onChange={e => onChange('lastName', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Tên đệm & Tên <span className="req">*</span></label>
          <input className="field-input" type="text" placeholder="VD: VAN AN" value={data.firstName} onChange={e => onChange('firstName', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Giới tính <span className="req">*</span></label>
          <div className="flex gap-2">
            {['Nam','Nữ','Khác'].map(g => (
              <label key={g} className={`flex-1 flex items-center gap-2 px-3 py-2.5 border-2 rounded-lg cursor-pointer text-sm font-semibold transition-all ${data.gender===g ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                <input type="radio" name="gender" className="hidden" checked={data.gender===g} onChange={() => onChange('gender', g)} />
                {g}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="field-label">Ngày sinh <span className="req">*</span></label>
          <input className="field-input" type="date" value={data.dob} onChange={e => onChange('dob', e.target.value)} />
        </div>
      </div>

      <div className="h-px bg-gray-100 my-5" />
      <div className="section-bar">Liên hệ</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="field-label">Email <span className="req">*</span></label>
          <input className="field-input" type="email" placeholder="email@example.com" value={data.email} onChange={e => onChange('email', e.target.value)} />
          <p className="field-hint">Visa sẽ gửi về email này</p>
        </div>
        <div>
          <label className="field-label">Số điện thoại <span className="req">*</span></label>
          <input className="field-input" type="tel" placeholder="+84 xxx xxx xxx" value={data.phone} onChange={e => onChange('phone', e.target.value)} />
        </div>
        <div>
          <label className="field-label">Quốc tịch <span className="req">*</span></label>
          <select className="field-input" value={data.nationality} onChange={e => onChange('nationality', e.target.value)}>
            {['Việt Nam','Mỹ','Nhật Bản','Hàn Quốc','Trung Quốc','Pháp','Đức'].map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="field-label">Nơi sinh <span className="req">*</span></label>
          <input className="field-input" type="text" placeholder="TP. Hồ Chí Minh, Việt Nam" value={data.birthPlace} onChange={e => onChange('birthPlace', e.target.value)} />
        </div>
      </div>

      <div className="h-px bg-gray-100 my-5" />
      <div className="section-bar">Ảnh chân dung</div>

      <div className="flex flex-col md:flex-row gap-5 items-start">
        {/* Upload zone */}
        <div
          className={`upload-zone flex-1 ${dragOver ? 'border-blue-400 bg-blue-50' : ''} ${photoPreview ? 'has-file' : ''}`}
          onClick={() => photoRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />
          {photoPreview ? (
            <div className="flex flex-col items-center gap-2">
              <img src={photoPreview} alt="preview" className="w-24 h-24 object-cover rounded-lg border-2 border-green-300 shadow" />
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
              <p className="text-sm font-semibold text-gray-600">Kéo thả hoặc nhấn để tải ảnh</p>
              <p className="text-xs text-gray-400">JPG, PNG · Nền trắng, mặt thẳng · Tối đa 5MB</p>
            </div>
          )}
        </div>

        {/* Requirements */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 w-full md:w-56 flex-shrink-0">
          <p className="font-bold mb-2">📋 Yêu cầu ảnh:</p>
          <ul className="space-y-1 text-xs">
            <li>✓ Nền trắng đồng nhất</li>
            <li>✓ Mặt thẳng, nhìn vào camera</li>
            <li>✓ Không đội mũ, không đeo kính</li>
            <li>✓ Ảnh chụp trong vòng 6 tháng</li>
            <li>✓ Kích thước tối thiểu 400×400px</li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Thông tin được mã hóa & bảo mật
        </div>
        <button onClick={onNext} className="flex items-center gap-2 text-sm font-bold text-white px-6 py-2.5 rounded-lg transition-all hover:opacity-90" style={{background:'var(--blue)'}}>
          Tiếp theo
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  )
}
