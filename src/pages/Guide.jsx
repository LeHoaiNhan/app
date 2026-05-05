import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const STEPS = [
  { num:'01', icon:'🌍', title:'Pick destination & visa type', time:'1 min',   desc:'Check the visa requirements for your destination and choose the eVisa type that fits your trip.' },
  { num:'02', icon:'📝', title:'Fill in your details',          time:'5 min',   desc:'Enter your name, date of birth, and contact info. The system validates each field as you type.' },
  { num:'03', icon:'📘', title:'Upload passport & photo',       time:'2 min',   desc:'Upload a passport scan and a portrait photo with white background. AI checks photo quality automatically.' },
  { num:'04', icon:'💳', title:'Pay securely',                  time:'1 min',   desc:'Pay by card or digital wallet with SSL 256-bit encryption. You get an instant e-receipt.' },
  { num:'05', icon:'✈️', title:'Receive visa by email',          time:'3-7 days', desc:'Our experts review your file and send the e-visa to your inbox. Just print or show it on your phone.' },
]

const DOCS = [
  { id:'passport',     required:true,  label:'Passport valid for at least 6 months',         hint:'Counted from your planned entry date' },
  { id:'photo',        required:true,  label:'Passport-style photo, white background',       hint:'Taken in the last 6 months, no hat, no glasses' },
  { id:'passport-img', required:true,  label:'Photo of passport info page',                  hint:'Sharp, all 4 corners visible, nothing covered' },
  { id:'flight',       required:false, label:'Round-trip flight ticket',                     hint:'Required by some countries (Thailand, Japan, Korea)' },
  { id:'hotel',        required:false, label:'Hotel booking or accommodation address',       hint:'Improves approval chances' },
  { id:'bank',         required:false, label:'Bank statement from the last 3 months',        hint:'Recommended for longer tourist visas' },
  { id:'insurance',    required:false, label:'Travel insurance',                             hint:'Mandatory for some European countries' },
  { id:'invitation',   required:false, label:'Invitation letter (if applicable)',            hint:'For visiting family or business trips' },
]

const PHOTO_DOS = ['Plain white background','Face the camera straight on','Even lighting, no shadows','Hair tidy, face uncovered','At least 400 × 400 px']
const PHOTO_DONTS = ['Wearing a hat or glasses (even prescription)','Smiling with teeth, unusual expressions','Patterned background or objects','Selfies or group photos','Blurry, filtered, or heavily edited photos']

const MISTAKES = [
  { icon:'📅', title:'Passport too close to expiry',  desc:'Your passport must be valid for at least 6 months. Many get rejected with 5 months 28 days left.' },
  { icon:'📸', title:'Photo doesn’t meet standards',  desc:'Selfies, filtered photos, or non-white backgrounds are the most common reason for rejection.' },
  { icon:'✍️', title:'Misspelled name',                desc:'The name on your application must match your passport exactly. Even one wrong letter triggers rejection.' },
  { icon:'⏰', title:'Applying too close to travel',  desc:'Submit at least 14 days early. Standard plan takes 5-7 days, leave a buffer.' },
  { icon:'💰', title:'Insufficient financial proof',   desc:'Long tourist visas need bank statements that cover your trip. Accounts under $2,000 raise questions.' },
  { icon:'🎯', title:'Wrong trip purpose',             desc:'Declaring tourism but actually traveling for business (or vice versa) can lead to denial at the border.' },
]

const TIPS = [
  { icon:'🚀', title:'Apply 2-3 weeks early', desc:'Don’t wait until the last minute — leave buffer for any issues with your file.' },
  { icon:'✅', title:'Double-check before submitting', desc:'Read everything twice — passport number, dates, and email matter most.' },
  { icon:'📞', title:'Save your order code', desc:'Your EV-XXXXXX code is used to track status and contact support.' },
  { icon:'💾', title:'Save your visa offline', desc:'Download the PDF and print a copy. Just in case you have no signal at the airport.' },
]

const FAQ_CATS = ['All','Documents','Payment','Processing','Account','After visa']

const FAQS = [
  { cat:'Documents', q:'What documents do I need to prepare?',                       a:'Required: passport valid for 6 months, portrait photo with white background, passport info-page scan. Recommended: flight ticket, hotel booking, bank statement. Some countries also require travel insurance.' },
  { cat:'Documents', q:'Can I apply if my passport expires in 5 months?',            a:'No. Most countries require at least 6 months passport validity from your intended entry date. Renew your passport before applying.' },
  { cat:'Documents', q:'Can I use a selfie?',                                        a:'No. The photo must have a plain white background, face the camera straight on, no smile with teeth, no hat or glasses. Most photo studios can take a compliant photo for a few dollars.' },
  { cat:'Payment',   q:'What payment methods do you accept?',                        a:'We accept VISA, Mastercard, American Express, JCB, Apple Pay, Google Pay, and bank transfer for business orders.' },
  { cat:'Payment',   q:'Is the service fee refundable if my visa is rejected?',     a:'Yes. We refund 100% of the eVisa service fee if your application is rejected by the issuing authority. Government fees are non-refundable per each country’s rules.' },
  { cat:'Processing',q:'How long does processing take?',                             a:'E-Visa typically takes 3-7 business days. Fast plan: 2-3 days (+$20). Express: 24 hours (+$50). Times vary by country and peak season.' },
  { cat:'Processing',q:'Can I track my application status?',                         a:'Yes. After submitting, you receive an order code EV-XXXXXX. Track in real time at Support → Track order, or in “My Orders” after signing in. Email updates at every step.' },
  { cat:'Processing',q:'It’s been 7 days with no result — is something wrong?',     a:'Some countries (Saudi Arabia, Brazil) usually take 7-10 days. Contact us via Live Chat or Hotline +1 (415) 555-0123 to check the status with the issuing authority.' },
  { cat:'Account',   q:'Can I edit info after submitting?',                          a:'You can edit within the first 2 hours after submission (before our experts start the review). After that, contact support — extra fees may apply.' },
  { cat:'Account',   q:'I forgot my password, what should I do?',                    a:'Click “Forgot password?” on the sign-in screen, enter your email, and we’ll send a reset link within a minute. Or sign in with Google if your account is linked.' },
  { cat:'After visa',q:'Is an electronic visa safe?',                                a:'Yes — issued by the government and legally equivalent to a sticker visa. At the border, just print the PDF or show it on your phone — officers scan the code to verify.' },
  { cat:'After visa',q:'What if I lose my visa?',                                    a:'Your e-visa is stored in your email and in the government system — you can’t really lose it. Just check your email for the PDF, or contact us to resend it.' },
  { cat:'After visa',q:'Can I extend my visa?',                                      a:'Depends on the country. Some (Thailand, Indonesia) allow a 30-day extension locally. Most require leaving and re-applying. Contact our experts for case-specific advice.' },
]

const QUICK_LINKS = [
  ['#process','📋 Process'],
  ['#docs','📦 Documents'],
  ['#photo','📸 Photo guide'],
  ['#mistakes','⚠️ Mistakes'],
  ['#faq','❓ FAQ'],
]

export default function Guide() {
  const [open, setOpen]       = useState(null)
  const [checked, setChecked] = useState(new Set(['passport','photo','passport-img']))
  const [cat, setCat]         = useState('All')
  const [search, setSearch]   = useState('')

  const filteredFaqs = useMemo(() => {
    const term = search.trim().toLowerCase()
    return FAQS.filter(f => {
      const matchCat = cat === 'All' || f.cat === cat
      const matchSearch = !term || f.q.toLowerCase().includes(term) || f.a.toLowerCase().includes(term)
      return matchCat && matchSearch
    })
  }, [cat, search])

  const toggle = (id) => {
    setChecked(p => {
      const next = new Set(p)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const requiredCount = DOCS.filter(d => d.required).length
  const requiredDone  = DOCS.filter(d => d.required && checked.has(d.id)).length
  const allDone       = DOCS.filter(d => checked.has(d.id)).length

  return (
    <div style={{ minHeight:'100vh', background:'#F9FAFB' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ background:'linear-gradient(135deg,#0B1D3A 0%,#1a3060 55%,#0d2451 100%)', padding:'64px 20px 72px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:440, height:440, background:'radial-gradient(circle,rgba(27,79,216,0.25) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:'30%', width:320, height:320, background:'radial-gradient(circle,rgba(245,166,35,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1024, margin:'0 auto', position:'relative', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(245,166,35,0.15)', border:'1px solid rgba(245,166,35,0.3)', color:'var(--gold)', padding:'6px 14px', borderRadius:50, fontSize:13, fontWeight:600, marginBottom:20 }}>
            <span className="pulse" style={{ width:8, height:8, background:'var(--gold)', borderRadius:'50%', display:'inline-block' }} />
            A-to-Z guide in 10 minutes
          </div>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(36px,6vw,56px)', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:16 }}>
            How to apply for an <span style={{ color:'var(--gold)' }}>eVisa</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.68)', fontSize:17, lineHeight:1.7, maxWidth:560, margin:'0 auto 28px' }}>
            Everything you need to know to get your visa — from preparing documents to receiving it by email
          </p>

          <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
            {QUICK_LINKS.map(([href, label]) => (
              <a key={href} href={href}
                style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:50, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'white', fontSize:13, fontWeight:600, textDecoration:'none', transition:'all .2s', backdropFilter:'blur(8px)' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'; e.currentTarget.style.transform='translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.transform='none' }}
              >{label}</a>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section id="process" style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Process</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>5 simple steps, done in 10 minutes</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>From application to approved visa — fully online</p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {STEPS.map(s => (
              <div key={s.num} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:22, display:'flex', gap:18, alignItems:'center', flexWrap:'wrap', transition:'box-shadow .2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow='0 8px 24px rgba(11,29,58,0.06)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow='none'}
              >
                <div style={{ position:'relative', width:60, height:60, borderRadius:16, background:'var(--blue-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>
                  {s.icon}
                  <div style={{ position:'absolute', top:-6, right:-6, width:24, height:24, borderRadius:'50%', background:'var(--blue)', color:'white', fontSize:10, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 6px rgba(0,0,0,0.15)' }}>{s.num}</div>
                </div>
                <div style={{ flex:1, minWidth:240 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4, flexWrap:'wrap' }}>
                    <h3 style={{ fontWeight:900, fontSize:17, color:'var(--navy)' }}>{s.title}</h3>
                    <span style={{ fontSize:11, fontWeight:600, padding:'2px 8px', borderRadius:50, background:'#FFFBEB', color:'#92400E' }}>⏱ {s.time}</span>
                  </div>
                  <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.65 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCS CHECKLIST ── */}
      <section id="docs" style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Checklist</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Documents you’ll need</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Tick items off as you prepare each document</p>
          </div>

          <div style={{ background:'white', borderRadius:14, border:'1px solid #E5E7EB', overflow:'hidden' }}>
            <div style={{ padding:'16px 22px', background:'#F9FAFB', borderBottom:'1px solid #F3F4F6' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexWrap:'wrap', gap:6 }}>
                <span style={{ fontWeight:700, fontSize:14, color:'var(--navy)' }}>
                  {requiredDone === requiredCount ? '✅ All required documents ready' : `📋 Required: ${requiredDone}/${requiredCount}`}
                </span>
                <span style={{ fontSize:12, color:'#6B7280' }}>{allDone}/{DOCS.length} items</span>
              </div>
              <div style={{ height:8, borderRadius:50, overflow:'hidden', background:'#E5E7EB' }}>
                <div style={{ height:'100%', width:`${(allDone / DOCS.length) * 100}%`, background:'var(--blue)', transition:'width .3s' }} />
              </div>
            </div>

            <div>
              {DOCS.map((d, i) => {
                const isChecked = checked.has(d.id)
                return (
                  <button key={d.id}
                    onClick={() => toggle(d.id)}
                    style={{ width:'100%', padding:'14px 22px', display:'flex', alignItems:'flex-start', gap:14, textAlign:'left', background:'white', border:'none', borderTop: i === 0 ? 'none' : '1px solid #F3F4F6', cursor:'pointer', fontFamily:'inherit', transition:'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#F9FAFB'}
                    onMouseLeave={e => e.currentTarget.style.background='white'}
                  >
                    <div style={{ width:24, height:24, borderRadius:6, border: isChecked ? 'none' : '2px solid #D1D5DB', background: isChecked ? 'var(--green)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>
                      {isChecked && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M5 13l4 4L19 7"/>
                        </svg>
                      )}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                        <span style={{ fontWeight:700, fontSize:14, color: isChecked ? '#9CA3AF' : 'var(--navy)', textDecoration: isChecked ? 'line-through' : 'none' }}>{d.label}</span>
                        {d.required && (
                          <span style={{ fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:4, background:'#FEE2E2', color:'#DC2626' }}>REQUIRED</span>
                        )}
                      </div>
                      <p style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{d.hint}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── PHOTO ── */}
      <section id="photo" style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Portrait photo</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>International photo standards</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Bad photos are the #1 reason for rejection</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
            <div style={{ background:'white', borderRadius:14, border:'2px solid #BBF7D0', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:10, background:'#F0FDF4' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--green)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>✓</div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--green)', textTransform:'uppercase', letterSpacing:'.06em' }}>DO</div>
                  <div style={{ fontSize:15, fontWeight:900, color:'var(--navy)' }}>Compliant photo</div>
                </div>
              </div>
              <ul style={{ listStyle:'none', padding:'14px 20px', margin:0 }}>
                {PHOTO_DOS.map(d => (
                  <li key={d} style={{ display:'flex', gap:10, fontSize:14, color:'#374151', marginBottom:10 }}>
                    <span style={{ color:'var(--green)', marginTop:1 }}>✓</span><span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ background:'white', borderRadius:14, border:'2px solid #FECACA', overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:10, background:'#FEF2F2' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'#DC2626', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>✕</div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#DC2626', textTransform:'uppercase', letterSpacing:'.06em' }}>DON’T</div>
                  <div style={{ fontSize:15, fontWeight:900, color:'var(--navy)' }}>Common mistakes</div>
                </div>
              </div>
              <ul style={{ listStyle:'none', padding:'14px 20px', margin:0 }}>
                {PHOTO_DONTS.map(d => (
                  <li key={d} style={{ display:'flex', gap:10, fontSize:14, color:'#374151', marginBottom:10 }}>
                    <span style={{ color:'#DC2626', marginTop:1 }}>✕</span><span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ marginTop:18, borderRadius:12, padding:14, display:'flex', gap:10, alignItems:'flex-start', background:'#FFFBEB', border:'1px solid #FDE68A' }}>
            <span style={{ fontSize:22 }}>💡</span>
            <div style={{ flex:1, fontSize:14, color:'#78350F' }}>
              <span style={{ fontWeight:700 }}>Tip:</span> Our AI checks your photo as soon as you upload it — if anything is off, you’ll know before submitting.
            </div>
          </div>
        </div>
      </section>

      {/* ── MISTAKES ── */}
      <section id="mistakes" style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#DC2626', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Warning</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>6 mistakes that get applications rejected</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Avoid these to push your approval rate up to 99%</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16 }}>
            {MISTAKES.map(m => (
              <div key={m.title} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:20, display:'flex', gap:14, transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 20px rgba(11,29,58,0.06)'; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}
              >
                <div style={{ width:48, height:48, borderRadius:12, background:'#FEF2F2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{m.icon}</div>
                <div style={{ flex:1 }}>
                  <h3 style={{ fontWeight:700, fontSize:15, color:'var(--navy)', marginBottom:4 }}>{m.title}</h3>
                  <p style={{ fontSize:13, color:'#6B7280', lineHeight:1.6 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIPS ── */}
      <section style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#F59E0B', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Pro tips</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)' }}>Tips from our experts</h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
            {TIPS.map(t => (
              <div key={t.title} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:22, transition:'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 20px rgba(11,29,58,0.06)'; e.currentTarget.style.transform='translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}
              >
                <div style={{ fontSize:30, marginBottom:12 }}>{t.icon}</div>
                <h3 style={{ fontWeight:700, fontSize:14, color:'var(--navy)', marginBottom:4 }}>{t.title}</h3>
                <p style={{ fontSize:12, color:'#6B7280', lineHeight:1.6 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:920, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>FAQ</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Frequently asked questions</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>{FAQS.length} common questions — find your answer in seconds</p>
          </div>

          <div style={{ position:'relative', marginBottom:14 }}>
            <svg style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              style={{ width:'100%', padding:'12px 14px 12px 42px', borderRadius:12, fontSize:14, border:'1px solid #E5E7EB', outline:'none', background:'white', fontFamily:'inherit' }}
              placeholder="Search questions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
            {FAQ_CATS.map(c => {
              const active = cat === c
              const count = c === 'All' ? FAQS.length : FAQS.filter(f => f.cat === c).length
              return (
                <button key={c} onClick={() => setCat(c)}
                  style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:50, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .15s', background: active ? 'var(--blue)' : 'white', color: active ? 'white' : '#6B7280', border: active ? '1px solid var(--blue)' : '1px solid #E5E7EB', boxShadow: active ? '0 4px 12px rgba(27,79,216,0.2)' : 'none' }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor='var(--blue)'; e.currentTarget.style.color='var(--blue)' } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.color='#6B7280' } }}
                >
                  <span>{c}</span>
                  <span style={{ fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:50, background: active ? 'rgba(255,255,255,0.25)' : '#F3F4F6', color: active ? 'white' : '#6B7280', minWidth:18, textAlign:'center' }}>{count}</span>
                </button>
              )
            })}
          </div>

          {filteredFaqs.length > 0 ? (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {filteredFaqs.map(f => {
                const isOpen = open === f.q
                return (
                  <div key={f.q} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
                    <button
                      onClick={() => setOpen(isOpen ? null : f.q)}
                      style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, padding:'14px 20px', textAlign:'left', fontWeight:600, fontSize:14, color:'var(--navy)', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit' }}
                    >
                      <div style={{ display:'flex', gap:10, flex:1, minWidth:0, alignItems:'flex-start' }}>
                        <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:4, background:'var(--blue-light)', color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.05em', flexShrink:0, marginTop:2 }}>{f.cat}</span>
                        <span style={{ flex:1 }}>{f.q}</span>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink:0, transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}>
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    </button>
                    {isOpen && (
                      <div style={{ padding:'12px 20px 16px', fontSize:14, color:'#6B7280', lineHeight:1.7, borderTop:'1px solid #F3F4F6' }}>
                        {f.a}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ background:'white', borderRadius:14, border:'1px solid #E5E7EB', padding:'48px 20px', textAlign:'center' }}>
              <div style={{ fontSize:38, opacity:0.6, marginBottom:10 }}>🔍</div>
              <p style={{ fontSize:16, fontWeight:700, color:'var(--navy)' }}>No matching questions found</p>
              <p style={{ fontSize:14, color:'#6B7280', marginTop:4, marginBottom:18 }}>Try a different search term or contact our experts</p>
              <Link to="/support" className="btn-primary">Contact support →</Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'var(--navy)', padding:'56px 20px', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Fraunces,serif', fontSize:30, fontWeight:900, color:'white', marginBottom:10 }}>Still have questions?</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:15, marginBottom:24 }}>Our experts are ready to help — free, 24/7</p>
        <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/support" style={{ display:'inline-block', background:'rgba(255,255,255,0.1)', color:'white', borderRadius:10, padding:'14px 28px', fontSize:15, fontWeight:700, textDecoration:'none', border:'1px solid rgba(255,255,255,0.2)', fontFamily:'inherit', transition:'background .15s' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
          >Contact support</Link>
          <Link to="/" style={{ display:'inline-block', background:'var(--gold)', color:'var(--navy)', borderRadius:10, padding:'14px 28px', fontSize:15, fontWeight:800, textDecoration:'none', fontFamily:'inherit', transition:'opacity .15s' }}
            onMouseEnter={e => e.currentTarget.style.opacity='.88'}
            onMouseLeave={e => e.currentTarget.style.opacity='1'}
          >Apply for visa →</Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
