import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ApplicationForm from '../components/ApplicationForm'
import Footer from '../components/Footer'

const STATS = [
  { num:'99%', label:'Tỷ lệ chấp thuận' },
  { num:'10+', label:'Năm kinh nghiệm' },
  { num:'24/7', label:'Hỗ trợ tiếng Việt' },
  { num:'150+', label:'Quốc gia' },
]

const FEATURES = [
  { icon:'⚡', title:'Nhanh chóng', desc:'Hoàn tất 10 phút. Nhận visa trong 24h với gói ưu tiên.', bg:'#EEF3FF' },
  { icon:'🔒', title:'An toàn', desc:'SSL 256-bit. Dữ liệu bảo vệ theo tiêu chuẩn quốc tế.', bg:'#F0FDF4' },
  { icon:'🏆', title:'Tỷ lệ cao', desc:'99% đơn được chấp thuận nhờ chuyên gia kiểm tra kỹ.', bg:'#FFF7ED' },
]

export default function Home() {
  const formRef = useRef()
  const scroll = () => formRef.current?.scrollIntoView({ behavior:'smooth', block:'start' })

  return (
    <div className="min-h-screen" style={{background:'var(--gray50)'}}>
      <Navbar onApplyClick={scroll} />

      {/* HERO */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden" style={{background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 60%,#0d2451 100%)'}}>
        <div className="absolute top-0 right-0 w-96 h-96 opacity-20 pointer-events-none" style={{background:'radial-gradient(circle,var(--blue) 0%,transparent 70%)'}} />
        <div className="max-w-5xl mx-auto">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-5" style={{background:'rgba(245,166,35,0.15)',border:'1px solid rgba(245,166,35,0.3)',color:'var(--gold)'}}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{background:'var(--gold)'}} />
              Được tin dùng bởi 2 triệu+ người dùng
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4" style={{fontFamily:'Fraunces,serif'}}>
              Visa du lịch<br/><span style={{color:'var(--gold)'}}>nhanh & dễ dàng</span>
            </h1>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8">
              Nộp đơn visa trực tuyến chỉ trong 10 phút.<br/>Chuyên gia hỗ trợ 24/7 từng bước.
            </p>

            {/* Quick check card */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-2xl max-w-lg">
              <p className="text-sm font-bold mb-4" style={{color:'var(--navy)'}}>Kiểm tra visa bạn cần</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="field-label">Quốc tịch</label>
                  <select className="field-input">
                    {['Việt Nam','Mỹ','Nhật Bản','Hàn Quốc'].map(n=><option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Điểm đến</label>
                  <select className="field-input">
                    {['Thái Lan','Nhật Bản','Singapore','Mỹ'].map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={scroll} className="w-full py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-all" style={{background:'var(--blue)'}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                Kiểm tra ngay
              </button>
              <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                {['🔒 SSL 256-bit','⏱ Duyệt 24h','💰 Hoàn tiền 100%'].map(t=>(
                  <span key={t} className="text-xs text-gray-500 font-medium">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(s=>(
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-black mb-1" style={{fontFamily:'Fraunces,serif',color:'var(--blue)'}}>{s.num}</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FORM */}
      <div ref={formRef}><ApplicationForm /></div>

      {/* FEATURES */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-black mb-2" style={{fontFamily:'Fraunces,serif',color:'var(--navy)'}}>Tại sao chọn eVisa?</h2>
            <p className="text-gray-500 text-sm">Đơn giản hóa quy trình để bạn tập trung vào chuyến đi</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map(f=>(
              <div key={f.title} className="p-5 rounded-xl border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4" style={{background:f.bg}}>{f.icon}</div>
                <h3 className="font-bold mb-2" style={{color:'var(--navy)'}}>{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 text-center" style={{background:'var(--navy)'}}>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3" style={{fontFamily:'Fraunces,serif'}}>
          Sẵn sàng cho chuyến đi?
        </h2>
        <p className="text-white/60 text-sm mb-6">Hơn 2 triệu người đã tin tưởng eVisa</p>
        <button onClick={scroll} className="px-8 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all" style={{background:'var(--gold)',color:'var(--navy)'}}>
          Đăng ký visa ngay →
        </button>
      </section>

      <Footer />
    </div>
  )
}
