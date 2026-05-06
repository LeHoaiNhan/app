import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'evisa_user_v1'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (_) { /* fall through */ }
    return null
  })
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  const loginWithGoogle = () => {
    setTimeout(() => {
      setUser({
        id: 'demo-customer',
        name: 'John Smith',
        email: 'john.smith@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=1B4FD8&color=fff&size=80',
        role: 'customer',
      })
      setShowLoginModal(false)
    }, 1200)
  }

  const loginAsAdmin = () => {
    setUser({
      id: 'admin-demo',
      name: 'eVisa Admin',
      email: 'admin@evisa.com',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=F5A623&color=0B1D3A&size=80&bold=true',
      role: 'admin',
    })
    setShowLoginModal(false)
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, loginAsAdmin, logout, showLoginModal, setShowLoginModal }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
