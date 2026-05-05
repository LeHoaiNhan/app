import { useRef } from 'react'
import Navbar from '../components/Navbar'
import ApplicationForm from '../components/ApplicationForm'
import Footer from '../components/Footer'

const STATS = [
  { num:'99%',  label:'Tỷ lệ chấp thuận' },
  { num:'10+',  label:'Năm kinh nghiệm' },
  { num:'24/7', label:'Hỗ trợ tiếng Việt' },
  { num:'150+', label:'Quốc gia phục vụ' },
]
const FEATURES = [
  { icon:'⚡', bg:'#EEF3FF', title:'Nhanh chóng', desc:'Hoàn tất đơn trong 10 phút. Nhận visa trong 24h với gói ưu tiên.' },
  { icon:'🔒', bg:'#F0FDF4', title:'An toàn tuyệt đối', desc:'Mã hóa SSL 256-bit. Dữ liệu bảo vệ theo tiêu chuẩn quốc tế.' },
  { icon:'🏆', bg:'#FFF7ED', title:'99% chấp thuận', desc:'Chuyên gia kiểm tra hồ sơ kỹ lưỡng trước khi nộp.' },
]
const DESTINATIONS = ['🇹🇭 Thái Lan','🇯🇵 Nhật Bản','🇸🇬 Singapore','🇰🇷 Hàn Quốc','🇺🇸 Mỹ','🇬🇧 Anh','🇦🇺 Úc','🇦🇪 Dubai']

export default function Home() {
  const formRef = useRef()
  const scroll = () => formRef.current?.scrollIntoView({ behavior:'smooth', block:'start' })

  return (
    <div style={{ minHeight:'100vh', background:'#F9FAFB' }}>
      <Navbar onApplyClick={scroll} />

      {/* ── HERO ── */}
      <section style={{ background:'linear-gradient(135deg,#0B1D3A 0%,#1a3060 55%,#0d2451 100%)', padding:'64px 20px 72px', position:'relative', overflow:'hidden' }}>
        {/* Glow */}
        <div style={{ position:'absolute', top:-80, right:-80, width:440, height:440, background:'radial-gradient(circle,rgba(27,79,216,0.25) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:'30%', width:320, height:320, background:'radial-gradient(circle,rgba(245,166,35,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1024, margin:'0 auto', display:'flex', flexWrap:'wrap', gap:40, alignItems:'center' }}>
          {/* Left text */}
          <div style={{ flex:1, minWidth:280 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(245,166,35,0.15)', border:'1px solid rgba(245,166,35,0.3)', color:'var(--gold)', padding:'6px 14px', borderRadius:50, fontSize:13, fontWeight:600, marginBottom:20 }}>
              <span className="pulse" style={{ width:8, height:8, background:'var(--gold)', borderRadius:'50%', display:'inline-block' }} />
              Được tin dùng bởi 2 triệu+ người dùng
            </div>
            <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(36px,6vw,56px)', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:16 }}>
              Visa du lịch<br/>
              <span style={{ color:'var(--gold)' }}>nhanh & dễ dàng</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,0.68)', fontSize:17, lineHeight:1.7, marginBottom:28 }}>
              Nộp đơn visa trực tuyến chỉ trong 10 phút.<br/>
              Chuyên gia hỗ trợ 24/7 từng bước.
            </p>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <button onClick={scroll} className="btn-primary" style={{ fontSize:15, padding:'13px 28px' }}>
                Đăng ký visa ngay →
              </button>
              <a href="#how" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'13px 22px', border:'1.5px solid rgba(255,255,255,0.25)', borderRadius:8, color:'rgba(255,255,255,0.8)', fontSize:15, fontWeight:600, textDecoration:'none', transition:'all .15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'}
              >Xem hướng dẫn</a>
            </div>
          </div>

          {/* Right: search card */}
          <div style={{ flex:'0 0 auto', width:'100%', maxWidth:420 }}>
            <div style={{ background:'white', borderRadius:16, padding:'24px', boxShadow:'0 24px 64px rgba(0,0,0,0.3)' }}>
              <p style={{ fontSize:15, fontWeight:700, color:'var(--navy)', marginBottom:16 }}>🔍 Kiểm tra visa bạn cần</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                <div>
                  <label className="field-label">Quốc tịch</label>
                  <select className="field-input">
                    {['Việt Nam','Mỹ','Nhật Bản','Hàn Quốc','Anh','Pháp'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Điểm đến</label>
                  <select className="field-input">
                    {['Thái Lan','Nhật Bản','Singapore','Mỹ','Anh','Úc'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={scroll} className="btn-primary" style={{ width:'100%', padding:'12px', fontSize:15 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Kiểm tra ngay
              </button>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:14, paddingTop:14, borderTop:'1px solid #F3F4F6' }}>
                {[['🔒','SSL 256-bit'],['⏱','Duyệt 24h'],['💰','Hoàn tiền']].map(([i,l]) => (
                  <span key={l} style={{ fontSize:12, color:'#6B7280', fontWeight:500 }}>{i} {l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:'white', padding:'40px 20px', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, textAlign:'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily:'Fraunces,serif', fontSize:38, fontWeight:900, color:'var(--blue)', lineHeight:1 }}>{s.num}</div>
              <div style={{ fontSize:14, color:'#6B7280', marginTop:6, fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <style>{`@media(max-width:600px){.stats-grid{grid-template-columns:1fr 1fr!important}}`}</style>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Quy trình 4 bước đơn giản</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Từ đăng ký đến nhận visa chỉ trong vài ngày</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
            {[
              ['01','Chọn điểm đến','Kiểm tra yêu cầu visa và chọn loại phù hợp','var(--blue-light)','var(--blue)'],
              ['02','Điền thông tin','Hoàn tất form 4 bước trong 10 phút','#F0FDF4','var(--green)'],
              ['03','Thanh toán','Thanh toán an toàn qua thẻ hoặc ví điện tử','#FFF7ED','#F59E0B'],
              ['04','Nhận visa','Email visa điện tử trong thời gian đã chọn','#FDF4FF','#9333EA'],
            ].map(([n,t,d,bg,col]) => (
              <div key={n} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:20, textAlign:'center' }}>
                <div style={{ width:52, height:52, background:bg, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontFamily:'Fraunces,serif', fontSize:22, fontWeight:900, color:col }}>{n}</div>
                <h3 style={{ fontSize:15, fontWeight:700, color:'var(--navy)', marginBottom:6 }}>{t}</h3>
                <p style={{ fontSize:13, color:'#6B7280', lineHeight:1.6 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ── */}
      <div ref={formRef}><ApplicationForm /></div>

      {/* ── FEATURES ── */}
      <section style={{ background:'white', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Tại sao chọn eVisa?</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Chúng tôi đơn giản hóa quy trình để bạn tập trung vào chuyến đi</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:18 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ padding:22, border:'1px solid #E5E7EB', borderRadius:14, transition:'all .2s', cursor:'default' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 24px rgba(27,79,216,0.1)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='var(--blue)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#E5E7EB' }}
              >
                <div style={{ width:46, height:46, background:f.bg, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:14 }}>{f.icon}</div>
                <h3 style={{ fontSize:16, fontWeight:700, color:'var(--navy)', marginBottom:7 }}>{f.title}</h3>
                <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ── */}
      <section style={{ background:'#F9FAFB', padding:'48px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <h2 style={{ fontFamily:'Fraunces,serif', fontSize:28, fontWeight:900, color:'var(--navy)', marginBottom:20, textAlign:'center' }}>Điểm đến phổ biến</h2>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            {DESTINATIONS.map(d => (
              <button key={d} onClick={scroll}
                style={{ padding:'10px 18px', background:'white', border:'1.5px solid #E5E7EB', borderRadius:50, fontSize:14, fontWeight:600, color:'#374151', cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--blue)'; e.currentTarget.style.color='var(--blue)'; e.currentTarget.style.background='var(--blue-light)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.color='#374151'; e.currentTarget.style.background='white' }}
              >{d}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'var(--navy)', padding:'56px 20px', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Fraunces,serif', fontSize:30, fontWeight:900, color:'white', marginBottom:10 }}>Sẵn sàng cho chuyến đi?</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:15, marginBottom:24 }}>Hơn 2 triệu người đã tin tưởng eVisa</p>
        <button onClick={scroll} style={{ background:'var(--gold)', color:'var(--navy)', border:'none', borderRadius:10, padding:'14px 32px', fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:'inherit', transition:'opacity .15s' }}
          onMouseEnter={e => e.target.style.opacity='.88'}
          onMouseLeave={e => e.target.style.opacity='1'}
        >Đăng ký visa ngay →</button>
      </section>

      <Footer />
    </div>
  )
}
