import { prisma } from './prisma.js'

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for']
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0].trim()
  }
  return req.ip || req.socket?.remoteAddress || null
}

export async function recordLoginEvent(req, { userId = null, email = null, event, provider, reason = null }) {
  try {
    await prisma.loginLog.create({
      data: {
        userId,
        email,
        event,
        provider,
        reason,
        ip: getClientIp(req),
        userAgent: req.headers['user-agent']?.slice(0, 500) || null,
      },
    })
  } catch (err) {
    console.error('[loginLog] failed to record:', err.message)
  }
}
