import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginModal() {
  const { loginWithGoogle, setShowLoginModal } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleGoogle = () => {
    setLoading(true)
    loginWithGoogle()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowLoginModal(false)}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 z-10"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"
          onClick={() => setShowLoginModal(false)}
        >✕</button>

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{background:'var(--blue)'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-black text-xl" style={{fontFamily:'Fraunces,serif',color:'var(--navy)'}}>eVisa</span>
          </div>
          <h2 className="text-xl font-bold mb-1" style={{color:'var(--navy)'}}>Chào mừng trở lại!</h2>
          <p className="text-sm text-gray-500">Đăng nhập để theo dõi đơn visa của bạn</p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-60"
        >
          {loading ? (
            <svg className="animate-spin w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31" strokeDashoffset="12"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          )}
          {loading ? 'Đang đăng nhập...' : 'Tiếp tục với Google'}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100"/>
          <span className="text-xs text-gray-400">hoặc</span>
          <div className="flex-1 h-px bg-gray-100"/>
        </div>

        {/* Email login */}
        <div className="space-y-3">
          <div>
            <label className="field-label">Email</label>
            <input className="field-input" type="email" placeholder="email@example.com" />
          </div>
          <div>
            <label className="field-label">Mật khẩu</label>
            <input className="field-input" type="password" placeholder="••••••••" />
          </div>
          <button
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
            style={{background:'var(--blue)'}}
            onClick={handleGoogle}
          >
            Đăng nhập
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          Chưa có tài khoản?{' '}
          <span className="font-semibold cursor-pointer" style={{color:'var(--blue)'}}>Đăng ký miễn phí</span>
        </p>
      </div>
    </div>
  )
}
