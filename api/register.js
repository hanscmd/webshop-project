// api/register.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // IP adresa korisnika (od Vercel‑a)
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      null

    // Geolokacija sa IPAPI (opciono)
    let geoData = {}
    if (ip) {
      try {
        const geoResponse = await fetch(`[ipapi.co](https://ipapi.co/${ip}/json/)`)
        geoData = await geoResponse.json()
      } catch (e) {
        console.warn('Geolokacija nije pronađena:')
      }
    }

    // Podaci koji dolaze iz frontenda
    const { name, surname, email, password } = req.body
    if (!email || !password || !name || !surname) {
      return res.status(400).json({ error: 'Nedostaju obavezna polja' })
    }

    // Registracija korisnika u Supabase auth + metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          surname,
          full_name: `${name} ${surname}`,
          role: 'user',
          ip_address: ip || null,
          ip_country: geoData.country_name || null,
          ip_city: geoData.city || null,
          registered_at: new Date().toISOString(),
          user_agent: req.headers['user-agent']
        }
      }
    })

    if (error) throw error

    return res.status(200).json({
      success: true,
      message: 'Registracija uspešna. Proverite email za verifikaciju.',
      data
    })
  } catch (error) {
    console.error('Greška pri registraciji:', error)
    return res.status(400).json({ success: false, error: error.message })
  }
}
