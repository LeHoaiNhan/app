import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api, getToken, setToken, apiError } from '../lib/api'

const STORAGE_KEY = 'evisa_user_v1'
const AuthContext = createContext(null)

const DEMO_GOOGLE_USER = {
  email: 'john.smith@gmail.com',
  name: 'John Smith',
  avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=1B4FD8&color=fff&size=80',
  googleId: 'demo-google-id-john',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return JSON.parse(stored)
    } catch (_) { /* fall through */ }
    return null
  })
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)

  const persist = useCallback((nextUser, token) => {
    setUser(nextUser)
    setToken(token)
    try {
      if (nextUser) localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
      else localStorage.removeItem(STORAGE_KEY)
    } catch (_e) {
      /* ignore quota errors */
    }
  }, [])

  useEffect(() => {
    if (!getToken()) return
    api.get('/auth/me')
      .then(res => {
        setUser(res.data.user)
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data.user)) } catch (_e) { /* ignore */ }
      })
      .catch(() => persist(null, null))
  }, [persist])

  const loginWithGoogle = useCallback(async () => {
    setAuthError(null)
    setAuthLoading(true)
    try {
      const { data } = await api.post('/auth/google', DEMO_GOOGLE_USER)
      persist(data.user, data.token)
      setShowLoginModal(false)
      return data.user
    } catch (err) {
      setAuthError(apiError(err, 'Google sign-in failed'))
      throw err
    } finally {
      setAuthLoading(false)
    }
  }, [persist])

  const loginAsAdmin = useCallback(async (credentials) => {
    setAuthError(null)
    setAuthLoading(true)
    try {
      const body = credentials || { email: 'admin@evisa.com', password: 'admin123' }
      const { data } = await api.post('/auth/admin', body)
      persist(data.user, data.token)
      setShowLoginModal(false)
      return data.user
    } catch (err) {
      setAuthError(apiError(err, 'Invalid admin credentials'))
      throw err
    } finally {
      setAuthLoading(false)
    }
  }, [persist])

  const logout = useCallback(() => {
    persist(null, null)
    setAuthError(null)
  }, [persist])

  return (
    <AuthContext.Provider value={{
      user,
      authError,
      authLoading,
      loginWithGoogle,
      loginAsAdmin,
      logout,
      showLoginModal,
      setShowLoginModal,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
