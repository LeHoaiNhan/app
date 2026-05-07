import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { authLimiter } from '../lib/rateLimit.js'
import {
  paypalConfigured,
  createPaypalOrder,
  capturePaypalOrder,
  getPaypalOrder,
} from '../lib/paypal.js'

const router = Router()

router.get('/config', (_req, res) => {
  res.json({
    paypal: {
      configured: paypalConfigured,
      clientId: process.env.PAYPAL_CLIENT_ID || null,
    },
  })
})

const createSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  description: z.string().max(127).optional(),
})

router.post('/paypal/create-order', requireAuth, authLimiter, async (req, res, next) => {
  try {
    if (!paypalConfigured) return res.status(503).json({ error: 'PayPal not configured' })
    const { amount, currency, description } = createSchema.parse(req.body)

    const order = await createPaypalOrder({
      amount,
      currency,
      description: description || 'eVisa application fee',
      referenceId: `evisa-${req.user.id}-${Date.now()}`,
    })

    res.json({ paypalOrderId: order.id, status: order.status })
  } catch (err) {
    if (err.details) return res.status(err.status || 502).json({ error: err.message, details: err.details })
    next(err)
  }
})

const captureSchema = z.object({
  paypalOrderId: z.string().min(1),
})

router.post('/paypal/capture-order', requireAuth, authLimiter, async (req, res, next) => {
  try {
    if (!paypalConfigured) return res.status(503).json({ error: 'PayPal not configured' })
    const { paypalOrderId } = captureSchema.parse(req.body)

    const result = await capturePaypalOrder(paypalOrderId)
    const capture = result?.purchase_units?.[0]?.payments?.captures?.[0]
    if (!capture || capture.status !== 'COMPLETED') {
      return res.status(402).json({
        error: 'Payment not completed',
        status: capture?.status || result?.status,
      })
    }

    res.json({
      paypalOrderId: result.id,
      captureId: capture.id,
      status: capture.status,
      amount: capture.amount,
      payer: result.payer ? { email: result.payer.email_address, payerId: result.payer.payer_id } : null,
    })
  } catch (err) {
    if (err.details) return res.status(err.status || 502).json({ error: err.message, details: err.details })
    next(err)
  }
})

router.get('/paypal/order/:id', requireAuth, async (req, res, next) => {
  try {
    if (!paypalConfigured) return res.status(503).json({ error: 'PayPal not configured' })
    const order = await getPaypalOrder(req.params.id)
    res.json({ order })
  } catch (err) {
    if (err.details) return res.status(err.status || 502).json({ error: err.message, details: err.details })
    next(err)
  }
})

export default router
