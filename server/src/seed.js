import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from './lib/prisma.js'
import { SEED_COUNTRIES } from './seedCountries.js'
import { SEED_SERVICE_TIERS } from './seedServiceTiers.js'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@evisa.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

const SEED_USERS = [
  { id: 'demo-customer', email: 'john.smith@gmail.com', name: 'John Smith',
    avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=1B4FD8&color=fff&size=80', role: 'customer' },
  { id: 'cust-002', email: 'emma.johnson@gmail.com', name: 'Emma Johnson',
    avatar: 'https://ui-avatars.com/api/?name=Emma+Johnson&background=F59E0B&color=fff&size=80', role: 'customer' },
  { id: 'cust-003', email: 'michael.brown@yahoo.com', name: 'Michael Brown',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=10B981&color=fff&size=80', role: 'customer' },
  { id: 'cust-004', email: 'david.wilson@gmail.com', name: 'David Wilson',
    avatar: 'https://ui-avatars.com/api/?name=David+Wilson&background=DC2626&color=fff&size=80', role: 'customer' },
  { id: 'cust-005', email: 'sophie.martin@gmail.com', name: 'Sophie Martin',
    avatar: 'https://ui-avatars.com/api/?name=Sophie+Martin&background=9333EA&color=fff&size=80', role: 'customer' },
  { id: 'cust-006', email: 'andreas.schmidt@gmail.com', name: 'Andreas Schmidt',
    avatar: 'https://ui-avatars.com/api/?name=Andreas+Schmidt&background=059669&color=fff&size=80', role: 'customer' },
  { id: 'cust-007', email: 'olivia.davis@yahoo.com', name: 'Olivia Davis',
    avatar: 'https://ui-avatars.com/api/?name=Olivia+Davis&background=F5A623&color=fff&size=80', role: 'customer' },
  { id: 'cust-008', email: 'james.anderson@gmail.com', name: 'James Anderson',
    avatar: 'https://ui-avatars.com/api/?name=James+Anderson&background=1B4FD8&color=fff&size=80', role: 'customer' },
]

const SEED_ORDERS = [
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
    createdAt: '2026-05-05T08:00:00Z', updatedAt: '2026-05-05T08:00:00Z',
  },
  {
    id: 'EV-K4N7T9', customerId: 'cust-003', status: 'sent',
    destination: 'Dubai (UAE)', flag: '🇦🇪', visaType: 'E-Visa', processing: 'fast',
    fee: { gov: 30, service: 39, total: 69, currency: 'USD' },
    payment: { method: 'ewallet', status: 'paid', paidAt: '2026-05-02T12:00:00Z' },
    applicant: { fullName: 'Michael Brown', email: 'michael.brown@yahoo.com', phone: '+1 212 555 0103', dob: '1988-11-05', gender: 'Male', nationality: 'United States', birthPlace: 'New York, USA', photoURL: 'https://ui-avatars.com/api/?name=Michael+Brown&background=10B981&color=fff&size=200' },
    passport: { no: 'A5432167', type: 'Regular passport', issueDate: '2017-12-20', expiryDate: '2027-12-19', issuePlace: 'New York Passport Agency', issueCountry: 'United States' },
    trip: { purpose: 'Business', entryDate: '2026-05-20', exitDate: '2026-05-27', accommodation: 'Burj Al Arab', notes: '' },
    timeline: [
      { stage: 'submitted', at: '2026-05-02T12:00:00Z', note: 'Application received' },
      { stage: 'review',    at: '2026-05-02T14:30:00Z', note: 'Application looks good' },
      { stage: 'sent',      at: '2026-05-03T09:00:00Z', note: 'Sent to UAE authority' },
    ],
    createdAt: '2026-05-02T12:00:00Z', updatedAt: '2026-05-03T09:00:00Z',
  },
  {
    id: 'EV-Q9F2R8', customerId: 'cust-004', status: 'rejected',
    destination: 'Turkey', flag: '🇹🇷', visaType: 'E-Visa', processing: 'normal',
    fee: { gov: 30, service: 19, total: 49, currency: 'USD' },
    payment: { method: 'card', status: 'refunded', paidAt: '2026-04-20T10:00:00Z' },
    applicant: { fullName: 'David Wilson', email: 'david.wilson@gmail.com', phone: '+61 2 5550 0104', dob: '1990-02-28', gender: 'Male', nationality: 'Australia', birthPlace: 'Sydney, Australia', photoURL: 'https://ui-avatars.com/api/?name=David+Wilson&background=DC2626&color=fff&size=200' },
    passport: { no: 'D9871234', type: 'Regular passport', issueDate: '2021-08-15', expiryDate: '2026-08-15', issuePlace: 'Sydney Passport Office', issueCountry: 'Australia' },
    trip: { purpose: 'Tourism', entryDate: '2026-05-10', exitDate: '2026-05-18', accommodation: 'Sultan Hotel Istanbul', notes: '' },
    timeline: [
      { stage: 'submitted', at: '2026-04-20T10:00:00Z', note: 'Application received' },
      { stage: 'review',    at: '2026-04-20T11:30:00Z', note: 'Passport expiring soon detected' },
      { stage: 'rejected',  at: '2026-04-21T09:00:00Z', note: 'Passport has only 4 months remaining — please renew before applying. $19 service fee refunded.' },
    ],
    createdAt: '2026-04-20T10:00:00Z', updatedAt: '2026-04-21T09:00:00Z',
  },
  {
    id: 'EV-W6Y1Z3', customerId: 'cust-005', status: 'approved',
    destination: 'Singapore', flag: '🇸🇬', visaType: 'E-Visa', processing: 'fast',
    fee: { gov: 30, service: 39, total: 69, currency: 'USD' },
    payment: { method: 'card', status: 'paid', paidAt: '2026-04-25T16:00:00Z' },
    applicant: { fullName: 'Sophie Martin', email: 'sophie.martin@gmail.com', phone: '+33 1 5550 0105', dob: '1996-09-15', gender: 'Female', nationality: 'France', birthPlace: 'Paris, France', photoURL: 'https://ui-avatars.com/api/?name=Sophie+Martin&background=9333EA&color=fff&size=200' },
    passport: { no: 'B6543219', type: 'Regular passport', issueDate: '2019-03-20', expiryDate: '2029-03-20', issuePlace: 'Paris Prefecture', issueCountry: 'France' },
    trip: { purpose: 'Tourism', entryDate: '2026-05-12', exitDate: '2026-05-16', accommodation: 'Marina Bay Sands', notes: '' },
    timeline: [
      { stage: 'submitted', at: '2026-04-25T16:00:00Z', note: 'Application received' },
      { stage: 'review',    at: '2026-04-25T18:00:00Z', note: 'Application looks good' },
      { stage: 'sent',      at: '2026-04-26T09:00:00Z', note: 'Sent to Singapore authority' },
      { stage: 'approved',  at: '2026-04-28T14:00:00Z', note: 'Visa approved, preparing to send' },
    ],
    createdAt: '2026-04-25T16:00:00Z', updatedAt: '2026-04-28T14:00:00Z',
  },
  {
    id: 'EV-T8V5C7', customerId: 'cust-006', status: 'submitted',
    destination: 'Indonesia', flag: '🇮🇩', visaType: 'Visa on Arrival', processing: 'normal',
    fee: { gov: 35, service: 19, total: 54, currency: 'USD' },
    payment: { method: 'ewallet', status: 'paid', paidAt: '2026-05-04T20:00:00Z' },
    applicant: { fullName: 'Andreas Schmidt', email: 'andreas.schmidt@gmail.com', phone: '+49 30 5550 0106', dob: '1985-05-30', gender: 'Male', nationality: 'Germany', birthPlace: 'Munich, Germany', photoURL: 'https://ui-avatars.com/api/?name=Andreas+Schmidt&background=059669&color=fff&size=200' },
    passport: { no: 'C9876543', type: 'Regular passport', issueDate: '2020-11-10', expiryDate: '2030-11-10', issuePlace: 'Munich Passport Office', issueCountry: 'Germany' },
    trip: { purpose: 'Tourism', entryDate: '2026-07-01', exitDate: '2026-07-15', accommodation: 'Bali Hyatt Sanur', notes: 'Traveling with wife and 2 children' },
    timeline: [{ stage: 'submitted', at: '2026-05-04T20:00:00Z', note: 'Application just received' }],
    createdAt: '2026-05-04T20:00:00Z', updatedAt: '2026-05-04T20:00:00Z',
  },
  {
    id: 'EV-J2H6B4', customerId: 'cust-007', status: 'review',
    destination: 'India', flag: '🇮🇳', visaType: 'E-Visa', processing: 'normal',
    fee: { gov: 30, service: 19, total: 49, currency: 'USD' },
    payment: { method: 'card', status: 'paid', paidAt: '2026-05-03T11:00:00Z' },
    applicant: { fullName: 'Olivia Davis', email: 'olivia.davis@yahoo.com', phone: '+1 312 555 0107', dob: '1993-08-12', gender: 'Female', nationality: 'United States', birthPlace: 'Chicago, USA', photoURL: 'https://ui-avatars.com/api/?name=Olivia+Davis&background=F5A623&color=fff&size=200' },
    passport: { no: 'A1357924', type: 'Regular passport', issueDate: '2018-06-25', expiryDate: '2028-06-25', issuePlace: 'Chicago Passport Agency', issueCountry: 'United States' },
    trip: { purpose: 'Tourism', entryDate: '2026-06-01', exitDate: '2026-06-10', accommodation: 'Taj Mahal Hotel New Delhi', notes: '' },
    timeline: [
      { stage: 'submitted', at: '2026-05-03T11:00:00Z', note: 'Application received' },
      { stage: 'review',    at: '2026-05-04T08:00:00Z', note: 'Reviewing portrait photo' },
    ],
    createdAt: '2026-05-03T11:00:00Z', updatedAt: '2026-05-04T08:00:00Z',
  },
  {
    id: 'EV-S5G3D9', customerId: 'cust-008', status: 'approved',
    destination: 'Australia', flag: '🇦🇺', visaType: 'E-Visa', processing: 'fast',
    fee: { gov: 95, service: 39, total: 134, currency: 'USD' },
    payment: { method: 'card', status: 'paid', paidAt: '2026-04-15T13:00:00Z' },
    applicant: { fullName: 'James Anderson', email: 'james.anderson@gmail.com', phone: '+1 617 555 0108', dob: '1980-12-22', gender: 'Male', nationality: 'United States', birthPlace: 'Boston, USA', photoURL: 'https://ui-avatars.com/api/?name=James+Anderson&background=1B4FD8&color=fff&size=200' },
    passport: { no: 'B2468135', type: 'Regular passport', issueDate: '2021-04-30', expiryDate: '2031-04-30', issuePlace: 'Boston Passport Agency', issueCountry: 'United States' },
    trip: { purpose: 'Business', entryDate: '2026-05-25', exitDate: '2026-06-05', accommodation: 'Four Seasons Sydney', notes: 'Annual conference' },
    timeline: [
      { stage: 'submitted', at: '2026-04-15T13:00:00Z', note: 'Application received' },
      { stage: 'review',    at: '2026-04-15T15:00:00Z', note: 'Application looks good' },
      { stage: 'sent',      at: '2026-04-16T10:00:00Z', note: 'Sent to Australian authority' },
      { stage: 'approved',  at: '2026-04-23T09:30:00Z', note: 'Visa approved' },
    ],
    createdAt: '2026-04-15T13:00:00Z', updatedAt: '2026-04-23T09:30:00Z',
  },
]

async function main() {
  console.log('[seed] starting…')

  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { password: adminHash, role: 'admin' },
    create: {
      id: 'admin-demo',
      email: ADMIN_EMAIL,
      name: 'eVisa Admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=F5A623&color=0B1D3A&size=80&bold=true',
      role: 'admin',
      password: adminHash,
    },
  })
  console.log(`[seed] admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)

  for (const u of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    })
  }
  console.log(`[seed] ${SEED_USERS.length} customers`)

  for (const o of SEED_ORDERS) {
    const { timeline, createdAt, updatedAt, ...rest } = o
    await prisma.order.upsert({
      where: { id: o.id },
      update: {},
      create: {
        ...rest,
        createdAt: new Date(createdAt),
        updatedAt: new Date(updatedAt),
        timeline: {
          create: timeline.map(t => ({ stage: t.stage, at: new Date(t.at), note: t.note })),
        },
      },
    })
  }
  console.log(`[seed] ${SEED_ORDERS.length} orders`)

  for (const c of SEED_COUNTRIES) {
    await prisma.country.upsert({
      where: { name: c.name },
      update: c,
      create: c,
    })
  }
  console.log(`[seed] ${SEED_COUNTRIES.length} countries`)

  for (const t of SEED_SERVICE_TIERS) {
    await prisma.serviceTier.upsert({
      where: { key: t.key },
      update: t,
      create: t,
    })
  }
  console.log(`[seed] ${SEED_SERVICE_TIERS.length} service tiers`)

  console.log('[seed] done')
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
