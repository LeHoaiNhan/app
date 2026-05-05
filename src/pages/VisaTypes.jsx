import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const TYPES = [
  { icon:'⚡', name:'E-Visa', desc:'Visa điện tử — nộp online, nhận qua email. Không cần đến đại sứ quán.', time:'3-7 ngày', best:'Thái Lan, Nhật Bản, Úc, Ấn Độ', color:'#EEF3FF', border:'#c7d7ff' },
  { icon:'🛬', name:'Visa on Arrival', desc:'Lấy visa tại cửa khẩu khi nhập cảnh. Cần chuẩn bị giấy tờ trước.', time:'Ngay tại sân bay', best:'Indonesia, Maldives, Nepal', color:'#F0FDF4', border:'#bbf7d0' },
  { icon:'📄', name:'Visa dán (Sticker)', desc:'Visa dán vào hộ chiếu tại đại sứ quán. Thủ tục truyền thống.', time:'7-15 ngày', best:'Mỹ, Anh, Schengen', color:'#FFF7ED', border:'#fed7aa' },
  { icon:'🌍', name:'Visa Schengen', desc:'Một visa đi được 27 nước châu Âu. Thủ tục phức tạp hơn.', time:'10-15 ngày', best:'Pháp, Đức, Ý, Tây Ban Nha...', color:'#FDF4FF', border:'#e9d5ff' },
  { icon:'💼', name:'Visa Công tác', desc:'Dành cho mục đích kinh doanh, hội nghị, đàm phán thương mại.', time:'5-10 ngày', best:'Toàn cầu', color:'#F0FDF4', border:'#bbf7d0' },
  { icon:'🎓', name:'Visa Du học', desc:'Dành cho học sinh, sinh viên theo học tại nước ngoài.', time:'15-30 ngày', best:'Mỹ, Anh, Úc, Canada', color:'#FFF7ED', border:'#fed7aa' },
]

export default function VisaTypes() {
  return (
    <div className="min-h-screen" style={{background:'var(--gray50)'}}>
      <Navbar />
      <div className="py-12 md:py-20 text-center px-4" style={{background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 100%)'}}>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3" style={{fontFamily:'Fraunces,serif'}}>
          Các <span style={{color:'var(--gold)'}}>loại visa</span>
        </h1>
        <p className="text-white/60 text-sm md:text-base">Hiểu đúng loại visa để chuẩn bị hồ sơ chính xác</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {TYPES.map(t => (
            <div key={t.name} className="bg-white rounded-xl border p-6 hover:shadow-md transition-all" style={{borderColor:t.border}}>
              <div className="flex items-start gap-4">
                <div className="text-3xl w-14 h-14 flex items-center justify-center rounded-xl flex-shrink-0" style={{background:t.color}}>
                  {t.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1" style={{color:'var(--navy)'}}>{t.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">{t.desc}</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-1 text-gray-500"><span>⏱</span> {t.time}</span>
                    <span className="flex items-center gap-1 text-gray-500"><span>🌏</span> {t.best}</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-2.5 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90" style={{background:'var(--blue)'}}>
                Đăng ký {t.name} →
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
