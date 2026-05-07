import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/Seo'

const TYPES = [
  {
    key:'evisa', icon:'⚡', name:'E-Visa', subtitle:'Standard electronic visa',
    accent:'#1B4FD8', bg:'#EEF3FF',
    desc:'The most common visa type — apply 100% online and receive your visa by email. No embassy visit needed.',
    suitable:['Short-term tourism (14-90 days)','Business meetings, conferences, trade trips','Visiting family or friends'],
    process:['Fill out the online form (10 min)','Upload passport photo & passport scan','Pay by card or digital wallet','Receive visa by email (3-7 days)'],
    info:{ time:'3-7 days', price:'from $29', entry:'Single / Multiple' },
    countries:'80+ countries',
    examples:'Thailand, Japan, South Korea, Dubai, Turkey...',
  },
  {
    key:'voa', icon:'🛬', name:'Visa on Arrival', subtitle:'Visa issued at the border',
    accent:'#F59E0B', bg:'#FFF7ED',
    desc:'Get pre-approval online before you fly, then receive the visa upon arrival. Bring originals.',
    suitable:['Independent travelers and group tours','Travelers with confirmed flights & hotel','Trips to Southeast Asia, Maldives, Nepal'],
    process:['Apply for pre-approval online','Print the approval letter / QR code','Submit photo + fee at the airport','Receive a visa sticker in your passport'],
    info:{ time:'5-7 days + at airport', price:'from $35', entry:'Single' },
    countries:'15+ countries',
    examples:'Indonesia, Sri Lanka, Maldives...',
  },
  {
    key:'eta', icon:'🚀', name:'eTA', subtitle:'Electronic Travel Authorization',
    accent:'#9333EA', bg:'#FDF4FF',
    desc:'Electronic entry permission for travelers to certain developed countries. Issued automatically in hours, valid for years.',
    suitable:['Travel & business to Canada, New Zealand, Australia','Long transits or visa-waiver travel','Travelers with strong passports who want speed'],
    process:['Fill out the short online form (5 min)','Pay the processing fee','Receive confirmation within hours','Linked automatically to your passport'],
    info:{ time:'1-3 days', price:'from $80', entry:'Multiple' },
    countries:'Canada, New Zealand, Australia',
    examples:'ESTA / eTA / ETA systems',
  },
  {
    key:'free', icon:'✅', name:'Visa-free', subtitle:'No visa required',
    accent:'#10B981', bg:'#ECFDF5',
    desc:'Several countries waive visa requirements for many passport holders. You only need a passport valid for 6 months.',
    suitable:['Short trips (14-30 days)','Weekend getaways and quick visits','Travelers who want to skip the visa fee'],
    process:['Confirm your passport is valid ≥ 6 months','Book a round-trip flight','Book accommodation (recommended)','Fill out the arrival form at the airport'],
    info:{ time:'Instant', price:'Free', entry:'Multiple' },
    countries:'12+ countries',
    examples:'Malaysia, Hong Kong, Singapore, Laos...',
  },
]

const COMPARISON_ROWS = [
  ['Application method', 'Online 100%',         'Online + at airport',     'Online 100%',          'No application'],
  ['Processing time',    '3-7 days',            '5-7 days + at airport',   '1-3 days',             'Instant'],
  ['Service fee',        'from $29',            'from $35',                'from $80',             'Free'],
  ['Entries',            'Single / Multi',      'Single',                  'Multiple',             'Multiple'],
  ['Length of stay',     '14-90 days',          '30 days',                 '90-180 days',          '14-30 days'],
  ['Best for',           'Tourism, business',   'Southeast Asia, Maldives','Canada, NZ, AU',       '12+ ASEAN countries'],
]

const TRUST = [
  ['🔒','SSL 256-bit','Encrypted data'],
  ['⚡','24h processing','Express plan'],
  ['🏆','99% approval','Expert review'],
  ['💬','24/7 support','English'],
]

const HELPER = [
  { q:'Going to Southeast Asia / East Asia?', a:'E-Visa',    icon:'🌏', accent:'#1B4FD8', desc:'Best for Thailand, Japan, South Korea, Dubai...' },
  { q:'Going to Canada, NZ, Australia?',      a:'eTA',       icon:'🛫', accent:'#9333EA', desc:'eTA issued in hours, valid for 2-5 years' },
  { q:'Going to Malaysia, Singapore, HK?',    a:'Visa-free', icon:'✅', accent:'#10B981', desc:'No visa needed — passport valid 6+ months' },
]

export default function VisaTypes() {
  const [active, setActive] = useState('evisa')
  const activeType = TYPES.find(t => t.key === active)

  const goDetail = () => document.getElementById('detail')?.scrollIntoView({ behavior:'smooth', block:'start' })

  return (
    <div style={{ minHeight:'100vh', background:'#F9FAFB' }}>
      <Seo
        title="Visa types — E-Visa, Visa on Arrival, eTA"
        description="Compare E-Visa, Visa on Arrival, eTA and visa-free options. Understand the differences, eligibility and which one fits your trip."
        path="/visa-types"
      />
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ background:'linear-gradient(135deg,#0B1D3A 0%,#1a3060 55%,#0d2451 100%)', padding:'64px 20px 72px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:440, height:440, background:'radial-gradient(circle,rgba(27,79,216,0.25) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:'30%', width:320, height:320, background:'radial-gradient(circle,rgba(245,166,35,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1024, margin:'0 auto', position:'relative', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(245,166,35,0.15)', border:'1px solid rgba(245,166,35,0.3)', color:'var(--gold)', padding:'6px 14px', borderRadius:50, fontSize:13, fontWeight:600, marginBottom:20 }}>
            <span className="pulse" style={{ width:8, height:8, background:'var(--gold)', borderRadius:'50%', display:'inline-block' }} />
            E-visas for 100+ countries
          </div>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(36px,6vw,56px)', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:16 }}>
            Pick the right <span style={{ color:'var(--gold)' }}>visa type</span><br/>for your trip
          </h1>
          <p style={{ color:'rgba(255,255,255,0.68)', fontSize:17, lineHeight:1.7, marginBottom:28, maxWidth:560, marginLeft:'auto', marginRight:'auto' }}>
            4 electronic visa types eVisa supports — choose the right one to prepare your file quickly
          </p>

          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            {TYPES.map(t => (
              <button
                key={t.key}
                onClick={() => { setActive(t.key); goDetail() }}
                style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px 6px 6px', borderRadius:50, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', color:'white', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .2s', backdropFilter:'blur(8px)' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.2)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'; e.currentTarget.style.transform='translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.transform='none' }}
              >
                <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:28, height:28, borderRadius:'50%', background:'rgba(255,255,255,0.18)', fontSize:14 }}>{t.icon}</span>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section style={{ background:'white', padding:'40px 20px', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:18 }}>
          {[
            ['🌐','100% online','No embassy visit needed'],
            ['⚡','Fast processing','Average 3-7 days, 24h plan available'],
            ['🔒','Bank-grade security','SSL 256-bit, international standards'],
            ['💼','Legally valid','Equivalent to a sticker visa'],
          ].map(([icon,title,desc]) => (
            <div key={title} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ fontSize:24, lineHeight:1, marginTop:2 }}>{icon}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:'var(--navy)', marginBottom:2 }}>{title}</div>
                <div style={{ fontSize:12, color:'#6B7280' }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TYPES PICKER ── */}
      <section id="detail" style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>4 electronic visa types</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Click any type to see the details</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:24 }}>
            {TYPES.map(t => {
              const isActive = active === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  style={{ position:'relative', textAlign:'left', padding:18, borderRadius:14, border: isActive ? `2px solid ${t.accent}` : '2px solid #E5E7EB', background: isActive ? t.bg : 'white', cursor:'pointer', fontFamily:'inherit', transition:'all .2s', boxShadow: isActive ? '0 8px 20px rgba(11,29,58,0.08)' : 'none' }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor='#CBD5E1'; e.currentTarget.style.transform='translateY(-2px)' } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.transform='none' } }}
                >
                  <div style={{ fontSize:30, marginBottom:8 }}>{t.icon}</div>
                  <div style={{ fontWeight:900, fontSize:15, color:'var(--navy)', marginBottom:2 }}>{t.name}</div>
                  <div style={{ fontSize:11, color:'#6B7280', lineHeight:1.4 }}>{t.subtitle}</div>
                </button>
              )
            })}
          </div>

          <div className="fade-up" key={active} style={{ background:'white', borderRadius:16, border:'1px solid #E5E7EB', overflow:'hidden' }}>
            <div style={{ background:activeType.bg, padding:'24px 28px', borderBottom:'1px solid #F3F4F6', display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={{ fontSize:54, lineHeight:1 }}>{activeType.icon}</div>
              <div style={{ flex:1 }}>
                <h3 style={{ fontFamily:'Fraunces,serif', fontSize:28, fontWeight:900, color:'var(--navy)', lineHeight:1.1 }}>{activeType.name}</h3>
                <p style={{ fontSize:13, fontWeight:700, color:activeType.accent, marginTop:4 }}>{activeType.subtitle}</p>
                <p style={{ fontSize:14, color:'#374151', marginTop:10, lineHeight:1.65 }}>{activeType.desc}</p>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:24, padding:'28px' }}>
              <div>
                <h4 style={{ fontSize:11, fontWeight:700, color:'var(--navy)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ color:activeType.accent }}>●</span> Best for
                </h4>
                <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                  {activeType.suitable.map(s => (
                    <li key={s} style={{ display:'flex', gap:8, fontSize:14, color:'#374151', marginBottom:10 }}>
                      <span style={{ color:activeType.accent, marginTop:2 }}>✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize:11, fontWeight:700, color:'var(--navy)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ color:activeType.accent }}>●</span> 4-step process
                </h4>
                <ol style={{ listStyle:'none', padding:0, margin:0 }}>
                  {activeType.process.map((p, i) => (
                    <li key={p} style={{ display:'flex', gap:12, fontSize:14, color:'#374151', marginBottom:12, alignItems:'flex-start' }}>
                      <div style={{ width:24, height:24, borderRadius:'50%', background:activeType.accent, color:'white', fontSize:11, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{i+1}</div>
                      <span>{p}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div style={{ padding:'0 28px 28px' }}>
              <div className="r-grid-3" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:18 }}>
                {[
                  ['⏱','Time',activeType.info.time],
                  ['💰','Service fee',activeType.info.price],
                  ['🔁','Entries',activeType.info.entry],
                ].map(([icon,label,val]) => (
                  <div key={label} style={{ background:'#F9FAFB', borderRadius:10, padding:'12px 8px', textAlign:'center' }}>
                    <div style={{ fontSize:16, marginBottom:2 }}>{icon}</div>
                    <div style={{ fontSize:10, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.05em', marginBottom:2 }}>{label}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--navy)', lineHeight:1.3 }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderRadius:10, padding:14, marginBottom:18, background:activeType.bg, display:'flex', gap:10, alignItems:'flex-start' }}>
                <span style={{ fontSize:18 }}>🌍</span>
                <div style={{ flex:1, fontSize:13 }}>
                  <span style={{ fontWeight:700, color:activeType.accent }}>{activeType.countries}</span>
                  <span style={{ color:'#6B7280', marginLeft:8 }}>— e.g. {activeType.examples}</span>
                </div>
              </div>

              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <Link to="/destinations" className="btn-secondary" style={{ flex:'0 0 auto', padding:'12px 24px' }}>View destinations</Link>
                <Link to="/" className="btn-primary" style={{ flex:1, justifyContent:'center', minWidth:200 }}>
                  Apply for {activeType.name}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Quick comparison</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>This table helps you pick the right visa type</p>
          </div>

          <div style={{ background:'white', borderRadius:14, border:'1px solid #E5E7EB', overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
              <thead>
                <tr style={{ background:'#F9FAFB', borderBottom:'1px solid #E5E7EB' }}>
                  <th style={{ textAlign:'left', padding:'16px 20px', fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em' }}>Criteria</th>
                  {TYPES.map(t => (
                    <th key={t.key} style={{ textAlign:'center', padding:'16px 12px' }}>
                      <div style={{ fontSize:24, marginBottom:4 }}>{t.icon}</div>
                      <div style={{ fontSize:13, fontWeight:900, color:'var(--navy)' }}>{t.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map(([label, ...vals]) => (
                  <tr key={label} style={{ borderBottom:'1px solid #F3F4F6' }}>
                    <td style={{ padding:'14px 20px', fontWeight:600, color:'#374151' }}>{label}</td>
                    {vals.map((v, i) => (
                      <td key={i} style={{ padding:'14px 12px', textAlign:'center', color:'#6B7280' }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── DECISION HELPER ── */}
      <section style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Still not sure which type fits?</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Answer one quick question to get a recommendation</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:18 }}>
            {HELPER.map(c => (
              <div key={c.q} style={{ background:'white', borderRadius:14, border:'1px solid #E5E7EB', padding:22, transition:'all .2s', cursor:'default' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 8px 24px rgba(11,29,58,0.08)'; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor=c.accent }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#E5E7EB' }}
              >
                <div style={{ fontSize:30, marginBottom:12 }}>{c.icon}</div>
                <div style={{ fontSize:11, fontWeight:700, color:c.accent, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:8 }}>If you’re</div>
                <h3 style={{ fontWeight:700, fontSize:16, color:'var(--navy)', marginBottom:8 }}>{c.q}</h3>
                <p style={{ fontSize:12, color:'#6B7280', lineHeight:1.6, marginBottom:14 }}>{c.desc}</p>
                <div style={{ borderRadius:10, padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', background:`${c.accent}11` }}>
                  <span style={{ fontSize:12, color:'#6B7280' }}>→ Pick type</span>
                  <span style={{ fontSize:14, fontWeight:900, color:c.accent }}>{c.a}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section style={{ background:'white', padding:'48px 20px', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:24, textAlign:'center' }}>
          {TRUST.map(([icon,title,desc]) => (
            <div key={title}>
              <div style={{ fontSize:32, marginBottom:8 }}>{icon}</div>
              <div style={{ fontWeight:900, fontSize:14, color:'var(--navy)' }}>{title}</div>
              <div style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'var(--navy)', padding:'56px 20px', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Fraunces,serif', fontSize:30, fontWeight:900, color:'white', marginBottom:10 }}>Ready to apply?</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:15, marginBottom:24 }}>Complete your application in 10 minutes — experts review before submission</p>
        <Link to="/" style={{ display:'inline-block', background:'var(--gold)', color:'var(--navy)', borderRadius:10, padding:'14px 32px', fontSize:16, fontWeight:800, textDecoration:'none', fontFamily:'inherit', transition:'opacity .15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity='.88'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
        >Apply for visa →</Link>
      </section>

      <Footer />
    </div>
  )
}
