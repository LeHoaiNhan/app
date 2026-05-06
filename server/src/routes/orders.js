import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { generateOrderId } from '../lib/orderId.js'

const router = Router()

const ORDER_STATUSES = ['submitted', 'review', 'sent', 'approved', 'delivered', 'rejected']

router.use(requireAuth)

router.get('/', async (req, res, next) => {
  try {
    const { status, q } = req.query
    const where = {}
    if (req.user.role !== 'admin') where.customerId = req.user.id
    if (status && ORDER_STATUSES.includes(status)) where.status = status
    if (q) {
      where.OR = [
        { id: { contains: String(q), mode: 'insensitive' } },
        { destination: { contains: String(q), mode: 'insensitive' } },
      ]
    }
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { timeline: { orderBy: { at: 'asc' } } },
    })
    res.json({ orders })
  } catch (err) { next(err) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { timeline: { orderBy: { at: 'asc' } } },
    })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    if (req.user.role !== 'admin' && order.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    res.json({ order })
  } catch (err) { next(err) }
})

const createSchema = z.object({
  destination: z.string().min(1),
  flag: z.string().optional(),
  visaType: z.string().min(1),
  processing: z.enum(['normal', 'fast', 'express']),
  fee: z.object({
    gov: z.number(),
    service: z.number(),
    total: z.number(),
    currency: z.string().default('USD'),
  }),
  payment: z.object({
    method: z.enum(['card', 'ewallet', 'bank']),
    status: z.enum(['paid', 'pending', 'refunded']).default('paid'),
    paidAt: z.string().datetime().optional(),
  }),
  applicant: z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    dob: z.string(),
    gender: z.string(),
    nationality: z.string(),
    birthPlace: z.string().optional().default(''),
    photoURL: z.string().url().optional(),
  }),
  passport: z.object({
    no: z.string().min(1),
    type: z.string(),
    issueDate: z.string(),
    expiryDate: z.string(),
    issuePlace: z.string().optional().default(''),
    issueCountry: z.string(),
  }),
  trip: z.object({
    purpose: z.string(),
    entryDate: z.string(),
    exitDate: z.string(),
    accommodation: z.string().optional().default(''),
    notes: z.string().optional().default(''),
  }),
})

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body)
    const id = generateOrderId()
    const order = await prisma.order.create({
      data: {
        id,
        customerId: req.user.id,
        status: 'submitted',
        destination: data.destination,
        flag: data.flag,
        visaType: data.visaType,
        processing: data.processing,
        fee: data.fee,
        payment: data.payment,
        applicant: data.applicant,
        passport: data.passport,
        trip: data.trip,
        timeline: {
          create: [{ stage: 'submitted', note: 'Application received, payment successful' }],
        },
      },
      include: { timeline: { orderBy: { at: 'asc' } } },
    })
    res.status(201).json({ order })
  } catch (err) { next(err) }
})

const statusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  note: z.string().optional(),
})

router.patch('/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const { status, note } = statusSchema.parse(req.body)
    const exists = await prisma.order.findUnique({ where: { id: req.params.id } })
    if (!exists) return res.status(404).json({ error: 'Order not found' })

    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        status,
        timeline: { create: [{ stage: status, note: note || status }] },
      },
      include: { timeline: { orderBy: { at: 'asc' } } },
    })
    res.json({ order })
  } catch (err) { next(err) }
})

export default router
