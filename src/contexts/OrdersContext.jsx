import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api, apiError, isNetworkError, getToken } from '../lib/api'
import { useAuth } from './AuthContext'
import { DEMO_ORDERS, DEMO_ADMIN_TOKEN } from '../lib/demoData'

const DEMO_STORAGE_KEY = 'evisa_demo_orders_v1'

function loadDemoOrders() {
  try {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return DEMO_ORDERS
}
function saveDemoOrders(orders) {
  try { localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(orders)) } catch {}
}

export const ORDER_STATUSES = {
  submitted: { label: 'Submitted',         icon: '📝', color: '#6B7280', bg: '#F3F4F6' },
  review:    { label: 'Under review',      icon: '🔍', color: '#1B4FD8', bg: '#EEF3FF' },
  sent:      { label: 'Sent to authority', icon: '📤', color: '#9333EA', bg: '#FDF4FF' },
  approved:  { label: 'Approved',          icon: '✅', color: '#16A34A', bg: '#F0FDF4' },
  delivered: { label: 'Visa delivered',    icon: '📧', color: '#059669', bg: '#ECFDF5' },
  rejected:  { label: 'Rejected',          icon: '❌', color: '#DC2626', bg: '#FEF2F2' },
}

export const STAGE_FLOW = ['submitted', 'review', 'sent', 'approved', 'delivered']

const OrdersContext = createContext(null)

export function OrdersProvider({ children }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isDemo = getToken() === DEMO_ADMIN_TOKEN

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([])
      return
    }
    if (isDemo) {
      setOrders(loadDemoOrders())
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/orders')
      setOrders(data.orders || [])
    } catch (err) {
      if (isNetworkError(err)) {
        // Backend down — show demo data so the UI is still useful.
        setOrders(loadDemoOrders())
        setError(null)
      } else {
        setError(apiError(err, 'Failed to load orders'))
        setOrders([])
      }
    } finally {
      setLoading(false)
    }
  }, [user, isDemo])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const createOrder = useCallback(async (payload) => {
    try {
      const { data } = await api.post('/orders', payload)
      setOrders(prev => [data.order, ...prev])
      return data.order
    } catch (err) {
      if (!isNetworkError(err)) throw err
      // Demo: create locally
      const id = 'EV-' + Math.random().toString(36).slice(2, 8).toUpperCase()
      const now = new Date().toISOString()
      const order = {
        id, status: 'submitted',
        timeline: [{ stage: 'submitted', at: now, note: 'Application received (demo mode)' }],
        documents: [], createdAt: now, updatedAt: now,
        ...payload,
      }
      setOrders(prev => {
        const next = [order, ...prev]
        saveDemoOrders(next)
        return next
      })
      return order
    }
  }, [])

  const updateStatus = useCallback(async (id, newStatus, note = '') => {
    try {
      const { data } = await api.patch(`/orders/${id}/status`, { status: newStatus, note })
      setOrders(prev => prev.map(o => o.id === id ? data.order : o))
      return data.order
    } catch (err) {
      if (!isNetworkError(err)) throw err
      // Demo: update locally
      let updated = null
      setOrders(prev => {
        const next = prev.map(o => {
          if (o.id !== id) return o
          const now = new Date().toISOString()
          updated = {
            ...o, status: newStatus, updatedAt: now,
            timeline: [...(o.timeline || []), { stage: newStatus, at: now, note: note || newStatus }],
          }
          return updated
        })
        saveDemoOrders(next)
        return next
      })
      return updated
    }
  }, [])

  const refresh = fetchOrders

  return (
    <OrdersContext.Provider value={{ orders, loading, error, createOrder, updateStatus, refresh }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => useContext(OrdersContext)
