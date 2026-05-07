import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { verifyToken } from '../lib/jwt.js'

const router = Router()

const TAGS = ['E-Visa', 'Visa on Arrival', 'eTA', 'Visa-free']

const countrySchema = z.object({
  name: z.string().min(1),
  flag: z.string().min(1),
  iso: z.string().min(2).max(3).toLowerCase(),
  region: z.string().min(1),
  city: z.string().min(1),
  tag: z.enum(TAGS),
  govFee: z.number().int().nullable(),
  processingTime: z.string().min(1),
  maxStay: z.string().min(1),
  entries: z.string().min(1),
  validity: z.string().min(1),
  description: z.string().min(1),
  popular: z.boolean().optional().default(false),
  trending: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
})

router.get('/', async (req, res, next) => {
  try {
    let isAdmin = false
    const header = req.headers.authorization || ''
    if (header.startsWith('Bearer ')) {
      try {
        const decoded = verifyToken(header.slice(7))
        isAdmin = decoded.role === 'admin'
      } catch {}
    }
    const where = isAdmin ? {} : { active: true }
    const countries = await prisma.country.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    })
    res.json({ countries })
  } catch (err) { next(err) }
})

router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = countrySchema.parse(req.body)
    const country = await prisma.country.create({ data })
    res.status(201).json({ country })
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Country name already exists' })
    next(err)
  }
})

router.patch('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = countrySchema.partial().parse(req.body)
    const country = await prisma.country.update({
      where: { id: req.params.id },
      data,
    })
    res.json({ country })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Country not found' })
    if (err.code === 'P2002') return res.status(409).json({ error: 'Country name already exists' })
    next(err)
  }
})

router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await prisma.country.delete({ where: { id: req.params.id } })
    res.json({ ok: true })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Country not found' })
    next(err)
  }
})

export default router
