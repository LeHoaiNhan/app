import { ZodError } from 'zod'

export function errorHandler(err, req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Validation failed', details: err.flatten() })
  }
  console.error('[error]', err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
}
