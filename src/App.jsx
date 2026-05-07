import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { OrdersProvider } from './contexts/OrdersContext'
import LoginModal from './components/LoginModal'
import Home from './pages/Home'
import Destinations from './pages/Destinations'
import VisaTypes from './pages/VisaTypes'
import Guide from './pages/Guide'
import Support from './pages/Support'
import Pricing from './pages/Pricing'

const MyOrders = lazy(() => import('./pages/MyOrders'))
const Admin = lazy(() => import('./pages/Admin'))

function AppInner() {
  const { showLoginModal } = useAuth()
  return (
    <>
      {showLoginModal && <LoginModal />}
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/visa-types" element={<VisaTypes />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/support" element={<Support />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </>
  )
}

function RouteFallback() {
  return (
    <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', color:'#9CA3AF', fontSize:14 }}>
      Loading…
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <OrdersProvider>
          <AppInner />
        </OrdersProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
