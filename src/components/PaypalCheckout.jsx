import { useEffect, useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { api, apiError } from '../lib/api'

export default function PaypalCheckout({ amount, currency = 'USD', description, onApproved, onError }) {
  const [clientId, setClientId] = useState(null)
  const [configured, setConfigured] = useState(false)
  const [loadingCfg, setLoadingCfg] = useState(true)

  useEffect(() => {
    let cancelled = false
    api.get('/payments/config')
      .then(({ data }) => {
        if (cancelled) return
        setConfigured(!!data?.paypal?.configured)
        const envId = import.meta.env.VITE_PAYPAL_CLIENT_ID || ''
        setClientId(envId || data?.paypal?.clientId || null)
      })
      .catch(() => { if (!cancelled) setConfigured(false) })
      .finally(() => { if (!cancelled) setLoadingCfg(false) })
    return () => { cancelled = true }
  }, [])

  if (loadingCfg) {
    return <div style={{ padding:16, textAlign:'center', color:'#6B7280', fontSize:13 }}>Loading PayPal…</div>
  }

  if (!configured || !clientId) {
    return (
      <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:8, padding:'12px 14px', fontSize:13, color:'#92400E' }}>
        PayPal is not configured on the server. Ask the admin to set <code>PAYPAL_CLIENT_ID</code> and <code>PAYPAL_SECRET</code>.
      </div>
    )
  }

  return (
    <PayPalScriptProvider options={{ clientId, currency, intent: 'capture' }}>
      <PayPalButtons
        style={{ layout: 'vertical', shape: 'rect', label: 'paypal' }}
        disabled={!amount || amount <= 0}
        forceReRender={[amount, currency]}
        createOrder={async () => {
          try {
            const { data } = await api.post('/payments/paypal/create-order', {
              amount: Number(amount),
              currency,
              description,
            })
            return data.paypalOrderId
          } catch (err) {
            onError?.(apiError(err, 'Failed to create PayPal order'))
            throw err
          }
        }}
        onApprove={async (data) => {
          try {
            const { data: capture } = await api.post('/payments/paypal/capture-order', {
              paypalOrderId: data.orderID,
            })
            await onApproved?.(capture)
          } catch (err) {
            onError?.(apiError(err, 'Failed to capture PayPal payment'))
          }
        }}
        onError={(err) => {
          console.error('PayPal error:', err)
          onError?.(err?.message || 'PayPal payment failed')
        }}
      />
    </PayPalScriptProvider>
  )
}
