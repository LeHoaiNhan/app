export function parseDateRange(query, field = 'createdAt') {
  const where = {}
  const from = query.from ? new Date(String(query.from)) : null
  const to = query.to ? new Date(String(query.to)) : null
  if (from && !isNaN(from)) where.gte = from
  if (to && !isNaN(to)) where.lte = to
  return Object.keys(where).length ? { [field]: where } : {}
}

export function parsePagination(query, { defaultLimit = 50, maxLimit = 200 } = {}) {
  const limit = Math.max(1, Math.min(Number(query.limit) || defaultLimit, maxLimit))
  const skip = Math.max(0, Number(query.skip) || 0)
  return { take: limit, skip }
}
