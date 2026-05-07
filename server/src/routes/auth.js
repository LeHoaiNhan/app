import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { OAuth2Client } from 'google-auth-library'
import { prisma } from '../lib/prisma.js'
import { signToken } from '../lib/jwt.js'
import { requireAuth } from '../middleware/auth.js'
import { recordLoginEvent } from '../lib/loginLog.js'
import { authLimiter } from '../lib/rateLimit.js'

const router = Router()
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

router.post('/google', authLimiter, async (req, res) => {
  try {
    const { idToken } = req.body

    if (!idToken) {
      await recordLoginEvent(req, { event: 'login_failure', provider: 'google', reason: 'Missing idToken' })
      return res.status(400).json({ error: 'Missing idToken' })
    }

    let payload
    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
      payload = ticket.getPayload()
    } catch (err) {
      console.error('Google verify failed:', err)
      await recordLoginEvent(req, { event: 'login_failure', provider: 'google', reason: 'Invalid Google token' })
      return res.status(401).json({ error: 'Invalid Google token' })
    }

    if (!payload?.email) {
      await recordLoginEvent(req, { event: 'login_failure', provider: 'google', reason: 'No email in payload' })
      return res.status(401).json({ error: 'Invalid token' })
    }

    const user = await prisma.user.upsert({
      where: { email: payload.email },
      update: {
        name: payload.name,
        avatar: payload.picture,
        googleId: payload.sub,
      },
      create: {
        email: payload.email,
        name: payload.name,
        avatar: payload.picture,
        googleId: payload.sub,
        role: 'customer',
      },
    })

    const token = signToken({ sub: user.id, role: user.role })

    await recordLoginEvent(req, {
      userId: user.id,
      email: user.email,
      event: 'login_success',
      provider: 'google',
    })

    return res.json({ user, token })

  } catch (err) {
    console.error('[auth/google] ERROR:', err)
    await recordLoginEvent(req, { event: 'login_failure', provider: 'google', reason: err.message })
    return res.status(500).json({
      error: 'Google auth failed',
      detail: err.message,
    })
  }
})

const adminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post('/admin', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = adminSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.role !== 'admin' || !user.password) {
      await recordLoginEvent(req, { email, event: 'login_failure', provider: 'admin', reason: 'User not found or not admin' })
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      await recordLoginEvent(req, { userId: user.id, email, event: 'login_failure', provider: 'admin', reason: 'Wrong password' })
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = signToken({ sub: user.id, role: user.role })
    await recordLoginEvent(req, { userId: user.id, email, event: 'login_success', provider: 'admin' })
    res.json({ user: sanitize(user), token })
  } catch (err) { next(err) }
})

router.post('/logout', requireAuth, async (req, res) => {
  await recordLoginEvent(req, {
    userId: req.user.id,
    email: req.user.email,
    event: 'logout',
    provider: req.user.role === 'admin' ? 'admin' : 'google',
  })
  res.json({ ok: true })
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: sanitize(req.user) })
})

function sanitize(user) {
  const { password, ...rest } = user
  return rest
}

export default router
