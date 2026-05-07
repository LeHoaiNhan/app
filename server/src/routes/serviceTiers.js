import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { verifyToken } from '../lib/jwt.js'
import { recordAudit } from '../lib/audit.js'

const router = Router()

const tierSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  fee: z.number().int().min(0),
  processingTime: z.string().min(1),
  description: z.string().min(1),
  features: z.array(z.string()),
  accent: z.string().min(1),
  popular: z.boolean().optional().default(false),
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
    const tiers = await prisma.serviceTier.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { fee: 'asc' }],
    })
    res.json({ tiers })
  } catch (err) { next(err) }
})

router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = tierSchema.parse(req.body)
    const tier = await prisma.serviceTier.create({ data })
    await recordAudit(req, { action: 'service_tier.create', resource: `ServiceTier:${tier.id}`, payload: { key: tier.key } })
    res.status(201).json({ tier })
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Tier key already exists' })
    next(err)
  }
})

router.patch('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = tierSchema.partial().parse(req.body)
    const tier = await prisma.serviceTier.update({
      where: { id: req.params.id },
      data,
    })
    await recordAudit(req, { action: 'service_tier.update', resource: `ServiceTier:${tier.id}`, payload: data })
    res.json({ tier })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Tier not found' })
    if (err.code === 'P2002') return res.status(409).json({ error: 'Tier key already exists' })
    next(err)
  }
})

router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await prisma.serviceTier.delete({ where: { id: req.params.id } })
    await recordAudit(req, { action: 'service_tier.delete', resource: `ServiceTier:${req.params.id}` })
    res.json({ ok: true })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Tier not found' })
    next(err)
  }
})

export default router
