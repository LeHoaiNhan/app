// Hardcoded fallback data used when the backend is unreachable.
// Keep this small — just enough so the admin UI is fully clickable for previews.

export const DEMO_ADMIN_USER = {
  id: 'admin-demo',
  email: 'admin@evisa.com',
  name: 'eVisa Admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=F5A623&color=0B1D3A&size=80&bold=true',
  role: 'admin',
}

export const DEMO_ADMIN_TOKEN = 'demo-admin-token'

export const DEMO_ORDERS = [
  {
    id: 'EV-A47B92', customerId: 'demo-customer', status: 'review',
    destination: 'Thailand', flag: '🇹🇭', visaType: 'E-Visa', processing: 'fast',
    fee: { gov: 30, service: 39, total: 69, currency: 'USD' },
    payment: { method: 'card', status: 'paid', paidAt: '2026-04-29T10:30:00Z' },
    applicant: { fullName: 'John Smith', email: 'john.smith@gmail.com', phone: '+1 415 555 0101', dob: '1995-03-12', gender: 'Male', nationality: 'United States', birthPlace: 'San Francisco, USA', photoURL: 'https://ui-avatars.com/api/?name=John+Smith&background=1B4FD8&color=fff&size=200' },
    passport: { no: 'B1234567', type: 'Regular passport', issueDate: '2020-01-15', expiryDate: '2030-01-14', issuePlace: 'San Francisco Passport Agency', issueCountry: 'United States' },
    trip: { purpose: 'Tourism', entryDate: '2026-06-15', exitDate: '2026-06-25', accommodation: 'Hilton Sukhumvit Bangkok', notes: '' },
    timeline: [
      { stage: 'submitted', at: '2026-04-29T10:30:00Z', note: 'Application received, $69 paid successfully' },
      { stage: 'review',    at: '2026-04-30T08:00:00Z', note: 'Expert is reviewing your application' },
    ],
    documents: [],
    createdAt: '2026-04-29T10:30:00Z', updatedAt: '2026-04-30T08:00:00Z',
  },
  {
    id: 'EV-X92K11', customerId: 'demo-customer', status: 'delivered',
    destination: 'Japan', flag: '🇯🇵', visaType: 'E-Visa', processing: 'normal',
    fee: { gov: 30, service: 19, total: 49, currency: 'USD' },
    payment: { method: 'card', status: 'paid', paidAt: '2026-03-15T14:20:00Z' },
    applicant: { fullName: 'John Smith', email: 'john.smith@gmail.com', phone: '+1 415 555 0101', dob: '1995-03-12', gender: 'Male', nationality: 'United States', birthPlace: 'San Francisco, USA', photoURL: 'https://ui-avatars.com/api/?name=John+Smith&background=1B4FD8&color=fff&size=200' },
    passport: { no: 'B1234567', type: 'Regular passport', issueDate: '2020-01-15', expiryDate: '2030-01-14', issuePlace: 'San Francisco Passport Agency', issueCountry: 'United States' },
    trip: { purpose: 'Tourism', entryDate: '2026-04-01', exitDate: '2026-04-10', accommodation: 'Park Hotel Tokyo', notes: '' },
    timeline: [
      { stage: 'submitted', at: '2026-03-15T14:20:00Z', note: 'Application received' },
      { stage: 'review',    at: '2026-03-16T09:00:00Z', note: 'Application looks good' },
      { stage: 'sent',      at: '2026-03-17T11:00:00Z', note: 'Sent to Japanese visa authority' },
      { stage: 'approved',  at: '2026-03-21T15:00:00Z', note: 'Visa approved' },
      { stage: 'delivered', at: '2026-03-21T16:30:00Z', note: 'Visa email sent to john.smith@gmail.com' },
    ],
    documents: [],
    createdAt: '2026-03-15T14:20:00Z', updatedAt: '2026-03-21T16:30:00Z',
  },
  {
    id: 'EV-P3L8M2', customerId: 'cust-002', status: 'submitted',
    destination: 'South Korea', flag: '🇰🇷', visaType: 'E-Visa', processing: 'express',
    fee: { gov: 30, service: 69, total: 99, currency: 'USD' },
    payment: { method: 'card', status: 'paid', paidAt: '2026-05-05T08:00:00Z' },
    applicant: { fullName: 'Emma Johnson', email: 'emma.johnson@gmail.com', phone: '+44 20 7946 0102', dob: '1992-07-23', gender: 'Female', nationality: 'United Kingdom', birthPlace: 'London, UK', photoURL: 'https://ui-avatars.com/api/?name=Emma+Johnson&background=F59E0B&color=fff&size=200' },
    passport: { no: 'C7654321', type: 'Regular passport', issueDate: '2023-05-10', expiryDate: '2033-05-10', issuePlace: 'HM Passport Office London', issueCountry: 'United Kingdom' },
    trip: { purpose: 'Tourism', entryDate: '2026-05-15', exitDate: '2026-05-22', accommodation: 'Hotel Skypark Myeongdong', notes: 'Traveling with 4 friends' },
    timeline: [{ stage: 'submitted', at: '2026-05-05T08:00:00Z', note: 'Application just received, payment successful' }],
    documents: [],
    createdAt: '2026-05-05T08:00:00Z', updatedAt: '2026-05-05T08:00:00Z',
  },
]

export const DEMO_COUNTRIES = [
  { id:'c1', name:'Thailand', flag:'🇹🇭', iso:'th', region:'Southeast Asia', city:'Bangkok', tag:'E-Visa', govFee:30, processingTime:'3-5 days', maxStay:'30 days', entries:'Single', validity:'3 months', description:'Tropical beaches and rich culture.', popular:true, trending:true, active:true, sortOrder:1 },
  { id:'c2', name:'Japan', flag:'🇯🇵', iso:'jp', region:'East Asia', city:'Tokyo', tag:'E-Visa', govFee:30, processingTime:'5-7 days', maxStay:'90 days', entries:'Single', validity:'3 months', description:'Modern cities and ancient traditions.', popular:true, trending:false, active:true, sortOrder:2 },
  { id:'c3', name:'South Korea', flag:'🇰🇷', iso:'kr', region:'East Asia', city:'Seoul', tag:'E-Visa', govFee:30, processingTime:'3-5 days', maxStay:'90 days', entries:'Single', validity:'3 months', description:'K-pop and tech.', popular:true, trending:true, active:true, sortOrder:3 },
  { id:'c4', name:'Singapore', flag:'🇸🇬', iso:'sg', region:'Southeast Asia', city:'Singapore', tag:'E-Visa', govFee:30, processingTime:'3-5 days', maxStay:'30 days', entries:'Single', validity:'3 months', description:'Garden city.', popular:true, trending:false, active:true, sortOrder:4 },
  { id:'c5', name:'Dubai (UAE)', flag:'🇦🇪', iso:'ae', region:'Middle East', city:'Dubai', tag:'E-Visa', govFee:30, processingTime:'3-5 days', maxStay:'30 days', entries:'Single', validity:'2 months', description:'Skyscrapers and desert.', popular:true, trending:false, active:true, sortOrder:5 },
  { id:'c6', name:'Turkey', flag:'🇹🇷', iso:'tr', region:'Middle East', city:'Istanbul', tag:'E-Visa', govFee:30, processingTime:'3-5 days', maxStay:'90 days', entries:'Multiple', validity:'6 months', description:'Crossroads of continents.', popular:false, trending:true, active:true, sortOrder:6 },
  { id:'c7', name:'Indonesia', flag:'🇮🇩', iso:'id', region:'Southeast Asia', city:'Bali', tag:'Visa on Arrival', govFee:35, processingTime:'1-3 days', maxStay:'30 days', entries:'Single', validity:'1 month', description:'Bali and beyond.', popular:true, trending:false, active:true, sortOrder:7 },
  { id:'c8', name:'India', flag:'🇮🇳', iso:'in', region:'South Asia', city:'New Delhi', tag:'E-Visa', govFee:30, processingTime:'3-5 days', maxStay:'30 days', entries:'Single', validity:'1 month', description:'History and color.', popular:false, trending:true, active:true, sortOrder:8 },
  { id:'c9', name:'Australia', flag:'🇦🇺', iso:'au', region:'Oceania', city:'Sydney', tag:'eTA', govFee:95, processingTime:'1-3 days', maxStay:'90 days', entries:'Multiple', validity:'12 months', description:'Beaches and outback.', popular:true, trending:false, active:true, sortOrder:9 },
]

export const DEMO_SERVICE_TIERS = [
  { id:'t1', key:'normal',  label:'Standard', fee:19, processingTime:'5-7 days', description:'Standard processing.', features:['Expert review','Email updates','24/7 support'], accent:'#1B4FD8', popular:false, active:true, sortOrder:1 },
  { id:'t2', key:'fast',    label:'Fast',     fee:39, processingTime:'2-3 days', description:'Priority processing.', features:['Everything in Standard','Priority queue','SMS updates'], accent:'#F5A623', popular:true,  active:true, sortOrder:2 },
  { id:'t3', key:'express', label:'Express',  fee:69, processingTime:'24h',     description:'Same-day processing.', features:['Everything in Fast','Top priority','Phone support'], accent:'#16A34A', popular:false, active:true, sortOrder:3 },
]
