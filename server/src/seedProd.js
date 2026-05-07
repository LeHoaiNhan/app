import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { prisma } from './lib/prisma.js'
import { SEED_COUNTRIES } from './seedCountries.js'
import { SEED_SERVICE_TIERS } from './seedServiceTiers.js'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@evisa.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!ADMIN_PASSWORD) {
  console.error('[seed:prod] ADMIN_PASSWORD env var is required')
  process.exit(1)
}

async function main() {
  console.log('[seed:prod] starting…')

  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { password: adminHash, role: 'admin' },
    create: {
      email: ADMIN_EMAIL,
      name: 'eVisa Admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=F5A623&color=0B1D3A&size=80&bold=true',
      role: 'admin',
      password: adminHash,
    },
  })
  console.log(`[seed:prod] admin: ${ADMIN_EMAIL}`)

  let countryAdded = 0
  for (const c of SEED_COUNTRIES) {
    const result = await prisma.country.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    })
    if (result.createdAt && Date.now() - new Date(result.createdAt).getTime() < 5000) countryAdded++
  }
  console.log(`[seed:prod] countries: ${SEED_COUNTRIES.length} ensured (${countryAdded} new)`)

  for (const t of SEED_SERVICE_TIERS) {
    await prisma.serviceTier.upsert({
      where: { key: t.key },
      update: {},
      create: t,
    })
  }
  console.log(`[seed:prod] service tiers: ${SEED_SERVICE_TIERS.length} ensured`)

  console.log('[seed:prod] done — DB has admin + catalog, no demo customers/orders')
}

main()
  .catch(err => { console.error(err); process.exit(1) })
  .finally(() => prisma.$disconnect())
