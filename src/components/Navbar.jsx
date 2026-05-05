import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const NAV_LINKS = [
  { to: '/destinations', label: 'Điểm đến' },
  { to: '/visa-types', label: 'Loại visa' },
  { to: '/guide', label: 'Hướng dẫn' },
  { to: '/support', label: 'Hỗ trợ' },
]

export default function Navbar({ onApplyClick }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout, setShowLoginModal } = useAuth()
  const location = useLocation()

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'var(--blue)'}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-black text-xl hidden sm:block" style={{fontFamily:'Fraunces,serif',color:'var(--navy)'}}>eVisa</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex gap-6 flex-1 justify-center">
            {NAV_LINKS.map(l => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`text-sm font-500 transition-colors hover:text-blue-600 ${location.pathname === l.to ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <span className="hidden sm:block text-sm font-semibold text-gray-700 max-w-[100px] truncate">{user.name.split(' ').pop()}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hidden sm:block text-gray-400">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-lg w-48 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Đơn của tôi</button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cài đặt</button>
                    <button onClick={() => { logout(); setUserMenuOpen(false) }} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50">Đăng xuất</button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="hidden sm:block text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
              >
                Đăng nhập
              </button>
            )}

            <button
              onClick={onApplyClick || (() => {})}
              className="text-sm font-bold text-white px-4 py-2 rounded-lg transition-all hover:opacity-90 flex-shrink-0"
              style={{background:'var(--blue)'}}
            >
              Đăng ký visa
            </button>

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-1.5 rounded-lg hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}/>
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${menuOpen ? 'opacity-0' : ''}`}/>
              <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}/>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {NAV_LINKS.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === l.to ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {l.label}
              </Link>
            ))}
            {!user && (
              <button
                onClick={() => { setShowLoginModal(true); setMenuOpen(false) }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Đăng nhập
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  )
}
