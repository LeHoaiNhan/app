import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import pinoHttp from 'pino-http'
import path from 'node:path'

import { prisma } from './lib/prisma.js'
import authRoutes from './routes/auth.js'
import orderRoutes from './routes/orders.js'
import draftOrderRoutes from './routes/draftOrders.js'
import uploadRoutes from './routes/uploads.js'
import countryRoutes from './routes/countries.js'
import serviceTierRoutes from './routes/serviceTiers.js'
import trackRoutes from './routes/track.js'
import supportRoutes from './routes/support.js'
import adminRoutes from './routes/admin.js'
import paymentRoutes from './routes/payments.js'
import { errorHandler } from './middleware/error.js'

const app = express()
const isProd = process.env.NODE_ENV === 'production'

app.set('trust proxy', 1)

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(compression())
app.use(pinoHttp({
  level: isProd ? 'info' : 'warn',
  redact: ['req.headers.authorization', 'req.headers.cookie'],
  customLogLevel: (req, res, err) => {
    if (err || res.statusCode >= 500) return 'error'
    if (res.statusCode >= 400) return 'warn'
    return 'info'
  },
}))

app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use('/uploads', express.static(path.resolve('uploads')))

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ ok: true, db: 'up', uptime: Math.round(process.uptime()) })
  } catch (err) {
    res.status(503).json({ ok: false, db: 'down', error: err.message })
  }
})

app.use('/auth', authRoutes)
app.use('/track', trackRoutes)
app.use('/orders', orderRoutes)
app.use('/draft-orders', draftOrderRoutes)
app.use('/uploads', uploadRoutes)
app.use('/countries', countryRoutes)
app.use('/service-tiers', serviceTierRoutes)
app.use('/support', supportRoutes)
app.use('/admin', adminRoutes)
app.use('/payments', paymentRoutes)

app.use(errorHandler)

const port = Number(process.env.PORT) || 4000
const server = app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`)
})

let shuttingDown = false
async function shutdown(signal) {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`[server] ${signal} received — shutting down gracefully`)

  const force = setTimeout(() => {
    console.error('[server] forced exit after 10s')
    process.exit(1)
  }, 10_000).unref()

  server.close(async () => {
    try {
      await prisma.$disconnect()
      clearTimeout(force)
      console.log('[server] closed cleanly')
      process.exit(0)
    } catch (err) {
      console.error('[server] error during shutdown:', err)
      process.exit(1)
    }
  })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('unhandledRejection', (reason) => console.error('[unhandledRejection]', reason))
