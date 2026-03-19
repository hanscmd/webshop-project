import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Dohvatanje IP adrese i geolokacije pri loading-u komponente
  useEffect(() => {
    fetchIpInfo()
  }, [])

  const fetchIpInfo = async () => {
    try {
      // Dohvati IP i geolokaciju (radi u pozadini, ne prikazujemo korisniku)
      const ipResponse = await fetch('https://api.ipify.org?format=json')
      const ipData = await ipResponse.json()
      
      // Dohvati geolokaciju za IP (besplatno do 1000 zahteva dnevno)
      const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`)
      const geoData = await geoResponse.json()
      
      // Sačuvaj u localStorage ili state manager ako je potrebno za kasnije
      // Ali ne prikazujemo korisniku
      window.__userIpInfo = {
        ip_address: ipData.ip,
        ip_country: geoData.country_name || '',
        ip_city: geoData.city || ''
      }
      
      console.log('IP info detected for registration:', ipData.ip) // Samo za debug
    } catch (err) {
      console.error('Error fetching IP info:', err)
      window.__userIpInfo = null
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    // Validacija
    if (formData.password !== formData.confirmPassword) {
      setError('Lozinke se ne poklapaju')
      return
    }

    if (formData.password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera')
      return
    }

    setLoading(true)

    try {
      // Uzmi IP info koji smo sačuvali (ako postoji)
      const ipInfo = window.__userIpInfo || {}
      
      console.log('Registration with IP:', ipInfo.ip_address || 'unknown')

      // Pripremamo metadata sa IP adresom i geolokacijom
      const metadata = {
        name: formData.name,
        surname: formData.surname,
        full_name: `${formData.name} ${formData.surname}`,
        role: 'user',
        ip_address: ipInfo.ip_address || null,
        ip_country: ipInfo.ip_country || null,
        ip_city: ipInfo.ip_city || null,
        registered_at: new Date().toISOString(),
        user_agent: navigator.userAgent // Opciono: čuvamo i info o browseru
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: metadata
        }
      })

      if (error) {
        console.error('Registration error:', error)
        
        if (error.message.includes('User already registered')) {
          throw new Error('Korisnik sa ovom email adresom već postoji.')
        } else {
          throw error
        }
      }

      console.log('Registration successful:', data)

      if (data?.user) {
        setSuccess(true)
        // Preusmeri na login nakon 3 sekunde
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message || 'Došlo je do greške prilikom registracije')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <h2 className="text-2xl font-bold mb-2">Registracija uspešna!</h2>
            <p className="mb-4">
              Molimo proverite vaš email (<span className="font-bold">{formData.email}</span>) 
              i potvrdite vaš nalog.
            </p>
            <p className="text-sm text-green-600">
              Bićete preusmereni na stranicu za prijavu za nekoliko sekundi...
            </p>
          </div>
          <Link 
            to="/login" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Idi na prijavu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Kreirajte nalog
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Ime
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Petar"
                />
              </div>

              <div>
                <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-1">
                  Prezime
                </label>
                <input
                  id="surname"
                  name="surname"
                  type="text"
                  required
                  value={formData.surname}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Petrović"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email adresa
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="petar@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Lozinka
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-gray-500">
                Minimum 6 karaktera
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Potvrdite lozinku
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {loading ? 'Kreiranje naloga...' : 'Registruj se'}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Već imate nalog?</span>{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Prijavite se
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}