import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const STEPS = [
  { num:'01', title:'Chọn điểm đến & loại visa', desc:'Kiểm tra yêu cầu visa cho quốc gia bạn muốn đến. Chọn loại visa phù hợp với mục đích chuyến đi.' },
  { num:'02', title:'Điền thông tin & tải tài liệu', desc:'Hoàn tất form 4 bước: thông tin cá nhân, hộ chiếu, hành trình và tải ảnh lên hệ thống.' },
  { num:'03', title:'Thanh toán an toàn', desc:'Thanh toán qua thẻ tín dụng hoặc ví điện tử với mã hóa SSL 256-bit. Nhận xác nhận ngay lập tức.' },
  { num:'04', title:'Nhận visa qua email', desc:'Đội ngũ kiểm tra hồ sơ và gửi visa điện tử về email bạn trong thời gian đã chọn.' },
]

const FAQS = [
  { q:'Tôi cần chuẩn bị những giấy tờ gì?', a:'Thông thường cần: hộ chiếu còn hạn ít nhất 6 tháng, ảnh chân dung nền trắng, và tùy loại visa có thể cần thêm vé máy bay, đặt phòng khách sạn, sao kê ngân hàng.' },
  { q:'Thời gian xử lý bao lâu?', a:'E-Visa thường 3-7 ngày làm việc. Dịch vụ nhanh 2-3 ngày. Siêu nhanh 24 giờ. Thời gian có thể thay đổi tùy quốc gia và mùa cao điểm.' },
  { q:'Tôi có thể theo dõi trạng thái đơn không?', a:'Có! Sau khi đăng ký tài khoản, bạn có thể theo dõi trạng thái đơn realtime trong mục "Đơn của tôi". Hệ thống cũng gửi email cập nhật ở mỗi bước.' },
  { q:'Nếu đơn bị từ chối thì sao?', a:'Chúng tôi hoàn trả 100% phí dịch vụ nếu đơn bị từ chối. Phí visa chính phủ không được hoàn lại theo quy định của từng nước.' },
  { q:'Tôi có thể chỉnh sửa thông tin sau khi nộp không?', a:'Bạn có thể chỉnh sửa trong 2 giờ đầu sau khi nộp đơn. Sau đó cần liên hệ bộ phận hỗ trợ để được hỗ trợ.' },
  { q:'Visa điện tử có an toàn không?', a:'Hoàn toàn an toàn! E-Visa được cấp bởi chính phủ và có giá trị pháp lý như visa dán. Bạn chỉ cần in ra hoặc xuất trình trên điện thoại khi nhập cảnh.' },
]

export default function Guide() {
  const [open, setOpen] = useState(null)

  return (
    <div className="min-h-screen" style={{background:'var(--gray50)'}}>
      <Navbar />
      <div className="py-12 md:py-20 text-center px-4" style={{background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 100%)'}}>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3" style={{fontFamily:'Fraunces,serif'}}>
          Hướng dẫn <span style={{color:'var(--gold)'}}>chi tiết</span>
        </h1>
        <p className="text-white/60 text-sm md:text-base">Mọi thứ bạn cần biết để xin visa thành công</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Steps */}
        <h2 className="text-xl font-bold mb-6" style={{color:'var(--navy)'}}>Quy trình 4 bước đơn giản</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
          {STEPS.map((s,i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
              <div className="text-2xl font-black w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:'var(--blue-light)',color:'var(--blue)',fontFamily:'Fraunces,serif'}}>{s.num}</div>
              <div>
                <h3 className="font-bold mb-1 text-sm" style={{color:'var(--navy)'}}>{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-xl font-bold mb-6" style={{color:'var(--navy)'}}>❓ Câu hỏi thường gặp</h2>
        <div className="space-y-2">
          {FAQS.map((f,i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-sm hover:bg-gray-50 transition-colors"
                style={{color:'var(--navy)'}}
                onClick={() => setOpen(open===i?null:i)}
              >
                {f.q}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`flex-shrink-0 ml-3 transition-transform ${open===i?'rotate-180':''}`}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              {open===i && (
                <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
