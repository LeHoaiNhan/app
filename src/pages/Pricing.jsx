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
    features:[
      'Chuyên gia review hồ sơ',
      'AI kiểm tra ảnh chân dung',
      'Mã hóa SSL 256-bit',
      'Hỗ trợ tiếng Việt 24/7',
      'Email cập nhật trạng thái',
    ],
    accent:'#6B7280', bg:'#F9FAFB',
  },
  {
    key:'fast', label:'Fast', icon:'⚡',
    desc:'Lựa chọn phổ biến nhất',
    fee: SERVICE_FEES.fast,
    time:'2-3 ngày làm việc',
    features:[
      'Tất cả tính năng Standard',
      'Ưu tiên xử lý hồ sơ',
      'Hoàn 100% phí dịch vụ nếu từ chối',
      'Live Chat ưu tiên',
      'SMS thông báo',
    ],
    accent:'#1B4FD8', bg:'#EEF3FF', popular:true,
  },
  {
    key:'express', label:'Express', icon:'🚀',
    desc:'Nhanh nhất có thể',
    fee: SERVICE_FEES.express,
    time:'24 giờ',
    features:[
      'Tất cả tính năng Fast',
      'SLA 24h cam kết',
      'Hotline trực tiếp chuyên gia',
      'Ưu tiên đầu tiên trong queue',
      'Hoàn 200% nếu trễ deadline',
    ],
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
  { q:'Gói Express trễ deadline thì sao?',                a:'Cam kết SLA 24 giờ với gói Express. Nếu trễ vì lỗi của eVisa, chúng tôi hoàn 200% phí dịch vụ. Trễ vì cơ quan cấp visa thì hoàn 100% — chi tiết trong điều khoản.' },
]

export default function Pricing() {
  const [selectedTier, setSelectedTier] = useState('fast')
  const [search, setSearch] = useState('')
  const [sort, setSort]     = useState('popular') // popular | name | price-asc | price-desc
  const [openFaq, setOpenFaq] = useState(null)

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()
    let arr = PRICING.filter(p => !term || p.country.toLowerCase().includes(term))

    arr = [...arr].sort((a, b) => {
      if (sort === 'popular')   return Number(b.popular) - Number(a.popular) || a.country.localeCompare(b.country)
      if (sort === 'name')      return a.country.localeCompare(b.country)
      const at = (a.gov ?? 0) + SERVICE_FEES[selectedTier]
      const bt = (b.gov ?? 0) + SERVICE_FEES[selectedTier]
      if (sort === 'price-asc')  return at - bt
      if (sort === 'price-desc') return bt - at
      return 0
    })
    return arr
  }, [search, sort, selectedTier])

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
            Giá minh bạch — không phí ẩn
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight" style={{ fontFamily:'Fraunces,serif' }}>
            Bảng <span style={{ color:'var(--gold)' }}>giá</span> dịch vụ
          </h1>
          <p className="text-white/65 text-base mb-8 max-w-lg mx-auto">
            Phí dịch vụ + phí chính phủ — bạn chỉ trả đúng số tiền hiển thị, không phụ phí
          </p>

          <div className="inline-flex items-center divide-x divide-white/15 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            {[
              ['hoàn tiền', 'Nếu từ chối'],
              ['minh bạch','100%'],
              ['SLA',      '24h-7 ngày'],
            ].map(([label, val]) => (
              <div key={label} className="px-5 md:px-7 py-3.5 text-center">
                <div className="text-white font-black text-lg leading-none" style={{ fontFamily:'Fraunces,serif' }}>{val}</div>
                <div className="text-white/55 text-[11px] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service tiers ── */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'var(--blue)' }}>Phí dịch vụ</div>
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            Chọn tốc độ phù hợp
          </h2>
          <p className="text-sm text-gray-500">3 gói dịch vụ — chọn theo nhu cầu thời gian của bạn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {TIERS.map(t => {
            const isSelected = selectedTier === t.key
            return (
              <button
                key={t.key}
                onClick={() => setSelectedTier(t.key)}
                className={`relative rounded-2xl border-2 p-6 md:p-7 text-left transition-all hover:-translate-y-1 ${isSelected ? 'shadow-xl' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                style={isSelected ? { borderColor:t.accent, background:t.bg } : {}}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full text-white shadow-md" style={{ background:'var(--gold)', color:'var(--navy)' }}>
                    🔥 PHỔ BIẾN NHẤT
                  </span>
                )}
                <div className="flex items-center gap-3 mb-1">
                  <div className="text-3xl">{t.icon}</div>
                  <div>
                    <div className="font-black text-xl" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>{t.label}</div>
                    <div className="text-xs text-gray-500">{t.desc}</div>
                  </div>
                </div>

                <div className="my-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black" style={{ color:t.accent }}>${t.fee}</span>
                    <span className="text-sm text-gray-500">+ phí chính phủ</span>
                  </div>
                  <div className="text-xs font-semibold mt-1" style={{ color:t.accent }}>⏱ {t.time}</div>
                </div>

                <ul className="space-y-2 mb-5">
                  {t.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-0.5 flex-shrink-0" style={{ color:t.accent }}>✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`text-center text-sm font-bold py-2.5 rounded-lg transition-all ${isSelected ? 'text-white' : 'border border-gray-300 text-gray-700'}`}
                  style={isSelected ? { background:t.accent } : {}}
                >
                  {isSelected ? '✓ Đang xem giá theo gói này' : 'Xem giá theo gói này'}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── Country pricing table ── */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="text-center mb-8">
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'var(--blue)' }}>Theo quốc gia</div>
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            Giá visa cho từng nước
          </h2>
          <p className="text-sm text-gray-500">
            Đang xem theo gói <span className="font-bold" style={{ color:'var(--blue)' }}>{TIERS.find(t => t.key === selectedTier)?.label}</span> — đổi gói ở trên để cập nhật giá
          </p>
        </div>

        {/* Search + sort */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Tìm quốc gia..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-blue-500 transition-all bg-white"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="popular">Phổ biến trước</option>
              <option value="name">Tên A-Z</option>
              <option value="price-asc">Giá thấp → cao</option>
              <option value="price-desc">Giá cao → thấp</option>
            </select>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200" style={{ background:'#F9FAFB' }}>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Quốc gia</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Loại</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Phí chính phủ</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Phí dịch vụ</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Tổng</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(p => {
                  const tagColor = TAG_COLORS[p.tag] || { bg:'#F3F4F6', text:'#6B7280' }
                  const isFree = p.gov === null
                  const total = isFree ? null : p.gov + SERVICE_FEES[selectedTier]
                  return (
                    <tr key={p.country} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{p.flag}</span>
                          <div>
                            <span className="font-bold" style={{ color:'var(--navy)' }}>{p.country}</span>
                            {p.popular && <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background:'#FFFBEB', color:'#92400E' }}>HOT</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background:tagColor.bg, color:tagColor.text }}>{p.tag}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-gray-600">{isFree ? '—' : `$${p.gov}`}</td>
                      <td className="px-4 py-3.5 text-right text-gray-600">{isFree ? '—' : `$${SERVICE_FEES[selectedTier]}`}</td>
                      <td className="px-4 py-3.5 text-right">
                        {isFree ? (
                          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background:'#ECFDF5', color:'#059669' }}>Miễn phí</span>
                        ) : (
                          <span className="font-black text-base" style={{ color:'var(--blue)' }}>${total}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {isFree ? (
                          <span className="text-xs text-gray-400">Không cần</span>
                        ) : (
                          <Link to="/" className="text-xs font-bold whitespace-nowrap hover:underline" style={{ color:'var(--blue)' }}>
                            Đăng ký →
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {rows.map(p => {
              const tagColor = TAG_COLORS[p.tag] || { bg:'#F3F4F6', text:'#6B7280' }
              const isFree = p.gov === null
              const total = isFree ? null : p.gov + SERVICE_FEES[selectedTier]
              return (
                <div key={p.country} className="px-5 py-4 flex items-center gap-3">
                  <span className="text-3xl flex-shrink-0">{p.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm" style={{ color:'var(--navy)' }}>{p.country}</span>
                      {p.popular && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background:'#FFFBEB', color:'#92400E' }}>HOT</span>}
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background:tagColor.bg, color:tagColor.text }}>{p.tag}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {isFree ? (
                      <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background:'#ECFDF5', color:'#059669' }}>Miễn phí</span>
                    ) : (
                      <>
                        <div className="font-black text-base" style={{ color:'var(--blue)' }}>${total}</div>
                        <div className="text-[10px] text-gray-500">${p.gov} + ${SERVICE_FEES[selectedTier]}</div>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {rows.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-2 opacity-50">🔍</div>
              <p className="text-sm text-gray-500">Không tìm thấy quốc gia phù hợp</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Fee breakdown explainer ── */}
      <section className="max-w-5xl mx-auto px-4 pb-14">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'var(--blue)' }}>Phí gồm những gì?</div>
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            Phân tích chi tiết phí
          </h2>
          <p className="text-sm text-gray-500">Bạn biết rõ tiền đi đâu — không một xu phụ phí ẩn</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border-2 rounded-2xl overflow-hidden" style={{ borderColor:'#FED7AA' }}>
            <div className="px-6 py-5 flex items-center gap-3" style={{ background:'#FFF7ED' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white">🏛️</div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color:'#D97706' }}>Phí chính phủ</div>
                <div className="font-black text-lg" style={{ color:'var(--navy)' }}>Gov Fee</div>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Phí do cơ quan cấp visa của mỗi nước thu. eVisa thu hộ và <strong style={{ color:'var(--navy)' }}>chuyển 100%</strong> đến cơ quan, không giữ lại bất kỳ phần nào.
              </p>
              <ul className="text-xs text-gray-500 space-y-1.5">
                <li>• Mỗi nước có biểu phí riêng</li>
                <li>• Có thể thay đổi khi nước đó cập nhật chính sách</li>
                <li>• Không hoàn lại theo quy định mỗi nước</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border-2 rounded-2xl overflow-hidden" style={{ borderColor:'#BFDBFE' }}>
            <div className="px-6 py-5 flex items-center gap-3" style={{ background:'#EEF3FF' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white">⚡</div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color:'var(--blue)' }}>Phí dịch vụ eVisa</div>
                <div className="font-black text-lg" style={{ color:'var(--navy)' }}>Service Fee</div>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Chi phí cho công việc của đội ngũ chuyên gia eVisa — bao gồm review, AI kiểm ảnh, hỗ trợ và bảo hiểm hồ sơ.
              </p>
              <ul className="text-xs text-gray-500 space-y-1.5">
                <li>• Chuyên gia review từng hồ sơ</li>
                <li>• AI kiểm tra tự động ảnh & giấy tờ</li>
                <li>• Hỗ trợ 24/7 tiếng Việt</li>
                <li>• <strong style={{ color:'var(--green)' }}>Hoàn 100% nếu từ chối</strong></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl p-4 flex items-start gap-3" style={{ background:'#F0FDF4', border:'1px solid #BBF7D0' }}>
          <span className="text-2xl">💡</span>
          <div className="flex-1 text-sm" style={{ color:'#15803D' }}>
            <span className="font-bold">Tổng phí bạn trả</span> = Phí chính phủ + Phí dịch vụ. Bảng giá phía trên đã bao gồm cả 2.
          </div>
        </div>
      </section>

      {/* ── Pricing FAQ ── */}
      <section className="max-w-4xl mx-auto px-4 pb-14">
        <div className="text-center mb-8">
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'var(--blue)' }}>FAQ</div>
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            Câu hỏi về giá
          </h2>
        </div>

        <div className="space-y-2">
          {FAQS.map(f => {
            const isOpen = openFaq === f.q
            return (
              <div key={f.q} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-sm hover:bg-gray-50 transition-colors"
                  style={{ color:'var(--navy)' }}
                  onClick={() => setOpenFaq(isOpen ? null : f.q)}
                >
                  <span>{f.q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    <div className="pt-3">{f.a}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="rounded-2xl overflow-hidden relative" style={{ background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 60%,#0d2451 100%)' }}>
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(245,166,35,0.20) 0%,transparent 70%)' }} />
          <div className="absolute -bottom-16 left-12 w-56 h-56 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(27,79,216,0.30) 0%,transparent 70%)' }} />

          <div className="relative px-6 py-10 md:px-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-4 md:gap-5">
              <div className="text-5xl md:text-6xl">💳</div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-1" style={{ fontFamily:'Fraunces,serif' }}>
                  Sẵn sàng đăng ký?
                </h3>
                <p className="text-white/70 text-sm">Hoàn 100% phí dịch vụ nếu visa bị từ chối — không rủi ro</p>
              </div>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all hover:-translate-y-0.5 hover:shadow-xl"
              style={{ background:'var(--gold)', color:'var(--navy)' }}
            >
              Đăng ký visa ngay
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
