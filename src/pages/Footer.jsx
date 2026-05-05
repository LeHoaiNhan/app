import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{background:'var(--navy)'}} className="text-white/50 py-8 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'var(--blue)'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="font-black text-white" style={{fontFamily:'Fraunces,serif'}}>eVisa</span>
        </div>
        <div className="flex gap-5 text-sm flex-wrap justify-center">
          {[['/',  'Trang chủ'],['/destinations','Điểm đến'],['/guide','Hướng dẫn'],['/support','Hỗ trợ']].map(([to,l])=>(
            <Link key={to} to={to} className="hover:text-white transition-colors">{l}</Link>
          ))}
        </div>
        <p className="text-xs">© 2025 eVisa Vietnam · support@evisa.vn</p>
      </div>
    </footer>
  )
}
