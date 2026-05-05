import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Simulate Google login (replace with real Firebase/OAuth later)
  const loginWithGoogle = () => {
    setTimeout(() => {
      setUser({
        name: 'Nguyễn Văn An',
        email: 'nguyenvanan@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+An&background=1B4FD8&color=fff&size=40',
      })
      setShowLoginModal(false)
    }, 1200)
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, showLoginModal, setShowLoginModal }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
