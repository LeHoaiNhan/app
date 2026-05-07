import { prisma } from './prisma.js'

function clientIp(req) {
  return req.ip || req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress
}

export async function recordAudit(req, { action, resource, payload }) {
  try {
    await prisma.adminAudit.create({
      data: {
        actorId: req.user?.id || null,
        action,
        resource,
        payload: payload ?? undefined,
        ip: clientIp(req),
      },
    })
  } catch (err) {
    console.warn('[audit] failed to record:', err.message)
  }
}
