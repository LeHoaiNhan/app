import { useState } from 'react'
import { api, apiError } from '../lib/api'

const TIMELINE_STAGES = [
  { id:'submitted', icon:'📝', label:'Submitted',         desc:'We received your application' },
  { id:'review',    icon:'🔍', label:'Under review',      desc:'Our experts are reviewing your file' },
  { id:'sent',      icon:'📤', label:'Sent to authority', desc:'Forwarded to the visa-issuing authority' },
  { id:'approved',  icon:'✅', label:'Approved',          desc:'Your visa is being issued' },
  { id:'delivered', icon:'📧', label:'Delivered',         desc:'Your e-visa is in your inbox' },
]

const STAGE_INDEX = Object.fromEntries(TIMELINE_STAGES.map((s, i) => [s.id, i]))

export default function OrderTracker({ compact = false, defaultCode = '' }) {
  const [orderCode, setOrderCode] = useState(defaultCode)
  const [email, setEmail] = useState('')
  const [tracking, setTracking] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleTrack = async (e) => {
    e?.preventDefault()
    const code = orderCode.trim().toUpperCase()
    if (!code) return
    if (!/^EV-[A-Z0-9]{6}$/.test(code)) {
      setResult({ found: false })
      setError(null)
      return
    }
    setTracking(true)
    setResult(null)
    setError(null)
    try {
      const params = new URLSearchParams({ code })
      if (email.trim()) params.set('email', email.trim())
      const { data } = await api.get(`/track?${params.toString()}`)
      setResult(data)
    } catch (err) {
      setError(apiError(err, 'Cannot track order right now'))
    } finally {
      setTracking(false)
    }
  }

  const reject = result && result.order?.status === 'rejected'
  const order = result?.order
  const currentIdx = order ? (STAGE_INDEX[order.status] ?? -1) : -1

  return (
    <div style={{ background:'white', borderRadius:16, border:'1px solid #E5E7EB', overflow:'hidden' }}>
      <div style={{ padding:'18px 24px', display:'flex', alignItems:'center', gap:14, background:'var(--blue-light)', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ width:44, height:44, borderRadius:12, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🔎</div>
        <div style={{ flex:1, minWidth:0 }}>
          <h2 style={{ fontFamily:'Fraunces,serif', fontSize: compact ? 18 : 20, fontWeight:900, color:'var(--navy)' }}>Track your order</h2>
          <p style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>Enter your order code <span style={{ fontFamily:'monospace', fontWeight:700 }}>EV-XXXXXX</span> to see real-time status</p>
        </div>
      </div>
      <form onSubmit={handleTrack} style={{ padding: compact ? 18 : 24 }}>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          <input
            style={{ flex:'1 1 200px', padding:'12px 16px', borderRadius:12, border:'2px solid #E5E7EB', fontSize:14, fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'.05em', outline:'none', minWidth:0 }}
            placeholder="EV-A47B92"
            value={orderCode}
            onChange={e => setOrderCode(e.target.value.toUpperCase())}
            maxLength={9}
            autoComplete="off"
          />
          <input
            type="email"
            style={{ flex:'1 1 200px', padding:'12px 16px', borderRadius:12, border:'2px solid #E5E7EB', fontSize:14, outline:'none', minWidth:0 }}
            placeholder="Your email (optional, for security)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <button type="submit" disabled={tracking} className="btn-primary" style={{ padding:'12px 28px', justifyContent:'center', opacity: tracking ? 0.7 : 1, flex:'0 1 auto' }}>
            {tracking ? (
              <>
                <svg className="spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="31" strokeDashoffset="10"/>
                </svg>
                Searching
              </>
            ) : 'Track →'}
          </button>
        </div>

        {error && (
          <div className="fade-up" style={{ marginTop:14, borderRadius:8, padding:'10px 14px', fontSize:13, color:'#991B1B', background:'#FEF2F2', border:'1px solid #FECACA' }}>
            {error}
          </div>
        )}

        {result && !result.found && (
          <div className="fade-up" style={{ marginTop:18, borderRadius:12, padding:14, display:'flex', gap:12, alignItems:'flex-start', background:'#FEF2F2', border:'1px solid #FECACA' }}>
            <span style={{ fontSize:22 }}>⚠️</span>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:'#991B1B' }}>No order found with that code</div>
              <p style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>Codes follow <span style={{ fontFamily:'monospace', fontWeight:700 }}>EV-XXXXXX</span>. If you provided an email, make sure it matches the one used to apply.</p>
            </div>
          </div>
        )}

        {result?.found && order && (
          <div className="fade-up" style={{ marginTop:24 }}>
            <div style={{ borderRadius:12, padding:16, marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap', background: reject ? '#FEF2F2' : 'var(--green-light)', border: reject ? '1px solid #FECACA' : '1px solid #BBF7D0' }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color: reject ? '#DC2626' : 'var(--green)', textTransform:'uppercase', letterSpacing:'.06em' }}>{reject ? 'Order rejected' : 'Order found'}</div>
                <div style={{ fontFamily:'monospace', fontWeight:900, fontSize:18, color:'var(--navy)', marginTop:2 }}>{order.id}</div>
                <div style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>
                  {order.flag} <span style={{ fontWeight:600 }}>{order.destination}</span> · Submitted: {new Date(order.submittedAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em' }}>Status</div>
                <div style={{ fontWeight:700, fontSize:14, color: reject ? '#DC2626' : 'var(--blue)' }}>
                  {reject ? '❌ Rejected' : (TIMELINE_STAGES[currentIdx]?.label || order.status)}
                </div>
              </div>
            </div>

            {!reject && (
              <div>
                {TIMELINE_STAGES.map((stage, i) => {
                  const done = i <= currentIdx
                  const current = i === currentIdx
                  return (
                    <div key={stage.id} style={{ display:'flex', gap:14 }}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                        <div style={{ width:38, height:38, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, background: done ? (current ? 'var(--blue)' : 'var(--green)') : '#E5E7EB', color: done ? 'white' : '#9CA3AF', boxShadow: current ? '0 0 0 4px rgba(27,79,216,0.15)' : 'none', transition:'all .2s' }}>
                          {done && !current ? '✓' : stage.icon}
                        </div>
                        {i < TIMELINE_STAGES.length - 1 && (
                          <div style={{ width:2, flex:1, marginTop:4, marginBottom:4, minHeight:24, background: i < currentIdx ? 'var(--green)' : '#E5E7EB' }} />
                        )}
                      </div>
                      <div style={{ flex:1, paddingBottom:18, opacity: current ? 1 : (done ? 0.9 : 0.5) }}>
                        <div style={{ fontWeight:700, fontSize:14, color:'var(--navy)' }}>{stage.label}</div>
                        <div style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{stage.desc}</div>
                        {current && (
                          <span style={{ display:'inline-block', marginTop:6, fontSize:11, fontWeight:700, padding:'2px 10px', borderRadius:50, background:'var(--blue-light)', color:'var(--blue)' }}>
                            In progress
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {order.timeline?.length > 0 && (
              <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid #F3F4F6' }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8 }}>Latest update</div>
                {(() => {
                  const last = order.timeline[order.timeline.length - 1]
                  return (
                    <div style={{ fontSize:13, color:'#374151' }}>
                      {last.note && <div style={{ marginBottom:2 }}>{last.note}</div>}
                      <div style={{ fontSize:11, color:'#9CA3AF' }}>{new Date(last.at).toLocaleString()}</div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
