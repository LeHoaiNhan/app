import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import { useCountries } from '../lib/useCountries'
import { useServiceTiers } from '../lib/useServiceTiers'

const TIER_ICONS = { normal:'⏱', fast:'⚡', express:'🚀' }

function hexToBg(hex) {
  if (!hex || !/^#[0-9a-f]{6}$/i.test(hex)) return '#F9FAFB'
  return `${hex}11`
}

const TAG_COLORS = {
  'E-Visa':          { bg:'#EEF3FF', text:'#1B4FD8' },
  'Visa on Arrival': { bg:'#FFF7ED', text:'#D97706' },
  'eTA':             { bg:'#FDF4FF', text:'#9333EA' },
  'Visa-free':       { bg:'#ECFDF5', text:'#059669' },
}

const FAQS = [
  { q:'Why does the price differ by country?',           a:'Government fees are set by each country — eVisa collects them at face value and forwards 100% to the issuing authority. Service fees are fixed by the speed plan you pick (Standard/Fast/Express).' },
  { q:'Are fees refundable if my visa is rejected?',     a:'Yes. We refund 100% of the eVisa service fee if your application is rejected by the issuing authority. Government fees are non-refundable per each country’s rules. We help explain the reason and re-apply for free.' },
  { q:'Are there any hidden fees?',                      a:'No. The total shown includes the government fee + service fee. No extra processing, transaction, or cancellation fees. You pay exactly what we display, never more.' },
  { q:'Which payment methods are accepted?',             a:'We accept VISA / Mastercard, American Express, JCB, Apple Pay, Google Pay, and bank transfer for business accounts. Currency is USD; your bank converts automatically.' },
  { q:'Are there family or group discounts?',            a:'Yes. Orders of 3+ people get 10% off the service fee. Business orders for 5+ people, contact our experts for a custom quote.' },
  { q:'What if Express misses the deadline?',            a:'We commit to a 24-hour SLA on Express. If we miss it because of our processing, you get a 200% service-fee refund. If the issuing authority is delayed, you get a 100% refund — details in the terms.' },
]

const STATS = [
  { num:'100%',       label:'Transparent' },
  { num:'24h',        label:'Fastest plan' },
  { num:'$0',         label:'Hidden fees' },
  { num:'Refundable', label:'If rejected' },
]

export default function Pricing() {
  const [selectedTier, setSelectedTier] = useState('fast')
  const [search, setSearch] = useState('')
  const [sort, setSort]     = useState('popular')
  const [openFaq, setOpenFaq] = useState(null)
  const { countries } = useCountries()
  const { tiers: rawTiers } = useServiceTiers()

  const TIERS = useMemo(() => rawTiers.map(t => ({
    ...t,
    icon: TIER_ICONS[t.key] || '⚙️',
    desc: t.description,
    time: t.processingTime,
    bg: hexToBg(t.accent),
    features: t.features || [],
  })), [rawTiers])

  const SERVICE_FEES = useMemo(() => Object.fromEntries(rawTiers.map(t => [t.key, t.fee])), [rawTiers])

  const activeTier = TIERS.find(t => t.key === selectedTier) || TIERS[0]

  const rows = useMemo(() => {
    const tierFee = SERVICE_FEES[selectedTier] ?? 0
    const PRICING = countries.map(c => ({ country: c.name, flag: c.flag, tag: c.tag, gov: c.govFee, popular: c.popular }))
    const term = search.trim().toLowerCase()
    let arr = PRICING.filter(p => !term || p.country.toLowerCase().includes(term))
    arr = [...arr].sort((a, b) => {
      if (sort === 'popular') return Number(b.popular) - Number(a.popular) || a.country.localeCompare(b.country)
      if (sort === 'name')    return a.country.localeCompare(b.country)
      const at = (a.gov ?? 0) + tierFee
      const bt = (b.gov ?? 0) + tierFee
      if (sort === 'price-asc')  return at - bt
      if (sort === 'price-desc') return bt - at
      return 0
    })
    return arr
  }, [countries, search, sort, selectedTier, SERVICE_FEES])

  return (
    <div style={{ minHeight:'100vh', background:'#F9FAFB' }}>
      <Seo
        title="Pricing — Government and service fees"
        description="Transparent fees for every destination and processing speed. Compare government fees and our service tiers (normal, fast, express)."
        path="/pricing"
      />
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ background:'linear-gradient(135deg,#0B1D3A 0%,#1a3060 55%,#0d2451 100%)', padding:'64px 20px 72px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:440, height:440, background:'radial-gradient(circle,rgba(27,79,216,0.25) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:'30%', width:320, height:320, background:'radial-gradient(circle,rgba(245,166,35,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1024, margin:'0 auto', position:'relative', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(245,166,35,0.15)', border:'1px solid rgba(245,166,35,0.3)', color:'var(--gold)', padding:'6px 14px', borderRadius:50, fontSize:13, fontWeight:600, marginBottom:20 }}>
            <span className="pulse" style={{ width:8, height:8, background:'var(--gold)', borderRadius:'50%', display:'inline-block' }} />
            Transparent pricing — no hidden fees
          </div>
          <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(36px,6vw,56px)', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:16 }}>
            Service <span style={{ color:'var(--gold)' }}>pricing</span><br/>made simple
          </h1>
          <p style={{ color:'rgba(255,255,255,0.68)', fontSize:17, lineHeight:1.7, maxWidth:560, marginLeft:'auto', marginRight:'auto' }}>
            Service fee + government fee — you pay exactly what we show, nothing more
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:'white', padding:'40px 20px', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, textAlign:'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--blue)', lineHeight:1 }}>{s.num}</div>
              <div style={{ fontSize:13, color:'#6B7280', marginTop:6, fontWeight:500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIERS ── */}
      <section style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>Service fee</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Pick your speed</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>3 plans — choose based on how soon you need your visa</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
            {TIERS.map(t => {
              const isSelected = selectedTier === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setSelectedTier(t.key)}
                  style={{ position:'relative', textAlign:'left', background: isSelected ? t.bg : 'white', borderRadius:16, border: isSelected ? `2px solid ${t.accent}` : '2px solid #E5E7EB', padding:24, cursor:'pointer', fontFamily:'inherit', transition:'all .25s', boxShadow: isSelected ? '0 16px 32px rgba(11,29,58,0.10)' : 'none' }}
                  onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor='#CBD5E1' } }}
                  onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.transform='none'; e.currentTarget.style.borderColor='#E5E7EB' } }}
                >
                  {t.popular && (
                    <span style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', fontSize:10, fontWeight:700, padding:'4px 12px', borderRadius:50, background:'var(--gold)', color:'var(--navy)', boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}>
                      🔥 MOST POPULAR
                    </span>
                  )}
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
                    <div style={{ fontSize:30 }}>{t.icon}</div>
                    <div>
                      <div style={{ fontFamily:'Fraunces,serif', fontSize:20, fontWeight:900, color:'var(--navy)' }}>{t.label}</div>
                      <div style={{ fontSize:12, color:'#6B7280' }}>{t.desc}</div>
                    </div>
                  </div>

                  <div style={{ margin:'18px 0' }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                      <span style={{ fontSize:36, fontWeight:900, color:t.accent }}>${t.fee}</span>
                      <span style={{ fontSize:13, color:'#6B7280' }}>+ government fee</span>
                    </div>
                    <div style={{ fontSize:12, fontWeight:600, color:t.accent, marginTop:4 }}>⏱ {t.time}</div>
                  </div>

                  <ul style={{ listStyle:'none', padding:0, margin:'0 0 18px' }}>
                    {t.features.map(f => (
                      <li key={f} style={{ display:'flex', gap:8, fontSize:13, color:'#374151', marginBottom:8 }}>
                        <span style={{ color:t.accent, marginTop:1, flexShrink:0 }}>✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ textAlign:'center', fontSize:13, fontWeight:700, padding:'10px 14px', borderRadius:8, background: isSelected ? t.accent : 'transparent', color: isSelected ? 'white' : '#374151', border: isSelected ? 'none' : '1px solid #D1D5DB' }}>
                    {isSelected ? '✓ Viewing prices on this plan' : 'View prices on this plan'}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── COUNTRY TABLE ── */}
      <section style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6', borderBottom:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>By country</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Pricing by country</h2>
            <p style={{ fontSize:14, color:'#6B7280' }}>
              Viewing the <span style={{ fontWeight:700, color:'var(--blue)' }}>{activeTier?.label || '...'}</span> plan — switch above to update pricing
            </p>
          </div>

          <div style={{ background:'white', borderRadius:14, border:'1px solid #E5E7EB', overflow:'hidden' }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid #F3F4F6', display:'flex', gap:10, flexWrap:'wrap' }}>
              <div style={{ position:'relative', flex:'1 1 240px' }}>
                <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  style={{ width:'100%', padding:'10px 12px 10px 36px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, outline:'none', fontFamily:'inherit' }}
                  placeholder="Search country..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #E5E7EB', fontSize:13, background:'white', fontFamily:'inherit', outline:'none', cursor:'pointer' }}
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="popular">Popular first</option>
                <option value="name">Name A-Z</option>
                <option value="price-asc">Price low → high</option>
                <option value="price-desc">Price high → low</option>
              </select>
            </div>

            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                <thead>
                  <tr style={{ background:'#F9FAFB', borderBottom:'1px solid #E5E7EB' }}>
                    {['Country','Type','Gov fee','Service fee','Total',''].map((h, i) => (
                      <th key={i} style={{ padding:'12px 16px', fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', textAlign: i >= 2 ? 'right' : 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(p => {
                    const tagColor = TAG_COLORS[p.tag] || { bg:'#F3F4F6', text:'#6B7280' }
                    const isFree = p.gov === null
                    const tierFee = SERVICE_FEES[selectedTier] ?? 0
                    const total = isFree ? null : p.gov + tierFee
                    return (
                      <tr key={p.country} style={{ borderBottom:'1px solid #F3F4F6' }}>
                        <td style={{ padding:'14px 16px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <span style={{ fontSize:22 }}>{p.flag}</span>
                            <div>
                              <span style={{ fontWeight:700, color:'var(--navy)' }}>{p.country}</span>
                              {p.popular && <span style={{ marginLeft:8, fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:4, background:'#FFFBEB', color:'#92400E' }}>HOT</span>}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding:'14px 16px' }}>
                          <span style={{ fontSize:11, fontWeight:600, padding:'2px 10px', borderRadius:50, background:tagColor.bg, color:tagColor.text }}>{p.tag}</span>
                        </td>
                        <td style={{ padding:'14px 16px', textAlign:'right', color:'#6B7280' }}>{isFree ? '—' : `$${p.gov}`}</td>
                        <td style={{ padding:'14px 16px', textAlign:'right', color:'#6B7280' }}>{isFree ? '—' : `$${tierFee}`}</td>
                        <td style={{ padding:'14px 16px', textAlign:'right' }}>
                          {isFree ? (
                            <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:50, background:'#ECFDF5', color:'#059669' }}>Free</span>
                          ) : (
                            <span style={{ fontSize:16, fontWeight:900, color:'var(--blue)' }}>${total}</span>
                          )}
                        </td>
                        <td style={{ padding:'14px 16px', textAlign:'right' }}>
                          {isFree ? (
                            <span style={{ fontSize:12, color:'#9CA3AF' }}>Not needed</span>
                          ) : (
                            <Link to="/" style={{ fontSize:12, fontWeight:700, color:'var(--blue)', textDecoration:'none', whiteSpace:'nowrap' }}>Apply →</Link>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {rows.length === 0 && (
              <div style={{ textAlign:'center', padding:'40px 20px' }}>
                <div style={{ fontSize:38, opacity:0.5, marginBottom:6 }}>🔍</div>
                <p style={{ fontSize:14, color:'#6B7280' }}>No matching countries found</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── BREAKDOWN ── */}
      <section style={{ background:'#F9FAFB', padding:'64px 20px' }}>
        <div style={{ maxWidth:1024, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>What you pay for</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>Fee breakdown</h2>
            <p style={{ color:'#6B7280', fontSize:15 }}>Know exactly where your money goes — never a hidden cent</p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
            <div style={{ background:'white', borderRadius:14, border:'2px solid #FED7AA', overflow:'hidden' }}>
              <div style={{ padding:'18px 22px', display:'flex', alignItems:'center', gap:12, background:'#FFF7ED' }}>
                <div style={{ width:46, height:46, borderRadius:12, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🏛️</div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'#D97706', textTransform:'uppercase', letterSpacing:'.06em' }}>Government fee</div>
                  <div style={{ fontSize:18, fontWeight:900, color:'var(--navy)' }}>Gov Fee</div>
                </div>
              </div>
              <div style={{ padding:'18px 22px' }}>
                <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.65, marginBottom:14 }}>
                  Set by each country’s visa-issuing authority. eVisa collects this and <strong style={{ color:'var(--navy)' }}>forwards 100%</strong> to the government, keeping none of it.
                </p>
                <ul style={{ listStyle:'none', padding:0, margin:0, fontSize:12, color:'#6B7280', lineHeight:1.8 }}>
                  <li>• Each country sets its own rate</li>
                  <li>• May change when policies are updated</li>
                  <li>• Non-refundable per each country’s rules</li>
                </ul>
              </div>
            </div>

            <div style={{ background:'white', borderRadius:14, border:'2px solid #BFDBFE', overflow:'hidden' }}>
              <div style={{ padding:'18px 22px', display:'flex', alignItems:'center', gap:12, background:'#EEF3FF' }}>
                <div style={{ width:46, height:46, borderRadius:12, background:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>⚡</div>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.06em' }}>eVisa service fee</div>
                  <div style={{ fontSize:18, fontWeight:900, color:'var(--navy)' }}>Service Fee</div>
                </div>
              </div>
              <div style={{ padding:'18px 22px' }}>
                <p style={{ fontSize:14, color:'#6B7280', lineHeight:1.65, marginBottom:14 }}>
                  Covers the work our experts do for you — review, AI photo check, support, and file insurance.
                </p>
                <ul style={{ listStyle:'none', padding:0, margin:0, fontSize:12, color:'#6B7280', lineHeight:1.8 }}>
                  <li>• Expert review of each application</li>
                  <li>• Automatic AI checks for photos & docs</li>
                  <li>• 24/7 English support</li>
                  <li>• <strong style={{ color:'var(--green)' }}>100% refund if rejected</strong></li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ marginTop:18, borderRadius:12, padding:14, display:'flex', alignItems:'flex-start', gap:10, background:'#F0FDF4', border:'1px solid #BBF7D0' }}>
            <span style={{ fontSize:22 }}>💡</span>
            <div style={{ flex:1, fontSize:14, color:'#15803D' }}>
              <span style={{ fontWeight:700 }}>Total you pay</span> = Government fee + Service fee. The table above already includes both.
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background:'white', padding:'64px 20px', borderTop:'1px solid #F3F4F6' }}>
        <div style={{ maxWidth:820, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--blue)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>FAQ</div>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--navy)' }}>Pricing questions</h2>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {FAQS.map(f => {
              const isOpen = openFaq === f.q
              return (
                <div key={f.q} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:12, overflow:'hidden' }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : f.q)}
                    style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, padding:'14px 20px', textAlign:'left', fontWeight:600, fontSize:14, color:'var(--navy)', background:'transparent', border:'none', cursor:'pointer', fontFamily:'inherit' }}
                  >
                    <span>{f.q}</span>
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
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:'var(--navy)', padding:'56px 20px', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Fraunces,serif', fontSize:30, fontWeight:900, color:'white', marginBottom:10 }}>Ready to apply?</h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:15, marginBottom:24 }}>100% service fee refund if your visa is rejected — zero risk</p>
        <Link to="/" style={{ display:'inline-block', background:'var(--gold)', color:'var(--navy)', borderRadius:10, padding:'14px 32px', fontSize:16, fontWeight:800, textDecoration:'none', fontFamily:'inherit', transition:'opacity .15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity='.88'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
        >Apply for visa →</Link>
      </section>

      <Footer />
    </div>
  )
}
