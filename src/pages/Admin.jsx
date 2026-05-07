import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import { useAuth } from '../contexts/AuthContext'
import { useOrders, ORDER_STATUSES } from '../contexts/OrdersContext'
import { api, apiError } from '../lib/api'
import AdminCountries from './AdminCountries'
import AdminServiceTiers from './AdminServiceTiers'

const TIER_LABEL = { normal:'Standard', fast:'Fast', express:'Express' }

const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', { day:'2-digit', month:'2-digit', year:'numeric' })
}
const fmtDateTime = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
}
const fmtRelative = (iso) => {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hr ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days} days ago`
  return fmtDate(iso)
}

export default function Admin() {
  const { user, loginAsAdmin, logout, authError, authLoading } = useAuth()
  const { orders, updateStatus, loading, error, refresh } = useOrders()
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [tab, setTab] = useState('orders')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 25

  const activeFilterCount = (statusFilter !== 'all' ? 1 : 0) + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0)

  if (!user || user.role !== 'admin') {
    return <AdminAuthGate onLogin={loginAsAdmin} userIsCustomer={!!user} authError={authError} authLoading={authLoading} />
  }

  const selected = selectedId ? orders.find(o => o.id === selectedId) : null
  if (selected) {
    return (
      <AdminOrderDetail
        order={selected}
        onBack={() => setSelectedId(null)}
        onUpdateStatus={async (status, note) => updateStatus(selected.id, status, note)}
      />
    )
  }

  const stats = {
    total:     orders.length,
    submitted: orders.filter(o => o.status === 'submitted').length,
    inProgress:orders.filter(o => ['review','sent'].includes(o.status)).length,
    approved:  orders.filter(o => ['approved','delivered'].includes(o.status)).length,
    rejected:  orders.filter(o => o.status === 'rejected').length,
  }
  const todayRevenue = orders
    .filter(o => o.payment.status === 'paid' && new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((s, o) => s + o.fee.total, 0)

  const term = search.trim().toLowerCase()
  const fromTs = dateFrom ? new Date(dateFrom).getTime() : null
  const toTs = dateTo ? new Date(dateTo + 'T23:59:59').getTime() : null
  const filtered = orders.filter(o => {
    const matchSearch = !term ||
      o.id.toLowerCase().includes(term) ||
      o.applicant.fullName.toLowerCase().includes(term) ||
      o.applicant.email.toLowerCase().includes(term) ||
      o.destination.toLowerCase().includes(term)
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    const created = new Date(o.createdAt).getTime()
    const matchDate = (!fromTs || created >= fromTs) && (!toTs || created <= toTs)
    return matchSearch && matchStatus && matchDate
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * PAGE_SIZE
  const paged = filtered.slice(pageStart, pageStart + PAGE_SIZE)

  useEffect(() => { setPage(1) }, [search, statusFilter, dateFrom, dateTo])

  const exportCsv = () => {
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (dateFrom) params.set('from', dateFrom)
    if (dateTo) params.set('to', dateTo)
    const apiBase = import.meta.env.VITE_API_URL || ''
    const token = localStorage.getItem('evisa_token_v1') || ''
    fetch(`${apiBase}/admin/orders/export.csv?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.ok ? r.blob() : r.json().then(j => { throw new Error(j.error || 'Export failed') }))
      .then(blob => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `orders-${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
      })
      .catch(err => alert(err.message || 'Export failed'))
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F9FAFB' }}>
      <Seo title="Admin" description="eVisa admin dashboard." path="/admin" noindex />
      <Navbar />

      {/* ── ADMIN HERO ── */}
      <section style={{ background:'linear-gradient(135deg,#0B1D3A 0%,#1a3060 55%,#0d2451 100%)', padding:'40px 20px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, right:-60, width:300, height:300, background:'radial-gradient(circle,rgba(245,166,35,0.20) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, flexWrap:'wrap' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:'var(--gold)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, boxShadow:'0 12px 24px rgba(245,166,35,0.3)' }}>⚙️</div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <h1 style={{ fontFamily:'Fraunces,serif', fontSize:24, fontWeight:900, color:'white' }}>Admin Dashboard</h1>
                <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:50, background:'var(--gold)', color:'var(--navy)' }}>ADMIN</span>
              </div>
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12, marginTop:2 }}>Manage visa orders and process customer applications</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {tab === 'orders' && (
              <button onClick={refresh} title="Reload orders from server"
                style={{ fontSize:12, fontWeight:600, padding:'8px 14px', borderRadius:8, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.8)', cursor:'pointer', fontFamily:'inherit', transition:'background .15s', backdropFilter:'blur(8px)' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              >↻ Refresh</button>
            )}
            <button onClick={logout}
              style={{ fontSize:12, fontWeight:600, padding:'8px 14px', borderRadius:8, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'white', cursor:'pointer', fontFamily:'inherit', transition:'background .15s', backdropFilter:'blur(8px)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
            >Sign out</button>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ maxWidth:1200, margin:'24px auto 0', position:'relative', display:'flex', gap:6, flexWrap:'wrap' }}>
          {[
            { key:'orders',    label:'📋 Orders' },
            { key:'countries', label:'🌍 Countries' },
            { key:'tiers',     label:'💰 Service tiers' },
          ].map(t => {
            const active = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  padding:'10px 18px', fontSize:13, fontWeight:700, borderRadius:10,
                  border: active ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.15)',
                  background: active ? 'var(--gold)' : 'rgba(255,255,255,0.08)',
                  color: active ? 'var(--navy)' : 'white',
                  cursor:'pointer', fontFamily:'inherit', transition:'all .15s', backdropFilter:'blur(8px)',
                }}
              >{t.label}</button>
            )
          })}
        </div>
      </section>

      {tab === 'countries' ? (
        <AdminCountries />
      ) : tab === 'tiers' ? (
        <AdminServiceTiers />
      ) : (
      <>

      {/* ── STATS ── */}
      <section style={{ background:'white', padding:'32px 20px', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14 }}>
          {[
            ['Total orders',     stats.total,      '📋', '#1B4FD8'],
            ['New',              stats.submitted,  '📝', '#6B7280'],
            ['In progress',      stats.inProgress, '⚙️', '#F59E0B'],
            ['Approved',         stats.approved,   '✅', '#16A34A'],
            ['Rejected',         stats.rejected,   '❌', '#DC2626'],
            ['Revenue today',    `$${todayRevenue}`,'💰','#9333EA'],
          ].map(([label, val, icon, color]) => (
            <div key={label} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:12, padding:14 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em' }}>{label}</span>
                <span style={{ fontSize:16 }}>{icon}</span>
              </div>
              <div style={{ fontFamily:'Fraunces,serif', fontSize:24, fontWeight:900, color, lineHeight:1 }}>{val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ORDERS LIST ── */}
      <section style={{ background:'#F9FAFB', padding:'32px 20px 64px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, overflow:'hidden', marginBottom:14 }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <div style={{ position:'relative', flex:'1 1 240px', minWidth:0 }}>
                  <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    style={{ width:'100%', padding:'10px 12px 10px 36px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, outline:'none', fontFamily:'inherit' }}
                    placeholder="Search code, name, email, destination..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => setFiltersOpen(v => !v)}
                  className="admin-filters-toggle"
                  style={{ display:'none', alignItems:'center', gap:6, padding:'10px 12px', borderRadius:8, border:'1px solid #E5E7EB', background: filtersOpen ? 'var(--blue-light)' : 'white', color: filtersOpen ? 'var(--blue)' : '#374151', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', flexShrink:0 }}
                  title="Show filters"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', minWidth:18, height:18, padding:'0 5px', borderRadius:9, background:'var(--blue)', color:'white', fontSize:11, fontWeight:700 }}>{activeFilterCount}</span>
                  )}
                </button>
              </div>

              <div className={`admin-filters-panel ${filtersOpen ? 'open' : ''}`}
                style={{ display:'flex', gap:10, marginTop:10, flexWrap:'wrap', alignItems:'center' }}>
                <select
                  style={{ padding:'10px 14px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, background:'white', fontFamily:'inherit', outline:'none', cursor:'pointer', minWidth:160 }}
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="all">All statuses</option>
                  {Object.entries(ORDER_STATUSES).map(([key, s]) => (
                    <option key={key} value={key}>{s.icon} {s.label}</option>
                  ))}
                </select>
                <input type="date"
                  style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, fontFamily:'inherit', outline:'none' }}
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  title="Created from"
                />
                <input type="date"
                  style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, fontFamily:'inherit', outline:'none' }}
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  title="Created to"
                />
                {(dateFrom || dateTo || statusFilter !== 'all') && (
                  <button onClick={() => { setDateFrom(''); setDateTo(''); setStatusFilter('all') }}
                    style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #E5E7EB', background:'white', fontSize:12, color:'#6B7280', cursor:'pointer', fontFamily:'inherit' }}
                  >Clear all</button>
                )}
                <button onClick={exportCsv}
                  style={{ padding:'10px 14px', borderRadius:8, border:'1px solid var(--blue)', background:'var(--blue)', color:'white', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', marginLeft:'auto' }}
                  title="Download filtered orders as CSV"
                >⬇ Export CSV</button>
              </div>
            </div>

            <div style={{ overflowX:'auto' }}>
              <table className="orders-table" style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                <thead>
                  <tr style={{ background:'#F9FAFB', borderBottom:'1px solid #E5E7EB' }}>
                    {['Order','Customer','Destination','Status','Total','Updated',''].map((h, i) => (
                      <th key={i} style={{ padding:'12px 16px', fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', textAlign: i === 4 ? 'right' : 'left', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map(o => {
                    const status = ORDER_STATUSES[o.status]
                    return (
                      <tr key={o.id} onClick={() => setSelectedId(o.id)}
                        style={{ borderBottom:'1px solid #F3F4F6', cursor:'pointer', transition:'background .15s' }}
                        onMouseEnter={e => e.currentTarget.style.background='#F9FAFB'}
                        onMouseLeave={e => e.currentTarget.style.background='white'}
                      >
                        <td style={{ padding:'14px 16px' }}>
                          <div style={{ fontFamily:'monospace', fontWeight:700, fontSize:12, color:'var(--navy)' }}>{o.id}</div>
                          <div style={{ fontSize:11, color:'#9CA3AF', marginTop:2 }}>{TIER_LABEL[o.processing]} · {o.visaType}</div>
                        </td>
                        <td style={{ padding:'14px 16px' }}>
                          <div style={{ fontWeight:600, fontSize:14, color:'var(--navy)', maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.applicant.fullName}</div>
                          <div style={{ fontSize:11, color:'#6B7280', maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{o.applicant.email}</div>
                        </td>
                        <td style={{ padding:'14px 16px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ fontSize:20 }}>{o.flag}</span>
                            <span style={{ fontWeight:600, fontSize:14, color:'var(--navy)' }}>{o.destination}</span>
                          </div>
                        </td>
                        <td style={{ padding:'14px 16px' }}>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:50, whiteSpace:'nowrap', background:status.bg, color:status.color }}>
                            <span>{status.icon}</span>{status.label}
                          </span>
                        </td>
                        <td style={{ padding:'14px 16px', textAlign:'right', fontWeight:700, color:'var(--blue)' }}>${o.fee.total}</td>
                        <td style={{ padding:'14px 16px', fontSize:12, color:'#6B7280', whiteSpace:'nowrap' }}>{fmtRelative(o.updatedAt)}</td>
                        <td style={{ padding:'14px 16px', textAlign:'right' }}>
                          <svg style={{ color:'#9CA3AF' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 5l7 7-7 7"/>
                          </svg>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign:'center', padding:'48px 20px' }}>
                <div style={{ fontSize:38, opacity:0.5, marginBottom:8 }}>🔍</div>
                <p style={{ fontSize:14, color:'#6B7280' }}>No orders match your filter</p>
              </div>
            )}

            {filtered.length > PAGE_SIZE && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, padding:'14px 18px', borderTop:'1px solid #F3F4F6', flexWrap:'wrap' }}>
                <div style={{ fontSize:12, color:'#6B7280' }}>
                  Showing <strong style={{ color:'var(--navy)' }}>{pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)}</strong> of <strong style={{ color:'var(--navy)' }}>{filtered.length}</strong>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1}
                    style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #E5E7EB', background:'white', fontSize:13, fontWeight:600, color: safePage <= 1 ? '#D1D5DB' : '#374151', cursor: safePage <= 1 ? 'default' : 'pointer', fontFamily:'inherit' }}
                  >← Prev</button>
                  <span style={{ fontSize:12, color:'#6B7280', padding:'0 6px' }}>
                    Page <strong style={{ color:'var(--navy)' }}>{safePage}</strong> / {totalPages}
                  </span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
                    style={{ padding:'8px 12px', borderRadius:8, border:'1px solid #E5E7EB', background:'white', fontSize:13, fontWeight:600, color: safePage >= totalPages ? '#D1D5DB' : '#374151', cursor: safePage >= totalPages ? 'default' : 'pointer', fontFamily:'inherit' }}
                  >Next →</button>
                </div>
              </div>
            )}
          </div>

          <div style={{ fontSize:12, color:'#9CA3AF', textAlign:'center' }}>
            {loading ? 'Loading…' : error ? `Error: ${error}` : `Showing ${paged.length} of ${filtered.length} (filtered) · ${orders.length} total`}
          </div>
        </div>
      </section>
      </>
      )}

      <Footer />
    </div>
  )
}

function AdminAuthGate({ onLogin, userIsCustomer, authError, authLoading }) {
  const DEMO_EMAIL = import.meta.env.VITE_ADMIN_DEMO_EMAIL || 'admin@evisa.com'
  const DEMO_PASSWORD = import.meta.env.VITE_ADMIN_DEMO_PASSWORD || 'admin123'
  const showQuickLogin = !import.meta.env.VITE_DISABLE_DEMO_LOGIN

  const [creds, setCreds] = useState({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(creds).catch(() => { /* surfaced via authError */ })
  }
  const quickLogin = () => {
    setCreds({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
    onLogin({ email: DEMO_EMAIL, password: DEMO_PASSWORD }).catch(() => {})
  }
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'#F9FAFB' }}>
      <Navbar />
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 16px' }}>
        <div style={{ background:'white', borderRadius:20, border:'1px solid #E5E7EB', padding:'36px 32px', maxWidth:440, width:'100%', textAlign:'center', boxShadow:'0 12px 32px rgba(11,29,58,0.06)' }}>
          <div style={{ width:68, height:68, borderRadius:18, margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, background:'var(--gold)' }}>🔒</div>
          <h2 style={{ fontFamily:'Fraunces,serif', fontSize:26, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Admin area</h2>
          <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.65, marginBottom:22 }}>
            {userIsCustomer
              ? 'Your current account doesn’t have admin access. Sign out and sign in with an admin account.'
              : 'This area is for eVisa administrators only. Sign in with an admin account to continue.'}
          </p>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:10, textAlign:'left', marginBottom:14 }}>
            <div>
              <label className="field-label">Admin email</label>
              <input className="field-input" type="email" autoComplete="username"
                value={creds.email} onChange={e => setCreds({ ...creds, email: e.target.value })} />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input className="field-input" type="password" autoComplete="current-password"
                value={creds.password} onChange={e => setCreds({ ...creds, password: e.target.value })} />
            </div>
            {authError && (
              <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#991B1B' }}>{authError}</div>
            )}
            <button type="submit" className="btn-primary" disabled={authLoading} style={{ width:'100%', justifyContent:'center', background:'var(--gold)', color:'var(--navy)' }}>
              {authLoading ? 'Signing in…' : '🔑 Sign in as Admin'}
            </button>
          </form>
          {showQuickLogin && (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:10, margin:'14px 0' }}>
                <div style={{ flex:1, height:1, background:'#E5E7EB' }} />
                <span style={{ fontSize:11, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'.06em' }}>or</span>
                <div style={{ flex:1, height:1, background:'#E5E7EB' }} />
              </div>
              <button
                type="button"
                onClick={quickLogin}
                disabled={authLoading}
                style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:'1px dashed var(--blue)', background:'var(--blue-light)', color:'var(--blue)', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}
              >
                ⚡ One-click test login (demo admin)
              </button>
              <p style={{ fontSize:11, color:'#9CA3AF', marginTop:10 }}>
                Demo: <code>{DEMO_EMAIL}</code> · Password set via <code>ADMIN_PASSWORD</code> env on the server.
              </p>
            </>
          )}
          <Link to="/" style={{ fontSize:13, fontWeight:600, color:'var(--blue)', textDecoration:'none', display:'inline-block', marginTop:12 }}>← Back to home</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

const NEXT_ACTIONS = {
  submitted: [
    { to:'review',   label:'Start review',          icon:'🔍', accent:'#1B4FD8' },
    { to:'rejected', label:'Reject order',          icon:'❌', accent:'#DC2626' },
  ],
  review: [
    { to:'sent',     label:'Sent to authority',     icon:'📤', accent:'#9333EA' },
    { to:'rejected', label:'Reject order',          icon:'❌', accent:'#DC2626' },
  ],
  sent: [
    { to:'approved', label:'Mark as approved',      icon:'✅', accent:'#16A34A' },
    { to:'rejected', label:'Reject order',          icon:'❌', accent:'#DC2626' },
  ],
  approved: [
    { to:'delivered',label:'Email visa to customer', icon:'📧', accent:'#059669' },
  ],
  delivered: [],
  rejected: [],
}

function AdminOrderDetail({ order, onBack, onUpdateStatus }) {
  const { refresh } = useOrders()
  const [note, setNote] = useState('')
  const [confirmAction, setConfirmAction] = useState(null)
  const [showNotify, setShowNotify] = useState(false)
  const [notifyForm, setNotifyForm] = useState({ subject: '', message: '' })
  const [notifyState, setNotifyState] = useState({ loading: false, sent: false, error: null })
  const status = ORDER_STATUSES[order.status]
  const actions = NEXT_ACTIONS[order.status] || []
  const visaDoc = (order.documents || []).find(d => d.kind === 'visa_result')

  const handleConfirm = async () => {
    if (!confirmAction) return
    await onUpdateStatus(confirmAction.to, note.trim())
    setNote('')
    setConfirmAction(null)
  }

  const sendNotify = async () => {
    if (!notifyForm.subject.trim() || !notifyForm.message.trim()) return
    setNotifyState({ loading: true, sent: false, error: null })
    try {
      const { data } = await api.post('/admin/notify', {
        orderId: order.id,
        subject: notifyForm.subject.trim(),
        message: notifyForm.message.trim(),
      })
      setNotifyState({ loading: false, sent: true, error: data.skipped ? 'Email logged (SMTP not configured)' : null })
      setNotifyForm({ subject: '', message: '' })
    } catch (err) {
      setNotifyState({ loading: false, sent: false, error: apiError(err, 'Failed to send') })
    }
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F9FAFB' }}>
      <Navbar />

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 20px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, gap:10, flexWrap:'wrap' }}>
          <button onClick={onBack}
            style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'var(--blue)', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration='underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration='none'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 19l-7-7 7-7"/>
            </svg>
            Back to list
          </button>
          <button onClick={() => { setShowNotify(true); setNotifyState({ loading:false, sent:false, error:null }) }}
            style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, fontWeight:700, padding:'8px 14px', borderRadius:8, border:'1px solid var(--blue)', background:'white', color:'var(--blue)', cursor:'pointer', fontFamily:'inherit' }}
          >✉ Send message to customer</button>
        </div>

        <div style={{ background:'white', borderRadius:16, border:'1px solid #E5E7EB', overflow:'hidden', marginBottom:18 }}>
          <div style={{ position:'relative', overflow:'hidden', padding:'28px 32px', background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 100%)' }}>
            <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, background:'radial-gradient(circle,rgba(245,166,35,0.15) 0%,transparent 70%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', display:'flex', alignItems:'flex-start', gap:18, flexWrap:'wrap' }}>
              <div style={{ fontSize:54, lineHeight:1 }}>{order.flag}</div>
              <div style={{ flex:1, minWidth:240 }}>
                <h1 style={{ fontFamily:'Fraunces,serif', fontSize:30, fontWeight:900, color:'white', lineHeight:1.1 }}>{order.destination}</h1>
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
                <div style={{ color:'rgba(255,255,255,0.6)', fontSize:11, textTransform:'uppercase', letterSpacing:'.06em' }}>Total revenue</div>
                <div style={{ fontFamily:'Fraunces,serif', fontSize:28, fontWeight:900, color:'white' }}>${order.fee.total}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-detail-grid r-grid-2col" style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:18 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:18, minWidth:0 }}>
            <Section title="👤 Applicant information">
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14, paddingBottom:14, borderBottom:'1px solid #F3F4F6' }}>
                {order.applicant.photoURL && (
                  <img src={order.applicant.photoURL} alt="" style={{ width:54, height:54, borderRadius:12, objectFit:'cover' }} />
                )}
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:'var(--navy)' }}>{order.applicant.fullName}</div>
                  <div style={{ fontSize:12, color:'#6B7280' }}>{order.applicant.email} · {order.applicant.phone}</div>
                </div>
              </div>
              <InfoGrid items={[
                ['Date of birth', fmtDate(order.applicant.dob)],
                ['Gender',        order.applicant.gender],
                ['Nationality',   order.applicant.nationality],
                ['Place of birth',order.applicant.birthPlace],
              ]} />
            </Section>

            <Section title="📘 Passport">
              <InfoGrid items={[
                ['Passport number',  order.passport.no],
                ['Type',             order.passport.type],
                ['Issue date',       fmtDate(order.passport.issueDate)],
                ['Expiry date',      fmtDate(order.passport.expiryDate)],
                ['Place of issue',   order.passport.issuePlace],
                ['Issuing country',  order.passport.issueCountry],
              ]} />
            </Section>

            <Section title="✈️ Trip">
              <InfoGrid items={[
                ['Purpose',          order.trip.purpose],
                ['Entry date',       fmtDate(order.trip.entryDate)],
                ['Exit date',        fmtDate(order.trip.exitDate)],
                ['Accommodation',    order.trip.accommodation || '—'],
              ]} />
              {order.trip.notes && (
                <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid #F3F4F6' }}>
                  <InfoRow label="Customer notes" value={order.trip.notes} />
                </div>
              )}
            </Section>

            <Section title="💳 Payment">
              <div style={{ display:'flex', flexDirection:'column', gap:8, fontSize:14 }}>
                <Row label="Government fee" val={`$${order.fee.gov}.00`} />
                <Row label={`Service fee (${TIER_LABEL[order.processing]})`} val={`$${order.fee.service}.00`} />
                <div style={{ borderTop:'1px solid #F3F4F6', paddingTop:10, display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontWeight:700, color:'var(--navy)' }}>Total paid</span>
                  <span style={{ fontFamily:'Fraunces,serif', fontSize:18, fontWeight:900, color:'var(--blue)' }}>${order.fee.total}.00</span>
                </div>
                <div style={{ fontSize:12, color:'#6B7280', paddingTop:10, borderTop:'1px solid #F3F4F6', display:'flex', justifyContent:'space-between' }}>
                  <span>{order.payment.method === 'card' ? '💳 Credit card' : '📱 Digital wallet'}</span>
                  <span>{fmtDateTime(order.payment.paidAt)}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:12, color:'#6B7280' }}>Status:</span>
                  <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:50, background: order.payment.status === 'paid' ? '#F0FDF4' : '#FEF2F2', color: order.payment.status === 'paid' ? '#16A34A' : '#DC2626' }}>
                    {order.payment.status === 'paid' ? '✓ Paid' : order.payment.status === 'refunded' ? '↩️ Refunded' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </Section>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:18, minWidth:0 }}>
            <div style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:18, position:'sticky', top:80 }}>
              <h3 style={{ fontWeight:700, fontSize:15, color:'var(--navy)', marginBottom:14 }}>⚡ Update status</h3>
              {actions.length > 0 ? (
                <>
                  {!confirmAction && (
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {actions.map(a => (
                        <button key={a.to} onClick={() => setConfirmAction(a)}
                          style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, padding:'12px 14px', borderRadius:8, fontSize:13, fontWeight:700, border:`2px solid ${a.accent}`, color:a.accent, background:'white', cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}
                          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.background=`${a.accent}11` }}
                          onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.background='white' }}
                        >
                          <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span>{a.icon}</span>{a.label}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 5l7 7-7 7"/>
                          </svg>
                        </button>
                      ))}
                    </div>
                  )}

                  {confirmAction && (
                    <div className="fade-up">
                      <div style={{ borderRadius:8, padding:12, marginBottom:12, background:`${confirmAction.accent}11`, border:`1px solid ${confirmAction.accent}33` }}>
                        <div style={{ fontWeight:700, fontSize:13, display:'flex', alignItems:'center', gap:6, color:confirmAction.accent }}>
                          <span>{confirmAction.icon}</span>{confirmAction.label}
                        </div>
                        <p style={{ fontSize:11, color:'#6B7280', marginTop:4 }}>The customer will receive an email notification and see the update on their dashboard.</p>
                      </div>
                      <label style={{ fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', display:'block', marginBottom:6 }}>Internal note (sent to customer)</label>
                      <textarea
                        rows={3}
                        className="field-input"
                        placeholder={confirmAction.to === 'rejected' ? 'Rejection reason — sent to customer' : 'Optional — additional notes about this update'}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                      />
                      <div style={{ display:'flex', gap:8, marginTop:12 }}>
                        <button onClick={() => { setConfirmAction(null); setNote('') }} className="btn-secondary" style={{ flex:1, justifyContent:'center' }}>Cancel</button>
                        <button onClick={handleConfirm}
                          style={{ flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px 14px', borderRadius:8, fontSize:13, fontWeight:700, color:'white', background:confirmAction.accent, border:'none', cursor:'pointer', fontFamily:'inherit', transition:'opacity .15s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity='.88'}
                          onMouseLeave={e => e.currentTarget.style.opacity='1'}
                        >
                          Confirm
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12l5 5L20 7"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ borderRadius:8, padding:12, fontSize:12, background:status.bg, color:status.color }}>
                  <div style={{ fontWeight:700, marginBottom:2 }}>{status.icon} {status.label}</div>
                  <div style={{ opacity:0.8 }}>Order is in its final state — no further actions needed.</div>
                </div>
              )}
            </div>

            <div style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:18 }}>
              <h3 style={{ fontWeight:700, fontSize:15, color:'var(--navy)', marginBottom:16 }}>📍 History</h3>
              <div>
                {[...order.timeline].reverse().map((event, i) => {
                  const stage = ORDER_STATUSES[event.stage]
                  return (
                    <div key={i} style={{ display:'flex', gap:12 }}>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                        <div style={{ width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, background:stage.bg, color:stage.color }}>
                          {stage.icon}
                        </div>
                        {i < order.timeline.length - 1 && <div style={{ width:2, flex:1, marginTop:4, marginBottom:4, minHeight:24, background:'#E5E7EB' }} />}
                      </div>
                      <div style={{ flex:1, paddingBottom:14 }}>
                        <div style={{ fontWeight:700, fontSize:13, color:'var(--navy)' }}>{stage.label}</div>
                        <div style={{ fontSize:11, color:'#9CA3AF', marginTop:2 }}>{fmtDateTime(event.at)}</div>
                        {event.note && <div style={{ fontSize:12, color:'#6B7280', marginTop:4, lineHeight:1.6 }}>{event.note}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <AdminDocsPanel order={order} onUploaded={refresh} visaDoc={visaDoc} />

            <div style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:18 }}>
              <h3 style={{ fontWeight:700, fontSize:14, color:'var(--navy)', marginBottom:12 }}>📨 Contact customer</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <a href={`mailto:${order.applicant.email}`} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--blue)', textDecoration:'none' }}>
                  📧 {order.applicant.email}
                </a>
                <a href={`tel:${order.applicant.phone}`} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'var(--blue)', textDecoration:'none' }}>
                  📞 {order.applicant.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.admin-detail-grid{grid-template-columns:1fr!important}}`}</style>

      {showNotify && (
        <div onClick={() => !notifyState.loading && setShowNotify(false)}
          style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(11,29,58,0.5)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}
        >
          <div onClick={e => e.stopPropagation()}
            style={{ background:'white', borderRadius:16, maxWidth:520, width:'100%', boxShadow:'0 24px 64px rgba(0,0,0,0.25)', overflow:'hidden' }}
          >
            <div style={{ padding:'18px 22px', borderBottom:'1px solid #F3F4F6', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <h3 style={{ fontWeight:700, fontSize:16, color:'var(--navy)' }}>Send message to customer</h3>
                <p style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>To: {order.applicant?.email || '—'}</p>
              </div>
              <button onClick={() => !notifyState.loading && setShowNotify(false)}
                style={{ width:30, height:30, borderRadius:'50%', background:'transparent', border:'none', cursor:'pointer', color:'#9CA3AF', fontSize:20 }}
              >×</button>
            </div>
            <div style={{ padding:'20px 22px' }}>
              {notifyState.sent ? (
                <div style={{ textAlign:'center', padding:'8px 0' }}>
                  <div style={{ fontSize:36, marginBottom:8 }}>✓</div>
                  <div style={{ fontWeight:700, color:'var(--navy)', marginBottom:4 }}>Message sent</div>
                  {notifyState.error && <div style={{ fontSize:12, color:'#92400E', marginTop:6 }}>{notifyState.error}</div>}
                  <button onClick={() => setShowNotify(false)} className="btn-secondary" style={{ marginTop:14 }}>Close</button>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom:14 }}>
                    <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#6B7280', marginBottom:6 }}>Subject</label>
                    <input
                      style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:14, fontFamily:'inherit', outline:'none' }}
                      value={notifyForm.subject}
                      onChange={e => setNotifyForm(p => ({ ...p, subject: e.target.value }))}
                      placeholder={`Update on your ${order.destination} application`}
                      maxLength={200}
                    />
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#6B7280', marginBottom:6 }}>Message</label>
                    <textarea
                      style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:14, fontFamily:'inherit', outline:'none', resize:'vertical' }}
                      rows={6}
                      value={notifyForm.message}
                      onChange={e => setNotifyForm(p => ({ ...p, message: e.target.value }))}
                      maxLength={5000}
                      placeholder="Hi…"
                    />
                  </div>
                  {notifyState.error && (
                    <div style={{ fontSize:12, color:'#991B1B', background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'8px 12px', marginBottom:12 }}>
                      {notifyState.error}
                    </div>
                  )}
                  <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                    <button onClick={() => setShowNotify(false)} disabled={notifyState.loading} className="btn-secondary">Cancel</button>
                    <button onClick={sendNotify} disabled={notifyState.loading || !notifyForm.subject.trim() || !notifyForm.message.trim()} className="btn-primary">
                      {notifyState.loading ? 'Sending…' : 'Send'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'12px 24px' }}>
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
    <div style={{ display:'flex', justifyContent:'space-between' }}>
      <span style={{ color:'#6B7280' }}>{label}</span>
      <span style={{ fontWeight:600, color:'var(--navy)' }}>{val}</span>
    </div>
  )
}

function AdminDocsPanel({ order, onUploaded, visaDoc }) {
  const fileRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const canUpload = ['approved', 'delivered'].includes(order.status)

  const handleFile = async (file) => {
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('kind', 'visa_result')
      await api.post(`/orders/${order.id}/documents`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      await onUploaded()
    } catch (err) {
      setError(apiError(err, 'Upload failed'))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:18 }}>
      <h3 style={{ fontWeight:700, fontSize:14, color:'var(--navy)', marginBottom:12 }}>📎 Visa document</h3>

      {visaDoc ? (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#F0FDF4', border:'1px solid #BBF7D0', borderRadius:8 }}>
            <span style={{ fontSize:20 }}>📄</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--navy)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{visaDoc.filename}</div>
              <div style={{ fontSize:11, color:'#6B7280' }}>{(visaDoc.size / 1024).toFixed(1)} KB · {fmtDateTime(visaDoc.createdAt)}</div>
            </div>
            <a href={visaDoc.url} target="_blank" rel="noreferrer" style={{ fontSize:12, fontWeight:700, color:'var(--blue)', textDecoration:'none' }}>Open ↗</a>
          </div>
          {canUpload && (
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              style={{ fontSize:12, fontWeight:600, padding:'8px 12px', borderRadius:8, border:'1px solid #E5E7EB', background:'white', cursor:'pointer', fontFamily:'inherit', color:'#374151' }}>
              {uploading ? 'Uploading…' : 'Replace file'}
            </button>
          )}
        </div>
      ) : canUpload ? (
        <div>
          <p style={{ fontSize:12, color:'#6B7280', marginBottom:10, lineHeight:1.5 }}>
            Upload the approved visa PDF — customer will be able to download it after status moves to <strong>delivered</strong>.
          </p>
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary" style={{ width:'100%', justifyContent:'center', background:'var(--gold)', color:'var(--navy)' }}>
            {uploading ? 'Uploading…' : '📤 Upload visa PDF'}
          </button>
        </div>
      ) : (
        <p style={{ fontSize:12, color:'#9CA3AF', lineHeight:1.5 }}>
          Available once the order is approved. Current status: <strong>{ORDER_STATUSES[order.status]?.label}</strong>.
        </p>
      )}

      <input ref={fileRef} type="file" accept="application/pdf,image/png,image/jpeg" style={{ display:'none' }}
        onChange={e => handleFile(e.target.files?.[0])} />

      {error && (
        <div style={{ marginTop:10, background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'8px 12px', fontSize:12, color:'#991B1B' }}>{error}</div>
      )}
    </div>
  )
}
