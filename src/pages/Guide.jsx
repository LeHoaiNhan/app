import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const STEPS = [
  { num:'01', icon:'🌍', title:'Chọn điểm đến & loại visa', time:'1 phút', desc:'Kiểm tra yêu cầu visa cho quốc gia bạn muốn đến và chọn loại eVisa phù hợp với mục đích chuyến đi.' },
  { num:'02', icon:'📝', title:'Điền thông tin cá nhân',     time:'5 phút', desc:'Nhập họ tên, ngày sinh, thông tin liên hệ. Hệ thống tự động kiểm tra tính hợp lệ ngay khi gõ.' },
  { num:'03', icon:'📘', title:'Tải hộ chiếu & ảnh',         time:'2 phút', desc:'Tải ảnh trang thông tin hộ chiếu và ảnh chân dung nền trắng. Hệ thống AI kiểm tra chất lượng ảnh.' },
  { num:'04', icon:'💳', title:'Thanh toán an toàn',         time:'1 phút', desc:'Thanh toán qua thẻ tín dụng hoặc ví điện tử với mã hóa SSL 256-bit. Có hóa đơn điện tử ngay.' },
  { num:'05', icon:'✈️', title:'Nhận visa qua email',         time:'3-7 ngày', desc:'Đội ngũ chuyên gia kiểm tra hồ sơ và gửi visa điện tử về email. Bạn chỉ cần in hoặc xuất trình.' },
]

const DOCS = [
  { id:'passport',  required:true,  label:'Hộ chiếu còn hạn ít nhất 6 tháng',           hint:'Tính từ ngày dự kiến nhập cảnh' },
  { id:'photo',     required:true,  label:'Ảnh chân dung 4×6 nền trắng',                hint:'Chụp trong vòng 6 tháng, không đội mũ, không kính' },
  { id:'passport-img', required:true, label:'Ảnh trang thông tin hộ chiếu',             hint:'Rõ nét, đủ 4 góc, không bị che' },
  { id:'flight',    required:false, label:'Vé máy bay khứ hồi',                        hint:'Một số nước yêu cầu (Thái Lan, Nhật, Hàn)' },
  { id:'hotel',     required:false, label:'Đặt phòng khách sạn / địa chỉ lưu trú',     hint:'Giúp tăng tỷ lệ chấp thuận' },
  { id:'bank',      required:false, label:'Sao kê ngân hàng 3 tháng gần nhất',         hint:'Khuyến nghị cho visa du lịch dài ngày' },
  { id:'insurance', required:false, label:'Bảo hiểm du lịch',                          hint:'Bắt buộc với một số nước châu Âu' },
  { id:'invitation',required:false, label:'Thư mời (nếu có)',                          hint:'Cho mục đích thăm thân, công tác' },
]

const PHOTO_DOS = [
  'Nền trắng đồng nhất',
  'Mặt thẳng, nhìn vào camera',
  'Ánh sáng đều, không đổ bóng',
  'Tóc gọn, không che mặt',
  'Tối thiểu 400 × 400 px',
]
const PHOTO_DONTS = [
  'Đội mũ, đeo kính (kể cả kính cận)',
  'Cười hở răng, biểu cảm khác lạ',
  'Nền có hoa văn, vật thể',
  'Ảnh selfie, ảnh chụp với nhóm',
  'Ảnh mờ, có filter, chỉnh sửa quá mức',
]

const MISTAKES = [
  { icon:'📅', title:'Hộ chiếu sắp hết hạn',     desc:'Hộ chiếu phải còn hạn ít nhất 6 tháng. Nhiều người bị từ chối vì hạn còn 5 tháng 28 ngày.' },
  { icon:'📸', title:'Ảnh không đúng chuẩn',    desc:'Ảnh selfie, ảnh có filter, ảnh nền không trắng là lý do từ chối phổ biến nhất.' },
  { icon:'✍️', title:'Sai chính tả họ tên',     desc:'Tên trên đơn phải khớp 100% với hộ chiếu. Sai một chữ cái cũng bị từ chối.' },
  { icon:'⏰', title:'Đăng ký quá sát ngày đi', desc:'Nên nộp đơn trước ít nhất 14 ngày. Gói thường mất 5-7 ngày, thêm thời gian dự phòng.' },
  { icon:'💰', title:'Tài chính không đủ chứng minh', desc:'Visa du lịch dài ngày cần sao kê đủ chi phí. Tài khoản dưới $2000 dễ bị nghi ngờ.' },
  { icon:'🎯', title:'Khai sai mục đích chuyến đi', desc:'Khai du lịch nhưng đi công tác (hoặc ngược lại) có thể bị từ chối khi nhập cảnh.' },
]

const TIPS = [
  { icon:'🚀', title:'Nộp sớm 2-3 tuần',     desc:'Tránh sát ngày đi để có thời gian xử lý sự cố nếu hồ sơ thiếu.' },
  { icon:'✅', title:'Kiểm tra kỹ trước khi nộp', desc:'Đọc lại 2 lần — đặc biệt là số hộ chiếu, ngày tháng, email.' },
  { icon:'📞', title:'Lưu mã đơn',            desc:'Mã EV-XXXXXX dùng để tra cứu trạng thái và liên hệ hỗ trợ.' },
  { icon:'💾', title:'Lưu visa offline',      desc:'Tải visa PDF về máy + in ra giấy. Đề phòng mất kết nối tại sân bay.' },
]

const FAQ_CATS = ['Tất cả','Hồ sơ','Thanh toán','Xử lý','Tài khoản','Sau khi nhận visa']

const FAQS = [
  { cat:'Hồ sơ',     q:'Tôi cần chuẩn bị những giấy tờ gì?',                           a:'Bắt buộc: hộ chiếu còn hạn 6 tháng, ảnh chân dung nền trắng, ảnh trang thông tin hộ chiếu. Khuyến nghị thêm: vé máy bay, đặt phòng khách sạn, sao kê ngân hàng. Tùy quốc gia có thể yêu cầu bảo hiểm du lịch.' },
  { cat:'Hồ sơ',     q:'Hộ chiếu hết hạn còn 5 tháng có nộp được không?',              a:'Không. Hầu hết quốc gia yêu cầu hộ chiếu còn hạn tối thiểu 6 tháng tính từ ngày dự kiến nhập cảnh. Bạn cần làm mới hộ chiếu trước khi nộp đơn xin visa.' },
  { cat:'Hồ sơ',     q:'Có thể dùng ảnh selfie không?',                                a:'Không. Ảnh phải có nền trắng đồng nhất, mặt thẳng, không cười hở răng, không đội mũ kính. Nếu không có ảnh đúng chuẩn, bạn có thể chụp tại các tiệm ảnh thẻ với giá ~50.000đ.' },
  { cat:'Thanh toán',q:'Có những hình thức thanh toán nào?',                           a:'Hỗ trợ thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB), ví điện tử (MoMo, ZaloPay, VNPay, ShopeePay) và chuyển khoản ngân hàng cho đơn doanh nghiệp.' },
  { cat:'Thanh toán',q:'Phí dịch vụ có được hoàn lại nếu visa bị từ chối?',            a:'Có. Chúng tôi hoàn 100% phí dịch vụ eVisa nếu đơn bị từ chối bởi cơ quan cấp visa. Phí visa chính phủ không được hoàn lại theo quy định của từng nước.' },
  { cat:'Xử lý',     q:'Thời gian xử lý bao lâu?',                                     a:'E-Visa thường 3-7 ngày làm việc. Gói nhanh 2-3 ngày (+$20). Gói siêu nhanh 24 giờ (+$50). Thời gian có thể thay đổi tùy quốc gia và mùa cao điểm.' },
  { cat:'Xử lý',     q:'Tôi có thể theo dõi trạng thái đơn không?',                    a:'Có. Sau khi đăng ký, bạn nhận mã đơn EV-XXXXXX. Theo dõi realtime tại trang Hỗ trợ → Tra cứu đơn, hoặc trong mục "Đơn của tôi" sau khi đăng nhập. Email cập nhật ở mỗi bước.' },
  { cat:'Xử lý',     q:'Đơn của tôi đã 7 ngày chưa có kết quả, có sao không?',         a:'Một số nước (Saudi Arabia, Brazil) thường mất 7-10 ngày. Bạn có thể liên hệ chuyên gia qua Live Chat hoặc Hotline 1900 1234 để kiểm tra cụ thể trạng thái với cơ quan cấp visa.' },
  { cat:'Tài khoản', q:'Tôi có thể chỉnh sửa thông tin sau khi nộp không?',            a:'Bạn có thể chỉnh sửa trong 2 giờ đầu sau khi nộp đơn (trước khi chuyên gia bắt đầu review). Sau đó cần liên hệ bộ phận hỗ trợ — có thể tốn phí xử lý.' },
  { cat:'Tài khoản', q:'Tôi quên mật khẩu, làm sao đăng nhập?',                        a:'Click "Quên mật khẩu?" ở màn đăng nhập, nhập email, hệ thống gửi link reset trong vòng 1 phút. Hoặc dùng đăng nhập Google nếu tài khoản đã liên kết.' },
  { cat:'Sau khi nhận visa', q:'Visa điện tử có an toàn không?',                       a:'Hoàn toàn an toàn. eVisa được cấp bởi chính phủ và có giá trị pháp lý như visa dán. Khi nhập cảnh, bạn chỉ cần in PDF hoặc xuất trình trên điện thoại — biên phòng quét mã để xác thực.' },
  { cat:'Sau khi nhận visa', q:'Nếu tôi mất visa thì sao?',                            a:'Visa điện tử lưu trong email và trong hệ thống chính phủ — bạn không bao giờ "mất" được. Chỉ cần đăng nhập email tải lại, hoặc liên hệ chuyên gia gửi lại bản PDF.' },
  { cat:'Sau khi nhận visa', q:'Có thể gia hạn visa không?',                           a:'Tùy quốc gia. Một số nước (Thái Lan, Indonesia) cho phép gia hạn 30 ngày tại địa phương. Đa số phải xuất cảnh và xin visa mới. Liên hệ chuyên gia để được tư vấn cụ thể.' },
]

export default function Guide() {
  const [open, setOpen]       = useState(null)
  const [checked, setChecked] = useState(new Set(['passport','photo','passport-img']))
  const [cat, setCat]         = useState('Tất cả')
  const [search, setSearch]   = useState('')

  const filteredFaqs = useMemo(() => {
    const term = search.trim().toLowerCase()
    return FAQS.filter(f => {
      const matchCat = cat === 'Tất cả' || f.cat === cat
      const matchSearch = !term || f.q.toLowerCase().includes(term) || f.a.toLowerCase().includes(term)
      return matchCat && matchSearch
    })
  }, [cat, search])

  const toggle = (id) => {
    setChecked(p => {
      const next = new Set(p)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const requiredCount = DOCS.filter(d => d.required).length
  const requiredDone  = DOCS.filter(d => d.required && checked.has(d.id)).length
  const allDone       = DOCS.filter(d => checked.has(d.id)).length

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
            Hướng dẫn từ A-Z trong 10 phút
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight" style={{ fontFamily:'Fraunces,serif' }}>
            Hướng dẫn xin <span style={{ color:'var(--gold)' }}>eVisa</span>
          </h1>
          <p className="text-white/65 text-base mb-8 max-w-lg mx-auto">
            Mọi thứ bạn cần biết để xin visa thành công — từ chuẩn bị hồ sơ đến nhận visa qua email
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              ['#process','📋 Quy trình'],
              ['#docs','📦 Hồ sơ'],
              ['#photo','📸 Ảnh chuẩn'],
              ['#mistakes','⚠️ Sai lầm'],
              ['#faq','❓ FAQ'],
            ].map(([href,label]) => (
              <a key={href} href={href}
                className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs md:text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/15 text-white hover:bg-white/20 hover:border-white/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 transition-all duration-200"
              >{label}</a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process timeline ── */}
      <section id="process" className="max-w-5xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'var(--blue)' }}>Quy trình</div>
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            5 bước đơn giản, hoàn tất trong 10 phút
          </h2>
          <p className="text-sm text-gray-500">Từ đăng ký đến nhận visa — quy trình hoàn toàn online</p>
        </div>

        <div className="space-y-3">
          {STEPS.map((s, i) => (
            <div key={s.num} className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 md:items-center hover:shadow-md transition-shadow relative">
              {/* Vertical line */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute left-[42px] top-full h-3 w-0.5 z-0" style={{ background:'#E5E7EB' }} />
              )}

              <div className="flex items-center gap-4 md:flex-shrink-0">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 relative" style={{ background:'var(--blue-light)' }}>
                  {s.icon}
                  <div className="absolute -top-1.5 -right-1.5 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm" style={{ background:'var(--blue)' }}>{s.num}</div>
                </div>
                <div className="md:hidden">
                  <h3 className="font-black text-base" style={{ color:'var(--navy)' }}>{s.title}</h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background:'#FFFBEB', color:'#92400E' }}>⏱ {s.time}</span>
                </div>
              </div>

              <div className="flex-1">
                <div className="hidden md:flex items-center gap-3 mb-1">
                  <h3 className="font-black text-lg" style={{ color:'var(--navy)' }}>{s.title}</h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background:'#FFFBEB', color:'#92400E' }}>⏱ {s.time}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Document checklist ── */}
      <section id="docs" className="max-w-5xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'var(--blue)' }}>Checklist</div>
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            Giấy tờ cần chuẩn bị
          </h2>
          <p className="text-sm text-gray-500">Tick từng mục để theo dõi tiến độ chuẩn bị hồ sơ</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Progress bar */}
          <div className="px-6 py-4 border-b border-gray-100" style={{ background:'#F9FAFB' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold" style={{ color:'var(--navy)' }}>
                {requiredDone === requiredCount ? '✅ Đã đủ giấy tờ bắt buộc' : `📋 Bắt buộc: ${requiredDone}/${requiredCount}`}
              </span>
              <span className="text-xs text-gray-500">{allDone}/{DOCS.length} mục</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background:'#E5E7EB' }}>
              <div className="h-full transition-all duration-300" style={{ width:`${(allDone / DOCS.length) * 100}%`, background:'var(--blue)' }} />
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {DOCS.map(d => {
              const isChecked = checked.has(d.id)
              return (
                <button
                  key={d.id}
                  onClick={() => toggle(d.id)}
                  className="w-full px-5 md:px-6 py-4 flex items-start gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-6 h-6 rounded-md border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-all ${isChecked ? 'border-transparent' : 'border-gray-300'}`}
                    style={isChecked ? { background:'var(--green)' } : {}}
                  >
                    {isChecked && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <path d="M5 13l4 4L19 7"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`font-bold text-sm ${isChecked ? 'line-through text-gray-400' : ''}`} style={!isChecked ? { color:'var(--navy)' } : {}}>{d.label}</span>
                      {d.required && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background:'#FEE2E2', color:'#DC2626' }}>BẮT BUỘC</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{d.hint}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Photo requirements ── */}
      <section id="photo" className="max-w-5xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'var(--blue)' }}>Ảnh chân dung</div>
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            Yêu cầu ảnh chuẩn quốc tế
          </h2>
          <p className="text-sm text-gray-500">Ảnh sai chuẩn là lý do từ chối phổ biến nhất — đọc kỹ trước khi tải lên</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border-2 overflow-hidden" style={{ borderColor:'#BBF7D0' }}>
            <div className="px-5 py-4 flex items-center gap-2.5" style={{ background:'#F0FDF4' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg" style={{ background:'var(--green)' }}>✓</div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color:'var(--green)' }}>NÊN</div>
                <div className="font-black text-base" style={{ color:'var(--navy)' }}>Ảnh chuẩn</div>
              </div>
            </div>
            <ul className="px-5 py-4 space-y-2.5">
              {PHOTO_DOS.map(d => (
                <li key={d} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5" style={{ color:'var(--green)' }}>✓</span>
                  <span className="text-gray-700">{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border-2 overflow-hidden" style={{ borderColor:'#FECACA' }}>
            <div className="px-5 py-4 flex items-center gap-2.5" style={{ background:'#FEF2F2' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg" style={{ background:'#DC2626' }}>✕</div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color:'#DC2626' }}>KHÔNG NÊN</div>
                <div className="font-black text-base" style={{ color:'var(--navy)' }}>Lỗi thường gặp</div>
              </div>
            </div>
            <ul className="px-5 py-4 space-y-2.5">
              {PHOTO_DONTS.map(d => (
                <li key={d} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5" style={{ color:'#DC2626' }}>✕</span>
                  <span className="text-gray-700">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 rounded-xl p-4 flex items-start gap-3" style={{ background:'#FFFBEB', border:'1px solid #FDE68A' }}>
          <span className="text-2xl">💡</span>
          <div className="flex-1 text-sm" style={{ color:'#78350F' }}>
            <span className="font-bold">Mẹo:</span> Hệ thống AI của eVisa tự động kiểm tra ảnh ngay khi tải lên — nếu sai chuẩn, bạn sẽ được thông báo trước khi nộp đơn.
          </div>
        </div>
      </section>

      {/* ── Common mistakes ── */}
      <section id="mistakes" className="max-w-5xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'#DC2626' }}>Cảnh báo</div>
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            6 sai lầm khiến đơn bị từ chối
          </h2>
          <p className="text-sm text-gray-500">Tránh các lỗi này để tăng tỷ lệ chấp thuận lên 99%</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {MISTAKES.map(m => (
            <div key={m.title} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all flex gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background:'#FEF2F2' }}>{m.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1" style={{ color:'var(--navy)' }}>{m.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tips ── */}
      <section className="max-w-5xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'#F59E0B' }}>Pro tips</div>
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            Mẹo từ chuyên gia eVisa
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TIPS.map(t => (
            <div key={t.title} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-3">{t.icon}</div>
              <h3 className="font-bold text-sm mb-1" style={{ color:'var(--navy)' }}>{t.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="max-w-5xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'var(--blue)' }}>FAQ</div>
          <h2 className="text-2xl md:text-3xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            Câu hỏi thường gặp
          </h2>
          <p className="text-sm text-gray-500">{FAQS.length} câu hỏi phổ biến — tìm câu trả lời trong vài giây</p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none border border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            placeholder="Tìm câu hỏi..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FAQ_CATS.map(c => {
            const active = cat === c
            const count = c === 'Tất cả' ? FAQS.length : FAQS.filter(f => f.cat === c).length
            return (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`group relative overflow-hidden flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 border ${
                  active
                    ? 'text-white border-transparent shadow-md shadow-blue-500/25 -translate-y-0.5'
                    : 'border-gray-200 text-gray-600 bg-white hover:border-blue-300 hover:text-blue-700 hover:-translate-y-0.5 hover:shadow-sm'
                }`}
                style={active ? { background:'linear-gradient(135deg, var(--blue) 0%, var(--blue-mid) 100%)' } : {}}
              >
                {active && <span className="absolute inset-x-2 top-0 h-px bg-white/40 pointer-events-none" />}
                <span>{c}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none min-w-[20px] text-center transition-colors ${
                  active ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-700'
                }`}>{count}</span>
              </button>
            )
          })}
        </div>

        {/* FAQ items */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-2">
            {filteredFaqs.map((f, i) => {
              const isOpen = open === f.q
              return (
                <div key={f.q} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-sm hover:bg-gray-50 transition-colors"
                    style={{ color:'var(--navy)' }}
                    onClick={() => setOpen(isOpen ? null : f.q)}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-0.5 flex-shrink-0" style={{ background:'var(--blue-light)', color:'var(--blue)' }}>{f.cat}</span>
                      <span className="flex-1">{f.q}</span>
                    </div>
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
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <div className="text-4xl mb-3 opacity-60">🔍</div>
            <p className="font-bold text-base" style={{ color:'var(--navy)' }}>Không tìm thấy câu hỏi phù hợp</p>
            <p className="text-sm text-gray-500 mt-1 mb-4">Thử từ khóa khác hoặc liên hệ chuyên gia</p>
            <Link to="/support" className="btn-primary">Liên hệ hỗ trợ →</Link>
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="max-w-5xl mx-auto px-5 pb-14">
        <div className="rounded-2xl overflow-hidden relative" style={{ background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 60%,#0d2451 100%)' }}>
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(245,166,35,0.20) 0%,transparent 70%)' }} />
          <div className="absolute -bottom-16 left-12 w-56 h-56 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(27,79,216,0.30) 0%,transparent 70%)' }} />

          <div className="relative px-6 py-10 md:px-12 md:py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-4 md:gap-5">
              <div className="text-5xl md:text-6xl">📚</div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-1" style={{ fontFamily:'Fraunces,serif' }}>
                  Còn thắc mắc khác?
                </h3>
                <p className="text-white/70 text-sm">Chuyên gia eVisa sẵn sàng tư vấn miễn phí 24/7</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link to="/support" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all">
                Liên hệ hỗ trợ
              </Link>
              <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl" style={{ background:'var(--gold)', color:'var(--navy)' }}>
                Đăng ký visa ngay
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
