import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

const upsertSchema = z.object({
  data: z.record(z.any()),
  step: z.number().int().min(1).max(4).default(1),
})

router.get('/mine', async (req, res, next) => {
  try {
    const draft = await prisma.draftOrder.findUnique({ where: { userId: req.user.id } })
    res.json({ draft })
  } catch (err) { next(err) }
})

router.put('/mine', async (req, res, next) => {
  try {
    const { data, step } = upsertSchema.parse(req.body)
    const draft = await prisma.draftOrder.upsert({
      where: { userId: req.user.id },
      update: { data, step },
      create: { userId: req.user.id, data, step },
    })
    res.json({ draft })
  } catch (err) { next(err) }
})

router.delete('/mine', async (req, res, next) => {
  try {
    await prisma.draftOrder.deleteMany({ where: { userId: req.user.id } })
    res.json({ ok: true })
  } catch (err) { next(err) }
})

export default router
