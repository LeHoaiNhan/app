import { useState } from 'react'

export default function Step4Payment({ formData, onBack }) {
  const [pay, setPay] = useState('card')
  const [card, setCard] = useState({ number:'', expiry:'', cvv:'' })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const fee = formData.trip?.processing?.includes('Nhanh —') ? 69 : formData.trip?.processing?.includes('Siêu') ? 99 : 49

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 1800)
  }

  if (done) return (
    <div className="p-8 text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{background:'var(--green-light)'}}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h2 className="text-2xl font-black mb-2" style={{fontFamily:'Fraunces,serif',color:'var(--navy)'}}>Đơn đã nộp thành công!</h2>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">Chúng tôi đã nhận đơn visa. Email xác nhận<br/>sẽ được gửi trong vài phút.</p>
      <div className="inline-block bg-green-50 border border-green-200 rounded-xl px-6 py-4">
        <p className="text-xs text-gray-500 mb-1">Mã đơn của bạn</p>
        <p className="font-mono text-xl font-bold" style={{color:'var(--navy)'}}>EV-{Math.random().toString(36).slice(2,8).toUpperCase()}</p>
      </div>
    </div>
  )

  return (
    <div className="p-5 md:p-7">
      <div className="bg-green-50 border border-green-200 rounded-lg p-3.5 flex items-center gap-3 mb-6">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <div><p className="text-sm font-bold text-green-800">Hồ sơ hợp lệ!</p><p className="text-xs text-green-600">Sẵn sàng để nộp đơn</p></div>
      </div>

      <div className="section-bar">Tóm tắt đơn</div>
      <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
        {[
          ['Người nộp', `${formData.personal?.lastName||''} ${formData.personal?.firstName||''}`.trim()||'—'],
          ['Điểm đến', formData.trip?.destination||'Thái Lan'],
          ['Loại visa', formData.trip?.visaType||'E-Visa'],
          ['Xử lý', formData.trip?.processing||'Thường'],
          ['Phí visa chính phủ', '$30.00'],
          ['Phí dịch vụ', `$${fee-30}.00`],
        ].map(([l,v]) => (
          <div key={l} className="flex justify-between items-center px-4 py-3 border-b border-gray-100 text-sm">
            <span className="text-gray-500">{l}</span>
            <span className="font-semibold text-gray-800">{v}</span>
          </div>
        ))}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50">
          <span className="font-bold text-gray-800">Tổng cộng</span>
          <span className="text-lg font-black" style={{color:'var(--blue)'}}>${fee}.00</span>
        </div>
      </div>

      <div className="section-bar">Phương thức thanh toán</div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[['card','💳 Thẻ tín dụng'],['ewallet','📱 Ví điện tử']].map(([val,label]) => (
          <label key={val} className={`flex items-center gap-2.5 px-4 py-3 border-2 rounded-xl cursor-pointer text-sm font-semibold transition-all ${pay===val?'border-blue-500 bg-blue-50 text-blue-700':'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            <input type="radio" name="pay" className="hidden" checked={pay===val} onChange={() => setPay(val)} />
            {label}
          </label>
        ))}
      </div>

      {pay==='card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div className="md:col-span-2">
            <label className="field-label">Số thẻ <span className="req">*</span></label>
            <input className="field-input" placeholder="1234 5678 9012 3456" value={card.number} onChange={e => setCard({...card,number:e.target.value})} />
          </div>
          <div>
            <label className="field-label">Hết hạn <span className="req">*</span></label>
            <input className="field-input" placeholder="MM/YY" value={card.expiry} onChange={e => setCard({...card,expiry:e.target.value})} />
          </div>
          <div>
            <label className="field-label">CVV <span className="req">*</span></label>
            <input className="field-input" placeholder="123" value={card.cvv} onChange={e => setCard({...card,cvv:e.target.value})} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-100">
        <button onClick={onBack} className="text-sm font-semibold text-gray-600 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">← Quay lại</button>
        <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-2 text-sm font-bold text-white px-6 py-2.5 rounded-lg transition-all disabled:opacity-70" style={{background:'var(--green)'}}>
          {loading ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="31" strokeDashoffset="12"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          {loading ? 'Đang xử lý...' : `Nộp & Thanh toán $${fee}`}
        </button>
      </div>
    </div>
  )
}
