import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Maintenance from './pages/Maintenance'

function App() {
  const isMaintenance = import.meta.env.VITE_MAINTENANCE === "true"

  // automatski basename za GitHub Pages ili Vercel
  const base = import.meta.env.PROD
    ? (window.location.hostname.includes("github.io") ? "/webshop-project" : "/")
    : "/"

  return (
    <Router basename={base}>
      <div className="min-h-screen bg-gray-50">
        {isMaintenance ? (
          <Maintenance />
        ) : (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </>
        )}
      </div>
    </Router>
  )
}

export default App