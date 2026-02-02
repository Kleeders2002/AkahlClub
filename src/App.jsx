// import './i18n';
// import { useState, useEffect } from "react"
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

// import Navbar from "./components/Navbar"
// import Footer from "./components/Footer"
// import Landing from "./pages/Landing"
// import MembershipPage from "./pages/MembershipPage"
// import ComparativePage from "./pages/ComparativePage" // Nueva página
// import Login from "./components/Login"
// import Dashboard from "./components/Dashboard"
// import LeadCaptureModal from "./components/LeadCaptureModal"

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false)
//   const [userToken, setUserToken] = useState(null)
//   const [showLeadModal, setShowLeadModal] = useState(false)

//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (token) {
//       setUserToken(token)
//       setIsLoggedIn(true)
//     }
    
//     // Verificar si ya mostramos el modal al usuario
//     const hasSeenModal = localStorage.getItem("hasSeenLeadModal")
//     if (!hasSeenModal && !token) {
//       // Esperar un momento para mejor experiencia de usuario
//       const timer = setTimeout(() => {
//         setShowLeadModal(true)
//       }, 1000)
//       return () => clearTimeout(timer)
//     }
//   }, [])

//   const handleLogin = (token) => {
//     localStorage.setItem("token", token)
//     setUserToken(token)
//     setIsLoggedIn(true)
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("token")
//     setUserToken(null)
//     setIsLoggedIn(false)
//   }

//   const handleLeadSubmit = (leadData) => {
//     console.log("Lead capturado:", leadData)
//     localStorage.setItem("hasSeenLeadModal", "true")
//     setShowLeadModal(false)
//     alert("¡Gracias! Te contactaremos pronto.")
//   }

//   const handleCloseModal = () => {
//     localStorage.setItem("hasSeenLeadModal", "true")
//     setShowLeadModal(false)
//   }

//   return (
//     <Router>
//       {/* Modal de captación de leads */}
//       {showLeadModal && (
//         <LeadCaptureModal
//           onSubmit={handleLeadSubmit}
//           onClose={handleCloseModal}
//         />
//       )}

//       <Navbar />

//       <Routes>
//         {/* Landing como página principal */}
//         <Route path="/" element={<Landing />} />

//         {/* Nueva página de registro de membresía */}
//         <Route path="/membership" element={<MembershipPage />} />

//         {/* Nueva página de comparación y ebook */}
//         <Route path="/comparative" element={<ComparativePage />} />

//         {/* Login */}
//         <Route
//           path="/login"
//           element={
//             isLoggedIn ? (
//               <Navigate to="/dashboard" />
//             ) : (
//               <div className="pt-20 min-h-screen flex flex-col">
//                 <div className="flex-grow">
//                   <Login onLogin={handleLogin} />
//                 </div>
//                 <Footer />
//               </div>
//             )
//           }
//         />

//         {/* Dashboard protegido */}
//         <Route
//           path="/dashboard"
//           element={
//             isLoggedIn ? (
//               <Dashboard token={userToken} onLogout={handleLogout} />
//             ) : (
//               <Navigate to="/login" />
//             )
//           }
//         />
//       </Routes>

//       {/* Footer en todas las páginas excepto login/dashboard */}
//       <Routes>
//         <Route path="/" element={<Footer />} />
//         <Route path="/membership" element={<Footer />} />
//         <Route path="/comparative" element={<Footer />} />
//       </Routes>
//     </Router>
//   )
// }

// export default App

import './i18n';
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Landing from "./pages/Landing"
import MembershipPage from "./pages/MembershipPage"
import ComparativePage from "./pages/ComparativePage"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import LeadCaptureModal from "./components/LeadCaptureModal"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userToken, setUserToken] = useState(null)
  const [showLeadModal, setShowLeadModal] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setUserToken(token)
      setIsLoggedIn(true)
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

  const handleLogin = (token) => {
    localStorage.setItem("token", token)
    setUserToken(token)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUserToken(null)
    setIsLoggedIn(false)
  }

  const handleLeadSubmit = (leadData) => {
    console.log("Lead capturado:", leadData)
    localStorage.setItem("hasSeenLeadModal", "true")
    setShowLeadModal(false)
    alert("¡Gracias! Te contactaremos pronto.")
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
              <Navigate to="/dashboard" />
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

        {/* Dashboard protegido */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard token={userToken} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
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