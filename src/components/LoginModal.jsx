import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'

export default function LoginModal() {
  const { setShowLoginModal, authError } = useAuth()

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
            Sign in with Google
          </h2>
          <p style={{ fontSize:13, color:'#6B7280' }}>
            Use your Google account to track your visa orders
          </p>
        </div>

        {/* Google button (ID token via <GoogleLogin />) */}
        <div style={{ width: '100%', marginBottom: 16 }}>
          <GoogleLogin
            onSuccess={credentialResponse => {
              window.dispatchEvent(
                new CustomEvent('google-login-success', {
                  detail: credentialResponse,
                })
              )
            }}
            onError={() => {
              // AuthContext handles authError
            }}
          />
        </div>

        {authError && (
          <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'8px 12px', marginBottom:12, fontSize:12, color:'#991B1B' }}>
            {authError}
          </div>
        )}

        <p style={{ textAlign:'center', fontSize:12, color:'#9CA3AF', marginTop:20, lineHeight:1.6 }}>
          By continuing, you agree to our{' '}
          <span style={{ color:'var(--blue)', cursor:'pointer', fontWeight:600 }}>Terms</span> and{' '}
          <span style={{ color:'var(--blue)', cursor:'pointer', fontWeight:600 }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
