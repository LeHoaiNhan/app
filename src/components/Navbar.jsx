import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LINKS = [
  { to: '/destinations', label: 'Destinations' },
  { to: '/visa-types',   label: 'Visa Types' },
  { to: '/pricing',      label: 'Pricing' },
  { to: '/guide',        label: 'Guide' },
  { to: '/#track',       label: '🔎 Track' },
  { to: '/support',      label: 'Support' },
]

export default function Navbar({ onApplyClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const { user, logout, setShowLoginModal } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const handleApply = () => {
    if (onApplyClick) onApplyClick()
    else navigate('/')
  }

  return (
    <nav style={{ background:'white', borderBottom:'1px solid #E5E7EB', position:'sticky', top:0, zIndex:50, boxShadow:'0 1px 8px rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth:1024, margin:'0 auto', padding:'0 20px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>

        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', flexShrink:0 }}>
          <div style={{ width:32, height:32, background:'var(--blue)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span style={{ fontFamily:'Fraunces,serif', fontWeight:900, fontSize:21, color:'var(--navy)' }}>eVisa</span>
        </Link>

        {/* Desktop links */}
        <ul style={{ display:'flex', gap:20, listStyle:'none', flex:1, justifyContent:'center' }} className="nav-desktop">
          {LINKS.map(l => (
            <li key={l.to}>
              <Link to={l.to} style={{
                textDecoration:'none', fontSize:14, fontWeight:600,
                color: pathname===l.to ? 'var(--blue)' : '#4B5563',
                paddingBottom:2,
                borderBottom: pathname===l.to ? '2px solid var(--blue)' : '2px solid transparent',
                transition:'color .15s, border-color .15s'
              }}>{l.label}</Link>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {user ? (
            <div style={{ position:'relative' }}>
              <button
                onClick={() => setUserMenu(v => !v)}
                style={{ display:'flex', alignItems:'center', gap:8, background:'none', border:'none', cursor:'pointer', padding:'4px 6px', borderRadius:8 }}
              >
                <img src={user.avatar} alt="" style={{ width:34, height:34, borderRadius:'50%', border:`2px solid ${user.role==='admin' ? 'var(--gold)' : 'var(--blue-light)'}` }} />
                <span style={{ fontSize:13, fontWeight:600, color:'#374151', maxWidth:90, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }} className="nav-desktop">
                  {user.name.split(' ').at(-1)}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="nav-desktop">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              {userMenu && (
                <div style={{ position:'absolute', right:0, top:48, background:'white', border:'1px solid #E5E7EB', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', width:220, overflow:'hidden', zIndex:60 }}>
                  <div style={{ padding:'12px 16px', borderBottom:'1px solid #F3F4F6' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <p style={{ fontSize:14, fontWeight:700, color:'#111827' }}>{user.name}</p>
                      {user.role === 'admin' && (
                        <span style={{ fontSize:9, fontWeight:800, padding:'2px 6px', borderRadius:4, background:'var(--gold)', color:'var(--navy)' }}>ADMIN</span>
                      )}
                    </div>
                    <p style={{ fontSize:12, color:'#9CA3AF', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email}</p>
                  </div>

                  {user.role === 'admin' ? (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenu(false)}
                      style={{ display:'block', padding:'10px 16px', textDecoration:'none', fontSize:14, color:'#374151', fontFamily:'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.background='#F9FAFB'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >⚙️ Admin Dashboard</Link>
                  ) : (
                    <Link
                      to="/my-orders"
                      onClick={() => setUserMenu(false)}
                      style={{ display:'block', padding:'10px 16px', textDecoration:'none', fontSize:14, color:'#374151', fontFamily:'inherit' }}
                      onMouseEnter={e => e.currentTarget.style.background='#F9FAFB'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >📋 My Orders</Link>
                  )}
                  <Link
                    to="/support"
                    onClick={() => setUserMenu(false)}
                    style={{ display:'block', padding:'10px 16px', textDecoration:'none', fontSize:14, color:'#374151', fontFamily:'inherit' }}
                    onMouseEnter={e => e.currentTarget.style.background='#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >💬 Support</Link>

                  <button
                    onClick={() => { logout(); setUserMenu(false) }}
                    style={{ width:'100%', textAlign:'left', padding:'10px 16px', border:'none', borderTop:'1px solid #FEE2E2', background:'none', fontSize:14, color:'#DC2626', cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}
                  >🚪 Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="nav-desktop"
              style={{ fontSize:14, fontWeight:600, color:'#374151', background:'none', border:'1.5px solid #E5E7EB', borderRadius:8, padding:'8px 16px', cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}
              onMouseEnter={e => { e.target.style.borderColor='var(--blue)'; e.target.style.color='var(--blue)' }}
              onMouseLeave={e => { e.target.style.borderColor='#E5E7EB'; e.target.style.color='#374151' }}
            >Sign in</button>
          )}

          <button
            onClick={handleApply}
            className="btn-primary"
            style={{ fontSize:13, padding:'9px 18px' }}
          >Apply now</button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{ background:'none', border:'none', cursor:'pointer', padding:6, display:'flex', flexDirection:'column', gap:5, borderRadius:6 }}
            className="nav-mobile-btn"
          >
            <span style={{ display:'block', width:20, height:2, background:'#6B7280', borderRadius:2, transition:'all .2s', transform: menuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ display:'block', width:20, height:2, background:'#6B7280', borderRadius:2, transition:'all .2s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display:'block', width:20, height:2, background:'#6B7280', borderRadius:2, transition:'all .2s', transform: menuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{ borderTop:'1px solid #F3F4F6', background:'white', padding:'8px 16px 16px' }}>
          {LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display:'block', padding:'11px 12px', borderRadius:8, fontSize:14, fontWeight:600,
                textDecoration:'none', margin:'2px 0',
                background: pathname===l.to ? 'var(--blue-light)' : 'transparent',
                color: pathname===l.to ? 'var(--blue)' : '#374151',
              }}
            >{l.label}</Link>
          ))}

          {user && user.role !== 'admin' && (
            <Link
              to="/my-orders"
              onClick={() => setMenuOpen(false)}
              style={{
                display:'block', padding:'11px 12px', borderRadius:8, fontSize:14, fontWeight:600,
                textDecoration:'none', margin:'2px 0',
                background: pathname==='/my-orders' ? 'var(--blue-light)' : 'transparent',
                color: pathname==='/my-orders' ? 'var(--blue)' : '#374151',
              }}
            >📋 My Orders</Link>
          )}

          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              style={{
                display:'block', padding:'11px 12px', borderRadius:8, fontSize:14, fontWeight:600,
                textDecoration:'none', margin:'2px 0',
                background: pathname==='/admin' ? '#FFFBEB' : 'transparent',
                color: pathname==='/admin' ? '#92400E' : '#374151',
              }}
            >⚙️ Admin Dashboard</Link>
          )}

          {!user && (
            <button
              onClick={() => { setShowLoginModal(true); setMenuOpen(false) }}
              style={{ width:'100%', textAlign:'left', padding:'11px 12px', borderRadius:8, fontSize:14, fontWeight:600, color:'#374151', background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', marginTop:2 }}
            >Sign in</button>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) { .nav-mobile-btn { display: none !important; } }
        @media (max-width: 768px)  { .nav-desktop { display: none !important; } }
      `}</style>
    </nav>
  )
}
