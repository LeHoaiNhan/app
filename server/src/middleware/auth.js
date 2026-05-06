import { verifyToken } from '../lib/jwt.js'
import { prisma } from '../lib/prisma.js'

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ error: 'Missing token' })

    const decoded = verifyToken(token)
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } })
    if (!user) return res.status(401).json({ error: 'User not found' })

    req.user = user
    next()
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin only' })
  next()
}
