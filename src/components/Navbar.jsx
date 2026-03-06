import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

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
          
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            {user?.email === 'admin@example.com' && (
              <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="text-gray-600 hover:text-gray-900">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}