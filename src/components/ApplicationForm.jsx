import { useEffect, useRef, useState } from 'react'
import Step1Personal from './steps/Step1Personal'
import Step2Passport from './steps/Step2Passport'
import Step3Trip     from './steps/Step3Trip'
import Step4Payment  from './steps/Step4Payment'
import { api, getToken } from '../lib/api'

const STEPS = [
  { id:1, label:'Personal',  emoji:'👤' },
  { id:2, label:'Passport',  emoji:'📘' },
  { id:3, label:'Trip',      emoji:'✈️' },
  { id:4, label:'Payment',   emoji:'💳' },
]
const TITLES = ['Personal information','Passport information','Trip details','Confirm & Pay']

const INIT = {
  personal: { lastName:'',firstName:'',gender:'Male',dob:'',email:'',phone:'',nationality:'United States',birthPlace:'',photo:null,photoURL:'' },
  passport: { passportNo:'',passportType:'Regular passport',issueDate:'',expiryDate:'',issuePlace:'',issueCountry:'United States',passportImg:null,passportImgURL:'' },
  trip:     { destination:'Thailand',purpose:'Tourism',entryDate:'',exitDate:'',visaType:'E-Visa (electronic)',variantKey:'',processing:'normal',accommodation:'',notes:'' },
}

const DRAFT_KEY = 'evisa-draft-v1'

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.data?.personal || !parsed?.data?.passport || !parsed?.data?.trip) return null
    // Drop blob: photo URLs that won't survive a refresh
    const sanitizeUrl = (u) => (typeof u === 'string' && /^https?:\/\//.test(u)) ? u : ''
    return {
      data: {
        personal: { ...INIT.personal, ...parsed.data.personal, photo: null, photoURL: sanitizeUrl(parsed.data.personal.photoURL) },
        passport: { ...INIT.passport, ...parsed.data.passport, passportImg: null, passportImgURL: sanitizeUrl(parsed.data.passport.passportImgURL) },
        trip:     { ...INIT.trip,     ...parsed.data.trip },
      },
      step: Math.min(Math.max(1, Number(parsed.step) || 1), 4),
      savedAt: Number(parsed.savedAt) || 0,
    }
  } catch { return null }
}

function cleanDraftData(data) {
  return {
    personal: { ...data.personal, photo: undefined },
    passport: { ...data.passport, passportImg: undefined },
    trip:     data.trip,
  }
}

function saveDraftLocal(data, step) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ data: cleanDraftData(data), step, savedAt: Date.now() }))
  } catch {}
}

async function saveDraftServer(data, step) {
  if (!getToken()) return
  try { await api.put('/draft-orders/mine', { data: cleanDraftData(data), step }) } catch {}
}

function clearDraftLocal() {
  try { localStorage.removeItem(DRAFT_KEY) } catch {}
}

async function clearDraftServer() {
  if (!getToken()) return
  try { await api.delete('/draft-orders/mine') } catch {}
}

export default function ApplicationForm() {
  const initial = useRef(loadDraft())
  const [step, setStep] = useState(initial.current?.step || 1)
  const [data, setData] = useState(() => initial.current?.data || INIT)
  const [savedAt, setSavedAt] = useState(initial.current?.savedAt || 0)
  const [hadDraft, setHadDraft] = useState(!!initial.current)
  const [draftSource, setDraftSource] = useState(initial.current ? 'local' : null)
  const saveTimer = useRef(null)
  const dirty = useRef(false)

  // On mount: if logged in and server has a newer draft, prefer it.
  useEffect(() => {
    if (!getToken()) return
    let cancelled = false
    api.get('/draft-orders/mine')
      .then(({ data: res }) => {
        if (cancelled || !res?.draft) return
        const serverAt = new Date(res.draft.updatedAt).getTime()
        const localAt = initial.current?.savedAt || 0
        if (serverAt > localAt) {
          const restored = res.draft.data
          // Defensive merge — server payload might be from older form version.
          setData(prev => ({
            personal: { ...INIT.personal, ...(restored.personal || {}), photo: null },
            passport: { ...INIT.passport, ...(restored.passport || {}), passportImg: null },
            trip:     { ...INIT.trip,     ...(restored.trip || {}) },
          }))
          if (typeof res.draft.step === 'number') setStep(res.draft.step)
          setSavedAt(serverAt)
          setHadDraft(true)
          setDraftSource('server')
        }
      })
      .catch(() => { /* offline / unauth — fall back to local draft */ })
    return () => { cancelled = true }
  }, [])

  const update = (section) => (field, value) => {
    dirty.current = true
    setData(p => ({ ...p, [section]: { ...p[section], [field]: value } }))
  }

  const next = () => setStep(s => Math.min(s+1, 4))
  const back = () => setStep(s => Math.max(s-1, 1))
  const goToStep = (n) => setStep(Math.min(Math.max(1, n), 4))

  useEffect(() => {
    if (!dirty.current) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveDraftLocal(data, step)
      saveDraftServer(data, step)
      setSavedAt(Date.now())
      if (!draftSource) setDraftSource('local')
    }, 500)
    return () => saveTimer.current && clearTimeout(saveTimer.current)
  }, [data, step, draftSource])

  const handleSubmitted = () => {
    clearDraftLocal()
    clearDraftServer()
    setHadDraft(false)
    setDraftSource(null)
  }

  const startFresh = () => {
    clearDraftLocal()
    clearDraftServer()
    setData(INIT)
    setStep(1)
    setSavedAt(0)
    setHadDraft(false)
    setDraftSource(null)
    dirty.current = false
  }

  return (
    <section style={{ background:'#F3F4F6', padding:'56px 0' }}>
      <div style={{ maxWidth:780, margin:'0 auto', padding:'0 20px' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <h2 style={{ fontFamily:'Fraunces,serif', fontSize:34, fontWeight:900, color:'var(--navy)', marginBottom:8 }}>
            Apply for your visa online
          </h2>
          <p style={{ color:'#6B7280', fontSize:15 }}>
            Fill out your details to start the application process
          </p>
        </div>

        {/* Resumed-draft strip */}
        {hadDraft && savedAt > 0 && (
          <div className="draft-resume">
            <div>
              <strong>Welcome back!</strong> We restored your draft from {timeAgo(savedAt)}
              {draftSource === 'server' ? ' — synced from your account.' : '.'}
            </div>
            <button type="button" className="draft-resume-btn" onClick={startFresh}>Start fresh</button>
          </div>
        )}

        {/* Step tabs */}
        <div className="step-tabs">
          {STEPS.map(s => (
            <button
              key={s.id}
              onClick={() => s.id < step && setStep(s.id)}
              className={`step-tab ${step===s.id?'active':''} ${step>s.id?'done':''}`}
            >
              <span className="step-num">
                {step > s.id
                  ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
                  : s.id}
              </span>
              <span style={{ display:'none' }} className="step-label-desktop">{s.label}</span>
              <span className="step-label-mobile">{s.emoji}</span>
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="evisa-card fade-up" key={step}>
          <div className="evisa-card-header">
            <h3 style={{ fontSize:16, fontWeight:700, color:'var(--navy)' }}>
              {STEPS[step-1].emoji} {TITLES[step-1]}
            </h3>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              {savedAt > 0 && <span className="draft-saved" title={new Date(savedAt).toLocaleString()}>✓ Draft saved</span>}
              <span className="step-chip" style={{ fontSize:12, fontWeight:600, color:'#6B7280', background:'white', padding:'4px 12px', borderRadius:20, border:'1px solid #E5E7EB' }}>
                Step {step} of 4
              </span>
            </div>
          </div>

          {step===1 && <Step1Personal data={data.personal} onChange={update('personal')} onNext={next} />}
          {step===2 && <Step2Passport data={data.passport} onChange={update('passport')} onNext={next} onBack={back} />}
          {step===3 && <Step3Trip     data={data.trip}     onChange={update('trip')}     onNext={next} onBack={back} personal={data.personal} passport={data.passport} />}
          {step===4 && <Step4Payment  formData={data}      onBack={back} goToStep={goToStep} onSubmitted={handleSubmitted} />}
        </div>
      </div>

      <style>{`
        @media (min-width: 540px) {
          .step-label-desktop { display: inline !important; }
          .step-label-mobile  { display: none !important; }
        }
        @media (max-width: 539px) {
          .step-label-desktop { display: none !important; }
          .step-label-mobile  { display: inline !important; }
        }
      `}</style>
    </section>
  )
}

function timeAgo(ts) {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000))
  if (s < 60) return `${s}s ago`
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.round(h / 24)}d ago`
}
