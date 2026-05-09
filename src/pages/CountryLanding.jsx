import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Seo from '../components/Seo'
import { useCountries } from '../lib/useCountries'
import { describeStay, describeValidity } from '../lib/visaRules'
import { slugify, findCountryBySlug } from '../lib/slug'

const REQUIRED_DOC_LABEL = {
  passport:        'Valid passport',
  photo:           'Recent passport-style photo',
  hotel:           'Hotel booking',
  ticket:          'Round-trip ticket',
  host_letter:     'Host invitation letter',
  company_letter:  'Company / employer letter',
  birth_cert:      'Birth certificate',
  auth_letter:     'Notarised authorisation letter',
  non_citizen_stmt:'Statement of non-citizenship',
}

const TAG_COLORS = {
  'E-Visa':          { bg:'#EEF3FF', text:'#1B4FD8' },
  'Visa on Arrival': { bg:'#FFF7ED', text:'#D97706' },
  'eTA':             { bg:'#FDF4FF', text:'#9333EA' },
  'Visa-free':       { bg:'#ECFDF5', text:'#059669' },
}

const STEPS = [
  { n:'01', t:'Pick visa type',      d:'Choose the option that fits your trip — fees and stay shown upfront.' },
  { n:'02', t:'Fill 4-step form',    d:'Trip → personal → passport → review. Around 10 minutes.' },
  { n:'03', t:'Pay securely',        d:'PayPal checkout, gov + service fee combined, USD.' },
  { n:'04', t:'Get visa via email',  d:'Approved e-visa lands in your inbox within the chosen window.' },
]

export default function CountryLanding() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { countries, loading } = useCountries()
  const country = useMemo(() => findCountryBySlug(countries, slug), [countries, slug])

  // 404 redirect when data has loaded and slug is unknown.
  useEffect(() => {
    if (!loading && countries.length > 0 && !country) navigate('/destinations', { replace: true })
  }, [loading, countries.length, country, navigate])

  if (loading || !country) return <CountryLandingFallback />

  const variants = Array.isArray(country.variants) ? country.variants : []
  const rules = country.rules || {}
  const requiredDocs = rules.requiredDocs || ['passport','photo']
  const tagColor = TAG_COLORS[country.tag] || { bg:'#F3F4F6', text:'#374151' }
  const minFee = variants.length ? Math.min(...variants.map(v => v.govFee || 0)) : (country.govFee || 0)

  const related = countries
    .filter(c => c.id !== country.id && c.region === country.region && c.active !== false)
    .slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${country.name} ${country.tag}`,
    description: country.description,
    areaServed: { '@type': 'Country', name: country.name },
    provider: { '@type': 'Organization', name: 'eVisa' },
    serviceType: 'Visa application processing',
    offers: variants.length ? variants.map(v => ({
      '@type': 'Offer',
      name: v.label,
      priceCurrency: 'USD',
      price: String(v.govFee || 0),
    })) : [{ '@type':'Offer', name: country.tag, priceCurrency:'USD', price:String(country.govFee||0) }],
  }

  return (
    <div style={{ minHeight:'100vh', background:'#F9FAFB' }}>
      <Seo
        title={`${country.name} ${country.tag} — Apply online`}
        description={`Apply for the ${country.name} ${country.tag} online. ${country.description} Processing ${country.processingTime}, max stay ${country.maxStay}, gov fee from $${minFee}.`}
        path={`/${slug}`}
        jsonLd={jsonLd}
      />
      <Navbar />

      {/* HERO */}
      <section style={{ background:'linear-gradient(135deg,#0B1D3A 0%,#1a3060 55%,#0d2451 100%)', padding:'56px 20px 64px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:440, height:440, background:'radial-gradient(circle,rgba(27,79,216,0.25) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1024, margin:'0 auto', position:'relative' }}>
          <nav aria-label="Breadcrumb" style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:16 }}>
            <Link to="/" style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none' }}>Home</Link>
            <span style={{ margin:'0 6px' }}>›</span>
            <Link to="/destinations" style={{ color:'rgba(255,255,255,0.6)', textDecoration:'none' }}>Destinations</Link>
            <span style={{ margin:'0 6px' }}>›</span>
            <span style={{ color:'rgba(255,255,255,0.95)' }}>{country.name}</span>
          </nav>

          <div style={{ display:'flex', alignItems:'flex-start', gap:24, flexWrap:'wrap' }}>
            <div style={{ fontSize:96, lineHeight:1 }}>{country.flag}</div>
            <div style={{ flex:1, minWidth:280 }}>
              <span style={{ display:'inline-block', fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:50, background:tagColor.bg, color:tagColor.text, marginBottom:14 }}>
                {country.tag}
              </span>
              <h1 style={{ fontFamily:'Fraunces,serif', fontSize:'clamp(32px,5vw,46px)', fontWeight:900, color:'white', lineHeight:1.1, marginBottom:10 }}>
                Apply for the {country.name} {country.tag}
              </h1>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:16, lineHeight:1.6, marginBottom:20, maxWidth:640 }}>
                {country.description}
              </p>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <Link to={`/?destination=${encodeURIComponent(country.name)}#apply`} className="btn-primary" style={{ fontSize:15, padding:'13px 28px', background:'var(--gold)', color:'var(--navy)' }}>
                  Apply for {country.name} →
                </Link>
                <Link to="/destinations" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'13px 22px', border:'1.5px solid rgba(255,255,255,0.3)', borderRadius:8, color:'white', fontSize:15, fontWeight:600, textDecoration:'none', background:'rgba(255,255,255,0.05)' }}>
                  Browse other destinations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FACTS */}
      <section style={{ background:'white', borderBottom:'1px solid #F3F4F6', padding:'32px 20px' }}>
        <div className="r-grid-4" style={{ maxWidth:1024, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, textAlign:'center' }}>
          <Fact label="Validity" value={country.validity} />
          <Fact label="Max stay" value={country.maxStay} />
          <Fact label="Entries" value={country.entries} />
          <Fact label="Processing" value={country.processingTime} />
        </div>
      </section>

      {/* VARIANTS */}
      {variants.length > 0 && (
        <section style={{ padding:'56px 20px', background:'#F9FAFB' }}>
          <div style={{ maxWidth:1024, margin:'0 auto' }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:30, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>
              Visa options for {country.name}
            </h2>
            <p style={{ color:'#6B7280', fontSize:14, marginBottom:24 }}>
              All fees include the government fee. eVisa service fee added at checkout.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
              {variants.map(v => (
                <div key={v.key} style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:22 }}>
                  <h3 style={{ fontSize:16, fontWeight:700, color:'var(--navy)', marginBottom:6 }}>{v.label}</h3>
                  <div style={{ fontFamily:'Fraunces,serif', fontSize:32, fontWeight:900, color:'var(--blue)', marginBottom:14 }}>
                    ${v.govFee}<span style={{ fontSize:12, color:'#6B7280', fontWeight:600 }}> / applicant gov fee</span>
                  </div>
                  <ul style={{ listStyle:'none', padding:0, fontSize:13, color:'#374151', lineHeight:1.9 }}>
                    <li><strong>Validity:</strong> {describeValidity(v) || '—'}</li>
                    <li><strong>Stay:</strong> {describeStay(v) || '—'}</li>
                    <li><strong>Entries:</strong> {v.entries}</li>
                    {v.purpose?.length > 0 && <li><strong>For:</strong> {v.purpose.join(', ')}</li>}
                    {v.blockNationalities?.length > 0 && (
                      <li style={{ color:'#B91C1C' }}><strong>Excluded:</strong> {v.blockNationalities.join(', ').toUpperCase()}</li>
                    )}
                  </ul>
                  <Link to={`/?destination=${encodeURIComponent(country.name)}&variant=${encodeURIComponent(v.key)}#apply`}
                    className="btn-primary" style={{ marginTop:16, width:'100%', justifyContent:'center' }}>
                    Apply
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* REQUIREMENTS */}
      <section style={{ padding:'56px 20px', background:'white' }}>
        <div style={{ maxWidth:1024, margin:'0 auto', display:'grid', gridTemplateColumns:'2fr 1fr', gap:32 }} className="r-grid-2col">
          <div style={{ minWidth:0 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:28, fontWeight:900, color:'var(--navy)', marginBottom:16 }}>
              Required documents
            </h2>
            <ul style={{ listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:10 }}>
              {requiredDocs.map(k => (
                <li key={k} style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:14, color:'#374151' }}>
                  <span style={{ flexShrink:0, width:22, height:22, borderRadius:'50%', background:'var(--green-light)', color:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800 }}>✓</span>
                  {REQUIRED_DOC_LABEL[k] || k}
                </li>
              ))}
              {rules.passport?.minMonthsBeyondEntry && (
                <li style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:14, color:'#374151' }}>
                  <span style={{ flexShrink:0, width:22, height:22, borderRadius:'50%', background:'var(--green-light)', color:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800 }}>✓</span>
                  Passport must be valid at least {rules.passport.minMonthsBeyondEntry} months past your entry date
                </li>
              )}
              {rules.passport?.ordinaryOnly && (
                <li style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:14, color:'#374151' }}>
                  <span style={{ flexShrink:0, width:22, height:22, borderRadius:'50%', background:'var(--green-light)', color:'var(--green)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800 }}>✓</span>
                  Ordinary passport only (diplomatic / official not accepted)
                </li>
              )}
            </ul>

            {(rules.notes || []).length > 0 && (
              <div style={{ marginTop:24, padding:'16px 18px', background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:12 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#92400E', marginBottom:8 }}>Important notes</div>
                <ul style={{ margin:0, paddingLeft:18, fontSize:13, color:'#78350F', lineHeight:1.8 }}>
                  {rules.notes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            )}
          </div>

          <div style={{ minWidth:0 }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:22, fontWeight:900, color:'var(--navy)', marginBottom:16 }}>
              How it works
            </h2>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {STEPS.map(s => (
                <div key={s.n} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <div style={{ flexShrink:0, fontFamily:'Fraunces,serif', fontSize:18, fontWeight:900, color:'var(--blue)' }}>{s.n}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'var(--navy)' }}>{s.t}</div>
                    <div style={{ fontSize:12, color:'#6B7280', lineHeight:1.6, marginTop:2 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'48px 20px', background:'var(--navy)', textAlign:'center' }}>
        <h2 style={{ fontFamily:'Fraunces,serif', fontSize:28, fontWeight:900, color:'white', marginBottom:8 }}>
          Ready for your trip to {country.name}?
        </h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:15, marginBottom:20 }}>
          Start your application — pre-filled with {country.name} as the destination.
        </p>
        <Link to={`/?destination=${encodeURIComponent(country.name)}#apply`} className="btn-primary" style={{ fontSize:15, padding:'14px 32px', background:'var(--gold)', color:'var(--navy)' }}>
          Apply for {country.name} now →
        </Link>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section style={{ padding:'48px 20px', background:'#F9FAFB' }}>
          <div style={{ maxWidth:1024, margin:'0 auto' }}>
            <h2 style={{ fontFamily:'Fraunces,serif', fontSize:24, fontWeight:900, color:'var(--navy)', marginBottom:18 }}>
              Other destinations in {country.region}
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14 }}>
              {related.map(r => (
                <Link key={r.id} to={`/${slugify(r.name)}`}
                  style={{ background:'white', border:'1px solid #E5E7EB', borderRadius:14, padding:18, textDecoration:'none', color:'inherit', transition:'border-color .15s, transform .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--blue)'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='#E5E7EB'; e.currentTarget.style.transform='none' }}
                >
                  <div style={{ fontSize:36, marginBottom:8 }}>{r.flag}</div>
                  <div style={{ fontSize:15, fontWeight:700, color:'var(--navy)' }}>{r.name}</div>
                  <div style={{ fontSize:12, color:'#6B7280', marginTop:2 }}>{r.tag} · {r.processingTime}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

function Fact({ label, value }) {
  return (
    <div>
      <div style={{ fontSize:11, fontWeight:700, color:'#6B7280', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:4 }}>{label}</div>
      <div style={{ fontFamily:'Fraunces,serif', fontSize:20, fontWeight:900, color:'var(--navy)' }}>{value}</div>
    </div>
  )
}

function CountryLandingFallback() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F9FAFB' }}>
      <div style={{ fontSize:14, color:'#6B7280' }}>Loading destination…</div>
    </div>
  )
}
