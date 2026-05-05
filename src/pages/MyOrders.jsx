import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { useOrders, ORDER_STATUSES, STAGE_FLOW } from '../contexts/OrdersContext'

const TIER_LABEL = { normal:'Standard', fast:'Fast', express:'Express' }

const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' })
}
const fmtDateTime = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

export default function MyOrders() {
  const { user, setShowLoginModal } = useAuth()
  const { orders } = useOrders()
  const [selectedId, setSelectedId] = useState(null)
  const [filter, setFilter] = useState('all') // all | active | done

  // Auth gate
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background:'#F9FAFB' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 max-w-md text-center">
            <div className="text-5xl mb-5">🔐</div>
            <h2 className="text-2xl font-black mb-2" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
              Đăng nhập để xem đơn
            </h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Bạn cần đăng nhập để xem các đơn visa đã đăng ký và theo dõi trạng thái xử lý
            </p>
            <button onClick={() => setShowLoginModal(true)} className="btn-primary justify-center w-full mb-3">
              Đăng nhập
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <Link to="/" className="text-sm font-semibold" style={{ color:'var(--blue)' }}>
              ← Về trang chủ
            </Link>
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
    <div className="min-h-screen" style={{ background:'#F9FAFB' }}>
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden" style={{ background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 100%)' }}>
        <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full pointer-events-none" style={{ background:'radial-gradient(circle,rgba(27,79,216,0.25) 0%,transparent 70%)' }} />
        <div className="relative max-w-5xl mx-auto px-4 py-10 md:py-12">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt="" className="w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 border-white/30" />
            <div className="flex-1 min-w-0">
              <p className="text-white/60 text-xs md:text-sm">Xin chào,</p>
              <h1 className="text-xl md:text-3xl font-black text-white truncate" style={{ fontFamily:'Fraunces,serif' }}>{user.name}</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          {[
            ['Tổng đơn',     myOrders.length, '📋', 'var(--blue)'],
            ['Đang xử lý',   active.length,   '⏳', '#F59E0B'],
            ['Hoàn tất',     done.filter(o => o.status === 'delivered').length, '✅', 'var(--green)'],
          ].map(([label, val, icon, color]) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 md:p-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
                <span className="text-base">{icon}</span>
              </div>
              <div className="text-2xl md:text-3xl font-black" style={{ color }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <h2 className="text-lg md:text-xl font-black" style={{ color:'var(--navy)', fontFamily:'Fraunces,serif' }}>
            Đơn của tôi
          </h2>
          <div className="flex gap-1 bg-white rounded-lg border border-gray-200 p-1">
            {[
              ['all',    `Tất cả (${myOrders.length})`],
              ['active', `Đang xử lý (${active.length})`],
              ['done',   `Hoàn tất (${done.length})`],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-semibold transition-all ${filter === key ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}
                style={filter === key ? { background:'var(--blue)' } : {}}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* Orders list */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map(o => <OrderCard key={o.id} order={o} onClick={() => setSelectedId(o.id)} />)}
          </div>
        ) : myOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-black text-lg mb-2" style={{ color:'var(--navy)' }}>Bạn chưa có đơn nào</h3>
            <p className="text-sm text-gray-500 mb-5">Đăng ký visa đầu tiên để bắt đầu</p>
            <Link to="/" className="btn-primary">
              Đăng ký visa ngay
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <div className="text-3xl mb-2 opacity-50">🔍</div>
            <p className="text-sm text-gray-500">Không có đơn ở mục này</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

function OrderCard({ order, onClick }) {
  const status = ORDER_STATUSES[order.status]
  const isTerminal = ['delivered','rejected'].includes(order.status)
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md hover:border-blue-300 transition-all text-left flex items-center gap-4"
    >
      <div className="text-4xl md:text-5xl flex-shrink-0">{order.flag}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="font-black text-base md:text-lg" style={{ color:'var(--navy)' }}>{order.destination}</h3>
          <span className="font-mono text-[11px] font-bold text-gray-400">{order.id}</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
          <span>📅 Nộp: {fmtDate(order.createdAt)}</span>
          <span className="hidden sm:inline">·</span>
          <span>{order.visaType}</span>
          <span className="hidden sm:inline">·</span>
          <span>{TIER_LABEL[order.processing]}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background:status.bg, color:status.color }}
          >
            <span>{status.icon}</span>
            {status.label}
          </span>
          {!isTerminal && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background:'#FFFBEB', color:'#92400E' }}>
              <span className="pulse w-1.5 h-1.5 rounded-full" style={{ background:'#92400E' }} />
              Đang xử lý
            </span>
          )}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="font-black text-lg" style={{ color:'var(--blue)' }}>${order.fee.total}</div>
        <svg className="ml-auto mt-2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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

  return (
    <div className="min-h-screen" style={{ background:'#F9FAFB' }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold mb-5 hover:underline" style={{ color:'var(--blue)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 19l-7-7 7-7"/>
          </svg>
          Quay lại danh sách
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-5">
          <div className="px-6 py-6 md:px-8 relative overflow-hidden" style={{ background:'linear-gradient(135deg,var(--navy) 0%,#1a3060 100%)' }}>
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full" style={{ background:`radial-gradient(circle,${status.color}55 0%,transparent 70%)` }} />
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
                <div className="text-white/60 text-xs">Tổng đã thanh toán</div>
                <div className="text-2xl font-black text-white">${order.fee.total}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <Section title="📍 Tiến trình hồ sơ">
          {isRejected ? (
            <div className="rounded-xl p-4 mb-3" style={{ background:'#FEF2F2', border:'1px solid #FECACA' }}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">❌</span>
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color:'#991B1B' }}>Đơn bị từ chối</h4>
                  <p className="text-xs leading-relaxed" style={{ color:'#7F1D1D' }}>
                    {order.timeline[order.timeline.length - 1]?.note}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-0">
            {STAGE_FLOW.map((stageKey, i) => {
              const stage = ORDER_STATUSES[stageKey]
              const passedEvent = order.timeline.find(t => t.stage === stageKey)
              const done = !!passedEvent && i <= currentIdx
              const current = i === currentIdx && !isRejected
              return (
                <div key={stageKey} className="flex gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0 transition-all ${current ? 'shadow-lg ring-4 ring-blue-100' : ''}`}
                      style={done ? { background: current ? 'var(--blue)' : 'var(--green)', color:'white' } : { background:'#E5E7EB', color:'#9CA3AF' }}
                    >
                      {done && !current ? '✓' : stage.icon}
                    </div>
                    {i < STAGE_FLOW.length - 1 && (
                      <div className="w-0.5 flex-1 my-1 min-h-[28px]" style={{ background: i < currentIdx ? 'var(--green)' : '#E5E7EB' }} />
                    )}
                  </div>
                  <div className={`flex-1 pb-5 ${current ? '' : done ? 'opacity-90' : 'opacity-50'}`}>
                    <div className="flex items-baseline justify-between gap-3 flex-wrap">
                      <div className="font-bold text-sm" style={{ color:'var(--navy)' }}>{stage.label}</div>
                      {passedEvent && <div className="text-[11px] text-gray-400">{fmtDateTime(passedEvent.at)}</div>}
                    </div>
                    {passedEvent && <div className="text-xs text-gray-500 mt-0.5">{passedEvent.note}</div>}
                    {current && (
                      <div className="inline-block mt-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background:'var(--blue-light)', color:'var(--blue)' }}>
                        Đang diễn ra
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {order.status === 'delivered' && (
            <div className="mt-3 pt-4 border-t border-gray-100">
              <button className="btn-primary w-full justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Tải visa PDF
              </button>
            </div>
          )}
        </Section>

        {/* Applicant info */}
        <Section title="👤 Thông tin người nộp đơn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {[
              ['Họ và tên',   order.applicant.fullName],
              ['Email',       order.applicant.email],
              ['Điện thoại',  order.applicant.phone],
              ['Ngày sinh',   fmtDate(order.applicant.dob)],
              ['Giới tính',   order.applicant.gender],
              ['Quốc tịch',   order.applicant.nationality],
              ['Nơi sinh',    order.applicant.birthPlace],
            ].map(([label, val]) => (
              <InfoRow key={label} label={label} value={val} />
            ))}
          </div>
        </Section>

        {/* Passport info */}
        <Section title="📘 Thông tin hộ chiếu">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {[
              ['Số hộ chiếu',   order.passport.no],
              ['Loại',          order.passport.type],
              ['Ngày cấp',      fmtDate(order.passport.issueDate)],
              ['Ngày hết hạn',  fmtDate(order.passport.expiryDate)],
              ['Nơi cấp',       order.passport.issuePlace],
              ['Quốc gia cấp',  order.passport.issueCountry],
            ].map(([label, val]) => (
              <InfoRow key={label} label={label} value={val} />
            ))}
          </div>
        </Section>

        {/* Trip info */}
        <Section title="✈️ Thông tin chuyến đi">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {[
              ['Mục đích',          order.trip.purpose],
              ['Ngày nhập cảnh',    fmtDate(order.trip.entryDate)],
              ['Ngày xuất cảnh',    fmtDate(order.trip.exitDate)],
              ['Nơi lưu trú',       order.trip.accommodation || '—'],
            ].map(([label, val]) => (
              <InfoRow key={label} label={label} value={val} />
            ))}
            {order.trip.notes && (
              <div className="md:col-span-2">
                <InfoRow label="Ghi chú" value={order.trip.notes} />
              </div>
            )}
          </div>
        </Section>

        {/* Payment info */}
        <Section title="💳 Thanh toán">
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Phí chính phủ</span>
              <span className="font-semibold" style={{ color:'var(--navy)' }}>${order.fee.gov}.00</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Phí dịch vụ ({TIER_LABEL[order.processing]})</span>
              <span className="font-semibold" style={{ color:'var(--navy)' }}>${order.fee.service}.00</span>
            </div>
            <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center">
              <span className="font-bold" style={{ color:'var(--navy)' }}>Tổng đã thanh toán</span>
              <span className="text-xl font-black" style={{ color:'var(--blue)' }}>${order.fee.total}.00</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 pt-1.5 border-t border-gray-100">
              <span>Phương thức · Thời gian</span>
              <span>
                {order.payment.method === 'card' ? '💳 Thẻ' : '📱 Ví điện tử'} · {fmtDateTime(order.payment.paidAt)}
              </span>
            </div>
            {order.payment.status === 'refunded' && (
              <div className="rounded-lg p-2.5 text-xs flex items-center gap-2" style={{ background:'#FEF2F2', color:'#991B1B' }}>
                <span>↩️</span>
                <span><strong>Đã hoàn tiền</strong> phí dịch vụ ${order.fee.service} về tài khoản ban đầu</span>
              </div>
            )}
          </div>
        </Section>

        {/* Actions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6">
          <h3 className="font-bold text-sm mb-4" style={{ color:'var(--navy)' }}>Bạn cần hỗ trợ?</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/support" className="btn-secondary flex-1 justify-center">
              💬 Liên hệ chuyên gia
            </Link>
            <Link to="/guide" className="btn-secondary flex-1 justify-center">
              📚 Xem hướng dẫn
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 mb-5">
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
