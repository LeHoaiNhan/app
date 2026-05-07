import { Router } from 'express'
import { z } from 'zod'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { prisma } from '../lib/prisma.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { generateOrderId } from '../lib/orderId.js'
import { recordAudit } from '../lib/audit.js'
import { notifyOrderStatus, notifyOrderConfirmation } from '../lib/notifier.js'
import { parseDateRange, parsePagination } from '../lib/dateFilter.js'

const router = Router()

const ORDER_STATUSES = ['submitted', 'review', 'sent', 'approved', 'delivered', 'rejected']
const DOCUMENT_KINDS = ['applicant_photo', 'passport_scan', 'supporting', 'visa_result']

const UPLOAD_DIR = path.resolve('uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const docStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    cb(null, name)
  },
})

const docUpload = multer({
  storage: docStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/^(image\/(png|jpe?g|webp)|application\/pdf)$/.test(file.mimetype)) {
      return cb(new Error('Only PNG, JPG, WEBP, or PDF files are allowed'))
    }
    cb(null, true)
  },
})

router.use(requireAuth)

router.get('/', async (req, res, next) => {
  try {
    const { status, q } = req.query
    const where = { ...parseDateRange(req.query, 'createdAt') }
    if (req.user.role !== 'admin') where.customerId = req.user.id
    if (status && ORDER_STATUSES.includes(status)) where.status = status
    if (q) {
      where.OR = [
        { id: { contains: String(q), mode: 'insensitive' } },
        { destination: { contains: String(q), mode: 'insensitive' } },
      ]
    }
    const { take, skip } = parsePagination(req.query, { defaultLimit: 50, maxLimit: 200 })
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          timeline: { orderBy: { at: 'asc' } },
          documents: { orderBy: { createdAt: 'asc' } },
        },
        take, skip,
      }),
      prisma.order.count({ where }),
    ])
    res.json({ orders, total, take, skip })
  } catch (err) { next(err) }
})

router.get('/:id', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        timeline: { orderBy: { at: 'asc' } },
        documents: { orderBy: { createdAt: 'asc' } },
      },
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
    method: z.enum(['card', 'ewallet', 'bank', 'paypal']),
    status: z.enum(['paid', 'pending', 'refunded']).default('paid'),
    paidAt: z.string().datetime().optional(),
    paypalOrderId: z.string().optional(),
    paypalCaptureId: z.string().optional(),
    paypalAmount: z.object({ currency_code: z.string(), value: z.string() }).optional(),
    payer: z.object({ email: z.string().optional(), payerId: z.string().optional() }).nullable().optional(),
  }).passthrough(),
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
    variantKey: z.string().optional().default(''),
  }),
})

router.post('/', async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body)

    // Idempotency: if a PayPal capture id is supplied and we already saved an
    // order for it, return that order instead of double-creating + double-charging.
    const captureId = data.payment?.paypalCaptureId
    if (captureId) {
      const existing = await prisma.order.findFirst({
        where: { customerId: req.user.id, payment: { path: ['paypalCaptureId'], equals: captureId } },
        include: {
          timeline: { orderBy: { at: 'asc' } },
          documents: { orderBy: { createdAt: 'asc' } },
        },
      })
      if (existing) return res.status(200).json({ order: existing, idempotent: true })
    }

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
      include: {
        timeline: { orderBy: { at: 'asc' } },
        documents: { orderBy: { createdAt: 'asc' } },
      },
    })
    notifyOrderConfirmation(order).catch(err => console.warn('[notifier]', err.message))
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
      include: {
        timeline: { orderBy: { at: 'asc' } },
        documents: { orderBy: { createdAt: 'asc' } },
      },
    })
    await recordAudit(req, {
      action: 'order.status_update',
      resource: `Order:${order.id}`,
      payload: { from: exists.status, to: status, note },
    })
    notifyOrderStatus(order, status, note).catch(err => console.warn('[notifier]', err.message))
    res.json({ order })
  } catch (err) { next(err) }
})

router.get('/:id/documents', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    if (req.user.role !== 'admin' && order.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    const documents = await prisma.document.findMany({
      where: { orderId: req.params.id },
      orderBy: { createdAt: 'asc' },
    })
    res.json({ documents })
  } catch (err) { next(err) }
})

router.post('/:id/documents', requireAdmin, docUpload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    const order = await prisma.order.findUnique({ where: { id: req.params.id } })
    if (!order) {
      try { fs.unlinkSync(req.file.path) } catch (_e) { /* ignore */ }
      return res.status(404).json({ error: 'Order not found' })
    }

    const kind = DOCUMENT_KINDS.includes(req.body?.kind) ? req.body.kind : 'visa_result'
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

    const doc = await prisma.document.create({
      data: {
        uploaderId: req.user.id,
        orderId: order.id,
        kind,
        filename: req.file.filename,
        url,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    })
    res.status(201).json({ document: doc })
  } catch (err) { next(err) }
})

export default router
