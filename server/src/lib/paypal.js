const {
  PAYPAL_CLIENT_ID,
  PAYPAL_SECRET,
  PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com',
} = process.env

export const paypalConfigured = !!(PAYPAL_CLIENT_ID && PAYPAL_SECRET)

let cachedToken = null
let tokenExpiresAt = 0

async function getAccessToken() {
  if (!paypalConfigured) {
    throw new Error('PayPal not configured (missing PAYPAL_CLIENT_ID / PAYPAL_SECRET)')
  }
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken

  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64')
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`PayPal auth failed (${res.status}): ${text}`)
  }
  const data = await res.json()
  cachedToken = data.access_token
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000
  return cachedToken
}

async function paypalFetch(path, { method = 'GET', body, headers = {} } = {}) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : {}
  if (!res.ok) {
    const err = new Error(data.message || `PayPal ${method} ${path} failed (${res.status})`)
    err.status = res.status
    err.details = data
    throw err
  }
  return data
}

export async function createPaypalOrder({ amount, currency = 'USD', description, referenceId }) {
  return paypalFetch('/v2/checkout/orders', {
    method: 'POST',
    body: {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: referenceId,
        description,
        amount: {
          currency_code: currency,
          value: Number(amount).toFixed(2),
        },
      }],
      application_context: {
        brand_name: 'eVisa',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    },
  })
}

export async function capturePaypalOrder(paypalOrderId) {
  return paypalFetch(`/v2/checkout/orders/${paypalOrderId}/capture`, { method: 'POST' })
}

export async function getPaypalOrder(paypalOrderId) {
  return paypalFetch(`/v2/checkout/orders/${paypalOrderId}`)
}
