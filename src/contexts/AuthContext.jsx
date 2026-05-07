import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api, getToken, setToken, apiError, isNetworkError } from '../lib/api'
import { DEMO_ADMIN_USER, DEMO_ADMIN_TOKEN } from '../lib/demoData'

const STORAGE_KEY = 'evisa_user_v1'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [authError, setAuthError] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)

  // =========================
  // SAVE AUTH STATE
  // =========================
  const persist = useCallback((nextUser, token) => {
    setUser(nextUser)
    setToken(token)

    try {
      if (nextUser) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {}
  }, [])

  // =========================
  // AUTO LOAD USER
  // =========================
  useEffect(() => {
    const token = getToken()
    if (!token) return
    if (token === DEMO_ADMIN_TOKEN) return  // demo session — no backend to verify against

    api.get('/auth/me')
      .then(res => {
        setUser(res.data.user)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data.user))
      })
      .catch(err => {
        // Don't logout on network error — backend may be temporarily down. Only clear on 401.
        if (err?.response?.status === 401) persist(null, null)
      })
  }, [persist])

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    try {
      setAuthLoading(true)
      setAuthError(null)

      const idToken = credentialResponse?.credential

      if (!idToken) {
        setAuthError('Google did not return credential')
        return
      }

      const { data } = await api.post('/auth/google', {
        idToken,
      })

      persist(data.user, data.token)
      setShowLoginModal(false)

    } catch (err) {
      console.error('🔥 GOOGLE AUTH ERROR:', err)

      setAuthError(
        apiError(err, 'Google sign-in failed')
      )
    } finally {
      setAuthLoading(false)
    }
  }, [persist])

  // =========================
  // EVENT BRIDGE (optional)
  // =========================
  useEffect(() => {
    const handler = (e) => {
      handleGoogleSuccess(e?.detail)
    }

    window.addEventListener('google-login-success', handler)
    return () => window.removeEventListener('google-login-success', handler)
  }, [handleGoogleSuccess])

  // =========================
  // ADMIN LOGIN
  // =========================
  const loginAsAdmin = useCallback(async (credentials) => {
    try {
      setAuthError(null)
      setAuthLoading(true)

      const body = credentials || {
        email: 'admin@evisa.com',
        password: 'admin123',
      }

      try {
        const { data } = await api.post('/auth/admin', body)
        persist(data.user, data.token)
        setShowLoginModal(false)
        return data.user
      } catch (err) {
        // Demo fallback: backend is unreachable AND credentials match the documented demo pair.
        const isDemoCreds = body.email === 'admin@evisa.com' && body.password === 'admin123'
        if (isNetworkError(err) && isDemoCreds) {
          console.warn('[auth] backend unreachable — using demo admin (no real DB)')
          persist(DEMO_ADMIN_USER, DEMO_ADMIN_TOKEN)
          setShowLoginModal(false)
          return DEMO_ADMIN_USER
        }
        throw err
      }
    } catch (err) {
      setAuthError(apiError(err, 'Invalid admin credentials'))
      throw err
    } finally {
      setAuthLoading(false)
    }
  }, [persist])

  // =========================
  // LOGOUT
  // =========================
  const logout = useCallback(async () => {
    try {
      if (getToken()) await api.post('/auth/logout')
    } catch {}
    persist(null, null)
    setAuthError(null)
  }, [persist])

  return (
    <AuthContext.Provider
      value={{
        user,
        authError,
        authLoading,

        loginAsAdmin,
        logout,

        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)