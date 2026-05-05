import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const DESTINATIONS = [
  { name:'Thái Lan',     flag:'🇹🇭', iso:'th', region:'Đông Nam Á', time:'3-5 ngày',  price:'$29',  popular:true,  trending:true,  tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'3 tháng',  desc:'Thiên đường du lịch với chi phí hợp lý, ẩm thực đa dạng và bãi biển tuyệt đẹp.', city:'Bangkok' },
  { name:'Singapore',    flag:'🇸🇬', iso:'sg', region:'Đông Nam Á', time:'2-3 ngày',  price:'$39',  popular:false, trending:true,  tag:'E-Visa',          stay:'30 ngày',    entry:'Multiple', validity:'2 năm',    desc:'Đảo quốc hiện đại với hệ thống giao thông và dịch vụ đẳng cấp thế giới.', city:'Marina Bay' },
  { name:'Indonesia',    flag:'🇮🇩', iso:'id', region:'Đông Nam Á', time:'3-5 ngày',  price:'$35',  popular:false, trending:false, tag:'Visa on Arrival', stay:'30 ngày',    entry:'Single',   validity:'30 ngày',  desc:'Bali, Jakarta và hàng ngàn hòn đảo nhiệt đới đang chờ bạn khám phá.', city:'Bali' },
  { name:'Malaysia',     flag:'🇲🇾', iso:'my', region:'Đông Nam Á', time:'Tức thì',   price:'Miễn phí', popular:false, trending:false, tag:'Miễn visa',   stay:'30 ngày',    entry:'Multiple', validity:'—',        desc:'Miễn visa 30 ngày cho công dân Việt Nam, chỉ cần hộ chiếu còn hạn 6 tháng.', city:'Kuala Lumpur' },
  { name:'Philippines',  flag:'🇵🇭', iso:'ph', region:'Đông Nam Á', time:'5-7 ngày',  price:'$45',  popular:false, trending:false, tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'3 tháng',  desc:'Hơn 7000 hòn đảo nhiệt đới, biển xanh và văn hóa thân thiện.', city:'Manila' },
  { name:'Campuchia',    flag:'🇰🇭', iso:'kh', region:'Đông Nam Á', time:'3-5 ngày',  price:'$30',  popular:false, trending:false, tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'3 tháng',  desc:'Angkor Wat huyền bí và nền văn hóa Khmer độc đáo.', city:'Siem Reap' },
  { name:'Myanmar',      flag:'🇲🇲', iso:'mm', region:'Đông Nam Á', time:'3-5 ngày',  price:'$50',  popular:false, trending:false, tag:'E-Visa',          stay:'28 ngày',    entry:'Single',   validity:'3 tháng',  desc:'Bagan với hàng ngàn ngôi chùa cổ và văn hóa Phật giáo độc đáo.', city:'Bagan' },
  { name:'Nhật Bản',     flag:'🇯🇵', iso:'jp', region:'Đông Á',     time:'5-7 ngày',  price:'$49',  popular:true,  trending:true,  tag:'E-Visa',          stay:'15-90 ngày', entry:'Single',   validity:'3 tháng',  desc:'Đất nước mặt trời mọc với văn hóa độc đáo và cảnh quan bốn mùa tuyệt đẹp.', city:'Tokyo' },
  { name:'Hàn Quốc',     flag:'🇰🇷', iso:'kr', region:'Đông Á',     time:'5-7 ngày',  price:'$55',  popular:true,  trending:true,  tag:'E-Visa',          stay:'30-90 ngày', entry:'Single',   validity:'3 tháng',  desc:'Xứ sở kim chi với K-pop, ẩm thực và mua sắm đẳng cấp.', city:'Seoul' },
  { name:'Đài Loan',     flag:'🇹🇼', iso:'tw', region:'Đông Á',     time:'5-7 ngày',  price:'$50',  popular:false, trending:false, tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'3 tháng',  desc:'Đảo ngọc với ẩm thực đường phố nổi tiếng và cảnh quan đa dạng.', city:'Đài Bắc' },
  { name:'Hong Kong',    flag:'🇭🇰', iso:'hk', region:'Đông Á',     time:'Tức thì',   price:'Miễn phí', popular:false, trending:false, tag:'Miễn visa',   stay:'14 ngày',    entry:'Multiple', validity:'—',        desc:'Miễn visa 14 ngày cho công dân Việt Nam, thiên đường mua sắm châu Á.', city:'Hong Kong' },
  { name:'Ấn Độ',        flag:'🇮🇳', iso:'in', region:'Đông Á',     time:'3-5 ngày',  price:'$30',  popular:false, trending:false, tag:'E-Visa',          stay:'30-60 ngày', entry:'Multiple', validity:'1 năm',    desc:'Taj Mahal, sông Hằng và sự đa dạng văn hóa rực rỡ.', city:'Delhi' },
  { name:'Sri Lanka',    flag:'🇱🇰', iso:'lk', region:'Đông Á',     time:'3-5 ngày',  price:'$35',  popular:false, trending:false, tag:'E-Visa',          stay:'30 ngày',    entry:'Multiple', validity:'6 tháng',  desc:'Đảo ngọc Ấn Độ Dương với rừng nhiệt đới, đền cổ và bãi biển hoang sơ.', city:'Colombo' },
  { name:'Dubai (UAE)',  flag:'🇦🇪', iso:'ae', region:'Trung Đông', time:'3-5 ngày',  price:'$45',  popular:true,  trending:true,  tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'2 tháng',  desc:'Thành phố tương lai với Burj Khalifa, sa mạc và mua sắm xa xỉ.', city:'Dubai' },
  { name:'Qatar',        flag:'🇶🇦', iso:'qa', region:'Trung Đông', time:'3-5 ngày',  price:'$50',  popular:false, trending:false, tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'30 ngày',  desc:'Doha hiện đại bên bờ vịnh Ba Tư, kiến trúc đỉnh cao.', city:'Doha' },
  { name:'Thổ Nhĩ Kỳ',   flag:'🇹🇷', iso:'tr', region:'Trung Đông', time:'3-5 ngày',  price:'$50',  popular:false, trending:true,  tag:'E-Visa',          stay:'90 ngày',    entry:'Multiple', validity:'180 ngày', desc:'Istanbul giao thoa Á-Âu, Cappadocia với khinh khí cầu nổi tiếng.', city:'Istanbul' },
  { name:'Saudi Arabia', flag:'🇸🇦', iso:'sa', region:'Trung Đông', time:'5-7 ngày',  price:'$120', popular:false, trending:false, tag:'E-Visa',          stay:'90 ngày',    entry:'Multiple', validity:'1 năm',    desc:'Mecca, Riyadh và sa mạc Ả Rập với di sản văn hóa Hồi giáo phong phú.', city:'Riyadh' },
  { name:'Oman',         flag:'🇴🇲', iso:'om', region:'Trung Đông', time:'3-5 ngày',  price:'$50',  popular:false, trending:false, tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'30 ngày',  desc:'Pháo đài cổ, sa mạc Wahiba và bờ biển Ấn Độ Dương yên bình.', city:'Muscat' },
  { name:'Bahrain',      flag:'🇧🇭', iso:'bh', region:'Trung Đông', time:'2-3 ngày',  price:'$55',  popular:false, trending:false, tag:'E-Visa',          stay:'14 ngày',    entry:'Multiple', validity:'90 ngày',  desc:'Đảo quốc vịnh Ba Tư với di sản văn hóa Bahrain phong phú.', city:'Manama' },
  { name:'Canada',       flag:'🇨🇦', iso:'ca', region:'Châu Mỹ',    time:'3-5 ngày',  price:'$80',  popular:false, trending:false, tag:'eTA',             stay:'180 ngày',   entry:'Multiple', validity:'5 năm',    desc:'Niagara, Rocky Mountains và Toronto — eTA online cấp nhanh trong vài giờ.', city:'Toronto' },
  { name:'Mexico',       flag:'🇲🇽', iso:'mx', region:'Châu Mỹ',    time:'5-7 ngày',  price:'$60',  popular:false, trending:false, tag:'E-Visa',          stay:'180 ngày',   entry:'Multiple', validity:'30 ngày',  desc:'Văn hóa Maya, bãi biển Cancun và ẩm thực đặc sắc.', city:'Cancún' },
  { name:'Brazil',       flag:'🇧🇷', iso:'br', region:'Châu Mỹ',    time:'7-10 ngày', price:'$85',  popular:false, trending:false, tag:'E-Visa',          stay:'90 ngày',    entry:'Multiple', validity:'2 năm',    desc:'Rio de Janeiro, rừng Amazon và lễ hội carnival sôi động.', city:'Rio' },
  { name:'Úc',           flag:'🇦🇺', iso:'au', region:'Châu Đại Dương', time:'5-10 ngày', price:'$95',  popular:true,  trending:false, tag:'E-Visa',     stay:'90 ngày',    entry:'Multiple', validity:'1 năm',    desc:'Sydney Opera House, Great Barrier Reef và outback hoang dã.', city:'Sydney' },
  { name:'New Zealand',  flag:'🇳🇿', iso:'nz', region:'Châu Đại Dương', time:'3-5 ngày',  price:'$110', popular:false, trending:false, tag:'eTA',        stay:'90 ngày',    entry:'Multiple', validity:'2 năm',    desc:'Đất nước của Chúa Tể Của Những Chiếc Nhẫn với cảnh quan tuyệt mỹ.', city:'Auckland' },
  { name:'Nga',          flag:'🇷🇺', iso:'ru', region:'Châu Âu',    time:'5-7 ngày',  price:'$60',  popular:false, trending:false, tag:'E-Visa',          stay:'16 ngày',    entry:'Single',   validity:'60 ngày',  desc:'Moscow, St. Petersburg và bề dày lịch sử nước Nga.', city:'Moscow' },
  { name:'Albania',      flag:'🇦🇱', iso:'al', region:'Châu Âu',    time:'3-5 ngày',  price:'$45',  popular:false, trending:false, tag:'E-Visa',          stay:'90 ngày',    entry:'Multiple', validity:'180 ngày', desc:'Bờ biển Adriatic xinh đẹp và văn hóa Balkan độc đáo.', city:'Tirana' },
  { name:'Ai Cập',       flag:'🇪🇬', iso:'eg', region:'Châu Phi',   time:'5-7 ngày',  price:'$60',  popular:false, trending:false, tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'3 tháng',  desc:'Kim tự tháp Giza, sông Nile và nền văn minh cổ đại Ai Cập.', city:'Cairo' },
  { name:'Kenya',        flag:'🇰🇪', iso:'ke', region:'Châu Phi',   time:'3-5 ngày',  price:'$55',  popular:false, trending:false, tag:'E-Visa',          stay:'90 ngày',    entry:'Single',   validity:'3 tháng',  desc:'Safari Maasai Mara và đại di cư của thú rừng nổi tiếng.', city:'Nairobi' },
]

const REGIONS = [
  { name:'Tất cả',          icon:'🌍' },
  { name:'Đông Nam Á',      icon:'🏝️' },
  { name:'Đông Á',          icon:'🏯' },
  { name:'Châu Âu',         icon:'🗼' },
  { name:'Châu Mỹ',         icon:'🗽' },
  { name:'Trung Đông',      icon:'🕌' },
  { name:'Châu Đại Dương',  icon:'🦘' },
  { name:'Châu Phi',        icon:'🦁' },
]

const TAG_COLORS = {
  'E-Visa':          { bg:'#EEF3FF', text:'#1B4FD8' },
  'Visa on Arrival': { bg:'#FFF7ED', text:'#D97706' },
  'eTA':             { bg:'#FDF4FF', text:'#9333EA' },
  'Miễn visa':       { bg:'#ECFDF5', text:'#059669' },
}

const REQUIREMENTS = [
  'Hộ chiếu còn hạn ít nhất 6 tháng',
  'Ảnh chân dung 4×6 nền trắng (chụp trong 6 tháng)',
  'Vé máy bay khứ hồi (nếu yêu cầu)',
  'Đặt phòng khách sạn / địa chỉ lưu trú',
  'Sao kê ngân hàng 3 tháng gần nhất',
  'Bảo hiểm du lịch (tùy quốc gia)',
]

const QUICK_PICKS = ['Thái Lan', 'Nhật Bản', 'Hàn Quốc', 'Dubai (UAE)', 'Singapore']

const flagUrl = (iso, w = 640) => `https://flagcdn.com/w${w}/${iso}.png`

const STATS = [
  { num:`${DESTINATIONS.length}+`, label:'Quốc gia hỗ trợ' },
  { num:'99%',                     label:'Tỷ lệ duyệt' },
  { num:'24h',                     label:'Xử lý nhanh' },
  { num:'24/7',                    label:'Hỗ trợ tiếng Việt' },
]

export default function Destinations() {
  const [search, setSearch]     = useState('')
  const [region, setRegion]     = useState('Tất cả')
  const [selected, setSelected] = useState(null)

  const term = search.trim().toLowerCase()
  const filtered = DESTINATIONS.filter(d => {
    const matchSearch = !term ||
      d.name.toLowerCase().includes(term) ||
      d.region.toLowerCase().includes(term) ||
      d.tag.toLowerCase().includes(term) ||
      d.city.toLowerCase().includes(term)
    const matchRegion = region === 'Tất cả' || d.region === region
    return matchSearch && matchRegion
  })

  const showFeatured = !term && region === 'Tất cả'
  const trending = DESTINATIONS.filter(d => d.trending)
  const popular  = DESTINATIONS.filter(d => d.popular)

  const handleQuickPick = (name) => {
    const dest = DESTINATIONS.find(d => d.name === name)
    if (dest) setSelected(dest)
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
            {DESTINATIONS.length} quốc gia eVisa hỗ trợ
          </div>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(36px,6vw,56px)', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:16 }}>
            Khám phá <span style={{ color:'var(--gold)' }}>thế giới</span><br/>
            không giới hạn
          </h1>
          <p style={{ color:'rgba(255,255,255,0.68)', fontSize:17, lineHeight:1.7, marginBottom:28, maxWidth:560, marginLeft:'auto', marginRight:'auto' }}>
            Tìm visa cho mọi quốc gia bạn muốn — chuyên gia hỗ trợ từ A-Z
          </p>

          <div style={{ maxWidth:560, margin:'0 auto 18px', position:'relative' }}>
            <svg style={{ position:'absolute', left:18, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              style={{ width:'100%', padding:'16px 48px 16px 48px', borderRadius:14, fontSize:15, border:'none', outline:'none', boxShadow:'0 24px 64px rgba(0,0,0,0.3)', fontFamily:'inherit' }}
              placeholder="Tìm quốc gia, thành phố, khu vực..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', width:30, height:30, borderRadius:'50%', background:'#F3F4F6', border:'none', cursor:'pointer', color:'#6B7280', fontSize:13 }}
              >✕</button>
            )}
          </div>

          <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center', alignItems:'center', marginBottom:28 }}>
            <span style={{ color:'rgba(255,255,255,0.5)', fontSize:12, marginRight:4 }}>Phổ biến:</span>
            {QUICK_PICKS.map(name => {
              const d = DESTINATIONS.find(x => x.name === name)
              return d ? (
                <button
                  key={name}
                  onClick={() => handleQuickPick(name)}
                  style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 14px 4px 4px', borderRadius:50, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'white', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .2s', backdropFilter:'blur(8px)' }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'; e.currentTarget.style.transform='translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.transform='none' }}
                >
                  <span style={{ width:24, height:24, borderRadius:'50%', overflow:'hidden', border:'1px solid rgba(255,255,255,0.25)', flexShrink:0 }}>
                    <img src={flagUrl(d.iso, 80)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </span>
                  {d.name}
                </button>
              ) : null
            })}
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
      </section>

      {/* ── REGION FILTER ── */}
      <section style={{ background:'#F9FAFB', padding:'48px 20px 24px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:28, fontWeight:900, color:'var(--navy)', marginBottom:6 }}>Chọn theo khu vực</h2>
            <p style={{ color:'#6B7280', fontSize:14 }}>Lọc nhanh theo châu lục bạn muốn đi</p>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            {REGIONS.map(r => {
              const count = r.name === 'Tất cả' ? DESTINATIONS.length : DESTINATIONS.filter(d => d.region === r.name).length
              const active = region === r.name
              return (
                <button
                  key={r.name}
                  onClick={() => setRegion(r.name)}
                  style={{
                    display:'inline-flex', alignItems:'center', gap:8,
                    padding:'10px 16px 10px 10px',
                    background: active ? 'var(--blue)' : 'white',
                    border: active ? '1.5px solid var(--blue)' : '1.5px solid #E5E7EB',
                    borderRadius:50, fontSize:14, fontWeight:600,
                    color: active ? 'white' : '#374151',
                    cursor:'pointer', fontFamily:'inherit', transition:'all .15s',
                    boxShadow: active ? '0 8px 20px rgba(27,79,216,0.25)' : 'none'
                  }}
                  onMouseEnter={e => {
                    if (!active) { e.currentTarget.style.borderColor='var(--blue)'; e.currentTarget.style.color='var(--blue)'; e.currentTarget.style.background='var(--blue-light)' }
                  }}
                  onMouseLeave={e => {
                    if (!active) { e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.color='#374151'; e.currentTarget.style.background='white' }
                  }}
                >
                  <span style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, background: active ? 'rgba(255,255,255,0.2)' : '#F3F4F6' }}>{r.icon}</span>
                  <span>{r.name}</span>
                  <span style={{ fontSize:11, fontWeight:700, padding:'2px 7px', borderRadius:50, background: active ? 'rgba(255,255,255,0.25)' : '#F3F4F6', color: active ? 'white' : '#6B7280' }}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TRENDING ── */}
      {showFeatured && trending.length >= 5 && (
        <section style={{ background:'#F9FAFB', padding:'40px 20px 64px' }}>
          <div style={{ maxWidth:1024, margin:'0 auto' }}>
            <SectionHeader icon="🔥" title="Đang xu hướng" subtitle="Những điểm đến được tìm kiếm nhiều nhất tuần này" right="Cập nhật mỗi tuần" />
            <div style={{ display:'grid', gap:16, marginBottom:16 }}>
              <FeaturedDestBanner d={trending[0]} onClick={() => setSelected(trending[0])} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
              {trending.slice(1, 5).map(d => (
                <DestCard key={d.name} d={d} onClick={() => setSelected(d)} highlight />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── POPULAR ── */}
      {showFeatured && popular.length > 0 && (
        <section style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #F3F4F6' }}>
          <div style={{ maxWidth:1024, margin:'0 auto' }}>
            <SectionHeader icon="⭐" title="Phổ biến nhất" subtitle="Top quốc gia khách Việt thường chọn" />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
              {popular.map(d => <DestCard key={d.name} d={d} onClick={() => setSelected(d)} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── ALL / FILTERED ── */}
      <section style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <SectionHeader
            icon="🌍"
            title={region === 'Tất cả' ? 'Tất cả điểm đến' : region}
            subtitle={term ? `Kết quả tìm kiếm cho "${search}"` : `Tổng cộng ${filtered.length} quốc gia`}
            right={`${filtered.length} kết quả`}
          />
          {filtered.length > 0 ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
              {filtered.map(d => <DestCard key={d.name} d={d} onClick={() => setSelected(d)} />)}
            </div>
          ) : (
            <div style={{ background:'white', borderRadius:14, border:'1px solid #E5E7EB', padding:'56px 20px', textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:14, opacity:0.6 }}>🔍</div>
              <p style={{ fontWeight:700, fontSize:16, color:'var(--navy)', marginBottom:6 }}>Không tìm thấy quốc gia phù hợp</p>
              <p style={{ fontSize:14, color:'#6B7280', marginBottom:20 }}>Thử từ khóa khác hoặc bỏ bộ lọc khu vực</p>
              <button onClick={() => { setSearch(''); setRegion('Tất cả') }} className="btn-primary">Xem tất cả điểm đến</button>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'var(--navy)', padding:'56px 20px', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Fraunces,serif', fontSize:30, fontWeight:900, color:'white', marginBottom:10 }}>Không thấy nước bạn cần?</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:15, marginBottom:24 }}>Liên hệ chuyên gia — chúng tôi hỗ trợ visa cho 150+ quốc gia</p>
        <Link
          to="/support"
          style={{ display:'inline-block', background:'var(--gold)', color:'var(--navy)', borderRadius:10, padding:'14px 32px', fontSize:16, fontWeight:800, textDecoration:'none', fontFamily:'inherit', transition:'opacity .15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity='.88'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
        >Hỗ trợ ngay →</Link>
      </section>

      {selected && <DestModal d={selected} onClose={() => setSelected(null)} />}

      <Footer />
    </div>
  )
}

function SectionHeader({ icon, title, subtitle, right }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16, marginBottom:24, flexWrap:'wrap' }}>
      <div>
        <h2 style={{ fontFamily:'Fraunces,serif', fontSize:28, fontWeight:900, color:'var(--navy)', marginBottom:6, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:28 }}>{icon}</span>{title}
        </h2>
        {subtitle && <p style={{ color:'#6B7280', fontSize:14 }}>{subtitle}</p>}
      </div>
      {right && <span style={{ fontSize:12, color:'#9CA3AF', whiteSpace:'nowrap' }}>{right}</span>}
    </div>
  )
}

function CardCover({ d, big = false, hires = false }) {
  const tagColor = TAG_COLORS[d.tag] || { bg:'#F3F4F6', text:'#6B7280' }
  const w = hires ? 1280 : 640
  return (
    <div style={{ position:'relative', height: big ? '100%' : 132, minHeight: big ? 260 : 132, overflow:'hidden', background:'#F3F4F6' }}>
      <img
        src={flagUrl(d.iso, w)}
        alt={`Cờ ${d.name}`}
        loading="lazy"
        style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transition:'transform .6s' }}
        className="card-flag-img"
      />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(0,0,0,0.10) 0%,rgba(0,0,0,0) 35%,rgba(0,0,0,0.55) 100%)' }} />
      <span style={{ position:'absolute', top:12, right:12, fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:50, background:'rgba(255,255,255,0.95)', color:tagColor.text, backdropFilter:'blur(8px)', boxShadow:'0 2px 6px rgba(0,0,0,0.15)' }}>
        {d.tag}
      </span>
      <span style={{ position:'absolute', bottom:10, left:12, fontSize:11, fontWeight:700, color:'white', textTransform:'uppercase', letterSpacing:'.05em', textShadow:'0 1px 4px rgba(0,0,0,0.5)', display:'flex', alignItems:'center', gap:4 }}>
        📍 {d.city}
      </span>
    </div>
  )
}

function DestCard({ d, onClick, highlight }) {
  return (
    <button
      onClick={onClick}
      style={{ position:'relative', background:'white', border:'1px solid #E5E7EB', borderRadius:14, overflow:'hidden', textAlign:'left', display:'flex', flexDirection:'column', cursor:'pointer', fontFamily:'inherit', padding:0, transition:'all .25s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='0 16px 32px rgba(11,29,58,0.12)'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor='var(--blue)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#E5E7EB' }}
    >
      {highlight && (
        <span style={{ position:'absolute', top:12, left:12, zIndex:10, fontSize:10, fontWeight:700, padding:'4px 8px', borderRadius:50, background:'var(--gold)', color:'var(--navy)', boxShadow:'0 2px 6px rgba(0,0,0,0.2)' }}>
          🔥 HOT
        </span>
      )}
      <CardCover d={d} />
      <div style={{ padding:16, display:'flex', flexDirection:'column', flex:1 }}>
        <h3 style={{ fontWeight:900, fontSize:16, color:'var(--navy)', marginBottom:4, lineHeight:1.2 }}>{d.name}</h3>
        <p style={{ fontSize:11, color:'#9CA3AF', lineHeight:1.5, marginBottom:12, minHeight:32, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{d.desc}</p>
        <div style={{ marginTop:'auto', paddingTop:12, borderTop:'1px solid #F3F4F6', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#6B7280' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            {d.time}
          </span>
          <span style={{ fontWeight:900, fontSize:16, color:'var(--blue)' }}>{d.price}</span>
        </div>
      </div>
    </button>
  )
}

function FeaturedDestBanner({ d, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ position:'relative', background:'white', border:'1px solid #E5E7EB', borderRadius:18, overflow:'hidden', cursor:'pointer', fontFamily:'inherit', padding:0, textAlign:'left', display:'grid', gridTemplateColumns:'minmax(0,2fr) minmax(0,3fr)', width:'100%', transition:'all .3s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='0 24px 48px rgba(11,29,58,0.15)'; e.currentTarget.style.borderColor='var(--blue)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='#E5E7EB' }}
    >
      <span style={{ position:'absolute', top:16, left:16, zIndex:10, fontSize:12, fontWeight:700, padding:'6px 12px', borderRadius:50, background:'var(--gold)', color:'var(--navy)', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', display:'inline-flex', alignItems:'center', gap:6 }}>
        🔥 HOT NHẤT
      </span>
      <div style={{ position:'relative', minHeight:280 }}>
        <CardCover d={d} big hires />
      </div>
      <div style={{ padding:'28px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:12, marginBottom:8 }}>
          <h3 style={{ fontFamily:'Fraunces,serif', fontSize:30, fontWeight:900, color:'var(--navy)', lineHeight:1.1 }}>{d.name}</h3>
          <span style={{ fontWeight:900, fontSize:24, color:'var(--blue)', whiteSpace:'nowrap' }}>{d.price}</span>
        </div>
        <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.6, marginBottom:16 }}>{d.desc}</p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
          {[['⏱', d.time], ['📅', `Lưu trú ${d.stay}`], ['🔁', d.entry]].map(([i,l]) => (
            <span key={l} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:50, background:'#F9FAFB', fontSize:12, color:'#374151', fontWeight:500 }}>
              {i} {l}
            </span>
          ))}
        </div>
        <div style={{ paddingTop:16, borderTop:'1px solid #F3F4F6', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:13, fontWeight:600, color:'#6B7280' }}>Xem chi tiết & đăng ký</span>
          <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:32, height:32, borderRadius:'50%', background:'var(--blue)', color:'white' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      </div>
      <style>{`@media(max-width:720px){button[data-featured]{grid-template-columns:1fr!important}}`}</style>
    </button>
  )
}

function DestModal({ d, onClose }) {
  const tagColor = TAG_COLORS[d.tag] || { bg:'#F3F4F6', text:'#6B7280' }
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)' }} />
      <div onClick={e => e.stopPropagation()} className="fade-up"
        style={{ position:'relative', background:'white', borderRadius:20, width:'100%', maxWidth:640, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 24px 80px rgba(0,0,0,0.4)' }}>
        <div style={{ position:'relative', height:200, overflow:'hidden', background:'#F3F4F6' }}>
          <img src={flagUrl(d.iso, 1280)} alt={`Cờ ${d.name}`} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(0,0,0,0.20) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,0.65) 100%)' }} />
          <button onClick={onClose}
            style={{ position:'absolute', top:16, right:16, width:38, height:38, borderRadius:'50%', background:'rgba(0,0,0,0.4)', color:'white', border:'none', cursor:'pointer', backdropFilter:'blur(8px)', fontSize:14, zIndex:10 }}
          >✕</button>
          <div style={{ position:'absolute', bottom:16, left:20, right:20, display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:12 }}>
            <div style={{ color:'white', textShadow:'0 2px 8px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em', color:'rgba(255,255,255,0.85)', marginBottom:4 }}>📍 {d.city} · {d.region}</div>
              <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, lineHeight:1.1 }}>{d.name}</h2>
            </div>
            <span style={{ fontSize:12, fontWeight:700, padding:'5px 12px', borderRadius:50, background:tagColor.bg, color:tagColor.text }}>{d.tag}</span>
          </div>
        </div>
        <div style={{ padding:'24px 28px 28px' }}>
          <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.7, marginBottom:22 }}>{d.desc}</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:10, marginBottom:22 }}>
            {[
              ['⏱','Thời gian xử lý',  d.time],
              ['📅','Lưu trú tối đa',   d.stay],
              ['🔁','Số lần nhập cảnh', d.entry],
              ['📆','Hiệu lực visa',    d.validity],
              ['💰','Phí dịch vụ',      d.price],
              ['📋','Loại visa',        d.tag],
            ].map(([icon,label,val]) => (
              <div key={label} style={{ background:'#F9FAFB', borderRadius:12, padding:'12px 14px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:5 }}>
                  <span style={{ fontSize:15 }}>{icon}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em' }}>{label}</span>
                </div>
                <p style={{ fontWeight:700, fontSize:13, color:'var(--navy)', lineHeight:1.3 }}>{val}</p>
              </div>
            ))}
          </div>
          <div style={{ borderRadius:12, padding:16, marginBottom:22, background:'#FFFBEB', border:'1px solid #FDE68A' }}>
            <h4 style={{ fontWeight:700, fontSize:13, color:'#92400E', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
              📋 Giấy tờ cần chuẩn bị
            </h4>
            <ul style={{ fontSize:12, color:'#78350F', lineHeight:1.7, listStyle:'none', padding:0, margin:0 }}>
              {REQUIREMENTS.map(r => (
                <li key={r} style={{ display:'flex', gap:8, marginBottom:4 }}>
                  <span style={{ color:'#16A34A' }}>✓</span><span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button onClick={onClose} className="btn-secondary" style={{ flex:'0 0 auto', padding:'12px 24px' }}>Để sau</button>
            <Link to="/" onClick={onClose} className="btn-primary" style={{ flex:1, justifyContent:'center', minWidth:200 }}>
              Đăng ký visa ngay
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
