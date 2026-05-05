import { useState, useMemo } from 'react'
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

  // Stats
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

  // Filter
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
    <div className="min-h-screen" style={{ background:'#F9FAFB' }}>
      <Navbar />

      {/* Admin header */}
      <section className="relative overflow-hidden" style={{ background:'linear-gradient(135deg,#0B1D3A 0%,#1a3060 100%)' }}>
        <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(245,166,35,0.20) 0%,transparent 70%)' }} />
        <div className="relative max-w-6xl mx-auto px-5 py-8 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg" style={{ background:'var(--gold)' }}>⚙️</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white" style={{ fontFamily:'Fraunces,serif' }}>Admin Dashboard</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:'var(--gold)', color:'var(--navy)' }}>ADMIN</span>
              </div>
              <p className="text-white/60 text-xs">Quản lý đơn visa và xử lý hồ sơ khách hàng</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={resetOrders} title="Reset về dữ liệu mẫu (dev)" className="text-xs font-semibold px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 hover:bg-white/20 transition-all">
              ↻ Reset demo
            </button>
            <button onClick={logout} className="text-xs font-semibold px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 text-white hover:bg-white/20 transition-all">
              Đăng xuất
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 mb-6">
          {[
            ['Tổng đơn',     stats.total,      '📋', '#1B4FD8'],
            ['Mới',          stats.submitted,  '📝', '#6B7280'],
            ['Đang xử lý',   stats.inProgress, '⚙️', '#F59E0B'],
            ['Đã duyệt',     stats.approved,   '✅', '#16A34A'],
            ['Từ chối',      stats.rejected,   '❌', '#DC2626'],
            ['Doanh thu hôm nay', `$${todayRevenue}`, '💰', '#9333EA'],
          ].map(([label, val, icon, color]) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-3 md:p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 truncate">{label}</span>
                <span className="text-base flex-shrink-0">{icon}</span>
              </div>
              <div className="text-xl md:text-2xl font-black" style={{ color }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-5">
          <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                className="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                placeholder="Tìm theo mã đơn, tên khách, email, điểm đến..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2.5 rounded-lg text-sm border border-gray-200 outline-none focus:border-blue-500 transition-all bg-white min-w-[180px]"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              {Object.entries(ORDER_STATUSES).map(([key, s]) => (
                <option key={key} value={key}>{s.icon} {s.label}</option>
              ))}
            </select>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200" style={{ background:'#F9FAFB' }}>
                  <th className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Đơn</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Khách hàng</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Điểm đến</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Trạng thái</th>
                  <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Tổng</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Cập nhật</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const status = ORDER_STATUSES[o.status]
                  return (
                    <tr key={o.id} onClick={() => setSelectedId(o.id)} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="font-mono font-bold text-xs" style={{ color:'var(--navy)' }}>{o.id}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{TIER_LABEL[o.processing]} · {o.visaType}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-sm truncate max-w-[180px]" style={{ color:'var(--navy)' }}>{o.applicant.fullName}</div>
                        <div className="text-[11px] text-gray-500 truncate max-w-[180px]">{o.applicant.email}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{o.flag}</span>
                          <span className="text-sm font-semibold" style={{ color:'var(--navy)' }}>{o.destination}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ background:status.bg, color:status.color }}>
                          <span>{status.icon}</span>{status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold" style={{ color:'var(--blue)' }}>${o.fee.total}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{fmtRelative(o.updatedAt)}</td>
                      <td className="px-4 py-3.5 text-right">
                        <svg className="text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M9 5l7 7-7 7"/>
                        </svg>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {filtered.map(o => {
              const status = ORDER_STATUSES[o.status]
              return (
                <button key={o.id} onClick={() => setSelectedId(o.id)} className="w-full px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0">{o.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-mono font-bold text-xs" style={{ color:'var(--navy)' }}>{o.id}</span>
                        <span className="font-bold text-sm" style={{ color:'var(--blue)' }}>${o.fee.total}</span>
                      </div>
                      <div className="font-semibold text-sm truncate" style={{ color:'var(--navy)' }}>{o.applicant.fullName} → {o.destination}</div>
                      <div className="text-[11px] text-gray-500 truncate mb-2">{o.applicant.email}</div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:status.bg, color:status.color }}>
                          {status.icon} {status.label}
                        </span>
                        <span className="text-[10px] text-gray-400">{fmtRelative(o.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-2 opacity-50">🔍</div>
              <p className="text-sm text-gray-500">Không có đơn phù hợp với bộ lọc</p>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-400 text-center">
          Hiển thị {filtered.length} / {orders.length} đơn — dữ liệu lưu local trong trình duyệt
        </div>
      </div>

      <Footer />
    </div>
  )
}

function AdminAuthGate({ onLogin, userIsCustomer }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background:'#F9FAFB' }}>
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-3xl" style={{ background:'var(--gold)' }}>🔒</div>
          <h2 className="text-2xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            Khu vực quản trị
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            {userIsCustomer
              ? 'Tài khoản hiện tại không có quyền truy cập. Đăng xuất rồi đăng nhập với tài khoản admin.'
              : 'Khu vực này chỉ dành cho quản trị viên eVisa. Đăng nhập bằng tài khoản admin để tiếp tục.'}
          </p>
          <button onClick={onLogin} className="btn-primary justify-center w-full mb-3" style={{ background:'var(--gold)', color:'var(--navy)' }}>
            🔑 Đăng nhập như Admin (demo)
          </button>
          <p className="text-[11px] text-gray-400 mb-3">Phase 1: auth giả lập — Phase 2 sẽ thay bằng auth thật</p>
          <Link to="/" className="text-sm font-semibold" style={{ color:'var(--blue)' }}>
            ← Về trang chủ
          </Link>
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
  const [confirmAction, setConfirmAction] = useState(null) // { to, label }
  const status = ORDER_STATUSES[order.status]
  const currentIdx = STAGE_FLOW.indexOf(order.status)
  const isRejected = order.status === 'rejected'
  const actions = NEXT_ACTIONS[order.status] || []

  const handleConfirm = () => {
    if (!confirmAction) return
    onUpdateStatus(confirmAction.to, note.trim())
    setNote('')
    setConfirmAction(null)
  }

  return (
    <div className="min-h-screen" style={{ background:'#F9FAFB' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-5 py-8">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold mb-5 hover:underline" style={{ color:'var(--blue)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
          Quay lại danh sách
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-5">
          <div className="px-6 py-6 md:px-8 relative overflow-hidden" style={{ background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 100%)' }}>
            <div className="relative flex items-start gap-4">
              <div className="text-5xl md:text-6xl">{order.flag}</div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight" style={{ fontFamily:'Fraunces,serif' }}>{order.destination}</h1>
                <div className="font-mono text-sm text-white/60 mt-1">{order.id}</div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background:status.bg, color:status.color }}>
                    {status.icon} {status.label}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white/90 bg-white/15">{order.visaType}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white/90 bg-white/15">{TIER_LABEL[order.processing]}</span>
                </div>
              </div>
              <div className="hidden md:block text-right flex-shrink-0">
                <div className="text-white/60 text-xs">Tổng thu</div>
                <div className="text-2xl font-black text-white">${order.fee.total}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left: detail (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Applicant */}
            <Section title="👤 Thông tin người nộp đơn">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                {order.applicant.photoURL && (
                  <img src={order.applicant.photoURL} alt="" className="w-14 h-14 rounded-xl object-cover" />
                )}
                <div>
                  <div className="font-bold text-base" style={{ color:'var(--navy)' }}>{order.applicant.fullName}</div>
                  <div className="text-xs text-gray-500">{order.applicant.email} · {order.applicant.phone}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {[
                  ['Ngày sinh',  fmtDate(order.applicant.dob)],
                  ['Giới tính',  order.applicant.gender],
                  ['Quốc tịch',  order.applicant.nationality],
                  ['Nơi sinh',   order.applicant.birthPlace],
                ].map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}
              </div>
            </Section>

            {/* Passport */}
            <Section title="📘 Hộ chiếu">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {[
                  ['Số hộ chiếu',   order.passport.no],
                  ['Loại',          order.passport.type],
                  ['Ngày cấp',      fmtDate(order.passport.issueDate)],
                  ['Ngày hết hạn',  fmtDate(order.passport.expiryDate)],
                  ['Nơi cấp',       order.passport.issuePlace],
                  ['Quốc gia cấp',  order.passport.issueCountry],
                ].map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}
              </div>
            </Section>

            {/* Trip */}
            <Section title="✈️ Chuyến đi">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {[
                  ['Mục đích',         order.trip.purpose],
                  ['Ngày nhập cảnh',   fmtDate(order.trip.entryDate)],
                  ['Ngày xuất cảnh',   fmtDate(order.trip.exitDate)],
                  ['Nơi lưu trú',      order.trip.accommodation || '—'],
                ].map(([l, v]) => <InfoRow key={l} label={l} value={v} />)}
                {order.trip.notes && (
                  <div className="sm:col-span-2"><InfoRow label="Ghi chú khách" value={order.trip.notes} /></div>
                )}
              </div>
            </Section>

            {/* Payment */}
            <Section title="💳 Thanh toán">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Phí chính phủ</span><span className="font-semibold" style={{ color:'var(--navy)' }}>${order.fee.gov}.00</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Phí dịch vụ ({TIER_LABEL[order.processing]})</span><span className="font-semibold" style={{ color:'var(--navy)' }}>${order.fee.service}.00</span></div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="font-bold" style={{ color:'var(--navy)' }}>Tổng đã thanh toán</span>
                  <span className="text-lg font-black" style={{ color:'var(--blue)' }}>${order.fee.total}.00</span>
                </div>
                <div className="text-xs text-gray-500 pt-2 border-t border-gray-100 flex justify-between">
                  <span>{order.payment.method === 'card' ? '💳 Thẻ tín dụng' : '📱 Ví điện tử'}</span>
                  <span>{fmtDateTime(order.payment.paidAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Trạng thái:</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: order.payment.status === 'paid' ? '#F0FDF4' : '#FEF2F2', color: order.payment.status === 'paid' ? '#16A34A' : '#DC2626' }}>
                    {order.payment.status === 'paid' ? '✓ Paid' : order.payment.status === 'refunded' ? '↩️ Refunded' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </Section>
          </div>

          {/* Right: timeline + actions (1 col, sticky) */}
          <div className="space-y-5">
            {/* Status pipeline / actions */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 lg:sticky lg:top-20">
              <h3 className="font-bold text-base mb-3" style={{ color:'var(--navy)' }}>⚡ Cập nhật trạng thái</h3>

              {actions.length > 0 ? (
                <>
                  {!confirmAction && (
                    <div className="space-y-2">
                      {actions.map(a => (
                        <button
                          key={a.to}
                          onClick={() => setConfirmAction(a)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-bold border-2 transition-all hover:-translate-y-0.5"
                          style={{ borderColor:a.accent, color:a.accent, background:'white' }}
                        >
                          <span className="flex items-center gap-2">
                            <span>{a.icon}</span>
                            {a.label}
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
                      <div className="rounded-lg p-3 mb-3 text-sm" style={{ background:`${confirmAction.accent}11`, border:`1px solid ${confirmAction.accent}33` }}>
                        <div className="font-bold flex items-center gap-2" style={{ color:confirmAction.accent }}>
                          <span>{confirmAction.icon}</span>
                          {confirmAction.label}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Khách sẽ được thông báo qua email và thấy update trên dashboard.</p>
                      </div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Ghi chú nội bộ (gửi cho khách)</label>
                      <textarea
                        rows={3}
                        className="field-input"
                        placeholder={confirmAction.to === 'rejected' ? 'Lý do từ chối — sẽ gửi cho khách' : 'Tùy chọn — ghi chú thêm về update này'}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                      />
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => { setConfirmAction(null); setNote('') }} className="btn-secondary flex-1 justify-center">Hủy</button>
                        <button
                          onClick={handleConfirm}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90"
                          style={{ background:confirmAction.accent }}
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
                <div className="rounded-lg p-3 text-xs" style={{ background:status.bg, color:status.color }}>
                  <div className="font-bold mb-0.5">{status.icon} {status.label}</div>
                  <div className="opacity-80">Đơn ở trạng thái cuối — không còn hành động cần thực hiện.</div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold text-base mb-4" style={{ color:'var(--navy)' }}>📍 Lịch sử</h3>
              <div className="space-y-0">
                {[...order.timeline].reverse().map((event, i) => {
                  const stage = ORDER_STATUSES[event.stage]
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background:stage.bg, color:stage.color }}>
                          {stage.icon}
                        </div>
                        {i < order.timeline.length - 1 && <div className="w-0.5 flex-1 my-1 min-h-[24px] bg-gray-200" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="font-bold text-sm" style={{ color:'var(--navy)' }}>{stage.label}</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{fmtDateTime(event.at)}</div>
                        {event.note && <div className="text-xs text-gray-600 mt-1 leading-relaxed">{event.note}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Customer contact */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color:'var(--navy)' }}>📨 Liên hệ khách</h3>
              <div className="space-y-2">
                <a href={`mailto:${order.applicant.email}`} className="flex items-center gap-2 text-xs hover:underline truncate" style={{ color:'var(--blue)' }}>
                  <span>📧</span> {order.applicant.email}
                </a>
                <a href={`tel:${order.applicant.phone}`} className="flex items-center gap-2 text-xs hover:underline" style={{ color:'var(--blue)' }}>
                  <span>📞</span> {order.applicant.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
      <h3 className="font-bold text-base mb-4" style={{ color:'var(--navy)' }}>{title}</h3>
      {children}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</div>
      <div className="text-sm font-semibold" style={{ color:'var(--navy)' }}>{value || '—'}</div>
    </div>
  )
}
