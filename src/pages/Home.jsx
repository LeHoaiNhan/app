import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ApplicationForm from '../components/ApplicationForm'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import OrderTracker from '../components/OrderTracker'
import { Reveal, CountUp } from '../lib/useReveal'

const STATS = [
  { num:'99%',  label:'Approval rate' },
  { num:'10+',  label:'Years experience' },
  { num:'24/7', label:'English support' },
  { num:'150+', label:'Countries served' },
]
const FEATURES = [
  { icon:'⚡', bg:'#EEF3FF', title:'Lightning fast', desc:'Complete your application in 10 minutes. Get your visa within 24h on priority plans.' },
  { icon:'🔒', bg:'#F0FDF4', title:'Bank-grade security', desc:'SSL 256-bit encryption. Your data is protected to international standards.' },
  { icon:'🏆', bg:'#FFF7ED', title:'99% approval', desc:'Expert reviewers check your file thoroughly before submission.' },
]
const DESTINATIONS = ['🇹🇭 Thailand','🇯🇵 Japan','🇸🇬 Singapore','🇰🇷 South Korea','🇺🇸 USA','🇬🇧 UK','🇦🇺 Australia','🇦🇪 Dubai']

export default function Home() {
  const formRef = useRef()
  const scroll = () => formRef.current?.scrollIntoView({ behavior:'smooth', block:'start' })
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.slice(1)
    const el = document.getElementById(id)
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }, [hash])

  return (
    <div style={{ minHeight:'100vh', background:'#F9FAFB' }}>
      <Seo
        title="Apply for your travel visa online"
        description="Apply for E-Visa, Visa on Arrival and eTA online for 60+ countries. Fast processing, transparent pricing, expert review, 24/7 support."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: 'eVisa application service',
          provider: { '@type': 'Organization', name: 'eVisa' },
          areaServed: 'Worldwide',
          serviceType: 'Visa application processing',
        }}
      />
      <Navbar onApplyClick={scroll} />

      {/* ── HERO ── */}
      <section className="r-hero" style={{ background:'linear-gradient(135deg,#0B1D3A 0%,#1a3060 55%,#0d2451 100%)', padding:'64px 20px 72px', position:'relative', overflow:'hidden' }}>
        {/* Glow */}
        <div style={{ position:'absolute', top:-80, right:-80, width:440, height:440, background:'radial-gradient(circle,rgba(27,79,216,0.25) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:'30%', width:320, height:320, background:'radial-gradient(circle,rgba(245,166,35,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1024, margin:'0 auto', display:'flex', flexWrap:'wrap', gap:40, alignItems:'center' }}>
          {/* Left text */}
          <div style={{ flex:1, minWidth:280 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(245,166,35,0.15)', border:'1px solid rgba(245,166,35,0.3)', color:'var(--gold)', padding:'6px 14px', borderRadius:50, fontSize:13, fontWeight:600, marginBottom:20 }}>
              <span className="pulse" style={{ width:8, height:8, background:'var(--gold)', borderRadius:'50%', display:'inline-block' }} />
              Trusted by 2M+ travelers worldwide
            </div>
            <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(36px,6vw,56px)', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:16 }}>
              Travel visas<br/>
              <span style={{ color:'var(--gold)' }}>fast & simple</span>
            </h1>
            <p style={{ color:'rgba(255,255,255,0.68)', fontSize:17, lineHeight:1.7, marginBottom:28 }}>
              Apply online in just 10 minutes.<br/>
              Expert support 24/7, every step of the way.
            </p>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <button onClick={scroll} className="btn-primary" style={{ fontSize:15, padding:'13px 28px' }}>
                Apply for visa →
              </button>
              <a
                href="#track"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('track')?.scrollIntoView({ behavior:'smooth', block:'start' })
                }}
                style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'13px 22px', border:'1.5px solid rgba(255,255,255,0.3)', borderRadius:8, color:'white', fontSize:15, fontWeight:600, textDecoration:'none', transition:'all .15s', background:'rgba(255,255,255,0.05)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.6)'; e.currentTarget.style.background='rgba(255,255,255,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'; e.currentTarget.style.background='rgba(255,255,255,0.05)' }}
              >🔎 Track my order</a>
            </div>
          </div>

          {/* Right: search card */}
          <div className="r-card-tight" style={{ flex:'0 0 auto', width:'100%', maxWidth:420 }}>
            <div style={{ background:'white', borderRadius:16, padding:'24px', boxShadow:'0 24px 64px rgba(0,0,0,0.3)' }}>
              <p style={{ fontSize:15, fontWeight:700, color:'var(--navy)', marginBottom:16 }}>🔍 Check your visa</p>
              <div className="r-grid-2-stack" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                <div>
                  <label className="field-label">Nationality</label>
                  <select className="field-input">
                    {['United States','United Kingdom','Australia','Canada','Germany','France'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Destination</label>
                  <select className="field-input">
                    {['Thailand','Japan','Singapore','Vietnam','Indonesia','Turkey'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={scroll} className="btn-primary" style={{ width:'100%', padding:'12px', fontSize:15 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Check now
              </button>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:14, paddingTop:14, borderTop:'1px solid #F3F4F6' }}>
                {[['🔒','SSL 256-bit'],['⏱','24h approval'],['💰','Money-back']].map(([i,l]) => (
                  <span key={l} style={{ fontSize:12, color:'#6B7280', fontWeight:500 }}>{i} {l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRACK ORDER (right after hero, prominent) ── */}
      <section id="track" style={{ background:'#F9FAFB', padding:'40px 20px', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:28, fontWeight:900, color:'var(--navy)', marginBottom:6 }}>
              Already applied? Track your order
            </h2>
            <p style={{ color:'#6B7280', fontSize:14 }}>
              Enter your order code from the confirmation email to see real-time status
            </p>
          </div>
          <OrderTracker />
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:'white', padding:'40px 20px', borderBottom:'1px solid #F3F4F6' }}>
        <div className="r-grid-4" style={{ maxWidth:1024, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, textAlign:'center' }}>
          {STATS.map((s, i) => {
            const m = s.num.match(/^(\d+)(.*)$/)
            return (
              <Reveal key={s.label} delay={i * 80}>
                <div style={{ fontFamily:'Fraunces,serif', fontSize:38, fontWeight:900, color:'var(--blue)', lineHeight:1 }}>
                  {m ? <CountUp end={Number(m[1])} suffix={m[2]} /> : s.num}
                </div>
                <div style={{ fontSize:14, color:'#6B7280', marginTop:6, fontWeight:500 }}>{s.label}</div>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>4 simple steps</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>From application to approved visa in just days</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16 }}>
            {[
              ['01','Pick destination','Check visa requirements and choose the right type','var(--blue-light)','var(--blue)'],
              ['02','Fill in details','Complete the 4-step form in 10 minutes','#F0FDF4','var(--green)'],
              ['03','Pay securely','Pay by card or digital wallet, safely','#FFF7ED','#F59E0B'],
              ['04','Get visa','Receive your e-visa by email within your chosen window','#FDF4FF','#9333EA'],
            ].map(([n,t,d,bg,col]) => (
              <div key={n} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:20, textAlign:'center' }}>
                <div style={{ width:52, height:52, background:bg, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontFamily:'Fraunces,serif', fontSize:22, fontWeight:900, color:col }}>{n}</div>
                <h3 style={{ fontSize:15, fontWeight:700, color:'var(--navy)', marginBottom:6 }}>{t}</h3>
                <p style={{ fontSize:13, color:'#6B7280', lineHeight:1.6 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ── */}
      <div ref={formRef}><ApplicationForm /></div>

      {/* ── FEATURES ── */}
      <section style={{ background:'white', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Why eVisa?</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>We simplify the process so you can focus on your trip</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:18 }}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 120}>
                <div style={{ padding:22, border:'1px solid #E5E7EB', borderRadius:14, transition:'all .2s', cursor:'default' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 24px rgba(27,79,216,0.1)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.borderColor='var(--blue)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#E5E7EB' }}
                >
                  <div style={{ width:46, height:46, background:f.bg, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:14 }}>{f.icon}</div>
                  <h3 style={{ fontSize:16, fontWeight:700, color:'var(--navy)', marginBottom:7 }}>{f.title}</h3>
                  <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.65 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ── */}
      <section style={{ background:'#F9FAFB', padding:'48px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <h2 style={{ fontFamily:'Fraunces,serif', fontSize:28, fontWeight:900, color:'var(--navy)', marginBottom:20, textAlign:'center' }}>Popular destinations</h2>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            {DESTINATIONS.map(d => (
              <button key={d} onClick={scroll}
                style={{ padding:'10px 18px', background:'white', border:'1.5px solid #E5E7EB', borderRadius:50, fontSize:14, fontWeight:600, color:'#374151', cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--blue)'; e.currentTarget.style.color='var(--blue)'; e.currentTarget.style.background='var(--blue-light)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.color='#374151'; e.currentTarget.style.background='white' }}
              >{d}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'var(--navy)', padding:'56px 20px', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Fraunces,serif', fontSize:30, fontWeight:900, color:'white', marginBottom:10 }}>Ready for your trip?</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:15, marginBottom:24 }}>Over 2 million travelers trust eVisa</p>
        <button onClick={scroll} style={{ background:'var(--gold)', color:'var(--navy)', border:'none', borderRadius:10, padding:'14px 32px', fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:'inherit', transition:'opacity .15s' }}
          onMouseEnter={e => e.target.style.opacity='.88'}
          onMouseLeave={e => e.target.style.opacity='1'}
        >Apply for visa now →</button>
      </section>

      <Footer />

      {/* Mobile-only sticky bottom CTA */}
      <div className="sticky-cta">
        <button onClick={scroll} className="btn-primary">
          Apply for visa →
        </button>
        <a
          href="#track"
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('track')?.scrollIntoView({ behavior:'smooth', block:'start' })
          }}
          aria-label="Track order"
          style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:44, height:44, borderRadius:8, border:'1px solid #E5E7EB', background:'white', color:'var(--navy)', textDecoration:'none', fontSize:18, flexShrink:0 }}
        >🔎</a>
      </div>
      <div className="sticky-cta-spacer" aria-hidden />
    </div>
  )
}
