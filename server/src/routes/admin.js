import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { recordAudit } from '../lib/audit.js'

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
    const { event, provider, email, take } = req.query
    const where = {}
    if (event) where.event = event
    if (provider) where.provider = provider
    if (email) where.email = { contains: String(email), mode: 'insensitive' }
    const logs = await prisma.loginLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Number(take) || 100, 500),
    })
    res.json({ logs })
  } catch (err) { next(err) }
})

router.get('/audits', async (req, res, next) => {
  try {
    const { resource, action, take } = req.query
    const where = {}
    if (resource) where.resource = { contains: String(resource), mode: 'insensitive' }
    if (action) where.action = String(action)
    const audits = await prisma.adminAudit.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Number(take) || 100, 500),
      include: { actor: { select: { id: true, email: true, name: true } } },
    })
    res.json({ audits })
  } catch (err) { next(err) }
})

export default router
