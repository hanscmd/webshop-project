import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Provera da li je korisnik admin (prilagodi svom email-u)
  const isAdmin = user?.email === 'admin@example.com'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            WebShop
          </Link>
          
          <div className="flex space-x-4 items-center">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            
            {/* Link za obične korisnike - Support Chat */}
            {user && !isAdmin && (
              <Link to="/support" className="text-blue-600 font-medium hover:text-blue-800">
                Support Chat
              </Link>
            )}


            {/* ADMIN SEKCIJA */}
            {isAdmin && (
              <div className="flex space-x-4 border-l pl-4 border-gray-200">
                <Link to="/admin" className="text-red-600 hover:text-red-800 font-bold">
                  Dashboard
                </Link>
                <Link to="/admin/inbox" className="text-red-600 hover:text-red-800 font-bold">
                  Inbox
                </Link>
              </div>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200 transition"
              >
                Logout
              </button>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}