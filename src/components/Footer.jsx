import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background:'var(--navy)', color:'rgba(255,255,255,0.5)', padding:'32px 20px' }}>
      <div style={{ maxWidth:1024, margin:'0 auto', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:28, height:28, background:'var(--blue)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span style={{ fontFamily:'Fraunces,serif', fontWeight:900, fontSize:20, color:'white' }}>eVisa</span>
        </div>
        <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          {[['/','Trang chủ'],['/destinations','Điểm đến'],['/visa-types','Loại visa'],['/pricing','Bảng giá'],['/guide','Hướng dẫn'],['/support','Hỗ trợ']].map(([to,l]) => (
            <Link key={to} to={to} style={{ color:'rgba(255,255,255,0.5)', textDecoration:'none', fontSize:13, transition:'color .15s' }}
              onMouseEnter={e => e.target.style.color='white'}
              onMouseLeave={e => e.target.style.color='rgba(255,255,255,0.5)'}
            >{l}</Link>
          ))}
        </div>
        <p style={{ fontSize:12 }}>© 2025 eVisa Vietnam · support@evisa.vn</p>
      </div>
    </footer>
  )
}
