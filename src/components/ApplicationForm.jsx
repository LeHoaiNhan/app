import { useState } from 'react'
import Step1Personal from './steps/Step1Personal'
import Step2Passport from './steps/Step2Passport'
import Step3Trip     from './steps/Step3Trip'
import Step4Payment  from './steps/Step4Payment'

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
  trip:     { destination:'Thailand',purpose:'Tourism',entryDate:'',exitDate:'',visaType:'E-Visa (electronic)',processing:'normal',accommodation:'',notes:'' },
}

export default function ApplicationForm() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(INIT)

  const update = (section) => (field, value) =>
    setData(p => ({ ...p, [section]: { ...p[section], [field]: value } }))

  const next = () => setStep(s => Math.min(s+1, 4))
  const back = () => setStep(s => Math.max(s-1, 1))

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
            <span className="step-chip" style={{ fontSize:12, fontWeight:600, color:'#6B7280', background:'white', padding:'4px 12px', borderRadius:20, border:'1px solid #E5E7EB' }}>
              Step {step} of 4
            </span>
          </div>

          {step===1 && <Step1Personal data={data.personal} onChange={update('personal')} onNext={next} />}
          {step===2 && <Step2Passport data={data.passport} onChange={update('passport')} onNext={next} onBack={back} />}
          {step===3 && <Step3Trip     data={data.trip}     onChange={update('trip')}     onNext={next} onBack={back} />}
          {step===4 && <Step4Payment  formData={data}      onBack={back} />}
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
