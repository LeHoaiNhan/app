import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const DESTINATIONS = [
  // Đông Nam Á
  { name:'Thái Lan',     flag:'🇹🇭', region:'Đông Nam Á', time:'3-5 ngày',  price:'$29',  popular:true,  trending:true,  tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'3 tháng',  desc:'Thiên đường du lịch với chi phí hợp lý, ẩm thực đa dạng và bãi biển tuyệt đẹp.' },
  { name:'Singapore',    flag:'🇸🇬', region:'Đông Nam Á', time:'2-3 ngày',  price:'$39',  popular:false, trending:true,  tag:'E-Visa',          stay:'30 ngày',    entry:'Multiple', validity:'2 năm',    desc:'Đảo quốc hiện đại với hệ thống giao thông và dịch vụ đẳng cấp thế giới.' },
  { name:'Indonesia',    flag:'🇮🇩', region:'Đông Nam Á', time:'3-5 ngày',  price:'$35',  popular:false, trending:false, tag:'Visa on Arrival', stay:'30 ngày',    entry:'Single',   validity:'30 ngày',  desc:'Bali, Jakarta và hàng ngàn hòn đảo nhiệt đới đang chờ bạn khám phá.' },
  { name:'Malaysia',     flag:'🇲🇾', region:'Đông Nam Á', time:'Tức thì',   price:'Miễn phí', popular:false, trending:false, tag:'Miễn visa',   stay:'30 ngày',    entry:'Multiple', validity:'—',        desc:'Miễn visa 30 ngày cho công dân Việt Nam, chỉ cần hộ chiếu còn hạn 6 tháng.' },
  { name:'Philippines',  flag:'🇵🇭', region:'Đông Nam Á', time:'5-7 ngày',  price:'$45',  popular:false, trending:false, tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'3 tháng',  desc:'Hơn 7000 hòn đảo nhiệt đới, biển xanh và văn hóa thân thiện.' },
  { name:'Campuchia',    flag:'🇰🇭', region:'Đông Nam Á', time:'3-5 ngày',  price:'$30',  popular:false, trending:false, tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'3 tháng',  desc:'Angkor Wat huyền bí và nền văn hóa Khmer độc đáo.' },
  { name:'Myanmar',      flag:'🇲🇲', region:'Đông Nam Á', time:'3-5 ngày',  price:'$50',  popular:false, trending:false, tag:'E-Visa',          stay:'28 ngày',    entry:'Single',   validity:'3 tháng',  desc:'Bagan với hàng ngàn ngôi chùa cổ và văn hóa Phật giáo độc đáo.' },

  // Đông Á & Nam Á
  { name:'Nhật Bản',     flag:'🇯🇵', region:'Đông Á',     time:'5-7 ngày',  price:'$49',  popular:true,  trending:true,  tag:'E-Visa',          stay:'15-90 ngày', entry:'Single',   validity:'3 tháng',  desc:'Đất nước mặt trời mọc với văn hóa độc đáo và cảnh quan bốn mùa tuyệt đẹp.' },
  { name:'Hàn Quốc',     flag:'🇰🇷', region:'Đông Á',     time:'5-7 ngày',  price:'$55',  popular:true,  trending:true,  tag:'E-Visa',          stay:'30-90 ngày', entry:'Single',   validity:'3 tháng',  desc:'Xứ sở kim chi với K-pop, ẩm thực và mua sắm đẳng cấp.' },
  { name:'Đài Loan',     flag:'🇹🇼', region:'Đông Á',     time:'5-7 ngày',  price:'$50',  popular:false, trending:false, tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'3 tháng',  desc:'Đảo ngọc với ẩm thực đường phố nổi tiếng và cảnh quan đa dạng.' },
  { name:'Hong Kong',    flag:'🇭🇰', region:'Đông Á',     time:'Tức thì',   price:'Miễn phí', popular:false, trending:false, tag:'Miễn visa',   stay:'14 ngày',    entry:'Multiple', validity:'—',        desc:'Miễn visa 14 ngày cho công dân Việt Nam, thiên đường mua sắm châu Á.' },
  { name:'Ấn Độ',        flag:'🇮🇳', region:'Đông Á',     time:'3-5 ngày',  price:'$30',  popular:false, trending:false, tag:'E-Visa',          stay:'30-60 ngày', entry:'Multiple', validity:'1 năm',    desc:'Taj Mahal, sông Hằng và sự đa dạng văn hóa rực rỡ.' },
  { name:'Sri Lanka',    flag:'🇱🇰', region:'Đông Á',     time:'3-5 ngày',  price:'$35',  popular:false, trending:false, tag:'E-Visa',          stay:'30 ngày',    entry:'Multiple', validity:'6 tháng',  desc:'Đảo ngọc Ấn Độ Dương với rừng nhiệt đới, đền cổ và bãi biển hoang sơ.' },

  // Trung Đông
  { name:'Dubai (UAE)',  flag:'🇦🇪', region:'Trung Đông', time:'3-5 ngày',  price:'$45',  popular:true,  trending:true,  tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'2 tháng',  desc:'Thành phố tương lai với Burj Khalifa, sa mạc và mua sắm xa xỉ.' },
  { name:'Qatar',        flag:'🇶🇦', region:'Trung Đông', time:'3-5 ngày',  price:'$50',  popular:false, trending:false, tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'30 ngày',  desc:'Doha hiện đại bên bờ vịnh Ba Tư, kiến trúc đỉnh cao.' },
  { name:'Thổ Nhĩ Kỳ',   flag:'🇹🇷', region:'Trung Đông', time:'3-5 ngày',  price:'$50',  popular:false, trending:true,  tag:'E-Visa',          stay:'90 ngày',    entry:'Multiple', validity:'180 ngày', desc:'Istanbul giao thoa Á-Âu, Cappadocia với khinh khí cầu nổi tiếng.' },
  { name:'Saudi Arabia', flag:'🇸🇦', region:'Trung Đông', time:'5-7 ngày',  price:'$120', popular:false, trending:false, tag:'E-Visa',          stay:'90 ngày',    entry:'Multiple', validity:'1 năm',    desc:'Mecca, Riyadh và sa mạc Ả Rập với di sản văn hóa Hồi giáo phong phú.' },
  { name:'Oman',         flag:'🇴🇲', region:'Trung Đông', time:'3-5 ngày',  price:'$50',  popular:false, trending:false, tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'30 ngày',  desc:'Pháo đài cổ, sa mạc Wahiba và bờ biển Ấn Độ Dương yên bình.' },
  { name:'Bahrain',      flag:'🇧🇭', region:'Trung Đông', time:'2-3 ngày',  price:'$55',  popular:false, trending:false, tag:'E-Visa',          stay:'14 ngày',    entry:'Multiple', validity:'90 ngày',  desc:'Đảo quốc vịnh Ba Tư với di sản văn hóa Bahrain phong phú.' },

  // Châu Mỹ
  { name:'Canada',       flag:'🇨🇦', region:'Châu Mỹ',    time:'3-5 ngày',  price:'$80',  popular:false, trending:false, tag:'eTA',             stay:'180 ngày',   entry:'Multiple', validity:'5 năm',    desc:'Niagara, Rocky Mountains và Toronto — eTA online cấp nhanh trong vài giờ.' },
  { name:'Mexico',       flag:'🇲🇽', region:'Châu Mỹ',    time:'5-7 ngày',  price:'$60',  popular:false, trending:false, tag:'E-Visa',          stay:'180 ngày',   entry:'Multiple', validity:'30 ngày',  desc:'Văn hóa Maya, bãi biển Cancun và ẩm thực đặc sắc.' },
  { name:'Brazil',       flag:'🇧🇷', region:'Châu Mỹ',    time:'7-10 ngày', price:'$85',  popular:false, trending:false, tag:'E-Visa',          stay:'90 ngày',    entry:'Multiple', validity:'2 năm',    desc:'Rio de Janeiro, rừng Amazon và lễ hội carnival sôi động.' },

  // Châu Đại Dương
  { name:'Úc',           flag:'🇦🇺', region:'Châu Đại Dương', time:'5-10 ngày', price:'$95',  popular:true,  trending:false, tag:'E-Visa',     stay:'90 ngày',    entry:'Multiple', validity:'1 năm',    desc:'Sydney Opera House, Great Barrier Reef và outback hoang dã.' },
  { name:'New Zealand',  flag:'🇳🇿', region:'Châu Đại Dương', time:'3-5 ngày',  price:'$110', popular:false, trending:false, tag:'eTA',        stay:'90 ngày',    entry:'Multiple', validity:'2 năm',    desc:'Đất nước của Chúa Tể Của Những Chiếc Nhẫn với cảnh quan tuyệt mỹ.' },

  // Châu Âu
  { name:'Nga',          flag:'🇷🇺', region:'Châu Âu',    time:'5-7 ngày',  price:'$60',  popular:false, trending:false, tag:'E-Visa',          stay:'16 ngày',    entry:'Single',   validity:'60 ngày',  desc:'Moscow, St. Petersburg và bề dày lịch sử nước Nga.' },
  { name:'Albania',      flag:'🇦🇱', region:'Châu Âu',    time:'3-5 ngày',  price:'$45',  popular:false, trending:false, tag:'E-Visa',          stay:'90 ngày',    entry:'Multiple', validity:'180 ngày', desc:'Bờ biển Adriatic xinh đẹp và văn hóa Balkan độc đáo.' },

  // Châu Phi
  { name:'Ai Cập',       flag:'🇪🇬', region:'Châu Phi',   time:'5-7 ngày',  price:'$60',  popular:false, trending:false, tag:'E-Visa',          stay:'30 ngày',    entry:'Single',   validity:'3 tháng',  desc:'Kim tự tháp Giza, sông Nile và nền văn minh cổ đại Ai Cập.' },
  { name:'Kenya',        flag:'🇰🇪', region:'Châu Phi',   time:'3-5 ngày',  price:'$55',  popular:false, trending:false, tag:'E-Visa',          stay:'90 ngày',    entry:'Single',   validity:'3 tháng',  desc:'Safari Maasai Mara và đại di cư của thú rừng nổi tiếng.' },
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
  'E-Visa':          { bg:'#EEF3FF', text:'#1B4FD8', accent:'#1B4FD8' },
  'Visa on Arrival': { bg:'#FFF7ED', text:'#D97706', accent:'#F59E0B' },
  'eTA':             { bg:'#FDF4FF', text:'#9333EA', accent:'#9333EA' },
  'Miễn visa':       { bg:'#ECFDF5', text:'#059669', accent:'#10B981' },
}

const REQUIREMENTS = [
  'Hộ chiếu còn hạn ít nhất 6 tháng',
  'Ảnh chân dung 4×6 nền trắng (chụp trong 6 tháng)',
  'Vé máy bay khứ hồi (nếu yêu cầu)',
  'Đặt phòng khách sạn / địa chỉ lưu trú',
  'Sao kê ngân hàng 3 tháng gần nhất',
  'Bảo hiểm du lịch (tùy quốc gia)',
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
      d.tag.toLowerCase().includes(term)
    const matchRegion = region === 'Tất cả' || d.region === region
    return matchSearch && matchRegion
  })

  const showFeatured = !term && region === 'Tất cả'
  const trending = DESTINATIONS.filter(d => d.trending)
  const popular  = DESTINATIONS.filter(d => d.popular)

  return (
    <div className="min-h-screen" style={{ background:'#F9FAFB' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 55%,#0d2451 100%)' }}>
        <div className="absolute -top-20 -right-20 w-[440px] h-[440px] rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(27,79,216,0.25) 0%,transparent 70%)' }} />
        <div className="absolute -bottom-16 left-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(245,166,35,0.10) 0%,transparent 70%)' }} />

        <div className="relative max-w-4xl mx-auto px-4 py-14 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 text-xs font-semibold border" style={{ background:'rgba(245,166,35,0.15)', borderColor:'rgba(245,166,35,0.3)', color:'var(--gold)' }}>
            <span className="pulse w-2 h-2 rounded-full" style={{ background:'var(--gold)' }} />
            {DESTINATIONS.length}+ quốc gia có sẵn
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight" style={{ fontFamily:'Fraunces,serif' }}>
            Khám phá <span style={{ color:'var(--gold)' }}>điểm đến</span>
          </h1>
          <p className="text-white/65 text-base mb-8 max-w-lg mx-auto">
            Tìm visa cho mọi quốc gia bạn muốn — nhanh, an toàn, được chuyên gia hỗ trợ
          </p>

          <div className="max-w-lg mx-auto relative">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="w-full pl-12 pr-5 py-4 rounded-2xl text-sm outline-none border-none shadow-2xl focus:ring-4 focus:ring-white/30 transition-all"
              placeholder="Tìm theo tên quốc gia, khu vực hoặc loại visa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="inline-flex items-center divide-x divide-white/15 mt-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            {[
              ['quốc gia',  `${DESTINATIONS.length}+`],
              ['tỷ lệ duyệt','99%'],
              ['xử lý nhanh','24h'],
            ].map(([label, val]) => (
              <div key={label} className="px-5 md:px-7 py-3.5 text-center">
                <div className="text-white font-black text-lg leading-none" style={{ fontFamily:'Fraunces,serif' }}>{val}</div>
                <div className="text-white/55 text-[11px] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* ── Region chips ── */}
        <div className="flex gap-2 flex-wrap mb-10">
          {REGIONS.map(r => {
            const count = r.name === 'Tất cả' ? DESTINATIONS.length : DESTINATIONS.filter(d => d.region === r.name).length
            const active = region === r.name
            return (
              <button
                key={r.name}
                onClick={() => setRegion(r.name)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border flex items-center gap-2 ${active ? 'text-white border-transparent shadow-lg shadow-blue-500/25' : 'border-gray-200 text-gray-700 bg-white hover:border-blue-300 hover:text-blue-700 hover:-translate-y-0.5'}`}
                style={active ? { background:'var(--blue)' } : {}}
              >
                <span className="text-base leading-none">{r.icon}</span>
                <span>{r.name}</span>
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Trending ── */}
        {showFeatured && trending.length > 0 && (
          <SectionHeader
            icon="🔥"
            title="Đang xu hướng"
            subtitle="Những điểm đến được tìm kiếm nhiều nhất tuần này"
            right="Cập nhật mỗi tuần"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trending.slice(0, 4).map(d => <DestCard key={d.name} d={d} onClick={() => setSelected(d)} highlight />)}
            </div>
          </SectionHeader>
        )}

        {/* ── Popular ── */}
        {showFeatured && popular.length > 0 && (
          <SectionHeader
            icon="⭐"
            title="Phổ biến nhất"
            subtitle="Top quốc gia khách Việt thường chọn"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popular.map(d => <DestCard key={d.name} d={d} onClick={() => setSelected(d)} />)}
            </div>
          </SectionHeader>
        )}

        {/* ── All / filtered ── */}
        <SectionHeader
          icon="🌍"
          title={region === 'Tất cả' ? 'Tất cả điểm đến' : region}
          subtitle={term ? `Kết quả tìm kiếm cho "${search}"` : `Tổng cộng ${filtered.length} quốc gia`}
          right={`${filtered.length} kết quả`}
        >
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {filtered.map(d => <DestCard key={d.name} d={d} onClick={() => setSelected(d)} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="text-5xl mb-4 opacity-60">🔍</div>
              <p className="font-bold text-base mb-1" style={{ color:'var(--navy)' }}>Không tìm thấy quốc gia phù hợp</p>
              <p className="text-sm text-gray-500 mb-5">Thử từ khóa khác hoặc bỏ bộ lọc khu vực</p>
              <button
                onClick={() => { setSearch(''); setRegion('Tất cả') }}
                className="btn-primary"
              >Xem tất cả điểm đến</button>
            </div>
          )}
        </SectionHeader>

        {/* ── CTA banner ── */}
        <section className="mt-16 rounded-2xl overflow-hidden relative" style={{ background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 60%,#0d2451 100%)' }}>
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(245,166,35,0.20) 0%,transparent 70%)' }} />
          <div className="absolute -bottom-16 left-12 w-56 h-56 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(27,79,216,0.30) 0%,transparent 70%)' }} />

          <div className="relative px-6 py-10 md:px-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-4 md:gap-5">
              <div className="text-5xl md:text-6xl">💼</div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-1" style={{ fontFamily:'Fraunces,serif' }}>
                  Không thấy nước bạn cần?
                </h3>
                <p className="text-white/70 text-sm">Liên hệ chuyên gia — chúng tôi hỗ trợ visa cho 150+ quốc gia</p>
              </div>
            </div>
            <Link
              to="/support"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background:'var(--gold)', color:'var(--navy)' }}
            >
              Hỗ trợ ngay
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </section>
      </div>

      {selected && <DestModal d={selected} onClose={() => setSelected(null)} />}

      <Footer />
    </div>
  )
}

function SectionHeader({ icon, title, subtitle, right, children }) {
  return (
    <section className="mb-12 last:mb-0">
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black flex items-center gap-2 mb-1" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            <span className="text-2xl">{icon}</span>
            {title}
          </h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {right && <span className="text-xs text-gray-400 whitespace-nowrap pb-1">{right}</span>}
      </div>
      {children}
    </section>
  )
}

function DestCard({ d, onClick, highlight }) {
  const tagColor = TAG_COLORS[d.tag] || { bg:'#F3F4F6', text:'#6B7280', accent:'#9CA3AF' }
  return (
    <button
      onClick={onClick}
      className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:border-transparent transition-all duration-300 text-left flex flex-col cursor-pointer"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background:tagColor.accent }} />

      {/* HOT badge */}
      {highlight && (
        <span
          className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1"
          style={{ background:'var(--gold)', color:'var(--navy)' }}
        >
          🔥 HOT
        </span>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110 origin-left">{d.flag}</div>
        <h3 className="font-bold text-base mb-2 leading-tight" style={{ color:'var(--navy)' }}>{d.name}</h3>
        <span
          className="self-start text-[11px] px-2 py-0.5 rounded-full mb-4 font-semibold"
          style={{ background:tagColor.bg, color:tagColor.text }}
        >
          {d.tag}
        </span>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            {d.time}
          </span>
          <span className="font-black text-base" style={{ color:'var(--blue)' }}>{d.price}</span>
        </div>
      </div>
    </button>
  )
}

function DestModal({ d, onClose }) {
  const tagColor = TAG_COLORS[d.tag] || { bg:'#F3F4F6', text:'#6B7280', accent:'#9CA3AF' }
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
      <div
        onClick={e => e.stopPropagation()}
        className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl fade-up"
      >
        {/* Header */}
        <div className="px-6 pt-7 pb-6 md:px-8 relative overflow-hidden" style={{ background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 100%)' }}>
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full pointer-events-none" style={{ background:`radial-gradient(circle,${tagColor.accent}33 0%,transparent 70%)` }} />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-all text-base"
            aria-label="Đóng"
          >✕</button>
          <div className="relative flex items-center gap-4 pr-10">
            <div className="text-5xl md:text-6xl drop-shadow-lg">{d.flag}</div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight" style={{ fontFamily:'Fraunces,serif' }}>{d.name}</h2>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white/90 bg-white/15">{d.region}</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background:'var(--gold)', color:'var(--navy)' }}>{d.tag}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          <p className="text-sm text-gray-600 leading-relaxed mb-6">{d.desc}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 mb-6">
            {[
              ['⏱', 'Thời gian xử lý',  d.time],
              ['📅', 'Lưu trú tối đa',   d.stay],
              ['🔁', 'Số lần nhập cảnh', d.entry],
              ['📆', 'Hiệu lực visa',    d.validity],
              ['💰', 'Phí dịch vụ',      d.price],
              ['📋', 'Loại visa',        d.tag],
            ].map(([icon, label, val]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3.5 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-base leading-none">{icon}</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
                </div>
                <p className="font-bold text-sm leading-tight" style={{ color:'var(--navy)' }}>{val}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-4 mb-6" style={{ background:'#FFFBEB', border:'1px solid #FDE68A' }}>
            <h4 className="font-bold text-sm mb-2.5 flex items-center gap-1.5" style={{ color:'#92400E' }}>
              <span className="text-base">📋</span> Giấy tờ cần chuẩn bị
            </h4>
            <ul className="text-xs leading-relaxed space-y-1.5" style={{ color:'#78350F' }}>
              {REQUIREMENTS.map(r => (
                <li key={r} className="flex gap-2">
                  <span style={{ color:'#16A34A' }}>✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button onClick={onClose} className="btn-secondary flex-1 sm:flex-initial sm:px-6">Để sau</button>
            <Link to="/" onClick={onClose} className="btn-primary flex-1 justify-center">
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
