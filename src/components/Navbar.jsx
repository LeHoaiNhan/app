import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

const LINKS = [
  { to: '/destinations', label: 'Destinations' },
  { to: '/visa-types',   label: 'Visa Types' },
  { to: '/pricing',      label: 'Pricing' },
  { to: '/guide',        label: 'Guide' },
  { to: '/#track',       label: 'Track' },
  { to: '/support',      label: 'Support' },
]

export default function Navbar({ onApplyClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout, setShowLoginModal } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const userRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setUserMenu(false) }, [pathname])

  useEffect(() => {
    const onDoc = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenu(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') { setUserMenu(false); setMenuOpen(false) }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const handleApply = () => {
    setMenuOpen(false)
    if (onApplyClick) onApplyClick()
    else navigate('/')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" aria-label="eVisa home">
          <span className="logo-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </span>
          eVisa
        </Link>

        <ul className="navbar-links">
          {LINKS.map(l => {
            const isHash = l.to.includes('#')
            const active = !isHash && pathname === l.to
            return (
              <li key={l.to}>
                <Link to={l.to} className={`nav-link ${active ? 'active' : ''}`}>{l.label}</Link>
              </li>
            )
          })}
        </ul>

        <div className="navbar-right">
          {user ? (
            <div className="user-menu" ref={userRef}>
              <button
                onClick={() => setUserMenu(v => !v)}
                className="user-btn"
                aria-haspopup="menu"
                aria-expanded={userMenu}
              >
                <img src={user.avatar} alt="" className={`user-avatar ${user.role === 'admin' ? 'is-admin' : ''}`} />
                <span className="user-name">{user.name.split(' ').at(-1)}</span>
                <svg className="user-caret" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>
              {userMenu && (
                <div className="user-dropdown" role="menu">
                  <div className="user-dropdown-head">
                    <div className="user-dropdown-name">
                      <span>{user.name}</span>
                      {user.role === 'admin' && <span className="admin-badge">ADMIN</span>}
                    </div>
                    <p className="user-dropdown-email">{user.email}</p>
                  </div>
                  {user.role === 'admin' ? (
                    <Link to="/admin" className="user-dropdown-link" onClick={() => setUserMenu(false)}>Admin Dashboard</Link>
                  ) : (
                    <Link to="/my-orders" className="user-dropdown-link" onClick={() => setUserMenu(false)}>My Orders</Link>
                  )}
                  <Link to="/support" className="user-dropdown-link" onClick={() => setUserMenu(false)}>Support</Link>
                  <button onClick={() => { logout(); setUserMenu(false) }} className="user-dropdown-signout">Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} className="btn-signin">Sign in</button>
          )}

          <button onClick={handleApply} className="btn-primary navbar-cta">
            Apply now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <button
            onClick={() => setMenuOpen(v => !v)}
            className={`hamburger ${menuOpen ? 'is-open' : ''}`}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span/><span/><span/>
          </button>
        </div>
      </div>

      <div className={`navbar-drawer ${menuOpen ? 'is-open' : ''}`}>
        <div className="navbar-drawer-inner">
          {LINKS.map(l => {
            const isHash = l.to.includes('#')
            const active = !isHash && pathname === l.to
            return (
              <Link key={l.to} to={l.to} onClick={closeMenu} className={`drawer-link ${active ? 'active' : ''}`}>
                {l.label}
              </Link>
            )
          })}
          {user && user.role !== 'admin' && (
            <Link to="/my-orders" onClick={closeMenu} className={`drawer-link ${pathname === '/my-orders' ? 'active' : ''}`}>My Orders</Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin" onClick={closeMenu} className={`drawer-link admin ${pathname === '/admin' ? 'active' : ''}`}>Admin Dashboard</Link>
          )}
          {!user && (
            <button onClick={() => { setShowLoginModal(true); setMenuOpen(false) }} className="drawer-link drawer-signin">Sign in</button>
          )}
        </div>
      </div>
    </nav>
  )
}
