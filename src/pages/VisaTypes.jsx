import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const TYPES = [
  {
    key:'evisa', icon:'⚡', name:'E-Visa', subtitle:'Visa điện tử tiêu chuẩn',
    accent:'#1B4FD8', bg:'#EEF3FF',
    desc:'Loại visa phổ biến nhất — nộp 100% online, nhận visa qua email. Không cần đến đại sứ quán.',
    suitable:['Du lịch ngắn hạn (14-90 ngày)','Công tác, hội nghị, đàm phán thương mại','Thăm thân nhân, bạn bè'],
    process:['Điền form online (10 phút)','Tải ảnh chân dung & hộ chiếu','Thanh toán qua thẻ / ví điện tử','Nhận visa qua email (3-7 ngày)'],
    info:{ time:'3-7 ngày', price:'từ $29', entry:'Single / Multiple' },
    countries:'80+ quốc gia',
    examples:'Thái Lan, Nhật Bản, Hàn Quốc, Dubai, Thổ Nhĩ Kỳ...',
  },
  {
    key:'voa', icon:'🛬', name:'Visa on Arrival', subtitle:'Visa cấp tại cửa khẩu',
    accent:'#F59E0B', bg:'#FFF7ED',
    desc:'Đăng ký pre-approval online trước khi đi, nhận visa khi nhập cảnh. Cần mang theo giấy tờ gốc.',
    suitable:['Du lịch tự do, tour nhóm','Có vé máy bay & khách sạn xác nhận','Đi các nước Đông Nam Á, Maldives, Nepal'],
    process:['Đăng ký pre-approval online','In thư mời / mã QR mang theo','Nộp ảnh + lệ phí tại sân bay','Nhận tem visa dán vào hộ chiếu'],
    info:{ time:'5-7 ngày + tại sân bay', price:'từ $35', entry:'Single' },
    countries:'15+ quốc gia',
    examples:'Indonesia, Sri Lanka, Maldives...',
  },
  {
    key:'eta', icon:'🚀', name:'eTA', subtitle:'Electronic Travel Authorization',
    accent:'#9333EA', bg:'#FDF4FF',
    desc:'Cho phép nhập cảnh điện tử dành cho các nước phát triển. Cấp tự động trong vài giờ, hiệu lực dài.',
    suitable:['Du lịch & công tác đến Canada, New Zealand','Quá cảnh dài hoặc visa-waiver','Người có hộ chiếu phổ biến muốn đi nhanh'],
    process:['Điền form ngắn online (5 phút)','Thanh toán phí xử lý','Nhận xác nhận trong vài giờ','Liên kết tự động với hộ chiếu'],
    info:{ time:'1-3 ngày', price:'từ $80', entry:'Multiple' },
    countries:'Canada, New Zealand, Úc',
    examples:'Hệ thống ESTA / eTA / ETA',
  },
  {
    key:'free', icon:'✅', name:'Miễn visa', subtitle:'Du lịch không cần visa',
    accent:'#10B981', bg:'#ECFDF5',
    desc:'Một số quốc gia miễn visa cho công dân Việt Nam. Bạn chỉ cần hộ chiếu còn hạn 6 tháng.',
    suitable:['Du lịch ngắn ngày (14-30 ngày)','Cuối tuần, đi nhanh, đi xa','Tiết kiệm chi phí xin visa'],
    process:['Kiểm tra hộ chiếu còn hạn ≥ 6 tháng','Đặt vé máy bay khứ hồi','Đặt phòng khách sạn (khuyến nghị)','Khai tờ khai nhập cảnh tại sân bay'],
    info:{ time:'Tức thì', price:'Miễn phí', entry:'Multiple' },
    countries:'12+ quốc gia',
    examples:'Malaysia, Hong Kong, Singapore, Lào...',
  },
]

const COMPARISON_ROWS = [
  ['Cách nộp',         'Online 100%',     'Online + tại sân bay',   'Online 100%',          'Không cần nộp'],
  ['Thời gian xử lý',  '3-7 ngày',        '5-7 ngày + tại sân bay', '1-3 ngày',             'Tức thì'],
  ['Phí dịch vụ',      'từ $29',          'từ $35',                 'từ $80',               'Miễn phí'],
  ['Số lần nhập cảnh', 'Single / Multi',  'Single',                 'Multiple',             'Multiple'],
  ['Thời gian lưu trú','14-90 ngày',      '30 ngày',                '90-180 ngày',          '14-30 ngày'],
  ['Phù hợp',          'Du lịch, công tác','Đông Nam Á, Maldives',  'Canada, NZ, Úc',       '12+ quốc gia ASEAN'],
]

const TRUST = [
  ['🔒','SSL 256-bit','Dữ liệu mã hóa'],
  ['⚡','24h xử lý','Gói siêu nhanh'],
  ['🏆','99% chấp thuận','Chuyên gia review'],
  ['💬','Hỗ trợ 24/7','Tiếng Việt'],
]

const HELPER = [
  { q:'Đi Đông Nam Á / Đông Á?',     a:'E-Visa',    icon:'🌏', accent:'#1B4FD8', desc:'Phù hợp cho Thái Lan, Nhật Bản, Hàn Quốc, Dubai...' },
  { q:'Đi Canada, NZ, Úc?',          a:'eTA',       icon:'🛫', accent:'#9333EA', desc:'eTA cấp nhanh trong vài giờ, hiệu lực 2-5 năm' },
  { q:'Đi Malaysia, Singapore, HK?', a:'Miễn visa', icon:'✅', accent:'#10B981', desc:'Không cần xin visa, chỉ cần hộ chiếu hạn 6 tháng' },
]

export default function VisaTypes() {
  const [active, setActive] = useState('evisa')
  const activeType = TYPES.find(t => t.key === active)

  const goDetail = () => document.getElementById('detail')?.scrollIntoView({ behavior:'smooth', block:'start' })

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
            Visa điện tử cho 100+ quốc gia
          </div>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(36px,6vw,56px)', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:16 }}>
            Hiểu đúng <span style={{ color:'var(--gold)' }}>loại visa</span><br/>bạn cần
          </h1>
          <p style={{ color:'rgba(255,255,255,0.68)', fontSize:17, lineHeight:1.7, marginBottom:28, maxWidth:560, marginLeft:'auto', marginRight:'auto' }}>
            4 loại visa điện tử eVisa hỗ trợ — chọn đúng loại để chuẩn bị hồ sơ nhanh và chính xác
          </p>

          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            {TYPES.map(t => (
              <button
                key={t.key}
                onClick={() => { setActive(t.key); goDetail() }}
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px 6px 6px', borderRadius:50, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'white', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .2s', backdropFilter:'blur(8px)' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'; e.currentTarget.style.transform='translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.transform='none' }}
              >
                <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.18)', fontSize:14 }}>{t.icon}</span>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section style={{ background:'white', padding:'40px 20px', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:18 }}>
          {[
            ['🌐','Nộp 100% online','Không cần đến đại sứ quán'],
            ['⚡','Xử lý nhanh','Trung bình 3-7 ngày, có gói 24h'],
            ['🔒','An toàn tuyệt đối','SSL 256-bit, chuẩn quốc tế'],
            ['💼','Giá trị pháp lý','Tương đương visa dán'],
          ].map(([icon,title,desc]) => (
            <div key={title} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ fontSize:24, lineHeight:1, marginTop:2 }}>{icon}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:'var(--navy)', marginBottom:2 }}>{title}</div>
                <div style={{ fontSize:12, color:'#6B7280' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TYPES PICKER ── */}
      <section id="detail" style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>4 loại visa điện tử</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Click vào loại bạn quan tâm để xem chi tiết</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:24 }}>
            {TYPES.map(t => {
              const isActive = active === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  style={{ position:'relative', textAlign:'left', padding:18, borderRadius:14, border: isActive ? `2px solid ${t.accent}` : '2px solid #E5E7EB', background: isActive ? t.bg : 'white', cursor:'pointer', fontFamily:'inherit', transition:'all .2s', boxShadow: isActive ? '0 8px 20px rgba(11,29,58,0.08)' : 'none' }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor='#CBD5E1'; e.currentTarget.style.transform='translateY(-2px)' } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.transform='none' } }}
                >
                  <div style={{ fontSize:30, marginBottom:8 }}>{t.icon}</div>
                  <div style={{ fontWeight:900, fontSize:15, color:'var(--navy)', marginBottom:2 }}>{t.name}</div>
                  <div style={{ fontSize:11, color:'#6B7280', lineHeight:1.4 }}>{t.subtitle}</div>
                </button>
              )
            })}
          </div>

          <div className="fade-up" key={active} style={{ background:'white', borderRadius:16, border:'1px solid #E5E7EB', overflow:'hidden' }}>
            <div style={{ background:activeType.bg, padding:'24px 28px', borderBottom:'1px solid #F3F4F6', display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={{ fontSize:54, lineHeight:1 }}>{activeType.icon}</div>
              <div style={{ flex:1 }}>
                <h3 style={{ fontFamily:'Fraunces,serif', fontSize:28, fontWeight:900, color:'var(--navy)', lineHeight:1.1 }}>{activeType.name}</h3>
                <p style={{ fontSize:13, fontWeight:700, color:activeType.accent, marginTop:4 }}>{activeType.subtitle}</p>
                <p style={{ fontSize:14, color:'#374151', marginTop:10, lineHeight:1.65 }}>{activeType.desc}</p>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:24, padding:'28px' }}>
              <div>
                <h4 style={{ fontSize:11, fontWeight:700, color:'var(--navy)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ color:activeType.accent }}>●</span> Phù hợp khi
                </h4>
                <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                  {activeType.suitable.map(s => (
                    <li key={s} style={{ display:'flex', gap:8, fontSize:14, color:'#374151', marginBottom:10 }}>
                      <span style={{ color:activeType.accent, marginTop:2 }}>✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize:11, fontWeight:700, color:'var(--navy)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ color:activeType.accent }}>●</span> Quy trình 4 bước
                </h4>
                <ol style={{ listStyle:'none', padding:0, margin:0 }}>
                  {activeType.process.map((p, i) => (
                    <li key={p} style={{ display:'flex', gap:12, fontSize:14, color:'#374151', marginBottom:12, alignItems:'flex-start' }}>
                      <div style={{ width:24, height:24, borderRadius:'50%', background:activeType.accent, color:'white', fontSize:11, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{i+1}</div>
                      <span>{p}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div style={{ padding:'0 28px 28px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:18 }}>
                {[
                  ['⏱','Thời gian',activeType.info.time],
                  ['💰','Phí dịch vụ',activeType.info.price],
                  ['🔁','Nhập cảnh',activeType.info.entry],
                ].map(([icon,label,val]) => (
                  <div key={label} style={{ background:'#F9FAFB', borderRadius:10, padding:'12px 8px', textAlign:'center' }}>
                    <div style={{ fontSize:16, marginBottom:2 }}>{icon}</div>
                    <div style={{ fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:2 }}>{label}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--navy)', lineHeight:1.3 }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderRadius:10, padding:14, marginBottom:18, background:activeType.bg, display:'flex', gap:10, alignItems:'flex-start' }}>
                <span style={{ fontSize:18 }}>🌍</span>
                <div style={{ flex:1, fontSize:13 }}>
                  <span style={{ fontWeight:700, color:activeType.accent }}>{activeType.countries}</span>
                  <span style={{ color:'#6B7280', marginLeft:8 }}>— ví dụ: {activeType.examples}</span>
                </div>
              </div>

              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <Link to="/destinations" className="btn-secondary" style={{ flex:'0 0 auto', padding:'12px 24px' }}>Xem điểm đến</Link>
                <Link to="/" className="btn-primary" style={{ flex:1, justifyContent:'center', minWidth:200 }}>
                  Đăng ký {activeType.name} ngay
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>So sánh nhanh</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Bảng so sánh giúp bạn chọn loại visa phù hợp nhất</p>
          </div>

          <div style={{ background:'white', borderRadius:14, border:'1px solid #E5E7EB', overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
              <thead>
                <tr style={{ background:'#F9FAFB', borderBottom:'1px solid #E5E7EB' }}>
                  <th style={{ textAlign:'left', padding:'16px 20px', fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em' }}>Tiêu chí</th>
                  {TYPES.map(t => (
                    <th key={t.key} style={{ textAlign:'center', padding:'16px 12px' }}>
                      <div style={{ fontSize:24, marginBottom:4 }}>{t.icon}</div>
                      <div style={{ fontSize:13, fontWeight:900, color:'var(--navy)' }}>{t.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map(([label, ...vals]) => (
                  <tr key={label} style={{ borderBottom:'1px solid #F3F4F6' }}>
                    <td style={{ padding:'14px 20px', fontWeight:600, color:'#374151' }}>{label}</td>
                    {vals.map((v, i) => (
                      <td key={i} style={{ padding:'14px 12px', textAlign:'center', color:'#6B7280' }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── DECISION HELPER ── */}
      <section style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Vẫn chưa chắc loại nào phù hợp?</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Trả lời 1 câu hỏi nhanh để được gợi ý</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:18 }}>
            {HELPER.map(c => (
              <div key={c.q} style={{ background:'white', borderRadius:14, border:'1px solid #E5E7EB', padding:22, transition:'all .2s', cursor:'default' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 24px rgba(11,29,58,0.08)'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor=c.accent }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#E5E7EB' }}
              >
                <div style={{ fontSize:30, marginBottom:12 }}>{c.icon}</div>
                <div style={{ fontSize:11, fontWeight:700, color:c.accent, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8 }}>Nếu bạn</div>
                <h3 style={{ fontWeight:700, fontSize:16, color:'var(--navy)', marginBottom:8 }}>{c.q}</h3>
                <p style={{ fontSize:12, color:'#6B7280', lineHeight:1.6, marginBottom:14 }}>{c.desc}</p>
                <div style={{ borderRadius:10, padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', background:`${c.accent}11` }}>
                  <span style={{ fontSize:12, color:'#6B7280' }}>→ Chọn loại</span>
                  <span style={{ fontSize:14, fontWeight:900, color:c.accent }}>{c.a}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section style={{ background:'white', padding:'48px 20px', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:24, textAlign:'center' }}>
          {TRUST.map(([icon,title,desc]) => (
            <div key={title}>
              <div style={{ fontSize:32, marginBottom:8 }}>{icon}</div>
              <div style={{ fontWeight:900, fontSize:14, color:'var(--navy)' }}>{title}</div>
              <div style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'var(--navy)', padding:'56px 20px', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Fraunces,serif', fontSize:30, fontWeight:900, color:'white', marginBottom:10 }}>Sẵn sàng nộp đơn?</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:15, marginBottom:24 }}>Hoàn tất hồ sơ trong 10 phút — chuyên gia kiểm tra trước khi nộp</p>
        <Link to="/" style={{ display:'inline-block', background:'var(--gold)', color:'var(--navy)', borderRadius:10, padding:'14px 32px', fontSize:16, fontWeight:800, textDecoration:'none', fontFamily:'inherit', transition:'opacity .15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity='.88'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
        >Đăng ký visa ngay →</Link>
      </section>

      <Footer />
    </div>
  )
}
