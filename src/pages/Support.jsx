import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CHANNELS = [
  { icon:'💬', title:'Live Chat', desc:'Phản hồi trong vòng 2 phút', avail:'24/7', action:'Bắt đầu chat', color:'#EEF3FF', accent:'var(--blue)' },
  { icon:'📧', title:'Email', desc:'support@evisa.vn', avail:'Phản hồi trong 4 giờ', action:'Gửi email', color:'#F0FDF4', accent:'var(--green)' },
  { icon:'📞', title:'Hotline', desc:'1900 1234', avail:'8:00 – 22:00 mỗi ngày', action:'Gọi ngay', color:'#FFF7ED', accent:'#F5A623' },
]

export default function Support() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [sent, setSent] = useState(false)

  const handleSend = () => { setSent(true) }

  return (
    <div className="min-h-screen" style={{background:'var(--gray50)'}}>
      <Navbar />
      <div className="py-12 md:py-20 text-center px-4" style={{background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 100%)'}}>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3" style={{fontFamily:'Fraunces,serif'}}>
          Trung tâm <span style={{color:'var(--gold)'}}>hỗ trợ</span>
        </h1>
        <p className="text-white/60 text-sm md:text-base">Đội ngũ chuyên gia luôn sẵn sàng giúp bạn</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {CHANNELS.map(c => (
            <div key={c.title} className="bg-white border border-gray-200 rounded-xl p-5 text-center hover:shadow-md transition-all">
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="font-bold mb-1" style={{color:'var(--navy)'}}>{c.title}</h3>
              <p className="text-sm font-semibold text-gray-700 mb-1">{c.desc}</p>
              <p className="text-xs text-gray-400 mb-4">{c.avail}</p>
              <button className="w-full py-2.5 rounded-lg text-sm font-bold text-white" style={{background:c.accent}}>{c.action}</button>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100" style={{background:'var(--blue-light)'}}>
            <h2 className="text-lg font-bold" style={{color:'var(--navy)'}}>📝 Gửi yêu cầu hỗ trợ</h2>
            <p className="text-sm text-gray-500 mt-0.5">Chúng tôi sẽ phản hồi trong vòng 4 giờ làm việc</p>
          </div>
          <div className="p-6">
            {sent ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-lg font-bold mb-2" style={{color:'var(--navy)'}}>Yêu cầu đã được gửi!</h3>
                <p className="text-sm text-gray-500">Chúng tôi sẽ liên hệ với bạn qua email trong vòng 4 giờ.</p>
                <button onClick={() => setSent(false)} className="mt-5 text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Gửi yêu cầu khác</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Họ tên <span className="req">*</span></label>
                  <input className="field-input" placeholder="Nguyễn Văn An" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                </div>
                <div>
                  <label className="field-label">Email <span className="req">*</span></label>
                  <input className="field-input" type="email" placeholder="email@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="field-label">Chủ đề</label>
                  <select className="field-input" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}>
                    <option value="">Chọn chủ đề...</option>
                    <option>Tình trạng đơn visa</option>
                    <option>Thanh toán & hoàn tiền</option>
                    <option>Tài liệu & hồ sơ</option>
                    <option>Lỗi kỹ thuật</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="field-label">Nội dung <span className="req">*</span></label>
                  <textarea className="field-input" rows={5} placeholder="Mô tả vấn đề của bạn..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button onClick={handleSend} className="flex items-center gap-2 text-sm font-bold text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all" style={{background:'var(--blue)'}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
                    Gửi yêu cầu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
