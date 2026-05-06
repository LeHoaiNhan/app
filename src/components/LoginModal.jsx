import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginModal() {
  const { loginWithGoogle, setShowLoginModal } = useAuth()
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ email:'', password:'', name:'' })

  const handleGoogle = () => {
    setLoading(true)
    loginWithGoogle()
  }

  const overlay = { position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }
  const backdrop = { position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }
  const modal = { position:'relative', background:'white', borderRadius:20, width:'100%', maxWidth:400, padding:32, boxShadow:'0 24px 64px rgba(0,0,0,0.2)', zIndex:10 }

  return (
    <div style={overlay} onClick={() => setShowLoginModal(false)}>
      <div style={backdrop} />
      <div style={modal} onClick={e => e.stopPropagation()} className="fade-up">

        {/* Close */}
        <button onClick={() => setShowLoginModal(false)}
          style={{ position:'absolute', top:16, right:16, width:32, height:32, borderRadius:'50%', border:'none', background:'#F3F4F6', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:'#6B7280' }}>✕</button>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <div style={{ width:36, height:36, background:'var(--blue)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span style={{ fontFamily:'Fraunces,serif', fontWeight:900, fontSize:22, color:'var(--navy)' }}>eVisa</span>
          </div>
          <h2 style={{ fontSize:20, fontWeight:800, color:'var(--navy)', marginBottom:4 }}>
            {tab==='login' ? 'Welcome back!' : 'Create your account'}
          </h2>
          <p style={{ fontSize:13, color:'#6B7280' }}>
            {tab==='login' ? 'Sign in to track your visa orders' : 'Free, takes only 30 seconds'}
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display:'flex', background:'#F3F4F6', borderRadius:10, padding:4, marginBottom:20 }}>
          {[['login','Sign in'],['register','Sign up']].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, padding:'8px 0', borderRadius:8, border:'none', cursor:'pointer', fontFamily:'inherit',
                fontSize:14, fontWeight:600, transition:'all .15s',
                background: tab===t ? 'white' : 'transparent',
                color: tab===t ? 'var(--navy)' : '#6B7280',
                boxShadow: tab===t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
              }}>{l}</button>
          ))}
        </div>

        {/* Google button */}
        <button onClick={handleGoogle} disabled={loading}
          style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:12,
            padding:'12px 16px', border:'1.5px solid #E5E7EB', borderRadius:10, background:'white',
            fontSize:14, fontWeight:600, color:'#374151', cursor:'pointer', fontFamily:'inherit',
            transition:'all .15s', marginBottom:16 }}
          onMouseEnter={e => e.currentTarget.style.borderColor='#9CA3AF'}
          onMouseLeave={e => e.currentTarget.style.borderColor='#E5E7EB'}
        >
          {loading ? (
            <svg className="spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="var(--blue)" strokeWidth="3" strokeDasharray="31" strokeDashoffset="10"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          )}
          {loading ? 'Signing in...' : `${tab==='login'?'Sign in':'Sign up'} with Google`}
        </button>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <div style={{ flex:1, height:1, background:'#E5E7EB' }} />
          <span style={{ fontSize:12, color:'#9CA3AF' }}>or</span>
          <div style={{ flex:1, height:1, background:'#E5E7EB' }} />
        </div>

        {/* Form fields */}
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {tab==='register' && (
            <div>
              <label className="field-label">Full name <span className="req">*</span></label>
              <input className="field-input" type="text" placeholder="John Smith"
                value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
            </div>
          )}
          <div>
            <label className="field-label">Email <span className="req">*</span></label>
            <input className="field-input" type="email" placeholder="email@example.com"
              value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
          </div>
          <div>
            <label className="field-label">Password <span className="req">*</span></label>
            <input className="field-input" type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password:e.target.value})} />
          </div>
          {tab==='login' && (
            <div style={{ textAlign:'right' }}>
              <span style={{ fontSize:13, color:'var(--blue)', cursor:'pointer', fontWeight:600 }}>Forgot password?</span>
            </div>
          )}
          <button onClick={handleGoogle}
            style={{ width:'100%', padding:'12px', background:'var(--blue)', color:'white', border:'none',
              borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'inherit', transition:'opacity .15s' }}
            onMouseEnter={e => e.target.style.opacity='.88'}
            onMouseLeave={e => e.target.style.opacity='1'}
          >{tab==='login' ? 'Sign in' : 'Create account'}</button>
        </div>

        <p style={{ textAlign:'center', fontSize:12, color:'#9CA3AF', marginTop:20, lineHeight:1.6 }}>
          By continuing, you agree to our{' '}
          <span style={{ color:'var(--blue)', cursor:'pointer', fontWeight:600 }}>Terms</span> and{' '}
          <span style={{ color:'var(--blue)', cursor:'pointer', fontWeight:600 }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
