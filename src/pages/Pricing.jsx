import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const SERVICE_FEES = { normal: 19, fast: 39, express: 69 }

const TIERS = [
  {
    key:'normal', label:'Standard', icon:'⏱',
    desc:'Đủ thời gian, chi phí tốt nhất',
    fee: SERVICE_FEES.normal,
    time:'5-7 ngày làm việc',
    features:['Chuyên gia review hồ sơ','AI kiểm tra ảnh chân dung','Mã hóa SSL 256-bit','Hỗ trợ tiếng Việt 24/7','Email cập nhật trạng thái'],
    accent:'#6B7280', bg:'#F9FAFB',
  },
  {
    key:'fast', label:'Fast', icon:'⚡',
    desc:'Lựa chọn phổ biến nhất',
    fee: SERVICE_FEES.fast,
    time:'2-3 ngày làm việc',
    features:['Tất cả tính năng Standard','Ưu tiên xử lý hồ sơ','Hoàn 100% phí dịch vụ nếu từ chối','Live Chat ưu tiên','SMS thông báo'],
    accent:'#1B4FD8', bg:'#EEF3FF', popular:true,
  },
  {
    key:'express', label:'Express', icon:'🚀',
    desc:'Nhanh nhất có thể',
    fee: SERVICE_FEES.express,
    time:'24 giờ',
    features:['Tất cả tính năng Fast','SLA 24h cam kết','Hotline trực tiếp chuyên gia','Ưu tiên đầu tiên trong queue','Hoàn 200% nếu trễ deadline'],
    accent:'#F59E0B', bg:'#FFF7ED',
  },
]

const PRICING = [
  { country:'Thái Lan',     flag:'🇹🇭', tag:'E-Visa',          gov:0,  popular:true },
  { country:'Singapore',    flag:'🇸🇬', tag:'E-Visa',          gov:15, popular:false },
  { country:'Indonesia',    flag:'🇮🇩', tag:'Visa on Arrival', gov:35, popular:false },
  { country:'Malaysia',     flag:'🇲🇾', tag:'Miễn visa',       gov:null, popular:false },
  { country:'Philippines',  flag:'🇵🇭', tag:'E-Visa',          gov:25, popular:false },
  { country:'Campuchia',    flag:'🇰🇭', tag:'E-Visa',          gov:30, popular:false },
  { country:'Myanmar',      flag:'🇲🇲', tag:'E-Visa',          gov:50, popular:false },
  { country:'Nhật Bản',     flag:'🇯🇵', tag:'E-Visa',          gov:30, popular:true },
  { country:'Hàn Quốc',     flag:'🇰🇷', tag:'E-Visa',          gov:35, popular:true },
  { country:'Đài Loan',     flag:'🇹🇼', tag:'E-Visa',          gov:30, popular:false },
  { country:'Hong Kong',    flag:'🇭🇰', tag:'Miễn visa',       gov:null, popular:false },
  { country:'Ấn Độ',        flag:'🇮🇳', tag:'E-Visa',          gov:25, popular:false },
  { country:'Sri Lanka',    flag:'🇱🇰', tag:'E-Visa',          gov:20, popular:false },
  { country:'Dubai (UAE)',  flag:'🇦🇪', tag:'E-Visa',          gov:30, popular:true },
  { country:'Qatar',        flag:'🇶🇦', tag:'E-Visa',          gov:35, popular:false },
  { country:'Thổ Nhĩ Kỳ',   flag:'🇹🇷', tag:'E-Visa',          gov:30, popular:false },
  { country:'Saudi Arabia', flag:'🇸🇦', tag:'E-Visa',          gov:80, popular:false },
  { country:'Oman',         flag:'🇴🇲', tag:'E-Visa',          gov:35, popular:false },
  { country:'Bahrain',      flag:'🇧🇭', tag:'E-Visa',          gov:40, popular:false },
  { country:'Canada',       flag:'🇨🇦', tag:'eTA',             gov:50, popular:false },
  { country:'Mexico',       flag:'🇲🇽', tag:'E-Visa',          gov:40, popular:false },
  { country:'Brazil',       flag:'🇧🇷', tag:'E-Visa',          gov:60, popular:false },
  { country:'Úc',           flag:'🇦🇺', tag:'E-Visa',          gov:95, popular:true },
  { country:'New Zealand',  flag:'🇳🇿', tag:'eTA',             gov:80, popular:false },
  { country:'Nga',          flag:'🇷🇺', tag:'E-Visa',          gov:40, popular:false },
  { country:'Albania',      flag:'🇦🇱', tag:'E-Visa',          gov:30, popular:false },
  { country:'Ai Cập',       flag:'🇪🇬', tag:'E-Visa',          gov:40, popular:false },
  { country:'Kenya',        flag:'🇰🇪', tag:'E-Visa',          gov:40, popular:false },
]

const TAG_COLORS = {
  'E-Visa':          { bg:'#EEF3FF', text:'#1B4FD8' },
  'Visa on Arrival': { bg:'#FFF7ED', text:'#D97706' },
  'eTA':             { bg:'#FDF4FF', text:'#9333EA' },
  'Miễn visa':       { bg:'#ECFDF5', text:'#059669' },
}

const FAQS = [
  { q:'Tại sao mỗi quốc gia có giá khác nhau?',          a:'Phí chính phủ (gov fee) do mỗi nước quy định riêng — eVisa thu hộ nguyên giá rồi chuyển 100% đến cơ quan cấp visa. Phí dịch vụ thì cố định theo gói tốc độ bạn chọn (Standard/Fast/Express).' },
  { q:'Phí có hoàn lại nếu visa bị từ chối không?',      a:'Có. Phí dịch vụ eVisa hoàn 100% nếu đơn bị từ chối bởi cơ quan cấp visa. Phí chính phủ không được hoàn lại theo quy định mỗi nước. Chúng tôi sẽ hỗ trợ giải thích lý do và tư vấn nộp lại miễn phí.' },
  { q:'Có phí ẩn nào không?',                            a:'Không. Tổng phí hiển thị bao gồm gov fee + service fee. Không có phí xử lý thêm, phí transaction hay phí hủy. Bạn chỉ thanh toán đúng số tiền này, không hơn.' },
  { q:'Thanh toán bằng VND được không?',                 a:'Có. Hệ thống tự động quy đổi USD → VND theo tỷ giá ngân hàng tại thời điểm thanh toán. Hỗ trợ thẻ VISA/Mastercard, MoMo, ZaloPay, VNPay, ShopeePay, chuyển khoản.' },
  { q:'Có giảm giá cho gia đình / nhóm không?',          a:'Có. Đơn từ 3 người trở lên được giảm 10% phí dịch vụ. Đơn doanh nghiệp 5+ người liên hệ chuyên gia để nhận báo giá riêng.' },
  { q:'Gói Express trễ deadline thì sao?',               a:'Cam kết SLA 24 giờ với gói Express. Nếu trễ vì lỗi của eVisa, chúng tôi hoàn 200% phí dịch vụ. Trễ vì cơ quan cấp visa thì hoàn 100% — chi tiết trong điều khoản.' },
]

const STATS = [
  { num:'100%',     label:'Minh bạch' },
  { num:'24h',      label:'Gói nhanh nhất' },
  { num:'$0',       label:'Phí ẩn' },
  { num:'Hoàn tiền',label:'Nếu từ chối' },
]

export default function Pricing() {
  const [selectedTier, setSelectedTier] = useState('fast')
  const [search, setSearch] = useState('')
  const [sort, setSort]     = useState('popular')
  const [openFaq, setOpenFaq] = useState(null)

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()
    let arr = PRICING.filter(p => !term || p.country.toLowerCase().includes(term))
    arr = [...arr].sort((a, b) => {
      if (sort === 'popular') return Number(b.popular) - Number(a.popular) || a.country.localeCompare(b.country)
      if (sort === 'name')    return a.country.localeCompare(b.country)
      const at = (a.gov ?? 0) + SERVICE_FEES[selectedTier]
      const bt = (b.gov ?? 0) + SERVICE_FEES[selectedTier]
      if (sort === 'price-asc')  return at - bt
      if (sort === 'price-desc') return bt - at
      return 0
    })
    return arr
  }, [search, sort, selectedTier])

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
            Giá minh bạch — không phí ẩn
          </div>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(36px,6vw,56px)', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:16 }}>
            Bảng <span style={{ color:'var(--gold)' }}>giá</span><br/>dịch vụ
          </h1>
          <p style={{ color:'rgba(255,255,255,0.68)', fontSize:17, lineHeight:1.7, maxWidth:560, marginLeft:'auto', marginRight:'auto' }}>
            Phí dịch vụ + phí chính phủ — bạn chỉ trả đúng số tiền hiển thị
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

      {/* ── TIERS ── */}
      <section style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Phí dịch vụ</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Chọn tốc độ phù hợp</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>3 gói dịch vụ — chọn theo nhu cầu thời gian của bạn</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
            {TIERS.map(t => {
              const isSelected = selectedTier === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setSelectedTier(t.key)}
                  style={{ position:'relative', textAlign:'left', background: isSelected ? t.bg : 'white', borderRadius:16, border: isSelected ? `2px solid ${t.accent}` : '2px solid #E5E7EB', padding:24, cursor:'pointer', fontFamily:'inherit', transition:'all .25s', boxShadow: isSelected ? '0 16px 32px rgba(11,29,58,0.10)' : 'none' }}
                  onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor='#CBD5E1' } }}
                  onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#E5E7EB' } }}
                >
                  {t.popular && (
                    <span style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', fontSize:10, fontWeight:700, padding:'4px 12px', borderRadius:50, background:'var(--gold)', color:'var(--navy)', boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}>
                      🔥 PHỔ BIẾN NHẤT
                    </span>
                  )}
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
                    <div style={{ fontSize:30 }}>{t.icon}</div>
                    <div>
                      <div style={{ fontFamily:'Fraunces,serif', fontSize:20, fontWeight:900, color:'var(--navy)' }}>{t.label}</div>
                      <div style={{ fontSize:12, color:'#6B7280' }}>{t.desc}</div>
                    </div>
                  </div>

                  <div style={{ margin:'18px 0' }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                      <span style={{ fontSize:36, fontWeight:900, color:t.accent }}>${t.fee}</span>
                      <span style={{ fontSize:13, color:'#6B7280' }}>+ phí chính phủ</span>
                    </div>
                    <div style={{ fontSize:12, fontWeight:600, color:t.accent, marginTop:4 }}>⏱ {t.time}</div>
                  </div>

                  <ul style={{ listStyle:'none', padding:0, margin:'0 0 18px' }}>
                    {t.features.map(f => (
                      <li key={f} style={{ display:'flex', gap:8, fontSize:13, color:'#374151', marginBottom:8 }}>
                        <span style={{ color:t.accent, marginTop:1, flexShrink:0 }}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ textAlign:'center', fontSize:13, fontWeight:700, padding:'10px 14px', borderRadius:8, background: isSelected ? t.accent : 'transparent', color: isSelected ? 'white' : '#374151', border: isSelected ? 'none' : '1px solid #D1D5DB' }}>
                    {isSelected ? '✓ Đang xem giá theo gói này' : 'Xem giá theo gói này'}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── COUNTRY TABLE ── */}
      <section style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Theo quốc gia</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Giá visa cho từng nước</h2>
            <p style={{ fontSize:14, color:'#6B7280' }}>
              Đang xem theo gói <span style={{ fontWeight:700, color:'var(--blue)' }}>{TIERS.find(t => t.key === selectedTier)?.label}</span> — đổi gói ở trên để cập nhật giá
            </p>
          </div>

          <div style={{ background:'white', borderRadius:14, border:'1px solid #E5E7EB', overflow:'hidden' }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid #F3F4F6', display:'flex', gap:10, flexWrap:'wrap' }}>
              <div style={{ position:'relative', flex:'1 1 240px' }}>
                <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  style={{ width:'100%', padding:'10px 12px 10px 36px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, outline:'none', fontFamily:'inherit' }}
                  placeholder="Tìm quốc gia..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, background:'white', fontFamily:'inherit', outline:'none', cursor:'pointer' }}
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="popular">Phổ biến trước</option>
                <option value="name">Tên A-Z</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
              </select>
            </div>

            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                <thead>
                  <tr style={{ background:'#F9FAFB', borderBottom:'1px solid #E5E7EB' }}>
                    {['Quốc gia','Loại','Phí chính phủ','Phí dịch vụ','Tổng',''].map((h, i) => (
                      <th key={i} style={{ padding:'12px 16px', fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', textAlign: i >= 2 ? 'right' : 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(p => {
                    const tagColor = TAG_COLORS[p.tag] || { bg:'#F3F4F6', text:'#6B7280' }
                    const isFree = p.gov === null
                    const total = isFree ? null : p.gov + SERVICE_FEES[selectedTier]
                    return (
                      <tr key={p.country} style={{ borderBottom:'1px solid #F3F4F6' }}>
                        <td style={{ padding:'14px 16px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <span style={{ fontSize:22 }}>{p.flag}</span>
                            <div>
                              <span style={{ fontWeight:700, color:'var(--navy)' }}>{p.country}</span>
                              {p.popular && <span style={{ marginLeft:8, fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:4, background:'#FFFBEB', color:'#92400E' }}>HOT</span>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:'14px 16px' }}>
                          <span style={{ fontSize:11, fontWeight:600, padding:'2px 10px', borderRadius:50, background:tagColor.bg, color:tagColor.text }}>{p.tag}</span>
                        </td>
                        <td style={{ padding:'14px 16px', textAlign:'right', color:'#6B7280' }}>{isFree ? '—' : `$${p.gov}`}</td>
                        <td style={{ padding:'14px 16px', textAlign:'right', color:'#6B7280' }}>{isFree ? '—' : `$${SERVICE_FEES[selectedTier]}`}</td>
                        <td style={{ padding:'14px 16px', textAlign:'right' }}>
                          {isFree ? (
                            <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:50, background:'#ECFDF5', color:'#059669' }}>Miễn phí</span>
                          ) : (
                            <span style={{ fontSize:16, fontWeight:900, color:'var(--blue)' }}>${total}</span>
                          )}
                        </td>
                        <td style={{ padding:'14px 16px', textAlign:'right' }}>
                          {isFree ? (
                            <span style={{ fontSize:12, color:'#9CA3AF' }}>Không cần</span>
                          ) : (
                            <Link to="/" style={{ fontSize:12, fontWeight:700, color:'var(--blue)', textDecoration:'none', whiteSpace:'nowrap' }}>Đăng ký →</Link>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {rows.length === 0 && (
              <div style={{ textAlign:'center', padding:'40px 20px' }}>
                <div style={{ fontSize:38, opacity:0.5, marginBottom:6 }}>🔍</div>
                <p style={{ fontSize:14, color:'#6B7280' }}>Không tìm thấy quốc gia phù hợp</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── BREAKDOWN ── */}
      <section style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Phí gồm những gì?</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Phân tích chi tiết phí</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Bạn biết rõ tiền đi đâu — không một xu phụ phí ẩn</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
            <div style={{ background:'white', borderRadius:14, border:'2px solid #FED7AA', overflow:'hidden' }}>
              <div style={{ padding:'18px 22px', display:'flex', alignItems:'center', gap:12, background:'#FFF7ED' }}>
                <div style={{ width:46, height:46, borderRadius:12, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🏛️</div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#D97706', textTransform:'uppercase', letterSpacing:'.06em' }}>Phí chính phủ</div>
                  <div style={{ fontSize:18, fontWeight:900, color:'var(--navy)' }}>Gov Fee</div>
                </div>
              </div>
              <div style={{ padding:'18px 22px' }}>
                <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.65, marginBottom:14 }}>
                  Phí do cơ quan cấp visa của mỗi nước thu. eVisa thu hộ và <strong style={{ color:'var(--navy)' }}>chuyển 100%</strong> đến cơ quan, không giữ lại bất kỳ phần nào.
                </p>
                <ul style={{ listStyle:'none', padding:0, margin:0, fontSize:12, color:'#6B7280', lineHeight:1.8 }}>
                  <li>• Mỗi nước có biểu phí riêng</li>
                  <li>• Có thể thay đổi khi nước đó cập nhật chính sách</li>
                  <li>• Không hoàn lại theo quy định mỗi nước</li>
                </ul>
              </div>
            </div>

            <div style={{ background:'white', borderRadius:14, border:'2px solid #BFDBFE', overflow:'hidden' }}>
              <div style={{ padding:'18px 22px', display:'flex', alignItems:'center', gap:12, background:'#EEF3FF' }}>
                <div style={{ width:46, height:46, borderRadius:12, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>⚡</div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.06em' }}>Phí dịch vụ eVisa</div>
                  <div style={{ fontSize:18, fontWeight:900, color:'var(--navy)' }}>Service Fee</div>
                </div>
              </div>
              <div style={{ padding:'18px 22px' }}>
                <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.65, marginBottom:14 }}>
                  Chi phí cho công việc của đội ngũ chuyên gia eVisa — bao gồm review, AI kiểm ảnh, hỗ trợ và bảo hiểm hồ sơ.
                </p>
                <ul style={{ listStyle:'none', padding:0, margin:0, fontSize:12, color:'#6B7280', lineHeight:1.8 }}>
                  <li>• Chuyên gia review từng hồ sơ</li>
                  <li>• AI kiểm tra tự động ảnh & giấy tờ</li>
                  <li>• Hỗ trợ 24/7 tiếng Việt</li>
                  <li>• <strong style={{ color:'var(--green)' }}>Hoàn 100% nếu từ chối</strong></li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ marginTop:18, borderRadius:12, padding:14, display:'flex', alignItems:'flex-start', gap:10, background:'#F0FDF4', border:'1px solid #BBF7D0' }}>
            <span style={{ fontSize:22 }}>💡</span>
            <div style={{ flex:1, fontSize:14, color:'#15803D' }}>
              <span style={{ fontWeight:700 }}>Tổng phí bạn trả</span> = Phí chính phủ + Phí dịch vụ. Bảng giá phía trên đã bao gồm cả 2.
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:820, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>FAQ</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)' }}>Câu hỏi về giá</h2>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {FAQS.map(f => {
              const isOpen = openFaq === f.q
              return (
                <div key={f.q} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : f.q)}
                    style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, padding:'14px 20px', textAlign:'left', fontWeight:600, fontSize:14, color:'var(--navy)', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit' }}
                  >
                    <span>{f.q}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink:0, transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}>
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>
                  {isOpen && (
                    <div style={{ padding:'12px 20px 16px', fontSize:14, color:'#6B7280', lineHeight:1.7, borderTop:'1px solid #F3F4F6' }}>
                      {f.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'var(--navy)', padding:'56px 20px', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Fraunces,serif', fontSize:30, fontWeight:900, color:'white', marginBottom:10 }}>Sẵn sàng đăng ký?</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:15, marginBottom:24 }}>Hoàn 100% phí dịch vụ nếu visa bị từ chối — không rủi ro</p>
        <Link to="/" style={{ display:'inline-block', background:'var(--gold)', color:'var(--navy)', borderRadius:10, padding:'14px 32px', fontSize:16, fontWeight:800, textDecoration:'none', fontFamily:'inherit', transition:'opacity .15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity='.88'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
        >Đăng ký visa ngay →</Link>
      </section>

      <Footer />
    </div>
  )
}
