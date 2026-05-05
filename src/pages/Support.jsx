import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CHANNELS = [
  { icon:'💬', title:'Live Chat',  desc:'Phản hồi trong vòng 2 phút', avail:'24/7',                action:'Bắt đầu chat',  color:'#EEF3FF', accent:'var(--blue)',  badge:'Online' },
  { icon:'📧', title:'Email',      desc:'support@evisa.vn',           avail:'Phản hồi trong 4 giờ', action:'Gửi email',     color:'#F0FDF4', accent:'var(--green)', badge:null },
  { icon:'📞', title:'Hotline',    desc:'1900 1234',                  avail:'8:00 – 22:00 mỗi ngày',action:'Gọi ngay',      color:'#FFF7ED', accent:'#F5A623',      badge:null },
]

const TOPICS = [
  { icon:'📝', title:'Đăng ký visa',         desc:'Hướng dẫn nộp đơn, điền form',       count:8 },
  { icon:'📋', title:'Hồ sơ giấy tờ',        desc:'Yêu cầu, mẫu ảnh, văn bản',          count:12 },
  { icon:'💳', title:'Thanh toán',           desc:'Phương thức, hóa đơn, hoàn tiền',    count:6 },
  { icon:'📊', title:'Trạng thái đơn',       desc:'Tra cứu, theo dõi, cập nhật',        count:5 },
  { icon:'👤', title:'Tài khoản',            desc:'Đăng nhập, mật khẩu, bảo mật',       count:7 },
  { icon:'❌', title:'Visa bị từ chối',      desc:'Nguyên nhân, kháng nghị, hoàn phí',  count:4 },
  { icon:'🔄', title:'Hoàn tiền & hủy đơn',  desc:'Chính sách, quy trình, thời gian',   count:5 },
  { icon:'🆘', title:'Khẩn cấp',             desc:'Đơn gấp, lỗi nhập cảnh, mất visa',   count:3 },
]

// Mock timeline status — randomized based on order code
const TIMELINE_STAGES = [
  { id:'submitted', icon:'📝', label:'Đã nộp đơn',           desc:'Hệ thống đã nhận hồ sơ' },
  { id:'review',    icon:'🔍', label:'Đang kiểm tra',        desc:'Chuyên gia đang review hồ sơ' },
  { id:'sent',      icon:'📤', label:'Đã gửi cơ quan cấp',   desc:'Hồ sơ chuyển đến cơ quan visa' },
  { id:'approved',  icon:'✅', label:'Đã được duyệt',         desc:'Visa đang được tạo' },
  { id:'delivered', icon:'📧', label:'Đã gửi email',          desc:'Visa điện tử đã đến hộp thư' },
]

export default function Support() {
  const [form, setForm]   = useState({ name:'', email:'', subject:'', message:'' })
  const [sent, setSent]   = useState(false)
  const [orderCode, setOrderCode] = useState('')
  const [trackResult, setTrackResult] = useState(null)
  const [tracking, setTracking] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  const handleSend = (e) => {
    e?.preventDefault()
    setSent(true)
  }

  const handleTrack = (e) => {
    e?.preventDefault()
    if (!orderCode.trim()) return
    setTracking(true)
    setTrackResult(null)
    setTimeout(() => {
      const code = orderCode.trim().toUpperCase()
      if (!/^EV-[A-Z0-9]{6}$/.test(code)) {
        setTrackResult({ found:false })
      } else {
        // Pick a stage based on hash of code for realistic mock
        const hash = [...code].reduce((s, c) => s + c.charCodeAt(0), 0)
        const currentStage = (hash % TIMELINE_STAGES.length)
        setTrackResult({
          found:true,
          code,
          country: ['Thái Lan','Nhật Bản','Hàn Quốc','Dubai','Singapore'][hash % 5],
          submittedAt: '2026-04-28',
          currentStage,
        })
      }
      setTracking(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen" style={{ background:'#F9FAFB' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 55%,#0d2451 100%)' }}>
        <div className="absolute -top-20 -right-20 w-[440px] h-[440px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(27,79,216,0.25) 0%,transparent 70%)' }} />
        <div className="absolute -bottom-16 left-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(245,166,35,0.10) 0%,transparent 70%)' }} />

        <div className="relative max-w-4xl mx-auto px-5 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 text-xs font-semibold border" style={{ background:'rgba(245,166,35,0.15)', borderColor:'rgba(245,166,35,0.3)', color:'var(--gold)' }}>
            <span className="pulse w-2 h-2 rounded-full" style={{ background:'var(--gold)' }} />
            Hỗ trợ 24/7 bằng tiếng Việt
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight" style={{ fontFamily:'Fraunces,serif' }}>
            Trung tâm <span style={{ color:'var(--gold)' }}>hỗ trợ</span>
          </h1>
          <p className="text-white/65 text-base mb-8 max-w-lg mx-auto">
            Tra cứu đơn, tìm câu trả lời nhanh, hoặc liên hệ trực tiếp với chuyên gia eVisa
          </p>

          <div className="inline-flex items-center divide-x divide-white/15 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            {[
              ['phản hồi','< 2 phút'],
              ['hỗ trợ','24/7'],
              ['ngôn ngữ','Tiếng Việt'],
            ].map(([label, val]) => (
              <div key={label} className="px-5 md:px-7 py-3.5 text-center">
                <div className="text-white font-black text-lg leading-none" style={{ fontFamily:'Fraunces,serif' }}>{val}</div>
                <div className="text-white/55 text-[11px] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-5 py-12">
        {/* ── Order tracking ── */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3" style={{ background:'var(--blue-light)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl" style={{ background:'white' }}>🔎</div>
              <div className="flex-1">
                <h2 className="text-lg font-black" style={{ color:'var(--navy)' }}>Tra cứu đơn của bạn</h2>
                <p className="text-xs text-gray-500 mt-0.5">Nhập mã đơn EV-XXXXXX để xem trạng thái realtime</p>
              </div>
            </div>
            <form onSubmit={handleTrack} className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-mono uppercase tracking-wider outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="EV-A47B92"
                  value={orderCode}
                  onChange={e => setOrderCode(e.target.value.toUpperCase())}
                  maxLength={9}
                />
                <button type="submit" disabled={tracking} className="btn-primary justify-center px-8" style={tracking ? { opacity:0.7 } : {}}>
                  {tracking ? (
                    <>
                      <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="31" strokeDashoffset="10"/>
                      </svg>
                      Đang tra cứu
                    </>
                  ) : 'Tra cứu →'}
                </button>
              </div>

              {trackResult && trackResult.found && (
                <div className="mt-6 fade-up">
                  <div className="rounded-xl p-4 mb-5 flex items-center justify-between flex-wrap gap-3" style={{ background:'var(--green-light)', border:'1px solid #BBF7D0' }}>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color:'var(--green)' }}>Tìm thấy đơn</div>
                      <div className="font-mono font-black text-lg" style={{ color:'var(--navy)' }}>{trackResult.code}</div>
                      <div className="text-xs text-gray-600 mt-0.5">Điểm đến: <span className="font-semibold">{trackResult.country}</span> · Nộp ngày: {trackResult.submittedAt}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Trạng thái</div>
                      <div className="font-bold text-sm" style={{ color:'var(--blue)' }}>{TIMELINE_STAGES[trackResult.currentStage].label}</div>
                    </div>
                  </div>

                  <div className="space-y-0">
                    {TIMELINE_STAGES.map((stage, i) => {
                      const done = i <= trackResult.currentStage
                      const current = i === trackResult.currentStage
                      return (
                        <div key={stage.id} className="flex gap-4 relative">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0 transition-all ${current ? 'shadow-lg ring-4 ring-blue-100' : ''}`}
                              style={done ? { background:current ? 'var(--blue)' : 'var(--green)', color:'white' } : { background:'#E5E7EB', color:'#9CA3AF' }}
                            >
                              {done && !current ? '✓' : stage.icon}
                            </div>
                            {i < TIMELINE_STAGES.length - 1 && (
                              <div className="w-0.5 flex-1 my-1" style={{ background: i < trackResult.currentStage ? 'var(--green)' : '#E5E7EB' }} />
                            )}
                          </div>
                          <div className={`flex-1 pb-5 ${current ? '' : done ? 'opacity-90' : 'opacity-50'}`}>
                            <div className="font-bold text-sm" style={{ color:'var(--navy)' }}>{stage.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{stage.desc}</div>
                            {current && (
                              <div className="inline-block mt-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background:'var(--blue-light)', color:'var(--blue)' }}>
                                Đang diễn ra
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {trackResult && !trackResult.found && (
                <div className="mt-5 rounded-xl p-4 flex items-start gap-3 fade-up" style={{ background:'#FEF2F2', border:'1px solid #FECACA' }}>
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <div className="font-bold text-sm" style={{ color:'#991B1B' }}>Không tìm thấy đơn với mã này</div>
                    <p className="text-xs text-gray-600 mt-0.5">Mã đơn có dạng <span className="font-mono font-bold">EV-XXXXXX</span> (6 ký tự sau dấu gạch). Kiểm tra lại trong email xác nhận.</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* ── Channels ── */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
              Liên hệ chuyên gia
            </h2>
            <p className="text-sm text-gray-500">Chọn kênh phù hợp — chúng tôi luôn sẵn sàng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CHANNELS.map(c => (
              <div key={c.title} className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all relative">
                {c.badge && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full" style={{ background:'var(--green-light)', color:'var(--green)' }}>
                    <span className="pulse w-1.5 h-1.5 rounded-full" style={{ background:'var(--green)' }} />
                    {c.badge}
                  </span>
                )}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4" style={{ background:c.color }}>{c.icon}</div>
                <h3 className="font-black text-base mb-1" style={{ color:'var(--navy)' }}>{c.title}</h3>
                <p className="text-sm font-semibold text-gray-700 mb-1">{c.desc}</p>
                <p className="text-xs text-gray-400 mb-4">{c.avail}</p>
                <button
                  onClick={c.title === 'Live Chat' ? () => setChatOpen(true) : undefined}
                  className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ background:c.accent }}
                >
                  {c.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Help topics ── */}
        <section className="mb-12">
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black mb-1" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
                Trung tâm trợ giúp
              </h2>
              <p className="text-sm text-gray-500">{TOPICS.reduce((s,t) => s+t.count, 0)} bài viết theo {TOPICS.length} chủ đề</p>
            </div>
            <Link to="/guide" className="text-xs md:text-sm font-bold whitespace-nowrap pb-1 hover:underline" style={{ color:'var(--blue)' }}>
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {TOPICS.map(t => (
              <Link
                key={t.title}
                to="/guide"
                className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md hover:-translate-y-1 hover:border-blue-300 transition-all group"
              >
                <div className="text-3xl mb-3 transition-transform group-hover:scale-110 origin-left">{t.icon}</div>
                <h3 className="font-bold text-sm mb-1 leading-tight" style={{ color:'var(--navy)' }}>{t.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-2">{t.desc}</p>
                <span className="text-[11px] font-semibold" style={{ color:'var(--blue)' }}>{t.count} bài viết →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Contact form ── */}
        <section className="mb-4">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3" style={{ background:'var(--blue-light)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl bg-white">📝</div>
              <div>
                <h2 className="text-lg font-black" style={{ color:'var(--navy)' }}>Gửi yêu cầu hỗ trợ</h2>
                <p className="text-xs text-gray-500 mt-0.5">Chúng tôi sẽ phản hồi qua email trong vòng 4 giờ làm việc</p>
              </div>
            </div>
            <div className="p-6 md:p-8">
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background:'var(--green-light)' }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>Yêu cầu đã được gửi!</h3>
                  <p className="text-sm text-gray-500 mb-6">Chúng tôi sẽ liên hệ với bạn qua email <span className="font-semibold" style={{ color:'var(--navy)' }}>{form.email || 'của bạn'}</span> trong 4 giờ.</p>
                  <button onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }) }} className="btn-secondary">
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSend} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Họ tên <span className="req">*</span></label>
                    <input className="field-input" placeholder="Nguyễn Văn An" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
                  </div>
                  <div>
                    <label className="field-label">Email <span className="req">*</span></label>
                    <input className="field-input" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="field-label">Chủ đề</label>
                    <select className="field-input" value={form.subject} onChange={e => setForm({...form, subject:e.target.value})}>
                      <option value="">Chọn chủ đề...</option>
                      {TOPICS.map(t => <option key={t.title}>{t.title}</option>)}
                      <option>Khác</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="field-label">Nội dung <span className="req">*</span></label>
                    <textarea className="field-input" rows={5} placeholder="Mô tả chi tiết vấn đề của bạn..." value={form.message} onChange={e => setForm({...form, message:e.target.value})} required />
                    <p className="field-hint">Nếu liên quan đến đơn cụ thể, vui lòng đính kèm mã đơn EV-XXXXXX</p>
                  </div>
                  <div className="md:col-span-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      Thông tin được mã hóa SSL 256-bit
                    </div>
                    <button type="submit" className="btn-primary justify-center">
                      Gửi yêu cầu
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                      </svg>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* ── Floating chat widget ── */}
      <ChatWidget open={chatOpen} onToggle={() => setChatOpen(v => !v)} />
    </div>
  )
}

function ChatWidget({ open, onToggle }) {
  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 md:right-7 z-[90] w-[calc(100%-40px)] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden fade-up" style={{ maxHeight:'calc(100vh - 140px)' }}>
          <div className="px-5 py-4 flex items-center gap-3 relative" style={{ background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 100%)' }}>
            <div className="relative">
              <img src="https://ui-avatars.com/api/?name=eVisa+Support&background=F5A623&color=0B1D3A&size=40&bold=true" alt="" className="w-10 h-10 rounded-full" />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white" style={{ background:'#10B981' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-white text-sm">Chuyên gia eVisa</div>
              <div className="text-[11px] text-white/70 flex items-center gap-1">
                <span className="pulse w-1.5 h-1.5 rounded-full" style={{ background:'#10B981' }} />
                Đang online · Phản hồi trong 2 phút
              </div>
            </div>
            <button onClick={onToggle} className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-all">✕</button>
          </div>

          <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight:280, background:'#F9FAFB' }}>
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background:'var(--blue-light)' }}>👋</div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[80%] shadow-sm">
                <p className="text-sm" style={{ color:'var(--navy)' }}>Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background:'var(--blue-light)' }}>💡</div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%] shadow-sm">
                <p className="text-xs text-gray-500 mb-2">Câu hỏi phổ biến:</p>
                <div className="flex flex-col gap-1.5">
                  {['📍 Tra cứu đơn của tôi','💳 Vấn đề thanh toán','📋 Yêu cầu hồ sơ','⏰ Thời gian xử lý'].map(q => (
                    <button key={q} className="text-left text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all" style={{ color:'var(--navy)' }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-3 flex gap-2 items-center bg-white">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-3 py-2 rounded-lg text-sm bg-gray-50 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 border border-transparent focus:border-blue-300 transition-all"
            />
            <button className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0 transition-opacity hover:opacity-90" style={{ background:'var(--blue)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onToggle}
        className="fixed bottom-5 right-5 md:right-7 z-[91] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-105 transition-transform"
        style={{ background:'linear-gradient(135deg,var(--blue) 0%,var(--blue-mid) 100%)' }}
        aria-label="Mở chat"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 6l12 12M6 18L18 6"/>
          </svg>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white shadow-md" style={{ background:'var(--gold)', color:'var(--navy)' }}>1</span>
          </>
        )}
      </button>
    </>
  )
}
