import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // SLANJE PODATAKA U SUPABASE AUTH
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        // Ovi podaci idu u raw_user_meta_data u bazi
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Više nema insert-a u "users" ili "profiles" ovde! 
    // SQL Trigger u bazi će to uraditi automatski.
    
    setLoading(false)
    setIsRegistered(true)
  }

  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center space-y-6">
          <div className="text-6xl text-green-500">✉️</div>
          <h2 className="text-2xl font-bold text-gray-800">Proverite email!</h2>
          <p className="text-gray-600">
            Poslali smo potvrdu na <strong>{formData.email}</strong>. 
            Morate potvrditi email pre nego što se prijavite.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Idi na Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
          Kreiraj Profil
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Ime"
              required
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
            <input
              type="text"
              placeholder="Prezime"
              required
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>

          <input
            type="email"
            placeholder="Email adresa"
            required
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <input
            type="password"
            placeholder="Lozinka"
            required
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition shadow-md"
          >
            {loading ? 'Slanje...' : 'Registruj se'}
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            Već imaš nalog? <Link to="/login" className="text-blue-600 font-bold hover:underline">Prijavi se</Link>
          </p>
        </form>
      </div>
    </div>
  )
}