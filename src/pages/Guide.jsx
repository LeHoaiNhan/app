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
  { id:'passport',     required:true,  label:'Hộ chiếu còn hạn ít nhất 6 tháng',          hint:'Tính từ ngày dự kiến nhập cảnh' },
  { id:'photo',        required:true,  label:'Ảnh chân dung 4×6 nền trắng',               hint:'Chụp trong vòng 6 tháng, không đội mũ, không kính' },
  { id:'passport-img', required:true,  label:'Ảnh trang thông tin hộ chiếu',              hint:'Rõ nét, đủ 4 góc, không bị che' },
  { id:'flight',       required:false, label:'Vé máy bay khứ hồi',                        hint:'Một số nước yêu cầu (Thái Lan, Nhật, Hàn)' },
  { id:'hotel',        required:false, label:'Đặt phòng khách sạn / địa chỉ lưu trú',     hint:'Giúp tăng tỷ lệ chấp thuận' },
  { id:'bank',         required:false, label:'Sao kê ngân hàng 3 tháng gần nhất',         hint:'Khuyến nghị cho visa du lịch dài ngày' },
  { id:'insurance',    required:false, label:'Bảo hiểm du lịch',                          hint:'Bắt buộc với một số nước châu Âu' },
  { id:'invitation',   required:false, label:'Thư mời (nếu có)',                          hint:'Cho mục đích thăm thân, công tác' },
]

const PHOTO_DOS = ['Nền trắng đồng nhất','Mặt thẳng, nhìn vào camera','Ánh sáng đều, không đổ bóng','Tóc gọn, không che mặt','Tối thiểu 400 × 400 px']
const PHOTO_DONTS = ['Đội mũ, đeo kính (kể cả kính cận)','Cười hở răng, biểu cảm khác lạ','Nền có hoa văn, vật thể','Ảnh selfie, ảnh chụp với nhóm','Ảnh mờ, có filter, chỉnh sửa quá mức']

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

const QUICK_LINKS = [
  ['#process','📋 Quy trình'],
  ['#docs','📦 Hồ sơ'],
  ['#photo','📸 Ảnh chuẩn'],
  ['#mistakes','⚠️ Sai lầm'],
  ['#faq','❓ FAQ'],
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
    <div style={{ minHeight:'100vh', background:'#F9FAFB' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ background:'linear-gradient(135deg,#0B1D3A 0%,#1a3060 55%,#0d2451 100%)', padding:'64px 20px 72px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:440, height:440, background:'radial-gradient(circle,rgba(27,79,216,0.25) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:'30%', width:320, height:320, background:'radial-gradient(circle,rgba(245,166,35,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1024, margin:'0 auto', position:'relative', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(245,166,35,0.15)', border:'1px solid rgba(245,166,35,0.3)', color:'var(--gold)', padding:'6px 14px', borderRadius:50, fontSize:13, fontWeight:600, marginBottom:20 }}>
            <span className="pulse" style={{ width:8, height:8, background:'var(--gold)', borderRadius:'50%', display:'inline-block' }} />
            Hướng dẫn từ A-Z trong 10 phút
          </div>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(36px,6vw,56px)', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:16 }}>
            Hướng dẫn xin <span style={{ color:'var(--gold)' }}>eVisa</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.68)', fontSize:17, lineHeight:1.7, maxWidth:560, margin:'0 auto 28px' }}>
            Mọi thứ bạn cần biết để xin visa thành công — từ chuẩn bị hồ sơ đến nhận visa qua email
          </p>

          <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
            {QUICK_LINKS.map(([href, label]) => (
              <a key={href} href={href}
                style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:50, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'white', fontSize:13, fontWeight:600, textDecoration:'none', transition:'all .2s', backdropFilter:'blur(8px)' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'; e.currentTarget.style.transform='translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.transform='none' }}
              >{label}</a>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section id="process" style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Quy trình</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>5 bước đơn giản, hoàn tất trong 10 phút</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Từ đăng ký đến nhận visa — quy trình hoàn toàn online</p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {STEPS.map(s => (
              <div key={s.num} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:22, display:'flex', gap:18, alignItems:'center', flexWrap:'wrap', transition:'box-shadow .2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow='0 8px 24px rgba(11,29,58,0.06)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow='none'}
              >
                <div style={{ position:'relative', width:60, height:60, borderRadius:16, background:'var(--blue-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>
                  {s.icon}
                  <div style={{ position:'absolute', top:-6, right:-6, width:24, height:24, borderRadius:'50%', background:'var(--blue)', color:'white', fontSize:10, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 6px rgba(0,0,0,0.15)' }}>{s.num}</div>
                </div>
                <div style={{ flex:1, minWidth:240 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4, flexWrap:'wrap' }}>
                    <h3 style={{ fontWeight:900, fontSize:17, color:'var(--navy)' }}>{s.title}</h3>
                    <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:50, background:'#FFFBEB', color:'#92400E' }}>⏱ {s.time}</span>
                  </div>
                  <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.65 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCS CHECKLIST ── */}
      <section id="docs" style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Checklist</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Giấy tờ cần chuẩn bị</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Tick từng mục để theo dõi tiến độ chuẩn bị hồ sơ</p>
          </div>

          <div style={{ background:'white', borderRadius:14, border:'1px solid #E5E7EB', overflow:'hidden' }}>
            <div style={{ padding:'16px 22px', background:'#F9FAFB', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexWrap:'wrap', gap:6 }}>
                <span style={{ fontWeight:700, fontSize:14, color:'var(--navy)' }}>
                  {requiredDone === requiredCount ? '✅ Đã đủ giấy tờ bắt buộc' : `📋 Bắt buộc: ${requiredDone}/${requiredCount}`}
                </span>
                <span style={{ fontSize:12, color:'#6B7280' }}>{allDone}/{DOCS.length} mục</span>
              </div>
              <div style={{ height:8, borderRadius:50, overflow:'hidden', background:'#E5E7EB' }}>
                <div style={{ height:'100%', width:`${(allDone / DOCS.length) * 100}%`, background:'var(--blue)', transition:'width .3s' }} />
              </div>
            </div>

            <div>
              {DOCS.map((d, i) => {
                const isChecked = checked.has(d.id)
                return (
                  <button key={d.id}
                    onClick={() => toggle(d.id)}
                    style={{ width:'100%', padding:'14px 22px', display:'flex', alignItems:'flex-start', gap:14, textAlign:'left', background:'white', border:'none', borderTop: i === 0 ? 'none' : '1px solid #F3F4F6', cursor:'pointer', fontFamily:'inherit', transition:'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.background='white'}
                  >
                    <div style={{ width:24, height:24, borderRadius:6, border: isChecked ? 'none' : '2px solid #D1D5DB', background: isChecked ? 'var(--green)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                      {isChecked && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                        <span style={{ fontWeight:700, fontSize:14, color: isChecked ? '#9CA3AF' : 'var(--navy)', textDecoration: isChecked ? 'line-through' : 'none' }}>{d.label}</span>
                        {d.required && (
                          <span style={{ fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:4, background:'#FEE2E2', color:'#DC2626' }}>BẮT BUỘC</span>
                        )}
                      </div>
                      <p style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{d.hint}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── PHOTO ── */}
      <section id="photo" style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Ảnh chân dung</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Yêu cầu ảnh chuẩn quốc tế</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Ảnh sai chuẩn là lý do từ chối phổ biến nhất</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
            <div style={{ background:'white', borderRadius:14, border:'2px solid #BBF7D0', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:10, background:'#F0FDF4' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--green)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>✓</div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--green)', textTransform:'uppercase', letterSpacing:'.06em' }}>NÊN</div>
                  <div style={{ fontSize:15, fontWeight:900, color:'var(--navy)' }}>Ảnh chuẩn</div>
                </div>
              </div>
              <ul style={{ listStyle:'none', padding:'14px 20px', margin:0 }}>
                {PHOTO_DOS.map(d => (
                  <li key={d} style={{ display:'flex', gap:10, fontSize:14, color:'#374151', marginBottom:10 }}>
                    <span style={{ color:'var(--green)', marginTop:1 }}>✓</span><span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background:'white', borderRadius:14, border:'2px solid #FECACA', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:10, background:'#FEF2F2' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'#DC2626', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>✕</div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#DC2626', textTransform:'uppercase', letterSpacing:'.06em' }}>KHÔNG NÊN</div>
                  <div style={{ fontSize:15, fontWeight:900, color:'var(--navy)' }}>Lỗi thường gặp</div>
                </div>
              </div>
              <ul style={{ listStyle:'none', padding:'14px 20px', margin:0 }}>
                {PHOTO_DONTS.map(d => (
                  <li key={d} style={{ display:'flex', gap:10, fontSize:14, color:'#374151', marginBottom:10 }}>
                    <span style={{ color:'#DC2626', marginTop:1 }}>✕</span><span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ marginTop:18, borderRadius:12, padding:14, display:'flex', gap:10, alignItems:'flex-start', background:'#FFFBEB', border:'1px solid #FDE68A' }}>
            <span style={{ fontSize:22 }}>💡</span>
            <div style={{ flex:1, fontSize:14, color:'#78350F' }}>
              <span style={{ fontWeight:700 }}>Mẹo:</span> Hệ thống AI của eVisa tự động kiểm tra ảnh ngay khi tải lên — nếu sai chuẩn, bạn sẽ được thông báo trước khi nộp đơn.
            </div>
          </div>
        </div>
      </section>

      {/* ── MISTAKES ── */}
      <section id="mistakes" style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#DC2626', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Cảnh báo</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>6 sai lầm khiến đơn bị từ chối</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Tránh các lỗi này để tăng tỷ lệ chấp thuận lên 99%</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16 }}>
            {MISTAKES.map(m => (
              <div key={m.title} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:20, display:'flex', gap:14, transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 20px rgba(11,29,58,0.06)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}
              >
                <div style={{ width:48, height:48, borderRadius:12, background:'#FEF2F2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{m.icon}</div>
                <div style={{ flex:1 }}>
                  <h3 style={{ fontWeight:700, fontSize:15, color:'var(--navy)', marginBottom:4 }}>{m.title}</h3>
                  <p style={{ fontSize:13, color:'#6B7280', lineHeight:1.6 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIPS ── */}
      <section style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#F59E0B', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Pro tips</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)' }}>Mẹo từ chuyên gia eVisa</h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
            {TIPS.map(t => (
              <div key={t.title} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:22, transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 20px rgba(11,29,58,0.06)'; e.currentTarget.style.transform='translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}
              >
                <div style={{ fontSize:30, marginBottom:12 }}>{t.icon}</div>
                <h3 style={{ fontWeight:700, fontSize:14, color:'var(--navy)', marginBottom:4 }}>{t.title}</h3>
                <p style={{ fontSize:12, color:'#6B7280', lineHeight:1.6 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:920, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>FAQ</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Câu hỏi thường gặp</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>{FAQS.length} câu hỏi phổ biến — tìm câu trả lời trong vài giây</p>
          </div>

          <div style={{ position:'relative', marginBottom:14 }}>
            <svg style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              style={{ width:'100%', padding:'12px 14px 12px 42px', borderRadius:12, fontSize:14, border:'1px solid #E5E7EB', outline:'none', background:'white', fontFamily:'inherit' }}
              placeholder="Tìm câu hỏi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
            {FAQ_CATS.map(c => {
              const active = cat === c
              const count = c === 'Tất cả' ? FAQS.length : FAQS.filter(f => f.cat === c).length
              return (
                <button key={c} onClick={() => setCat(c)}
                  style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:50, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .15s', background: active ? 'var(--blue)' : 'white', color: active ? 'white' : '#6B7280', border: active ? '1px solid var(--blue)' : '1px solid #E5E7EB', boxShadow: active ? '0 4px 12px rgba(27,79,216,0.2)' : 'none' }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor='var(--blue)'; e.currentTarget.style.color='var(--blue)' } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.color='#6B7280' } }}
                >
                  <span>{c}</span>
                  <span style={{ fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:50, background: active ? 'rgba(255,255,255,0.25)' : '#F3F4F6', color: active ? 'white' : '#6B7280', minWidth:18, textAlign:'center' }}>{count}</span>
                </button>
              )
            })}
          </div>

          {filteredFaqs.length > 0 ? (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {filteredFaqs.map(f => {
                const isOpen = open === f.q
                return (
                  <div key={f.q} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
                    <button
                      onClick={() => setOpen(isOpen ? null : f.q)}
                      style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, padding:'14px 20px', textAlign:'left', fontWeight:600, fontSize:14, color:'var(--navy)', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit' }}
                    >
                      <div style={{ display:'flex', gap:10, flex:1, minWidth:0, alignItems:'flex-start' }}>
                        <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:4, background:'var(--blue-light)', color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.05em', flexShrink:0, marginTop:2 }}>{f.cat}</span>
                        <span style={{ flex:1 }}>{f.q}</span>
                      </div>
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
          ) : (
            <div style={{ background:'white', borderRadius:14, border:'1px solid #E5E7EB', padding:'48px 20px', textAlign:'center' }}>
              <div style={{ fontSize:38, opacity:0.6, marginBottom:10 }}>🔍</div>
              <p style={{ fontSize:16, fontWeight:700, color:'var(--navy)' }}>Không tìm thấy câu hỏi phù hợp</p>
              <p style={{ fontSize:14, color:'#6B7280', marginTop:4, marginBottom:18 }}>Thử từ khóa khác hoặc liên hệ chuyên gia</p>
              <Link to="/support" className="btn-primary">Liên hệ hỗ trợ →</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'var(--navy)', padding:'56px 20px', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Fraunces,serif', fontSize:30, fontWeight:900, color:'white', marginBottom:10 }}>Còn thắc mắc khác?</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:15, marginBottom:24 }}>Chuyên gia eVisa sẵn sàng tư vấn miễn phí 24/7</p>
        <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/support" style={{ display:'inline-block', background:'rgba(255,255,255,0.1)', color:'white', borderRadius:10, padding:'14px 28px', fontSize:15, fontWeight:700, textDecoration:'none', border:'1px solid rgba(255,255,255,0.2)', fontFamily:'inherit', transition:'background .15s' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
          >Liên hệ hỗ trợ</Link>
          <Link to="/" style={{ display:'inline-block', background:'var(--gold)', color:'var(--navy)', borderRadius:10, padding:'14px 28px', fontSize:15, fontWeight:800, textDecoration:'none', fontFamily:'inherit', transition:'opacity .15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity='.88'}
            onMouseLeave={e => e.currentTarget.style.opacity='1'}
          >Đăng ký visa ngay →</Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
