import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { supportLimiter } from '../lib/rateLimit.js'
import { recordAudit } from '../lib/audit.js'
import { notifySupportReply } from '../lib/notifier.js'

const router = Router()

const SUPPORT_STATUSES = ['open', 'in_progress', 'resolved', 'closed']
const ORDER_CODE_RE = /EV-[A-Z0-9]{6}/i

const createSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
})

router.post('/', supportLimiter, async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body)
    const orderId = data.message.match(ORDER_CODE_RE)?.[0]?.toUpperCase()

    const ip = req.ip || req.headers['x-forwarded-for']?.split(',')[0] || null
    const userAgent = req.headers['user-agent'] || null

    const message = await prisma.supportMessage.create({
      data: { ...data, orderId, ip, userAgent },
    })
    res.status(201).json({ id: message.id, ok: true })
  } catch (err) { next(err) }
})

router.use(requireAuth, requireAdmin)

router.get('/', async (req, res, next) => {
  try {
    const { status, q } = req.query
    const where = {}
    if (status && SUPPORT_STATUSES.includes(status)) where.status = status
    if (q) {
      where.OR = [
        { email: { contains: String(q), mode: 'insensitive' } },
        { name: { contains: String(q), mode: 'insensitive' } },
        { subject: { contains: String(q), mode: 'insensitive' } },
        { orderId: { contains: String(q), mode: 'insensitive' } },
      ]
    }
    const messages = await prisma.supportMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
    })
    res.json({ messages })
  } catch (err) { next(err) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const message = await prisma.supportMessage.findUnique({ where: { id: req.params.id } })
    if (!message) return res.status(404).json({ error: 'Message not found' })
    res.json({ message })
  } catch (err) { next(err) }
})

const updateSchema = z.object({
  status: z.enum(SUPPORT_STATUSES).optional(),
  reply: z.string().max(5000).optional(),
})

router.patch('/:id', async (req, res, next) => {
  try {
    const data = updateSchema.parse(req.body)
    const existing = await prisma.supportMessage.findUnique({ where: { id: req.params.id } })
    if (!existing) return res.status(404).json({ error: 'Message not found' })

    const update = { ...data }
    if (data.reply && data.reply !== existing.reply) {
      update.repliedAt = new Date()
      if (!data.status) update.status = 'resolved'
    }

    const message = await prisma.supportMessage.update({
      where: { id: req.params.id },
      data: update,
    })

    await recordAudit(req, {
      action: 'support.update',
      resource: `SupportMessage:${message.id}`,
      payload: { status: update.status, replied: !!update.reply },
    })

    if (update.reply && update.reply !== existing.reply) {
      notifySupportReply(message).catch(err => console.warn('[notifier]', err.message))
    }

    res.json({ message })
  } catch (err) { next(err) }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.supportMessage.delete({ where: { id: req.params.id } })
    await recordAudit(req, { action: 'support.delete', resource: `SupportMessage:${req.params.id}` })
    res.json({ ok: true })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Message not found' })
    next(err)
  }
})

export default router
