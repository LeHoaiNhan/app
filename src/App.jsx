import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginModal from './components/LoginModal'
import Home from './pages/Home'
import Destinations from './pages/Destinations'
import VisaTypes from './pages/VisaTypes'
import Guide from './pages/Guide'
import Support from './pages/Support'

function AppInner() {
  const { showLoginModal } = useAuth()
  return (
    <>
      {showLoginModal && <LoginModal />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/visa-types" element={<VisaTypes />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/support" element={<Support />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  )
}
