import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.js'
import orderRoutes from './routes/orders.js'
import uploadRoutes from './routes/uploads.js'

const app = express()

// ======================
// MIDDLEWARE
// ======================
app.use(express.json())

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}))

// ======================
// ROUTES
// ======================
app.use('/auth', authRoutes)
app.use('/orders', orderRoutes)
app.use('/uploads', uploadRoutes)

// ======================
// HEALTH CHECK
// ======================
app.get('/health', (req, res) => {
  res.json({ ok: true })
})

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})