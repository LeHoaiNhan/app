import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'

import authRoutes from './routes/auth.js'
import orderRoutes from './routes/orders.js'
import uploadRoutes from './routes/uploads.js'
import { errorHandler } from './middleware/error.js'

const app = express()

app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use('/uploads', express.static(path.resolve('uploads')))

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/auth', authRoutes)
app.use('/orders', orderRoutes)
app.use('/uploads', uploadRoutes)

app.use(errorHandler)

const port = Number(process.env.PORT) || 4000
app.listen(port, () => {
  console.log(`[server] listening on http://localhost:${port}`)
})
