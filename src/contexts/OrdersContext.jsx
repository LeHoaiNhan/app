import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api, apiError } from '../lib/api'
import { useAuth } from './AuthContext'

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

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/orders')
      setOrders(data.orders || [])
    } catch (err) {
      setError(apiError(err, 'Failed to load orders'))
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const createOrder = useCallback(async (payload) => {
    const { data } = await api.post('/orders', payload)
    setOrders(prev => [data.order, ...prev])
    return data.order
  }, [])

  const updateStatus = useCallback(async (id, newStatus, note = '') => {
    const { data } = await api.patch(`/orders/${id}/status`, { status: newStatus, note })
    setOrders(prev => prev.map(o => o.id === id ? data.order : o))
    return data.order
  }, [])

  const refresh = fetchOrders

  return (
    <OrdersContext.Provider value={{ orders, loading, error, createOrder, updateStatus, refresh }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => useContext(OrdersContext)
