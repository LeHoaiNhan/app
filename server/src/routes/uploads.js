import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { prisma } from '../lib/prisma.js'

const UPLOAD_DIR = path.resolve('uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const DOCUMENT_KINDS = ['applicant_photo', 'passport_scan', 'supporting', 'visa_result']

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
    cb(null, name)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/^image\/(png|jpe?g|webp)$/.test(file.mimetype)) {
      return cb(new Error('Only PNG, JPG, or WEBP images are allowed'))
    }
    cb(null, true)
  },
})

const router = Router()

router.post('/photo', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    const kind = DOCUMENT_KINDS.includes(req.body?.kind) ? req.body.kind : 'applicant_photo'
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`

    const doc = await prisma.document.create({
      data: {
        uploaderId: req.user.id,
        kind,
        filename: req.file.filename,
        url,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    })

    res.status(201).json({ id: doc.id, url, filename: doc.filename, size: doc.size, kind: doc.kind })
  } catch (err) { next(err) }
})

const linkSchema = z.object({
  orderId: z.string().min(1),
})

router.patch('/:id/link', requireAuth, async (req, res, next) => {
  try {
    const { orderId } = linkSchema.parse(req.body)
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    if (req.user.role !== 'admin' && order.customerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const doc = await prisma.document.findUnique({ where: { id: req.params.id } })
    if (!doc) return res.status(404).json({ error: 'Document not found' })
    if (req.user.role !== 'admin' && doc.uploaderId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    const updated = await prisma.document.update({
      where: { id: req.params.id },
      data: { orderId },
    })
    res.json({ document: updated })
  } catch (err) { next(err) }
})

export default router
