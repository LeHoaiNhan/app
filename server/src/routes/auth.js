import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { signToken } from '../lib/jwt.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const googleSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  avatar: z.string().url().optional(),
  googleId: z.string().optional(),
})

router.post('/google', async (req, res, next) => {
  try {
    const data = googleSchema.parse(req.body)

    // TODO: in production, verify a Google ID token here using google-auth-library
    // and derive email/name/picture/sub from the verified payload instead of trusting the body.

    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: { name: data.name, avatar: data.avatar, googleId: data.googleId },
      create: {
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        googleId: data.googleId,
        role: 'customer',
      },
    })

    const token = signToken({ sub: user.id, role: user.role })
    res.json({ user: sanitize(user), token })
  } catch (err) { next(err) }
})

const adminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post('/admin', async (req, res, next) => {
  try {
    const { email, password } = adminSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.role !== 'admin' || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })

    const token = signToken({ sub: user.id, role: user.role })
    res.json({ user: sanitize(user), token })
  } catch (err) { next(err) }
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: sanitize(req.user) })
})

function sanitize(user) {
  const { password, ...rest } = user
  return rest
}

export default router
