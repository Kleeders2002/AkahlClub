import './i18n';
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Landing from "./pages/Landing"
import MembershipPage from "./pages/MembershipPage"
import ComparativePage from "./pages/ComparativePage"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import LeadCaptureModal from "./components/LeadCaptureModal"
import ChangePasswordPage from "./pages/ChangePasswordPage"
import AdminPanel from "./pages/AdminPage"

function App() {
  const { t } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userToken, setUserToken] = useState(null)
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [mustChangePassword, setMustChangePassword] = useState(false)
  const [userRole, setUserRole] = useState('USER')  // 👈 Nuevo estado para el rol

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        // Decodificar token para verificar si debe cambiar contraseña y el rol
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUserToken(token)
        setIsLoggedIn(true)
        setUserRole(payload.role || 'USER')  // 👈 Guardar el rol

        // Verificar si tiene contraseña temporal
        if (payload.must_change_pwd) {
          setMustChangePassword(true)
        }
      } catch (err) {
        console.error('Error al decodificar token:', err)
        localStorage.removeItem('token')
      }
    }

    // Verificar si ya mostramos el modal al usuario
    const hasSeenModal = localStorage.getItem("hasSeenLeadModal")
    if (!hasSeenModal && !token) {
      // Esperar un momento para mejor experiencia de usuario
      const timer = setTimeout(() => {
        setShowLeadModal(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Callback para actualizar token después de cambiar contraseña
  const handleTokenUpdate = (newToken) => {
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]))
      localStorage.setItem('token', newToken)
      setUserToken(newToken)
      setUserRole(payload.role || 'USER')  // 👈 Actualizar rol también
      setMustChangePassword(payload.must_change_pwd || false)
    } catch (err) {
      console.error('Error al actualizar token:', err)
    }
  }

  const handleLogin = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      localStorage.setItem("token", token)
      setUserToken(token)
      setIsLoggedIn(true)
      setUserRole(payload.role || 'USER')  // 👈 Guardar rol
      setMustChangePassword(payload.must_change_pwd || false)

      // Mostrar alerta según si debe cambiar contraseña
      if (payload.must_change_pwd) {
        alert("⚠️ " + t('login.tempPasswordWarning'))
      }
    } catch (err) {
      console.error('Error al procesar login:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUserToken(null)
    setIsLoggedIn(false)
    setMustChangePassword(false)
  }

  const handleLeadSubmit = (leadData) => {
    localStorage.setItem("hasSeenLeadModal", "true")
    setShowLeadModal(false)
    alert(t('lead.thankYou'))
  }

  const handleCloseModal = () => {
    localStorage.setItem("hasSeenLeadModal", "true")
    setShowLeadModal(false)
  }

  return (
    <Router>
      {/* Modal de captación de leads - Solo muestra una vez */}
      {showLeadModal && (
        <LeadCaptureModal
          onSubmit={handleLeadSubmit}
          onClose={handleCloseModal}
        />
      )}

      <Navbar />

      <Routes>
        {/* Landing como página principal */}
        <Route path="/" element={<Landing />} />

        {/* Nueva página de registro de membresía */}
        <Route path="/membership" element={<MembershipPage />} />

        {/* Nueva página de comparación y ebook */}
        <Route path="/comparative" element={<ComparativePage />} />

        {/* Login */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate
                to={mustChangePassword ? "/change-password" : userRole === 'ADMIN' ? "/admin" : "/dashboard"}
                replace
              />
            ) : (
              <div className="pt-20 min-h-screen flex flex-col">
                <div className="flex-grow">
                  <Login onLogin={handleLogin} />
                </div>
                <Footer />
              </div>
            )
          }
        />

        {/* Cambio de contraseña obligatorio */}
        <Route
          path="/change-password"
          element={
            !isLoggedIn ? (
              <Navigate to="/login" replace />
            ) : !mustChangePassword ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <ChangePasswordPage
                token={userToken}
                onTokenUpdate={handleTokenUpdate}
              />
            )
          }
        />

        {/* Dashboard protegido */}
        <Route
          path="/dashboard"
          element={
            !isLoggedIn ? (
              <Navigate to="/login" replace />
            ) : mustChangePassword ? (
              <Navigate to="/change-password" replace />
            ) : userRole === 'ADMIN' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Dashboard token={userToken} onLogout={handleLogout} />
            )
          }
        />

        {/* Panel de Administración - Solo ADMIN */}
        <Route
          path="/admin"
          element={
            !isLoggedIn ? (
              <Navigate to="/login" replace />
            ) : userRole !== 'ADMIN' ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AdminPanel token={userToken} onLogout={handleLogout} />
            )
          }
        />
      </Routes>

      {/* Footer en todas las páginas excepto login/dashboard */}
      <Routes>
        <Route path="/" element={<Footer />} />
        <Route path="/membership" element={<Footer />} />
        <Route path="/comparative" element={<Footer />} />
      </Routes>
    </Router>
  )
}

export default App
