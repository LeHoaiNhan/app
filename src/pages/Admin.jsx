import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { useOrders, ORDER_STATUSES, STAGE_FLOW } from '../contexts/OrdersContext'

const TIER_LABEL = { normal:'Standard', fast:'Fast', express:'Express' }

const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' })
}
const fmtDateTime = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
}
const fmtRelative = (iso) => {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} giờ trước`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days} ngày trước`
  return fmtDate(iso)
}

export default function Admin() {
  const { user, loginAsAdmin, logout } = useAuth()
  const { orders, updateStatus, resetOrders } = useOrders()
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  if (!user || user.role !== 'admin') {
    return <AdminAuthGate onLogin={loginAsAdmin} userIsCustomer={!!user} />
  }

  const selected = selectedId ? orders.find(o => o.id === selectedId) : null
  if (selected) {
    return (
      <AdminOrderDetail
        order={selected}
        onBack={() => setSelectedId(null)}
        onUpdateStatus={(status, note) => updateStatus(selected.id, status, note)}
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
  const filtered = orders.filter(o => {
    const matchSearch = !term ||
      o.id.toLowerCase().includes(term) ||
      o.applicant.fullName.toLowerCase().includes(term) ||
      o.applicant.email.toLowerCase().includes(term) ||
      o.destination.toLowerCase().includes(term)
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div style={{ minHeight:'100vh', background:'#F9FAFB' }}>
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
              <p style={{ color:'rgba(255,255,255,0.6)', fontSize:12, marginTop:2 }}>Quản lý đơn visa và xử lý hồ sơ khách hàng</p>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={resetOrders} title="Reset về dữ liệu mẫu (dev)"
              style={{ fontSize:12, fontWeight:600, padding:'8px 14px', borderRadius:8, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.8)', cursor:'pointer', fontFamily:'inherit', transition:'background .15s', backdropFilter:'blur(8px)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
            >↻ Reset demo</button>
            <button onClick={logout}
              style={{ fontSize:12, fontWeight:600, padding:'8px 14px', borderRadius:8, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'white', cursor:'pointer', fontFamily:'inherit', transition:'background .15s', backdropFilter:'blur(8px)' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
            >Đăng xuất</button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:'white', padding:'32px 20px', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:14 }}>
          {[
            ['Tổng đơn',          stats.total,      '📋', '#1B4FD8'],
            ['Mới',               stats.submitted,  '📝', '#6B7280'],
            ['Đang xử lý',        stats.inProgress, '⚙️', '#F59E0B'],
            ['Đã duyệt',          stats.approved,   '✅', '#16A34A'],
            ['Từ chối',           stats.rejected,   '❌', '#DC2626'],
            ['Doanh thu hôm nay', `$${todayRevenue}`,'💰','#9333EA'],
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
            <div style={{ padding:'14px 18px', borderBottom:'1px solid #F3F4F6', display:'flex', gap:10, flexWrap:'wrap' }}>
              <div style={{ position:'relative', flex:'1 1 240px' }}>
                <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  style={{ width:'100%', padding:'10px 12px 10px 36px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, outline:'none', fontFamily:'inherit' }}
                  placeholder="Tìm theo mã đơn, tên khách, email, điểm đến..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                style={{ padding:'10px 14px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, background:'white', fontFamily:'inherit', outline:'none', cursor:'pointer', minWidth:180 }}
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                {Object.entries(ORDER_STATUSES).map(([key, s]) => (
                  <option key={key} value={key}>{s.icon} {s.label}</option>
                ))}
              </select>
            </div>

            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                <thead>
                  <tr style={{ background:'#F9FAFB', borderBottom:'1px solid #E5E7EB' }}>
                    {['Đơn','Khách hàng','Điểm đến','Trạng thái','Tổng','Cập nhật',''].map((h, i) => (
                      <th key={i} style={{ padding:'12px 16px', fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', textAlign: i === 4 ? 'right' : 'left', whiteSpace:'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o => {
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
                <p style={{ fontSize:14, color:'#6B7280' }}>Không có đơn phù hợp với bộ lọc</p>
              </div>
            )}
          </div>

          <div style={{ fontSize:12, color:'#9CA3AF', textAlign:'center' }}>
            Hiển thị {filtered.length} / {orders.length} đơn — dữ liệu lưu local trong trình duyệt
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function AdminAuthGate({ onLogin, userIsCustomer }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'#F9FAFB' }}>
      <Navbar />
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 16px' }}>
        <div style={{ background:'white', borderRadius:20, border:'1px solid #E5E7EB', padding:'36px 32px', maxWidth:440, width:'100%', textAlign:'center', boxShadow:'0 12px 32px rgba(11,29,58,0.06)' }}>
          <div style={{ width:68, height:68, borderRadius:18, margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, background:'var(--gold)' }}>🔒</div>
          <h2 style={{ fontFamily:'Fraunces,serif', fontSize:26, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Khu vực quản trị</h2>
          <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.65, marginBottom:22 }}>
            {userIsCustomer
              ? 'Tài khoản hiện tại không có quyền truy cập. Đăng xuất rồi đăng nhập với tài khoản admin.'
              : 'Khu vực này chỉ dành cho quản trị viên eVisa. Đăng nhập bằng tài khoản admin để tiếp tục.'}
          </p>
          <button onClick={onLogin} className="btn-primary" style={{ width:'100%', justifyContent:'center', background:'var(--gold)', color:'var(--navy)', marginBottom:12 }}>
            🔑 Đăng nhập như Admin (demo)
          </button>
          <p style={{ fontSize:11, color:'#9CA3AF', marginBottom:12 }}>Phase 1: auth giả lập — Phase 2 sẽ thay bằng auth thật</p>
          <Link to="/" style={{ fontSize:13, fontWeight:600, color:'var(--blue)', textDecoration:'none' }}>← Về trang chủ</Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}

const NEXT_ACTIONS = {
  submitted: [
    { to:'review',   label:'Bắt đầu kiểm tra',   icon:'🔍', accent:'#1B4FD8' },
    { to:'rejected', label:'Từ chối đơn',         icon:'❌', accent:'#DC2626' },
  ],
  review: [
    { to:'sent',     label:'Đã gửi cơ quan cấp', icon:'📤', accent:'#9333EA' },
    { to:'rejected', label:'Từ chối đơn',         icon:'❌', accent:'#DC2626' },
  ],
  sent: [
    { to:'approved', label:'Đánh dấu chấp thuận', icon:'✅', accent:'#16A34A' },
    { to:'rejected', label:'Từ chối đơn',         icon:'❌', accent:'#DC2626' },
  ],
  approved: [
    { to:'delivered',label:'Gửi email visa cho khách', icon:'📧', accent:'#059669' },
  ],
  delivered: [],
  rejected: [],
}

function AdminOrderDetail({ order, onBack, onUpdateStatus }) {
  const [note, setNote] = useState('')
  const [confirmAction, setConfirmAction] = useState(null)
  const status = ORDER_STATUSES[order.status]
  const actions = NEXT_ACTIONS[order.status] || []

  const handleConfirm = () => {
    if (!confirmAction) return
    onUpdateStatus(confirmAction.to, note.trim())
    setNote('')
    setConfirmAction(null)
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F9FAFB' }}>
      <Navbar />

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 20px' }}>
        <button onClick={onBack}
          style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, fontWeight:600, color:'var(--blue)', marginBottom:18, background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit' }}
          onMouseEnter={e => e.currentTarget.style.textDecoration='underline'}
          onMouseLeave={e => e.currentTarget.style.textDecoration='none'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
          Quay lại danh sách
        </button>

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
                <div style={{ color:'rgba(255,255,255,0.6)', fontSize:11, textTransform:'uppercase', letterSpacing:'.06em' }}>Tổng thu</div>
                <div style={{ fontFamily:'Fraunces,serif', fontSize:28, fontWeight:900, color:'white' }}>${order.fee.total}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:18 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:18, minWidth:0 }}>
            <Section title="👤 Thông tin người nộp đơn">
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
                ['Ngày sinh',  fmtDate(order.applicant.dob)],
                ['Giới tính',  order.applicant.gender],
                ['Quốc tịch',  order.applicant.nationality],
                ['Nơi sinh',   order.applicant.birthPlace],
              ]} />
            </Section>

            <Section title="📘 Hộ chiếu">
              <InfoGrid items={[
                ['Số hộ chiếu',   order.passport.no],
                ['Loại',          order.passport.type],
                ['Ngày cấp',      fmtDate(order.passport.issueDate)],
                ['Ngày hết hạn',  fmtDate(order.passport.expiryDate)],
                ['Nơi cấp',       order.passport.issuePlace],
                ['Quốc gia cấp',  order.passport.issueCountry],
              ]} />
            </Section>

            <Section title="✈️ Chuyến đi">
              <InfoGrid items={[
                ['Mục đích',         order.trip.purpose],
                ['Ngày nhập cảnh',   fmtDate(order.trip.entryDate)],
                ['Ngày xuất cảnh',   fmtDate(order.trip.exitDate)],
                ['Nơi lưu trú',      order.trip.accommodation || '—'],
              ]} />
              {order.trip.notes && (
                <div style={{ marginTop:14, paddingTop:14, borderTop:'1px solid #F3F4F6' }}>
                  <InfoRow label="Ghi chú khách" value={order.trip.notes} />
                </div>
              )}
            </Section>

            <Section title="💳 Thanh toán">
              <div style={{ display:'flex', flexDirection:'column', gap:8, fontSize:14 }}>
                <Row label="Phí chính phủ" val={`$${order.fee.gov}.00`} />
                <Row label={`Phí dịch vụ (${TIER_LABEL[order.processing]})`} val={`$${order.fee.service}.00`} />
                <div style={{ borderTop:'1px solid #F3F4F6', paddingTop:10, display:'flex', justifyContent:'space-between' }}>
                  <span style={{ fontWeight:700, color:'var(--navy)' }}>Tổng đã thanh toán</span>
                  <span style={{ fontFamily:'Fraunces,serif', fontSize:18, fontWeight:900, color:'var(--blue)' }}>${order.fee.total}.00</span>
                </div>
                <div style={{ fontSize:12, color:'#6B7280', paddingTop:10, borderTop:'1px solid #F3F4F6', display:'flex', justifyContent:'space-between' }}>
                  <span>{order.payment.method === 'card' ? '💳 Thẻ tín dụng' : '📱 Ví điện tử'}</span>
                  <span>{fmtDateTime(order.payment.paidAt)}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:12, color:'#6B7280' }}>Trạng thái:</span>
                  <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:50, background: order.payment.status === 'paid' ? '#F0FDF4' : '#FEF2F2', color: order.payment.status === 'paid' ? '#16A34A' : '#DC2626' }}>
                    {order.payment.status === 'paid' ? '✓ Paid' : order.payment.status === 'refunded' ? '↩️ Refunded' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </Section>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:18, minWidth:0 }}>
            <div style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:18, position:'sticky', top:80 }}>
              <h3 style={{ fontWeight:700, fontSize:15, color:'var(--navy)', marginBottom:14 }}>⚡ Cập nhật trạng thái</h3>
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
                        <p style={{ fontSize:11, color:'#6B7280', marginTop:4 }}>Khách sẽ được thông báo qua email và thấy update trên dashboard.</p>
                      </div>
                      <label style={{ fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', display:'block', marginBottom:6 }}>Ghi chú nội bộ (gửi cho khách)</label>
                      <textarea
                        rows={3}
                        className="field-input"
                        placeholder={confirmAction.to === 'rejected' ? 'Lý do từ chối — sẽ gửi cho khách' : 'Tùy chọn — ghi chú thêm về update này'}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                      />
                      <div style={{ display:'flex', gap:8, marginTop:12 }}>
                        <button onClick={() => { setConfirmAction(null); setNote('') }} className="btn-secondary" style={{ flex:1, justifyContent:'center' }}>Hủy</button>
                        <button onClick={handleConfirm}
                          style={{ flex:1, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px 14px', borderRadius:8, fontSize:13, fontWeight:700, color:'white', background:confirmAction.accent, border:'none', cursor:'pointer', fontFamily:'inherit', transition:'opacity .15s' }}
                          onMouseEnter={e => e.currentTarget.style.opacity='.88'}
                          onMouseLeave={e => e.currentTarget.style.opacity='1'}
                        >
                          Xác nhận
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
                  <div style={{ opacity:0.8 }}>Đơn ở trạng thái cuối — không còn hành động cần thực hiện.</div>
                </div>
              )}
            </div>

            <div style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:18 }}>
              <h3 style={{ fontWeight:700, fontSize:15, color:'var(--navy)', marginBottom:16 }}>📍 Lịch sử</h3>
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

            <div style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:18 }}>
              <h3 style={{ fontWeight:700, fontSize:14, color:'var(--navy)', marginBottom:12 }}>📨 Liên hệ khách</h3>
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
