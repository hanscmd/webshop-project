import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase/client'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (requireAdmin && user.email !== 'admin@example.com') {
    return <Navigate to="/" />
  }

  return children
}