import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { recordAudit } from '../lib/audit.js'
import { parseDateRange, parsePagination } from '../lib/dateFilter.js'
import { notifyCustomMessage } from '../lib/notifier.js'

const router = Router()
router.use(requireAuth, requireAdmin)

router.get('/stats', async (_req, res, next) => {
  try {
    const [byStatus, totalOrders, paidAgg, totalUsers, openSupport, last7d] = await Promise.all([
      prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.order.count(),
      prisma.order.findMany({ select: { fee: true, payment: true } }),
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.supportMessage.count({ where: { status: { in: ['open', 'in_progress'] } } }),
      prisma.order.count({
        where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      }),
    ])

    let revenue = 0
    let refunded = 0
    for (const o of paidAgg) {
      const total = Number(o.fee?.total) || 0
      if (o.payment?.status === 'paid') revenue += total
      else if (o.payment?.status === 'refunded') refunded += total
    }

    const counts = Object.fromEntries(byStatus.map(b => [b.status, b._count._all]))

    res.json({
      orders: {
        total: totalOrders,
        last7d,
        byStatus: {
          submitted: counts.submitted || 0,
          review: counts.review || 0,
          sent: counts.sent || 0,
          approved: counts.approved || 0,
          delivered: counts.delivered || 0,
          rejected: counts.rejected || 0,
        },
      },
      revenue: { paid: revenue, refunded, currency: 'USD' },
      users: { customers: totalUsers },
      support: { open: openSupport },
    })
  } catch (err) { next(err) }
})

router.get('/users', async (req, res, next) => {
  try {
    const { q, role } = req.query
    const where = {}
    if (role === 'admin' || role === 'customer') where.role = role
    if (q) {
      where.OR = [
        { email: { contains: String(q), mode: 'insensitive' } },
        { name: { contains: String(q), mode: 'insensitive' } },
      ]
    }
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, name: true, avatar: true, role: true,
        active: true, createdAt: true,
        _count: { select: { orders: true } },
      },
      take: 200,
    })
    res.json({ users })
  } catch (err) { next(err) }
})

const updateUserSchema = z.object({
  active: z.boolean().optional(),
  role: z.enum(['admin', 'customer']).optional(),
  name: z.string().min(1).max(120).optional(),
})

router.patch('/users/:id', async (req, res, next) => {
  try {
    const data = updateUserSchema.parse(req.body)
    if (req.user.id === req.params.id && data.active === false) {
      return res.status(400).json({ error: 'Cannot deactivate yourself' })
    }
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
      select: { id: true, email: true, name: true, role: true, active: true },
    })
    await recordAudit(req, {
      action: 'user.update',
      resource: `User:${user.id}`,
      payload: data,
    })
    res.json({ user })
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'User not found' })
    next(err)
  }
})

router.get('/login-logs', async (req, res, next) => {
  try {
    const { event, provider, email } = req.query
    const where = { ...parseDateRange(req.query, 'createdAt') }
    if (event) where.event = event
    if (provider) where.provider = provider
    if (email) where.email = { contains: String(email), mode: 'insensitive' }
    const { take, skip } = parsePagination(req.query, { defaultLimit: 100, maxLimit: 500 })
    const [logs, total] = await Promise.all([
      prisma.loginLog.findMany({ where, orderBy: { createdAt: 'desc' }, take, skip }),
      prisma.loginLog.count({ where }),
    ])
    res.json({ logs, total, take, skip })
  } catch (err) { next(err) }
})

router.get('/orders/export.csv', async (req, res, next) => {
  try {
    const where = { ...parseDateRange(req.query, 'createdAt') }
    if (req.query.status) where.status = req.query.status
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { customer: { select: { email: true, name: true } } },
      take: 5000,
    })

    const cols = [
      'id', 'status', 'destination', 'visaType', 'processing',
      'customerEmail', 'customerName',
      'applicantName', 'applicantEmail', 'applicantNationality',
      'passportNo', 'tripEntryDate', 'tripExitDate',
      'feeGov', 'feeService', 'feeTotal', 'feeCurrency',
      'paymentMethod', 'paymentStatus', 'paypalCaptureId',
      'createdAt', 'updatedAt',
    ]
    const rows = orders.map(o => [
      o.id, o.status, o.destination, o.visaType, o.processing,
      o.customer?.email || '', o.customer?.name || '',
      o.applicant?.fullName || '', o.applicant?.email || '', o.applicant?.nationality || '',
      o.passport?.no || '', o.trip?.entryDate || '', o.trip?.exitDate || '',
      o.fee?.gov ?? '', o.fee?.service ?? '', o.fee?.total ?? '', o.fee?.currency || 'USD',
      o.payment?.method || '', o.payment?.status || '', o.payment?.paypalCaptureId || '',
      o.createdAt.toISOString(), o.updatedAt.toISOString(),
    ])

    const escape = (v) => {
      const s = String(v ?? '')
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const csv = [cols.join(','), ...rows.map(r => r.map(escape).join(','))].join('\n')

    await recordAudit(req, { action: 'orders.export', resource: 'Order', payload: { count: orders.length, where } })

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="orders-${Date.now()}.csv"`)
    res.send(csv)
  } catch (err) { next(err) }
})

const notifySchema = z.object({
  orderId: z.string().min(1),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
})

router.post('/notify', async (req, res, next) => {
  try {
    const { orderId, subject, message } = notifySchema.parse(req.body)
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    const email = order.applicant?.email
    if (!email) return res.status(400).json({ error: 'Order has no applicant email' })

    const result = await notifyCustomMessage({ to: email, subject, message, order })

    await recordAudit(req, {
      action: 'order.notify',
      resource: `Order:${order.id}`,
      payload: { subject, to: email, sent: !result?.skipped },
    })

    res.json({ ok: true, skipped: !!result?.skipped, to: email })
  } catch (err) { next(err) }
})

router.get('/audits', async (req, res, next) => {
  try {
    const { resource, action } = req.query
    const where = { ...parseDateRange(req.query, 'createdAt') }
    if (resource) where.resource = { contains: String(resource), mode: 'insensitive' }
    if (action) where.action = String(action)
    const { take, skip } = parsePagination(req.query, { defaultLimit: 100, maxLimit: 500 })
    const [audits, total] = await Promise.all([
      prisma.adminAudit.findMany({
        where, orderBy: { createdAt: 'desc' }, take, skip,
        include: { actor: { select: { id: true, email: true, name: true } } },
      }),
      prisma.adminAudit.count({ where }),
    ])
    res.json({ audits, total, take, skip })
  } catch (err) { next(err) }
})

export default router
