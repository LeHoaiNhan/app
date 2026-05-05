import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CHANNELS = [
  { icon:'💬', title:'Live Chat',  desc:'Phản hồi trong vòng 2 phút', avail:'24/7',                 action:'Bắt đầu chat',  color:'#EEF3FF', accent:'var(--blue)',  badge:'Online' },
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

const TIMELINE_STAGES = [
  { id:'submitted', icon:'📝', label:'Đã nộp đơn',           desc:'Hệ thống đã nhận hồ sơ' },
  { id:'review',    icon:'🔍', label:'Đang kiểm tra',        desc:'Chuyên gia đang review hồ sơ' },
  { id:'sent',      icon:'📤', label:'Đã gửi cơ quan cấp',   desc:'Hồ sơ chuyển đến cơ quan visa' },
  { id:'approved',  icon:'✅', label:'Đã được duyệt',         desc:'Visa đang được tạo' },
  { id:'delivered', icon:'📧', label:'Đã gửi email',          desc:'Visa điện tử đã đến hộp thư' },
]

const STATS = [
  { num:'< 2 phút', label:'Phản hồi' },
  { num:'24/7',     label:'Hỗ trợ' },
  { num:'4 giờ',    label:'Email' },
  { num:'VN',       label:'Tiếng Việt' },
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
    <div style={{ minHeight:'100vh', background:'#F9FAFB' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ background:'linear-gradient(135deg,#0B1D3A 0%,#1a3060 55%,#0d2451 100%)', padding:'64px 20px 72px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:440, height:440, background:'radial-gradient(circle,rgba(27,79,216,0.25) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:'30%', width:320, height:320, background:'radial-gradient(circle,rgba(245,166,35,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1024, margin:'0 auto', position:'relative', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(245,166,35,0.15)', border:'1px solid rgba(245,166,35,0.3)', color:'var(--gold)', padding:'6px 14px', borderRadius:50, fontSize:13, fontWeight:600, marginBottom:20 }}>
            <span className="pulse" style={{ width:8, height:8, background:'var(--gold)', borderRadius:'50%', display:'inline-block' }} />
            Hỗ trợ 24/7 bằng tiếng Việt
          </div>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(36px,6vw,56px)', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:16 }}>
            Trung tâm <span style={{ color:'var(--gold)' }}>hỗ trợ</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.68)', fontSize:17, lineHeight:1.7, maxWidth:560, margin:'0 auto' }}>
            Tra cứu đơn, tìm câu trả lời nhanh, hoặc liên hệ trực tiếp với chuyên gia eVisa
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:'white', padding:'40px 20px', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, textAlign:'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--blue)', lineHeight:1 }}>{s.num}</div>
              <div style={{ fontSize:13, color:'#6B7280', marginTop:6, fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ORDER TRACKING ── */}
      <section style={{ background:'#F9FAFB', padding:'48px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ background:'white', borderRadius:16, border:'1px solid #E5E7EB', overflow:'hidden' }}>
            <div style={{ padding:'18px 24px', display:'flex', alignItems:'center', gap:14, background:'var(--blue-light)', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🔎</div>
              <div style={{ flex:1 }}>
                <h2 style={{ fontFamily:'Fraunces,serif', fontSize:20, fontWeight:900, color:'var(--navy)' }}>Tra cứu đơn của bạn</h2>
                <p style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>Nhập mã đơn EV-XXXXXX để xem trạng thái realtime</p>
              </div>
            </div>
            <form onSubmit={handleTrack} style={{ padding:24 }}>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <input
                  style={{ flex:'1 1 240px', padding:'12px 16px', borderRadius:12, border:'2px solid #E5E7EB', fontSize:14, fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'.05em', outline:'none' }}
                  placeholder="EV-A47B92"
                  value={orderCode}
                  onChange={e => setOrderCode(e.target.value.toUpperCase())}
                  maxLength={9}
                />
                <button type="submit" disabled={tracking} className="btn-primary" style={{ padding:'12px 28px', justifyContent:'center', opacity: tracking ? 0.7 : 1 }}>
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
                <div className="fade-up" style={{ marginTop:24 }}>
                  <div style={{ borderRadius:12, padding:16, marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap', background:'var(--green-light)', border:'1px solid #BBF7D0' }}>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:'var(--green)', textTransform:'uppercase', letterSpacing:'.06em' }}>Tìm thấy đơn</div>
                      <div style={{ fontFamily:'monospace', fontWeight:900, fontSize:18, color:'var(--navy)', marginTop:2 }}>{trackResult.code}</div>
                      <div style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>Điểm đến: <span style={{ fontWeight:600 }}>{trackResult.country}</span> · Nộp ngày: {trackResult.submittedAt}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em' }}>Trạng thái</div>
                      <div style={{ fontWeight:700, fontSize:14, color:'var(--blue)' }}>{TIMELINE_STAGES[trackResult.currentStage].label}</div>
                    </div>
                  </div>

                  <div>
                    {TIMELINE_STAGES.map((stage, i) => {
                      const done = i <= trackResult.currentStage
                      const current = i === trackResult.currentStage
                      return (
                        <div key={stage.id} style={{ display:'flex', gap:14 }}>
                          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                            <div style={{ width:38, height:38, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, background: done ? (current ? 'var(--blue)' : 'var(--green)') : '#E5E7EB', color: done ? 'white' : '#9CA3AF', boxShadow: current ? '0 0 0 4px rgba(27,79,216,0.15)' : 'none', transition:'all .2s' }}>
                              {done && !current ? '✓' : stage.icon}
                            </div>
                            {i < TIMELINE_STAGES.length - 1 && (
                              <div style={{ width:2, flex:1, marginTop:4, marginBottom:4, background: i < trackResult.currentStage ? 'var(--green)' : '#E5E7EB' }} />
                            )}
                          </div>
                          <div style={{ flex:1, paddingBottom:18, opacity: current ? 1 : (done ? 0.9 : 0.5) }}>
                            <div style={{ fontWeight:700, fontSize:14, color:'var(--navy)' }}>{stage.label}</div>
                            <div style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{stage.desc}</div>
                            {current && (
                              <span style={{ display:'inline-block', marginTop:6, fontSize:11, fontWeight:700, padding:'2px 10px', borderRadius:50, background:'var(--blue-light)', color:'var(--blue)' }}>
                                Đang diễn ra
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {trackResult && !trackResult.found && (
                <div className="fade-up" style={{ marginTop:18, borderRadius:12, padding:14, display:'flex', gap:12, alignItems:'flex-start', background:'#FEF2F2', border:'1px solid #FECACA' }}>
                  <span style={{ fontSize:22 }}>⚠️</span>
                  <div>
                    <div style={{ fontWeight:700, fontSize:14, color:'#991B1B' }}>Không tìm thấy đơn với mã này</div>
                    <p style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>Mã đơn có dạng <span style={{ fontFamily:'monospace', fontWeight:700 }}>EV-XXXXXX</span>. Kiểm tra lại trong email xác nhận.</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ── CHANNELS ── */}
      <section style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Liên hệ chuyên gia</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Chọn kênh phù hợp — chúng tôi luôn sẵn sàng</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:18 }}>
            {CHANNELS.map(c => (
              <div key={c.title} style={{ position:'relative', background:'white', border:'1px solid #E5E7EB', borderRadius:16, padding:24, textAlign:'center', transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 12px 28px rgba(11,29,58,0.08)'; e.currentTarget.style.transform='translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}
              >
                {c.badge && (
                  <span style={{ position:'absolute', top:14, right:14, display:'inline-flex', alignItems:'center', gap:5, fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:50, background:'var(--green-light)', color:'var(--green)' }}>
                    <span className="pulse" style={{ width:6, height:6, borderRadius:'50%', background:'var(--green)' }} />
                    {c.badge}
                  </span>
                )}
                <div style={{ width:64, height:64, borderRadius:16, background:c.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, margin:'0 auto 16px' }}>{c.icon}</div>
                <h3 style={{ fontWeight:900, fontSize:16, color:'var(--navy)', marginBottom:4 }}>{c.title}</h3>
                <p style={{ fontSize:14, fontWeight:600, color:'#374151', marginBottom:4 }}>{c.desc}</p>
                <p style={{ fontSize:12, color:'#9CA3AF', marginBottom:16 }}>{c.avail}</p>
                <button
                  onClick={c.title === 'Live Chat' ? () => setChatOpen(true) : undefined}
                  style={{ width:'100%', padding:'10px 16px', borderRadius:8, fontSize:13, fontWeight:700, color:'white', background:c.accent, border:'none', cursor:'pointer', fontFamily:'inherit', transition:'opacity .15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity='.88'}
                  onMouseLeave={e => e.currentTarget.style.opacity='1'}
                >
                  {c.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HELP TOPICS ── */}
      <section style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:24, gap:12, flexWrap:'wrap' }}>
            <div>
              <h2 style={{ fontFamily:'Fraunces,serif', fontSize:28, fontWeight:900, color:'var(--navy)', marginBottom:4 }}>Trung tâm trợ giúp</h2>
              <p style={{ fontSize:14, color:'#6B7280' }}>{TOPICS.reduce((s,t) => s+t.count, 0)} bài viết theo {TOPICS.length} chủ đề</p>
            </div>
            <Link to="/guide" style={{ fontSize:13, fontWeight:700, color:'var(--blue)', textDecoration:'none' }}>Xem tất cả →</Link>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14 }}>
            {TOPICS.map(t => (
              <Link key={t.title} to="/guide"
                style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:20, textDecoration:'none', display:'block', transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 20px rgba(11,29,58,0.06)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='var(--blue)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#E5E7EB' }}
              >
                <div style={{ fontSize:30, marginBottom:12 }}>{t.icon}</div>
                <h3 style={{ fontWeight:700, fontSize:14, color:'var(--navy)', marginBottom:4, lineHeight:1.3 }}>{t.title}</h3>
                <p style={{ fontSize:12, color:'#6B7280', lineHeight:1.6, marginBottom:8 }}>{t.desc}</p>
                <span style={{ fontSize:11, fontWeight:600, color:'var(--blue)' }}>{t.count} bài viết →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:920, margin:'0 auto' }}>
          <div style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:16, overflow:'hidden' }}>
            <div style={{ padding:'18px 24px', display:'flex', alignItems:'center', gap:14, background:'var(--blue-light)', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ width:44, height:44, borderRadius:12, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>📝</div>
              <div>
                <h2 style={{ fontFamily:'Fraunces,serif', fontSize:20, fontWeight:900, color:'var(--navy)' }}>Gửi yêu cầu hỗ trợ</h2>
                <p style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>Chúng tôi sẽ phản hồi qua email trong vòng 4 giờ làm việc</p>
              </div>
            </div>
            <div style={{ padding:'28px' }}>
              {sent ? (
                <div style={{ textAlign:'center', padding:'24px 12px' }}>
                  <div style={{ width:76, height:76, borderRadius:'50%', margin:'0 auto 18px', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--green-light)' }}>
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 style={{ fontFamily:'Fraunces,serif', fontSize:22, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Yêu cầu đã được gửi!</h3>
                  <p style={{ fontSize:14, color:'#6B7280', marginBottom:22 }}>Chúng tôi sẽ liên hệ với bạn qua email <span style={{ fontWeight:600, color:'var(--navy)' }}>{form.email || 'của bạn'}</span> trong 4 giờ.</p>
                  <button onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }) }} className="btn-secondary">
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSend} style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
                  <div>
                    <label className="field-label">Họ tên <span className="req">*</span></label>
                    <input className="field-input" placeholder="Nguyễn Văn An" value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
                  </div>
                  <div>
                    <label className="field-label">Email <span className="req">*</span></label>
                    <input className="field-input" type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
                  </div>
                  <div style={{ gridColumn:'1 / -1' }}>
                    <label className="field-label">Chủ đề</label>
                    <select className="field-input" value={form.subject} onChange={e => setForm({...form, subject:e.target.value})}>
                      <option value="">Chọn chủ đề...</option>
                      {TOPICS.map(t => <option key={t.title}>{t.title}</option>)}
                      <option>Khác</option>
                    </select>
                  </div>
                  <div style={{ gridColumn:'1 / -1' }}>
                    <label className="field-label">Nội dung <span className="req">*</span></label>
                    <textarea className="field-input" rows={5} placeholder="Mô tả chi tiết vấn đề của bạn..." value={form.message} onChange={e => setForm({...form, message:e.target.value})} required />
                    <p className="field-hint">Nếu liên quan đến đơn cụ thể, vui lòng đính kèm mã đơn EV-XXXXXX</p>
                  </div>
                  <div style={{ gridColumn:'1 / -1', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10, paddingTop:6 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#9CA3AF' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      Thông tin được mã hóa SSL 256-bit
                    </div>
                    <button type="submit" className="btn-primary">
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
        </div>
      </section>

      <Footer />

      <ChatWidget open={chatOpen} onToggle={() => setChatOpen(v => !v)} />
    </div>
  )
}

function ChatWidget({ open, onToggle }) {
  return (
    <>
      {open && (
        <div className="fade-up" style={{ position:'fixed', bottom:96, right:20, zIndex:90, width:'calc(100% - 40px)', maxWidth:380, background:'white', borderRadius:16, boxShadow:'0 24px 64px rgba(0,0,0,0.25)', border:'1px solid #E5E7EB', overflow:'hidden', maxHeight:'calc(100vh - 140px)' }}>
          <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:12, background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 100%)' }}>
            <div style={{ position:'relative' }}>
              <img src="https://ui-avatars.com/api/?name=eVisa+Support&background=F5A623&color=0B1D3A&size=40&bold=true" alt="" style={{ width:38, height:38, borderRadius:'50%' }} />
              <span style={{ position:'absolute', bottom:0, right:0, width:11, height:11, borderRadius:'50%', border:'2px solid white', background:'#10B981' }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontWeight:700, color:'white', fontSize:14 }}>Chuyên gia eVisa</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', gap:4 }}>
                <span className="pulse" style={{ width:6, height:6, borderRadius:'50%', background:'#10B981' }} />
                Đang online · Phản hồi trong 2 phút
              </div>
            </div>
            <button onClick={onToggle} style={{ width:30, height:30, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.8)', background:'transparent', border:'none', cursor:'pointer', transition:'background .15s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >✕</button>
          </div>

          <div style={{ padding:14, display:'flex', flexDirection:'column', gap:12, overflowY:'auto', maxHeight:280, background:'#F9FAFB' }}>
            <div style={{ display:'flex', gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, background:'var(--blue-light)', flexShrink:0 }}>👋</div>
              <div style={{ background:'white', borderRadius:16, borderTopLeftRadius:4, padding:'10px 14px', maxWidth:'80%', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize:13, color:'var(--navy)' }}>Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, background:'var(--blue-light)', flexShrink:0 }}>💡</div>
              <div style={{ background:'white', borderRadius:16, borderTopLeftRadius:4, padding:'10px 14px', maxWidth:'85%', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize:11, color:'#6B7280', marginBottom:8 }}>Câu hỏi phổ biến:</p>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {['📍 Tra cứu đơn của tôi','💳 Vấn đề thanh toán','📋 Yêu cầu hồ sơ','⏰ Thời gian xử lý'].map(q => (
                    <button key={q} style={{ textAlign:'left', fontSize:12, fontWeight:600, padding:'7px 12px', borderRadius:8, border:'1px solid #E5E7EB', background:'white', color:'var(--navy)', cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor='var(--blue)'; e.currentTarget.style.background='var(--blue-light)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.background='white' }}
                    >{q}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop:'1px solid #F3F4F6', padding:10, display:'flex', gap:8, alignItems:'center', background:'white' }}>
            <input type="text" placeholder="Nhập tin nhắn..."
              style={{ flex:1, padding:'8px 12px', borderRadius:8, fontSize:13, background:'#F9FAFB', border:'1px solid transparent', outline:'none', fontFamily:'inherit' }}
            />
            <button style={{ width:36, height:36, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'white', background:'var(--blue)', border:'none', cursor:'pointer', flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <button
        onClick={onToggle}
        aria-label="Mở chat"
        style={{ position:'fixed', bottom:20, right:20, zIndex:91, width:56, height:56, borderRadius:'50%', boxShadow:'0 12px 32px rgba(27,79,216,0.4)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', background:'linear-gradient(135deg,var(--blue) 0%,var(--blue-mid) 100%)', border:'none', cursor:'pointer', transition:'transform .15s' }}
        onMouseEnter={e => e.currentTarget.style.transform='scale(1.06)'}
        onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
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
            <span style={{ position:'absolute', top:-4, right:-4, width:20, height:20, borderRadius:'50%', fontSize:10, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--gold)', color:'var(--navy)', boxShadow:'0 2px 6px rgba(0,0,0,0.2)' }}>1</span>
          </>
        )}
      </button>
    </>
  )
}
