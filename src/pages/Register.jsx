import { useState } from 'react'
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    
    if (formData.password !== formData.confirmPassword) {
      setError('Lozinke se ne poklapaju')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          surname: formData.surname
        })
      })

      // Sigurno čitanje odgovora (izbegava SyntaxError: Unexpected token A)
      const contentType = response.headers.get("content-type")
      let data
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        console.error("Server vratio tekst umesto JSON-a:", text)
        throw new Error("Sistemska greška na serveru (proveri logove u bazi)")
      }

      if (!response.ok) {
        throw new Error(data.error || 'Greška pri registraciji')
      }

      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)

    } catch (err) {
      console.error('Registration Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full text-center p-8 bg-white rounded shadow">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Registracija uspešna!</h2>
          <p className="mb-4">Proverite email <b>{formData.email}</b> za potvrdu naloga.</p>
          <p className="text-sm text-gray-500">Preusmeravanje za 3 sekunde...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Kreirajte nalog</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <input name="name" type="text" required placeholder="Ime" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
            <input name="surname" type="text" required placeholder="Prezime" value={formData.surname} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <input name="email" type="email" required placeholder="Email adresa" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
          <input name="password" type="password" required placeholder="Lozinka (min 6)" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
          <input name="confirmPassword" type="password" required placeholder="Potvrda lozinke" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
          
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
            {loading ? 'Slanje...' : 'Registruj se'}
          </button>
        </form>
        <div className="text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">Već imate nalog? Prijavite se</Link>
        </div>
      </div>
    </div>
  )
}