import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useOrders } from '../../contexts/OrdersContext'
import { useCountries } from '../../lib/useCountries'
import { useServiceTiers } from '../../lib/useServiceTiers'
import { findVariant } from '../../lib/visaRules'
import { api } from '../../lib/api'
import PaypalCheckout from '../PaypalCheckout'

export default function Step4Payment({ formData, onBack, goToStep, onSubmitted }) {
  const { user, setShowLoginModal } = useAuth()
  const { createOrder } = useOrders()
  const { countries } = useCountries()
  const { tiers } = useServiceTiers()
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [orderCode, setOrderCode] = useState(null)
  const [error, setError]     = useState(null)

  const proc  = formData.trip?.processing || 'normal'
  const destination = formData.trip?.destination || 'Thailand'
  const country = countries.find(c => c.name === destination)
  const variant = findVariant(country, formData.trip?.variantKey)
  const tier = tiers.find(t => t.key === proc) || tiers[0]
  const govFee = variant?.govFee ?? country?.govFee ?? 0
  const svcFee = tier?.fee ?? 0
  const total = govFee + svcFee
  const fullName = `${formData.personal?.lastName||''} ${formData.personal?.firstName||''}`.trim() || '—'

  const submitOrder = async (paymentInfo) => {
    const photoURL = formData.personal?.photoURL || ''
    const applicant = {
      fullName,
      email: formData.personal?.email || '',
      phone: formData.personal?.phone || '',
      dob: formData.personal?.dob || '',
      gender: formData.personal?.gender || '',
      nationality: formData.personal?.nationality || '',
      birthPlace: formData.personal?.birthPlace || '',
    }
    if (/^https?:\/\//.test(photoURL)) applicant.photoURL = photoURL

    const order = await createOrder({
      destination,
      flag: country?.flag || '🌍',
      visaType: variant?.label || formData.trip?.visaType || country?.tag || 'E-Visa',
      processing: proc,
      fee: { gov: govFee, service: svcFee, total, currency: 'USD' },
      payment: paymentInfo,
      applicant,
      passport: {
        no: formData.passport?.passportNo || '',
        type: formData.passport?.passportType || '',
        issueDate: formData.passport?.issueDate || '',
        expiryDate: formData.passport?.expiryDate || '',
        issueCountry: formData.passport?.issueCountry || '',
      },
      trip: {
        purpose: formData.trip?.purpose || '',
        entryDate: formData.trip?.entryDate || '',
        exitDate: formData.trip?.exitDate || '',
        accommodation: formData.trip?.accommodation || '',
        notes: formData.trip?.notes || '',
        variantKey: formData.trip?.variantKey || '',
      },
    })

    const docIds = [formData.personal?.photoDocId, formData.passport?.passportImgDocId].filter(Boolean)
    await Promise.all(docIds.map(id =>
      api.patch(`/uploads/${id}/link`, { orderId: order.id }).catch(() => null),
    ))

    setOrderCode(order.id)
    setDone(true)
    onSubmitted?.()
    return order
  }

  const handlePaypalApproved = async (capture) => {
    setError(null)
    if (!user) {
      setShowLoginModal(true)
      return
    }
    setLoading(true)
    const paymentInfo = {
      method: 'paypal',
      status: 'paid',
      paidAt: new Date().toISOString(),
      paypalOrderId: capture.paypalOrderId,
      paypalCaptureId: capture.captureId,
      paypalAmount: capture.amount,
      payer: capture.payer,
    }
    // Money is already captured — retry submitOrder a few times before showing
    // the contact-support fallback. Server is idempotent on paypalCaptureId.
    let lastErr = null
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await submitOrder(paymentInfo)
        setLoading(false)
        return
      } catch (err) {
        lastErr = err
        if (attempt < 2) await new Promise(r => setTimeout(r, 800 * (attempt + 1)))
      }
    }
    setLoading(false)
    setError(
      (lastErr?.response?.data?.error || lastErr?.message || 'Could not save order') +
      ` — your payment went through. Please contact support with PayPal capture ID ${capture.captureId}.`
    )
  }

  /* ── Success screen ── */
  if (done) return (
    <div style={{ padding:'48px 28px', textAlign:'center' }}>
      <div style={{ width:80, height:80, background:'var(--green-light)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h2 style={{ fontFamily:'Fraunces,serif', fontSize:28, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>
        Application submitted!
      </h2>
      <p style={{ color:'#6B7280', fontSize:15, lineHeight:1.7, marginBottom:24 }}>
        We’ve received your visa application.<br/>
        A confirmation email is on its way to <strong>{formData.personal?.email||'your inbox'}</strong>.
      </p>
      <div style={{ background:'var(--green-light)', border:'1px solid #BBF7D0', borderRadius:12, padding:'16px 28px', display:'inline-block', marginBottom:24 }}>
        <p style={{ fontSize:12, color:'#6B7280', marginBottom:4 }}>Your order code</p>
        <p style={{ fontFamily:'monospace', fontSize:22, fontWeight:800, color:'var(--navy)' }}>{orderCode}</p>
      </div>
      <div style={{ fontSize:13, color:'#9CA3AF', marginBottom:20 }}>
        Save this code to track your status anytime
      </div>
      <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
        <Link to="/my-orders" className="btn-primary">
          View my orders
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
        <Link to="/support" className="btn-secondary">Contact support</Link>
      </div>
    </div>
  )

  return (
    <div className="step-body">
      {/* Banner */}
      <div style={{ display:'flex', alignItems:'center', gap:12, background:'var(--green-light)', border:'1px solid #BBF7D0', borderRadius:10, padding:'12px 16px', marginBottom:20 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div>
          <p style={{ fontSize:14, fontWeight:700, color:'#15803D' }}>Application looks good!</p>
          <p style={{ fontSize:12, color:'#16A34A' }}>Your details have been validated — ready to pay</p>
        </div>
      </div>

      {/* Summary */}
      <h3 className="section-bar">Order summary</h3>
      <div className="summary-table" style={{ marginBottom:20 }}>
        <SummaryGroup label="Trip" stepNum={1} goToStep={goToStep} rows={[
          ['Destination',  `${country?.flag || '🌍'} ${formData.trip?.destination || 'Thailand'}`],
          ['Visa type',    formData.trip?.visaType || 'E-Visa'],
          ['Entry → Exit', `${formData.trip?.entryDate || '—'} → ${formData.trip?.exitDate || '—'}`],
          ['Processing',   tier?.processingTime || '—'],
        ]} />
        <SummaryGroup label="Applicant" stepNum={2} goToStep={goToStep} rows={[
          ['Name',        fullName],
          ['Email',       formData.personal?.email || '—'],
          ['Date of birth', formData.personal?.dob || '—'],
          ['Nationality', formData.personal?.nationality || '—'],
        ]} />
        <SummaryGroup label="Passport" stepNum={3} goToStep={goToStep} rows={[
          ['Number',  formData.passport?.passportNo || '—'],
          ['Expires', formData.passport?.expiryDate || '—'],
        ]} />
        <div className="summary-row"><span className="lbl">Government fee</span><span className="val">${govFee}.00</span></div>
        <div className="summary-row"><span className="lbl">eVisa service fee</span><span className="val">${svcFee}.00</span></div>
        <div className="summary-row total">
          <span className="lbl" style={{ fontWeight:700, color:'#111827' }}>Total</span>
          <span className="val">${total}.00</span>
        </div>
      </div>

      {/* Payment method */}
      <h3 className="section-bar">Payment method</h3>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:10, border:'1.5px solid var(--blue)', background:'var(--blue-light)', marginBottom:14 }}>
        <span style={{ fontSize:20 }}>🅿️</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'var(--blue)' }}>Pay with PayPal</div>
          <div style={{ fontSize:11, color:'#6B7280' }}>Card / wallet checkouts coming soon</div>
        </div>
        <span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:50, background:'white', color:'var(--blue)', border:'1px solid #DBEAFE' }}>Selected</span>
      </div>

      <div style={{ padding:'16px 16px 8px', background:'#F9FAFB', borderRadius:10, border:'1px solid #E5E7EB', marginBottom:8 }}>
        <p style={{ fontSize:13, color:'#6B7280', marginBottom:12 }}>
          You will be charged <strong style={{ color:'var(--navy)' }}>${total}.00 USD</strong>. The order will only be created after PayPal confirms the payment.
        </p>
        {!user ? (
          <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#92400E' }}>
            Please sign in before paying with PayPal.
          </div>
        ) : (
          <PaypalCheckout
            amount={total}
            currency="USD"
            description={`eVisa — ${destination} (${tier?.label || proc})`}
            onApproved={handlePaypalApproved}
            onError={(msg) => setError(typeof msg === 'string' ? msg : 'PayPal error')}
          />
        )}
      </div>

      {error && (
        <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:8, padding:'10px 14px', marginTop:16, fontSize:13, color:'#991B1B' }}>
          {error}
        </div>
      )}
      {!user && (
        <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:8, padding:'10px 14px', marginTop:16, fontSize:13, color:'#92400E' }}>
          You need to sign in before submitting your application.
        </div>
      )}

      {loading && (
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:8, background:'#EFF6FF', border:'1px solid #BFDBFE', marginTop:14, fontSize:13, color:'#1E40AF' }}>
          <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#1E40AF" strokeWidth="3" strokeDasharray="31" strokeDashoffset="10"/>
          </svg>
          Saving your order — please don’t close this page…
        </div>
      )}

      <div className="form-actions" style={{ marginTop:24, marginLeft:-28, marginRight:-28, marginBottom:-24 }}>
        <button className="btn-secondary" onClick={onBack} disabled={loading}>← Back</button>
      </div>
    </div>
  )
}

function SummaryGroup({ label, stepNum, goToStep, rows }) {
  return (
    <>
      <div className="summary-row" style={{ background:'#F9FAFB' }}>
        <span className="lbl" style={{ fontWeight:700, color:'#0B1D3A', fontSize:12, textTransform:'uppercase', letterSpacing:'0.4px' }}>{label}</span>
        {goToStep && (
          <button className="row-edit" onClick={() => goToStep(stepNum)} aria-label={`Edit ${label}`}>Edit</button>
        )}
      </div>
      {rows.map(([l,v]) => (
        <div className="summary-row" key={l}>
          <span className="lbl">{l}</span>
          <span className="val">{v}</span>
        </div>
      ))}
    </>
  )
}
