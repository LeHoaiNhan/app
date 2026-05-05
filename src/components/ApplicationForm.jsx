import { useState } from 'react'
import Step1Personal from './steps/Step1Personal'
import Step2Passport from './steps/Step2Passport'
import Step3Trip     from './steps/Step3Trip'
import Step4Payment  from './steps/Step4Payment'

const STEPS = [
  { id:1, label:'Cá nhân',    emoji:'👤' },
  { id:2, label:'Hộ chiếu',   emoji:'📘' },
  { id:3, label:'Hành trình', emoji:'✈️' },
  { id:4, label:'Thanh toán', emoji:'💳' },
]
const TITLES = ['Thông tin cá nhân','Thông tin hộ chiếu','Thông tin hành trình','Xác nhận & Thanh toán']

const INIT = {
  personal: { lastName:'',firstName:'',gender:'Nam',dob:'',email:'',phone:'',nationality:'Việt Nam',birthPlace:'',photo:null,photoURL:'' },
  passport: { passportNo:'',passportType:'Hộ chiếu phổ thông',issueDate:'',expiryDate:'',issuePlace:'',issueCountry:'Việt Nam',passportImg:null,passportImgURL:'' },
  trip:     { destination:'Thái Lan',purpose:'Du lịch',entryDate:'',exitDate:'',visaType:'E-Visa (điện tử)',processing:'normal',accommodation:'',notes:'' },
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
            Đăng ký visa trực tuyến
          </h2>
          <p style={{ color:'#6B7280', fontSize:15 }}>
            Điền thông tin để bắt đầu quy trình xin visa nhanh chóng
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
            <span style={{ fontSize:12, fontWeight:600, color:'#6B7280', background:'white', padding:'4px 12px', borderRadius:20, border:'1px solid #E5E7EB' }}>
              Bước {step} / 4
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
