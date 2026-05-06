import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useOrders } from '../../contexts/OrdersContext'

const FEE_MAP = { normal: 49, fast: 69, express: 99 }

const FLAG_MAP = {
  'Thailand':'🇹🇭','Singapore':'🇸🇬','Indonesia':'🇮🇩','South Korea':'🇰🇷','Japan':'🇯🇵',
  'Vietnam':'🇻🇳','Turkey':'🇹🇷','Australia':'🇦🇺','India':'🇮🇳','Egypt':'🇪🇬','Dubai (UAE)':'🇦🇪',
}

export default function Step4Payment({ formData, onBack }) {
  const { user } = useAuth()
  const { createOrder } = useOrders()
  const [pay, setPay]         = useState('card')
  const [card, setCard]       = useState({ number:'', expiry:'', cvv:'', name:'' })
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [orderCode, setOrderCode] = useState(null)

  const proc  = formData.trip?.processing || 'normal'
  const total = FEE_MAP[proc] || 49
  const govFee  = 30
  const svcFee  = total - govFee
  const fullName = `${formData.personal?.lastName||''} ${formData.personal?.firstName||''}`.trim() || '—'

  const handlePay = () => {
    setLoading(true)
    setTimeout(() => {
      const destination = formData.trip?.destination || 'Thailand'
      const order = createOrder({
        customerId: user?.id || 'guest',
        destination,
        flag: FLAG_MAP[destination] || '🌍',
        visaType: formData.trip?.visaType || 'E-Visa',
        processing: proc,
        fee: { gov: govFee, service: svcFee, total, currency: 'USD' },
        payment: { method: pay, status: 'paid', paidAt: new Date().toISOString() },
        applicant: {
          fullName,
          email: formData.personal?.email || '',
          phone: formData.personal?.phone || '',
          dob: formData.personal?.dob || '',
          gender: formData.personal?.gender || '',
          nationality: formData.personal?.nationality || '',
          birthPlace: formData.personal?.birthPlace || '',
          photoURL: formData.personal?.photoURL || '',
        },
        passport: {
          no: formData.passport?.passportNo || '',
          type: formData.passport?.passportType || '',
          issueDate: formData.passport?.issueDate || '',
          expiryDate: formData.passport?.expiryDate || '',
          issuePlace: formData.passport?.issuePlace || '',
          issueCountry: formData.passport?.issueCountry || '',
        },
        trip: {
          purpose: formData.trip?.purpose || '',
          entryDate: formData.trip?.entryDate || '',
          exitDate: formData.trip?.exitDate || '',
          accommodation: formData.trip?.accommodation || '',
          notes: formData.trip?.notes || '',
        },
      })
      setOrderCode(order.id)
      setLoading(false)
      setDone(true)
    }, 2000)
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
    <div style={{ padding:'24px 28px' }}>
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
      <div className="section-bar">Order summary</div>
      <div className="summary-table" style={{ marginBottom:20 }}>
        {[
          ['Applicant',       fullName],
          ['Destination',     formData.trip?.destination || 'Thailand'],
          ['Visa type',       formData.trip?.visaType || 'E-Visa'],
          ['Processing time', proc==='normal'?'5-7 days':proc==='fast'?'2-3 days':'24 hours'],
        ].map(([l,v]) => (
          <div className="summary-row" key={l}>
            <span className="lbl">{l}</span>
            <span className="val">{v}</span>
          </div>
        ))}
        <div className="summary-row"><span className="lbl">Government fee</span><span className="val">${govFee}.00</span></div>
        <div className="summary-row"><span className="lbl">eVisa service fee</span><span className="val">${svcFee}.00</span></div>
        <div className="summary-row total">
          <span className="lbl" style={{ fontWeight:700, color:'#111827' }}>Total</span>
          <span className="val">${total}.00</span>
        </div>
      </div>

      {/* Payment method */}
      <div className="section-bar">Payment method</div>
      <div className="pay-opts" style={{ marginBottom:20 }}>
        {[['card','💳','Credit / Debit card'],['ewallet','📱','Digital wallet / QR Code']].map(([val,ico,lbl]) => (
          <label key={val} className={`pay-opt ${pay===val?'active':''}`} onClick={() => setPay(val)}>
            <input type="radio" name="pay" style={{ display:'none' }} checked={pay===val} readOnly />
            <span style={{ fontSize:18 }}>{ico}</span>
            <span>{lbl}</span>
          </label>
        ))}
      </div>

      {/* Card form */}
      {pay==='card' && (
        <div className="form-grid-2" style={{ marginBottom:8 }}>
          <div style={{ gridColumn:'span 2' }}>
            <label className="field-label">Cardholder name <span className="req">*</span></label>
            <input className="field-input" placeholder="JOHN SMITH"
              value={card.name} onChange={e => setCard({...card,name:e.target.value})} />
          </div>
          <div style={{ gridColumn:'span 2' }}>
            <label className="field-label">Card number <span className="req">*</span></label>
            <input className="field-input" placeholder="1234  5678  9012  3456" maxLength={19}
              value={card.number}
              onChange={e => {
                const v = e.target.value.replace(/\D/g,'').slice(0,16)
                setCard({...card, number: v.replace(/(.{4})/g,'$1 ').trim()})
              }} />
          </div>
          <div>
            <label className="field-label">Expiry date <span className="req">*</span></label>
            <input className="field-input" placeholder="MM/YY" maxLength={5}
              value={card.expiry}
              onChange={e => {
                let v = e.target.value.replace(/\D/g,'')
                if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2,4)
                setCard({...card, expiry: v})
              }} />
          </div>
          <div>
            <label className="field-label">CVV <span className="req">*</span></label>
            <input className="field-input" placeholder="123" maxLength={4} type="password"
              value={card.cvv} onChange={e => setCard({...card, cvv:e.target.value.replace(/\D/g,'').slice(0,4)})} />
          </div>
        </div>
      )}

      {pay==='ewallet' && (
        <div style={{ textAlign:'center', padding:'24px 16px', background:'#F9FAFB', borderRadius:10, border:'1px solid #E5E7EB', marginBottom:8 }}>
          <div style={{ fontSize:48, marginBottom:8 }}>📱</div>
          <p style={{ fontSize:14, fontWeight:600, color:'var(--navy)', marginBottom:4 }}>Scan QR code to pay</p>
          <p style={{ fontSize:12, color:'#6B7280' }}>Supports: Apple Pay · Google Pay · PayPal · Alipay</p>
          <div style={{ width:120, height:120, background:'#E5E7EB', borderRadius:8, margin:'16px auto 0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#9CA3AF' }}>
            QR Code<br/>(demo)
          </div>
        </div>
      )}

      <div className="form-actions" style={{ marginTop:24, marginLeft:-28, marginRight:-28, marginBottom:-24 }}>
        <button className="btn-secondary" onClick={onBack}>← Back</button>
        <button className="btn-green" onClick={handlePay} disabled={loading} style={{ minWidth:200 }}>
          {loading ? (
            <>
              <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="31" strokeDashoffset="10"/>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Submit & Pay ${total}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
