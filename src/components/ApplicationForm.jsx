import { useState } from 'react'
import Step1Personal from './steps/Step1Personal'
import Step2Passport from './steps/Step2Passport'
import Step3Trip from './steps/Step3Trip'
import Step4Payment from './steps/Step4Payment'

const STEPS = [
  { id:1, label:'Cá nhân', short:'1' },
  { id:2, label:'Hộ chiếu', short:'2' },
  { id:3, label:'Hành trình', short:'3' },
  { id:4, label:'Thanh toán', short:'4' },
]

const TITLES = ['Thông tin cá nhân','Thông tin hộ chiếu','Thông tin hành trình','Xác nhận & Thanh toán']
const ICONS = ['👤','📘','✈️','✅']

const INIT = {
  personal: { lastName:'',firstName:'',gender:'Nam',dob:'',email:'',phone:'',nationality:'Việt Nam',birthPlace:'',photo:null },
  passport: { passportNo:'',passportType:'Hộ chiếu phổ thông',issueDate:'',expiryDate:'',issuePlace:'',issueCountry:'Việt Nam',passportImg:null },
  trip: { destination:'Thái Lan',purpose:'Du lịch',entryDate:'',exitDate:'',visaType:'E-Visa (điện tử)',processing:'Thường — 5-7 ngày',accommodation:'',notes:'' },
}

export default function ApplicationForm() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState(INIT)

  const update = (section) => (field, value) =>
    setData(p => ({ ...p, [section]: { ...p[section], [field]: value } }))

  const next = () => setStep(s => Math.min(s+1,4))
  const back = () => setStep(s => Math.max(s-1,1))

  return (
    <section className="py-12 md:py-16" style={{background:'var(--gray50)'}}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-black mb-2" style={{fontFamily:'Fraunces,serif',color:'var(--navy)'}}>Đăng ký visa trực tuyến</h2>
          <p className="text-gray-500 text-sm md:text-base">Điền thông tin để bắt đầu quy trình xin visa nhanh chóng</p>
        </div>

        {/* STEP TABS */}
        <div className="flex gap-1.5 bg-white border border-gray-200 rounded-xl p-1.5 mb-5 shadow-sm">
          {STEPS.map(s => (
            <button
              key={s.id}
              onClick={() => s.id < step && setStep(s.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 md:py-2.5 px-1 rounded-lg text-xs md:text-sm font-semibold transition-all ${step===s.id ? 'text-white shadow' : step>s.id ? 'text-green-600 cursor-pointer hover:bg-green-50' : 'text-gray-400 cursor-default'}`}
              style={step===s.id ? {background:'var(--blue)'} : {}}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step===s.id ? 'bg-white/20' : step>s.id ? 'bg-green-100' : 'bg-gray-100'}`}>
                {step>s.id ? '✓' : s.id}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>

        {/* FORM CARD */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-base font-bold" style={{color:'var(--navy)'}}>{ICONS[step-1]} {TITLES[step-1]}</h3>
            <span className="text-xs font-semibold text-gray-500 bg-white px-2.5 py-1 rounded-full border border-gray-200">Bước {step}/4</span>
          </div>
          {step===1 && <Step1Personal data={data.personal} onChange={update('personal')} onNext={next} />}
          {step===2 && <Step2Passport data={data.passport} onChange={update('passport')} onNext={next} onBack={back} />}
          {step===3 && <Step3Trip data={data.trip} onChange={update('trip')} onNext={next} onBack={back} />}
          {step===4 && <Step4Payment formData={data} onBack={back} />}
        </div>
      </div>
    </section>
  )
}
