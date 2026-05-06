export function generateOrderId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  return `EV-${rand}`
}
