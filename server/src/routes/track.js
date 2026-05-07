import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { trackLimiter } from '../lib/rateLimit.js'

const router = Router()

const trackSchema = z.object({
  code: z.string().regex(/^EV-[A-Z0-9]{6}$/i, 'Invalid order code'),
  email: z.string().email().optional(),
})

const STAGE_FLOW = ['submitted', 'review', 'sent', 'approved', 'delivered']

router.get('/', trackLimiter, async (req, res, next) => {
  try {
    const { code, email } = trackSchema.parse({
      code: String(req.query.code || ''),
      email: req.query.email ? String(req.query.email) : undefined,
    })

    const order = await prisma.order.findUnique({
      where: { id: code.toUpperCase() },
      include: { timeline: { orderBy: { at: 'asc' } } },
    })

    if (!order) return res.json({ found: false })

    if (email && order.applicant?.email?.toLowerCase() !== email.toLowerCase()) {
      return res.json({ found: false })
    }

    const currentStage = STAGE_FLOW.indexOf(order.status)

    res.json({
      found: true,
      order: {
        id: order.id,
        status: order.status,
        currentStage: currentStage >= 0 ? currentStage : null,
        destination: order.destination,
        flag: order.flag,
        visaType: order.visaType,
        processing: order.processing,
        submittedAt: order.createdAt,
        updatedAt: order.updatedAt,
        timeline: order.timeline.map(t => ({ stage: t.stage, at: t.at, note: t.note })),
      },
    })
  } catch (err) { next(err) }
})

export default router
