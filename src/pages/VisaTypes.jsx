import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const TYPES = [
  {
    key:'evisa',
    icon:'⚡',
    name:'E-Visa',
    subtitle:'Visa điện tử tiêu chuẩn',
    accent:'#1B4FD8',
    bg:'#EEF3FF',
    desc:'Loại visa phổ biến nhất — nộp 100% online, nhận visa qua email. Không cần đến đại sứ quán.',
    suitable:[
      'Du lịch ngắn hạn (14-90 ngày)',
      'Công tác, hội nghị, đàm phán thương mại',
      'Thăm thân nhân, bạn bè',
    ],
    process:[
      'Điền form online (10 phút)',
      'Tải ảnh chân dung & hộ chiếu',
      'Thanh toán qua thẻ / ví điện tử',
      'Nhận visa qua email (3-7 ngày)',
    ],
    info:{ time:'3-7 ngày', price:'từ $29', entry:'Single / Multiple' },
    countries:'80+ quốc gia',
    examples:'Thái Lan, Nhật Bản, Hàn Quốc, Dubai, Thổ Nhĩ Kỳ...',
  },
  {
    key:'voa',
    icon:'🛬',
    name:'Visa on Arrival',
    subtitle:'Visa cấp tại cửa khẩu',
    accent:'#F59E0B',
    bg:'#FFF7ED',
    desc:'Đăng ký pre-approval online trước khi đi, nhận visa khi nhập cảnh. Cần mang theo giấy tờ gốc.',
    suitable:[
      'Du lịch tự do, tour nhóm',
      'Có vé máy bay & khách sạn xác nhận',
      'Đi các nước Đông Nam Á, Maldives, Nepal',
    ],
    process:[
      'Đăng ký pre-approval online',
      'In thư mời / mã QR mang theo',
      'Nộp ảnh + lệ phí tại sân bay',
      'Nhận tem visa dán vào hộ chiếu',
    ],
    info:{ time:'5-7 ngày + tại sân bay', price:'từ $35', entry:'Single' },
    countries:'15+ quốc gia',
    examples:'Indonesia, Sri Lanka, Maldives...',
  },
  {
    key:'eta',
    icon:'🚀',
    name:'eTA',
    subtitle:'Electronic Travel Authorization',
    accent:'#9333EA',
    bg:'#FDF4FF',
    desc:'Cho phép nhập cảnh điện tử dành cho các nước phát triển. Cấp tự động trong vài giờ, hiệu lực dài.',
    suitable:[
      'Du lịch & công tác đến Canada, New Zealand',
      'Quá cảnh dài hoặc visa-waiver',
      'Người có hộ chiếu phổ biến muốn đi nhanh',
    ],
    process:[
      'Điền form ngắn online (5 phút)',
      'Thanh toán phí xử lý',
      'Nhận xác nhận trong vài giờ',
      'Liên kết tự động với hộ chiếu',
    ],
    info:{ time:'1-3 ngày', price:'từ $80', entry:'Multiple' },
    countries:'Canada, New Zealand, Úc',
    examples:'Hệ thống ESTA / eTA / ETA',
  },
  {
    key:'free',
    icon:'✅',
    name:'Miễn visa',
    subtitle:'Du lịch không cần visa',
    accent:'#10B981',
    bg:'#ECFDF5',
    desc:'Một số quốc gia miễn visa cho công dân Việt Nam. Bạn chỉ cần hộ chiếu còn hạn 6 tháng.',
    suitable:[
      'Du lịch ngắn ngày (14-30 ngày)',
      'Cuối tuần, đi nhanh, đi xa',
      'Tiết kiệm chi phí xin visa',
    ],
    process:[
      'Kiểm tra hộ chiếu còn hạn ≥ 6 tháng',
      'Đặt vé máy bay khứ hồi',
      'Đặt phòng khách sạn (khuyến nghị)',
      'Khai tờ khai nhập cảnh tại sân bay',
    ],
    info:{ time:'Tức thì', price:'Miễn phí', entry:'Multiple' },
    countries:'12+ quốc gia',
    examples:'Malaysia, Hong Kong, Singapore, Lào...',
  },
]

const COMPARISON_ROWS = [
  ['Cách nộp',      'Online 100%',     'Online + tại sân bay',  'Online 100%',          'Không cần nộp'],
  ['Thời gian xử lý','3-7 ngày',       '5-7 ngày + tại sân bay','1-3 ngày',             'Tức thì'],
  ['Phí dịch vụ',   'từ $29',          'từ $35',                'từ $80',               'Miễn phí'],
  ['Số lần nhập cảnh','Single / Multi','Single',                'Multiple',             'Multiple'],
  ['Thời gian lưu trú','14-90 ngày',   '30 ngày',               '90-180 ngày',          '14-30 ngày'],
  ['Phù hợp',       'Du lịch, công tác','Đông Nam Á, Maldives','Canada, NZ, Úc',       '12+ quốc gia ASEAN'],
]

export default function VisaTypes() {
  const [active, setActive] = useState('evisa')
  const activeType = TYPES.find(t => t.key === active)

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
            Visa điện tử cho 100+ quốc gia
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight" style={{ fontFamily:'Fraunces,serif' }}>
            Hiểu đúng <span style={{ color:'var(--gold)' }}>loại visa</span> bạn cần
          </h1>
          <p className="text-white/65 text-base mb-8 max-w-lg mx-auto">
            4 loại visa điện tử eVisa hỗ trợ — chọn đúng loại để chuẩn bị hồ sơ nhanh và chính xác
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {TYPES.map(t => (
              <button
                key={t.key}
                onClick={() => {
                  setActive(t.key)
                  document.getElementById('detail')?.scrollIntoView({ behavior:'smooth', block:'start' })
                }}
                className="group inline-flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full text-xs md:text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/15 text-white hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/15 text-base leading-none flex-shrink-0">{t.icon}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── What is eVisa? ── */}
      <section className="max-w-5xl mx-auto px-5 py-14">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-7 md:p-10">
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color:'var(--blue)' }}>
                eVisa là gì?
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
                Visa điện tử — đơn giản, an toàn, nhanh chóng
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-5">
                eVisa (Electronic Visa) là visa được cấp dưới dạng điện tử, có giá trị pháp lý tương đương visa dán. Bạn chỉ cần in ra hoặc xuất trình trên điện thoại khi nhập cảnh.
              </p>
              <div className="space-y-2.5">
                {[
                  ['🌐','Nộp 100% online','Không cần đến đại sứ quán'],
                  ['⚡','Xử lý nhanh','Trung bình 3-7 ngày, có gói 24h'],
                  ['🔒','An toàn tuyệt đối','Mã hóa SSL 256-bit, dữ liệu bảo vệ chuẩn quốc tế'],
                  ['💼','Giá trị pháp lý','Tương đương visa dán, được công nhận tại biên giới'],
                ].map(([icon,title,desc]) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="text-xl leading-none mt-0.5">{icon}</div>
                    <div>
                      <div className="font-bold text-sm" style={{ color:'var(--navy)' }}>{title}</div>
                      <div className="text-xs text-gray-500">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center p-10 relative" style={{ background:'linear-gradient(135deg,#EEF3FF 0%,#F0FDF4 100%)' }}>
              <div className="text-[180px] leading-none drop-shadow-2xl">📱</div>
              <div className="absolute top-8 right-8 bg-white rounded-xl p-3 shadow-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm" style={{ background:'var(--green)' }}>✓</div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color:'var(--green)' }}>Đã chấp thuận</div>
                  <div className="text-xs font-bold" style={{ color:'var(--navy)' }}>EV-A47B92</div>
                </div>
              </div>
              <div className="absolute bottom-10 left-10 bg-white rounded-xl p-3 shadow-lg">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Thời gian</div>
                <div className="text-sm font-black" style={{ color:'var(--blue)' }}>3 ngày</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 type cards ── */}
      <section className="max-w-5xl mx-auto px-5 pb-14" id="detail">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            4 loại visa điện tử
          </h2>
          <p className="text-sm text-gray-500">Click vào loại bạn quan tâm để xem chi tiết</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {TYPES.map(t => {
            const isActive = active === t.key
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`relative rounded-xl p-4 md:p-5 border-2 text-left transition-all hover:-translate-y-1 ${isActive ? 'shadow-lg' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                style={isActive ? { borderColor:t.accent, background:t.bg } : {}}
              >
                <div className="text-3xl mb-2">{t.icon}</div>
                <div className="font-black text-sm md:text-base mb-0.5" style={{ color:'var(--navy)' }}>{t.name}</div>
                <div className="text-[11px] text-gray-500 leading-tight">{t.subtitle}</div>
                {isActive && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45" style={{ background:t.bg, borderRight:`2px solid ${t.accent}`, borderBottom:`2px solid ${t.accent}` }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Detail panel */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden fade-up" key={active}>
          <div className="p-6 md:p-8 border-b border-gray-100" style={{ background:activeType.bg }}>
            <div className="flex items-start gap-4">
              <div className="text-5xl md:text-6xl">{activeType.icon}</div>
              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-black leading-tight" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>{activeType.name}</h3>
                <p className="text-sm font-semibold mt-0.5" style={{ color:activeType.accent }}>{activeType.subtitle}</p>
                <p className="text-sm text-gray-700 mt-3 leading-relaxed max-w-2xl">{activeType.desc}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color:'var(--navy)' }}>
                <span style={{ color:activeType.accent }}>●</span> Phù hợp khi
              </h4>
              <ul className="space-y-2">
                {activeType.suitable.map(s => (
                  <li key={s} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-0.5" style={{ color:activeType.accent }}>✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color:'var(--navy)' }}>
                <span style={{ color:activeType.accent }}>●</span> Quy trình 4 bước
              </h4>
              <ol className="space-y-2.5">
                {activeType.process.map((p, i) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-0.5 text-white" style={{ background:activeType.accent }}>{i + 1}</div>
                    <span className="pt-0.5">{p}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="px-6 md:px-8 pb-6 md:pb-8">
            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5">
              {[
                ['⏱', 'Thời gian',     activeType.info.time],
                ['💰', 'Phí dịch vụ',  activeType.info.price],
                ['🔁', 'Nhập cảnh',    activeType.info.entry],
              ].map(([icon, label, val]) => (
                <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-base mb-0.5">{icon}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">{label}</div>
                  <div className="font-bold text-xs md:text-sm leading-tight" style={{ color:'var(--navy)' }}>{val}</div>
                </div>
              ))}
            </div>

            <div className="rounded-lg p-3.5 mb-5 flex items-start gap-2.5" style={{ background:activeType.bg }}>
              <span className="text-base">🌍</span>
              <div className="flex-1 text-xs" style={{ color:activeType.accent }}>
                <span className="font-bold">{activeType.countries}</span>
                <span className="text-gray-600 ml-2">— ví dụ: {activeType.examples}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/destinations" className="btn-secondary flex-1 sm:flex-initial sm:px-6 justify-center">
                Xem điểm đến
              </Link>
              <Link to="/" className="btn-primary flex-1 justify-center">
                Đăng ký {activeType.name} ngay
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="max-w-5xl mx-auto px-5 pb-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            So sánh nhanh
          </h2>
          <p className="text-sm text-gray-500">Bảng so sánh giúp bạn chọn loại visa phù hợp nhất</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200" style={{ background:'#F9FAFB' }}>
                  <th className="text-left px-4 md:px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Tiêu chí</th>
                  {TYPES.map(t => (
                    <th key={t.key} className="text-center px-3 md:px-6 py-4">
                      <div className="text-2xl mb-1">{t.icon}</div>
                      <div className="font-black text-sm" style={{ color:'var(--navy)' }}>{t.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map(([label, ...vals]) => (
                  <tr key={label} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 md:px-6 py-3.5 font-semibold text-gray-700">{label}</td>
                    {vals.map((v, i) => (
                      <td key={i} className="px-3 md:px-6 py-3.5 text-center text-gray-600">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Decision helper ── */}
      <section className="max-w-5xl mx-auto px-5 pb-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            Vẫn chưa chắc loại nào phù hợp?
          </h2>
          <p className="text-sm text-gray-500">Trả lời 1 câu hỏi nhanh để được gợi ý</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { q:'Đi Đông Nam Á / Đông Á?',     a:'E-Visa', icon:'🌏', accent:'#1B4FD8', desc:'Phù hợp cho Thái Lan, Nhật Bản, Hàn Quốc, Dubai...' },
            { q:'Đi Canada, NZ, Úc?',          a:'eTA',    icon:'🛫', accent:'#9333EA', desc:'eTA cấp nhanh trong vài giờ, hiệu lực 2-5 năm' },
            { q:'Đi Malaysia, Singapore, HK?', a:'Miễn visa', icon:'✅', accent:'#10B981', desc:'Không cần xin visa, chỉ cần hộ chiếu hạn 6 tháng' },
          ].map(c => (
            <div key={c.q} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:c.accent }}>Nếu bạn</div>
              <h3 className="font-bold text-base mb-2" style={{ color:'var(--navy)' }}>{c.q}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{c.desc}</p>
              <div className="rounded-lg p-3 flex items-center justify-between" style={{ background:`${c.accent}11` }}>
                <span className="text-xs text-gray-600">→ Chọn loại</span>
                <span className="font-black text-sm" style={{ color:c.accent }}>{c.a}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="max-w-5xl mx-auto px-5 pb-14">
        <div className="bg-white rounded-2xl border border-gray-200 px-6 py-7 md:px-10 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              ['🔒','SSL 256-bit',     'Dữ liệu mã hóa'],
              ['⚡','24h xử lý',       'Gói siêu nhanh'],
              ['🏆','99% chấp thuận','Chuyên gia review'],
              ['💬','Hỗ trợ 24/7',    'Tiếng Việt'],
            ].map(([icon,title,desc]) => (
              <div key={title}>
                <div className="text-3xl mb-2">{icon}</div>
                <div className="font-black text-sm" style={{ color:'var(--navy)' }}>{title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-5xl mx-auto px-5 pb-14">
        <div className="rounded-2xl overflow-hidden relative" style={{ background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 60%,#0d2451 100%)' }}>
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(245,166,35,0.20) 0%,transparent 70%)' }} />
          <div className="absolute -bottom-16 left-12 w-56 h-56 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(27,79,216,0.30) 0%,transparent 70%)' }} />

          <div className="relative px-6 py-10 md:px-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-4 md:gap-5">
              <div className="text-5xl md:text-6xl">🚀</div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-1" style={{ fontFamily:'Fraunces,serif' }}>
                  Sẵn sàng nộp đơn?
                </h3>
                <p className="text-white/70 text-sm">Hoàn tất hồ sơ trong 10 phút — chuyên gia kiểm tra trước khi nộp</p>
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
