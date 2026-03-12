import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Maintenance from './pages/Maintenance'

// lazy loading stranica
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Contact = lazy(() => import('./pages/Contact'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

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

            <Suspense
              fallback={
                <div className="flex items-center justify-center h-screen text-lg">
                  Loading...
                </div>
              }
            >
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
            </Suspense>
          </>
        )}
      </div>
    </Router>
  )
}

export default App