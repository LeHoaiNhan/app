import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { useOrders, ORDER_STATUSES, STAGE_FLOW } from '../contexts/OrdersContext'

const TIER_LABEL = { normal:'Standard', fast:'Fast', express:'Express' }

const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { day:'2-digit', month:'2-digit', year:'numeric' })
}
const fmtDateTime = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

export default function MyOrders() {
  const { user, setShowLoginModal } = useAuth()
  const { orders } = useOrders()
  const [selectedId, setSelectedId] = useState(null)
  const [filter, setFilter] = useState('all')

  if (!user) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'#F9FAFB' }}>
        <Navbar />
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 16px' }}>
          <div style={{ background:'white', borderRadius:20, border:'1px solid #E5E7EB', padding:'36px 32px', maxWidth:440, width:'100%', textAlign:'center', boxShadow:'0 12px 32px rgba(11,29,58,0.06)' }}>
            <div style={{ fontSize:54, marginBottom:18 }}>🔐</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:26, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>
              Sign in to view your orders
            </h2>
            <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.65, marginBottom:22 }}>
              You need to sign in to view your visa applications and track their status
            </p>
            <button onClick={() => setShowLoginModal(true)} className="btn-primary" style={{ width:'100%', justifyContent:'center', marginBottom:12 }}>
              Sign in
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <Link to="/" style={{ fontSize:13, fontWeight:600, color:'var(--blue)', textDecoration:'none' }}>← Back to home</Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const myOrders = orders.filter(o => o.customerId === user.id)
  const active = myOrders.filter(o => !['delivered','rejected'].includes(o.status))
  const done   = myOrders.filter(o => ['delivered','rejected'].includes(o.status))

  const filtered = filter === 'all' ? myOrders : filter === 'active' ? active : done
  const selected = selectedId ? myOrders.find(o => o.id === selectedId) : null

  if (selected) {
    return <OrderDetail order={selected} onBack={() => setSelectedId(null)} />
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F9FAFB' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ background:'linear-gradient(135deg,#0B1D3A 0%,#1a3060 55%,#0d2451 100%)', padding:'48px 20px 56px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:440, height:440, background:'radial-gradient(circle,rgba(27,79,216,0.25) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:'30%', width:320, height:320, background:'radial-gradient(circle,rgba(245,166,35,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1024, margin:'0 auto', position:'relative', display:'flex', alignItems:'center', gap:18, flexWrap:'wrap' }}>
          <img src={user.avatar} alt=""
            style={{ width:64, height:64, borderRadius:16, border:'2px solid rgba(255,255,255,0.3)', flexShrink:0 }}
          />
          <div style={{ flex:1, minWidth:200 }}>
            <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, marginBottom:2 }}>Hello,</p>
            <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(24px,4vw,34px)', fontWeight:900, color:'white', lineHeight:1.1 }}>{user.name}</h1>
          </div>
          <Link to="/" className="btn-primary" style={{ background:'var(--gold)', color:'var(--navy)', flexShrink:0 }}>
            + New application
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:'white', padding:'40px 20px', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, textAlign:'center' }}>
          {[
            ['Total orders', myOrders.length, 'var(--blue)'],
            ['In progress',  active.length,   '#F59E0B'],
            ['Completed',    done.filter(o => o.status === 'delivered').length, 'var(--green)'],
          ].map(([label, val, color]) => (
            <div key={label}>
              <div style={{ fontFamily:'Fraunces,serif', fontSize:38, fontWeight:900, color, lineHeight:1 }}>{val}</div>
              <div style={{ fontSize:14, color:'#6B7280', marginTop:6, fontWeight:500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ORDERS LIST ── */}
      <section style={{ background:'#F9FAFB', padding:'48px 20px 64px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, marginBottom:24, flexWrap:'wrap' }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:28, fontWeight:900, color:'var(--navy)' }}>My orders</h2>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {[
                ['all',    'All',         myOrders.length],
                ['active', 'In progress', active.length],
                ['done',   'Completed',   done.length],
              ].map(([key, label, count]) => {
                const isActive = filter === key
                return (
                  <button key={key} onClick={() => setFilter(key)}
                    style={{
                      display:'inline-flex', alignItems:'center', gap:6,
                      padding:'8px 14px', borderRadius:50, fontSize:13, fontWeight:600,
                      cursor:'pointer', fontFamily:'inherit', transition:'all .15s',
                      background: isActive ? 'var(--blue)' : 'white',
                      color: isActive ? 'white' : '#374151',
                      border: isActive ? '1.5px solid var(--blue)' : '1.5px solid #E5E7EB',
                      boxShadow: isActive ? '0 8px 20px rgba(27,79,216,0.25)' : 'none',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) { e.currentTarget.style.borderColor='var(--blue)'; e.currentTarget.style.color='var(--blue)'; e.currentTarget.style.background='var(--blue-light)' }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) { e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.color='#374151'; e.currentTarget.style.background='white' }
                    }}
                  >
                    <span>{label}</span>
                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:50, background: isActive ? 'rgba(255,255,255,0.25)' : '#F3F4F6', color: isActive ? 'white' : '#6B7280', minWidth:18, textAlign:'center' }}>{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {filtered.map(o => <OrderCard key={o.id} order={o} onClick={() => setSelectedId(o.id)} />)}
            </div>
          ) : myOrders.length === 0 ? (
            <div style={{ background:'white', borderRadius:14, border:'1px solid #E5E7EB', padding:'56px 20px', textAlign:'center' }}>
              <div style={{ fontSize:48, marginBottom:14 }}>📭</div>
              <h3 style={{ fontFamily:'Fraunces,serif', fontSize:20, fontWeight:900, color:'var(--navy)', marginBottom:6 }}>You have no orders yet</h3>
              <p style={{ fontSize:14, color:'#6B7280', marginBottom:20 }}>Submit your first visa application to get started</p>
              <Link to="/" className="btn-primary">
                Apply for visa
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          ) : (
            <div style={{ background:'white', borderRadius:14, border:'1px solid #E5E7EB', padding:'40px 20px', textAlign:'center' }}>
              <div style={{ fontSize:36, opacity:0.5, marginBottom:8 }}>🔍</div>
              <p style={{ fontSize:14, color:'#6B7280' }}>No orders in this category</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

function OrderCard({ order, onClick }) {
  const status = ORDER_STATUSES[order.status]
  const isTerminal = ['delivered','rejected'].includes(order.status)
  return (
    <button onClick={onClick}
      style={{ width:'100%', display:'flex', alignItems:'center', gap:16, padding:18, background:'white', border:'1px solid #E5E7EB', borderRadius:14, cursor:'pointer', textAlign:'left', fontFamily:'inherit', transition:'all .2s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 20px rgba(11,29,58,0.06)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='var(--blue)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#E5E7EB' }}
    >
      <div style={{ fontSize:42, lineHeight:1, flexShrink:0 }}>{order.flag}</div>

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
          <h3 style={{ fontWeight:900, fontSize:17, color:'var(--navy)' }}>{order.destination}</h3>
          <span style={{ fontFamily:'monospace', fontSize:11, fontWeight:700, color:'#9CA3AF' }}>{order.id}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', fontSize:12, color:'#6B7280' }}>
          <span>📅 Submitted: {fmtDate(order.createdAt)}</span>
          <span style={{ color:'#D1D5DB' }}>·</span>
          <span>{order.visaType}</span>
          <span style={{ color:'#D1D5DB' }}>·</span>
          <span>{TIER_LABEL[order.processing]}</span>
        </div>
        <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:50, background:status.bg, color:status.color }}>
            <span>{status.icon}</span>{status.label}
          </span>
          {!isTerminal && (
            <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, padding:'3px 9px', borderRadius:50, background:'#FFFBEB', color:'#92400E' }}>
              <span className="pulse" style={{ width:6, height:6, borderRadius:'50%', background:'#92400E' }} />
              In progress
            </span>
          )}
        </div>
      </div>

      <div style={{ textAlign:'right', flexShrink:0 }}>
        <div style={{ fontFamily:'Fraunces,serif', fontSize:22, fontWeight:900, color:'var(--blue)', lineHeight:1 }}>${order.fee.total}</div>
        <svg style={{ marginLeft:'auto', marginTop:8, color:'#9CA3AF' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </button>
  )
}

function OrderDetail({ order, onBack }) {
  const status = ORDER_STATUSES[order.status]
  const currentIdx = STAGE_FLOW.indexOf(order.status)
  const isRejected = order.status === 'rejected'

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [order.id])

  return (
    <div style={{ minHeight:'100vh', background:'#F9FAFB' }}>
      <Navbar />

      {/* ── HEADER (navy gradient like Admin detail) ── */}
      <section style={{ background:'linear-gradient(135deg,#0B1D3A 0%,#1a3060 55%,#0d2451 100%)', padding:'40px 20px 48px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:300, height:300, background:`radial-gradient(circle,${status.color}55 0%,transparent 70%)`, pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-50, left:'30%', width:280, height:280, background:'radial-gradient(circle,rgba(245,166,35,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1024, margin:'0 auto', position:'relative' }}>
          <button onClick={onBack}
            style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.75)', marginBottom:20, background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit', padding:0 }}
            onMouseEnter={e => e.currentTarget.style.color='white'}
            onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.75)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 19l-7-7 7-7"/>
            </svg>
            Back to list
          </button>

          <div style={{ display:'flex', alignItems:'flex-start', gap:18, flexWrap:'wrap' }}>
            <div style={{ fontSize:54, lineHeight:1 }}>{order.flag}</div>
            <div style={{ flex:1, minWidth:240 }}>
              <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(28px,4.5vw,38px)', fontWeight:900, color:'white', lineHeight:1.1 }}>{order.destination}</h1>
              <div style={{ fontFamily:'monospace', fontSize:14, color:'rgba(255,255,255,0.6)', marginTop:4 }}>{order.id}</div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:12, flexWrap:'wrap' }}>
                <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:50, background:status.bg, color:status.color }}>
                  {status.icon} {status.label}
                </span>
                <span style={{ fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:50, color:'rgba(255,255,255,0.9)', background:'rgba(255,255,255,0.15)' }}>{order.visaType}</span>
                <span style={{ fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:50, color:'rgba(255,255,255,0.9)', background:'rgba(255,255,255,0.15)' }}>{TIER_LABEL[order.processing]}</span>
              </div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:11, textTransform:'uppercase', letterSpacing:'.06em' }}>Total paid</div>
              <div style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'white' }}>${order.fee.total}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BODY ── */}
      <section style={{ background:'#F9FAFB', padding:'40px 20px 64px' }}>
        <div style={{ maxWidth:920, margin:'0 auto', display:'flex', flexDirection:'column', gap:16 }}>

          {/* Timeline */}
          <Section title="📍 Application progress">
            {isRejected && (
              <div style={{ borderRadius:12, padding:14, marginBottom:14, display:'flex', gap:12, alignItems:'flex-start', background:'#FEF2F2', border:'1px solid #FECACA' }}>
                <span style={{ fontSize:22 }}>❌</span>
                <div>
                  <h4 style={{ fontWeight:700, fontSize:14, color:'#991B1B', marginBottom:4 }}>Application rejected</h4>
                  <p style={{ fontSize:13, lineHeight:1.6, color:'#7F1D1D' }}>
                    {order.timeline[order.timeline.length - 1]?.note}
                  </p>
                </div>
              </div>
            )}

            <div>
              {STAGE_FLOW.map((stageKey, i) => {
                const stage = ORDER_STATUSES[stageKey]
                const passedEvent = order.timeline.find(t => t.stage === stageKey)
                const done = !!passedEvent && i <= currentIdx
                const current = i === currentIdx && !isRejected
                return (
                  <div key={stageKey} style={{ display:'flex', gap:14 }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                      <div style={{ width:38, height:38, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, background: done ? (current ? 'var(--blue)' : 'var(--green)') : '#E5E7EB', color: done ? 'white' : '#9CA3AF', boxShadow: current ? '0 0 0 4px rgba(27,79,216,0.15)' : 'none', transition:'all .2s' }}>
                        {done && !current ? '✓' : stage.icon}
                      </div>
                      {i < STAGE_FLOW.length - 1 && (
                        <div style={{ width:2, flex:1, marginTop:4, marginBottom:4, minHeight:28, background: i < currentIdx ? 'var(--green)' : '#E5E7EB' }} />
                      )}
                    </div>
                    <div style={{ flex:1, paddingBottom:18, opacity: current ? 1 : (done ? 0.9 : 0.5) }}>
                      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
                        <div style={{ fontWeight:700, fontSize:14, color:'var(--navy)' }}>{stage.label}</div>
                        {passedEvent && <div style={{ fontSize:11, color:'#9CA3AF' }}>{fmtDateTime(passedEvent.at)}</div>}
                      </div>
                      {passedEvent && <div style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{passedEvent.note}</div>}
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

            {order.status === 'delivered' && (
              <div style={{ marginTop:14, paddingTop:18, borderTop:'1px solid #F3F4F6' }}>
                <button className="btn-primary" style={{ width:'100%', justifyContent:'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  Download visa PDF
                </button>
              </div>
            )}
          </Section>

          <Section title="👤 Applicant information">
            <InfoGrid items={[
              ['Full name',     order.applicant.fullName],
              ['Email',         order.applicant.email],
              ['Phone',         order.applicant.phone],
              ['Date of birth', fmtDate(order.applicant.dob)],
              ['Gender',        order.applicant.gender],
              ['Nationality',   order.applicant.nationality],
              ['Place of birth',order.applicant.birthPlace],
            ]} />
          </Section>

          <Section title="📘 Passport information">
            <InfoGrid items={[
              ['Passport number', order.passport.no],
              ['Type',            order.passport.type],
              ['Issue date',      fmtDate(order.passport.issueDate)],
              ['Expiry date',     fmtDate(order.passport.expiryDate)],
              ['Place of issue',  order.passport.issuePlace],
              ['Issuing country', order.passport.issueCountry],
            ]} />
          </Section>

          <Section title="✈️ Trip information">
            <InfoGrid items={[
              ['Purpose',       order.trip.purpose],
              ['Entry date',    fmtDate(order.trip.entryDate)],
              ['Exit date',     fmtDate(order.trip.exitDate)],
              ['Accommodation', order.trip.accommodation || '—'],
            ]} />
            {order.trip.notes && (
              <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid #F3F4F6' }}>
                <InfoRow label="Notes" value={order.trip.notes} />
              </div>
            )}
          </Section>

          <Section title="💳 Payment">
            <div style={{ display:'flex', flexDirection:'column', gap:10, fontSize:14 }}>
              <Row label="Government fee" val={`$${order.fee.gov}.00`} />
              <Row label={`Service fee (${TIER_LABEL[order.processing]})`} val={`$${order.fee.service}.00`} />
              <div style={{ borderTop:'1px solid #F3F4F6', paddingTop:10, display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontWeight:700, color:'var(--navy)' }}>Total paid</span>
                <span style={{ fontFamily:'Fraunces,serif', fontSize:20, fontWeight:900, color:'var(--blue)' }}>${order.fee.total}.00</span>
              </div>
              <div style={{ fontSize:12, color:'#6B7280', paddingTop:10, borderTop:'1px solid #F3F4F6', display:'flex', justifyContent:'space-between' }}>
                <span>Method · Date</span>
                <span>{order.payment.method === 'card' ? '💳 Card' : '📱 Digital wallet'} · {fmtDateTime(order.payment.paidAt)}</span>
              </div>
              {order.payment.status === 'refunded' && (
                <div style={{ borderRadius:8, padding:10, fontSize:12, display:'flex', alignItems:'center', gap:8, background:'#FEF2F2', color:'#991B1B' }}>
                  <span>↩️</span>
                  <span><strong>Refunded</strong> service fee of ${order.fee.service} to original payment</span>
                </div>
              )}
            </div>
          </Section>

          {/* Help actions */}
          <div style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:22 }}>
            <h3 style={{ fontWeight:700, fontSize:14, color:'var(--navy)', marginBottom:14 }}>Need help?</h3>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <Link to="/support" className="btn-secondary" style={{ flex:'1 1 200px', justifyContent:'center' }}>
                💬 Contact our experts
              </Link>
              <Link to="/guide" className="btn-secondary" style={{ flex:'1 1 200px', justifyContent:'center' }}>
                📚 View guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:22 }}>
      <h3 style={{ fontWeight:700, fontSize:15, color:'var(--navy)', marginBottom:16 }}>{title}</h3>
      {children}
    </div>
  )
}

function InfoGrid({ items }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'14px 24px' }}>
      {items.map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:2 }}>{label}</div>
      <div style={{ fontSize:14, fontWeight:600, color:'var(--navy)' }}>{value || '—'}</div>
    </div>
  )
}

function Row({ label, val }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <span style={{ color:'#6B7280' }}>{label}</span>
      <span style={{ fontWeight:600, color:'var(--navy)' }}>{val}</span>
    </div>
  )
}
