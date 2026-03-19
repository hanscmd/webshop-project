// api/register.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      null

    // Geo‑info direktno iz Vercel header‑a
    const city = req.headers['x-vercel-ip-city'] || null
    const country = req.headers['x-vercel-ip-country'] || null
    const region = req.headers['x-vercel-ip-country-region'] || null
    const lat = req.headers['x-vercel-ip-latitude'] || null
    const lon = req.headers['x-vercel-ip-longitude'] || null

    const { name, surname, email, password } = req.body
    if (!email || !password || !name || !surname) {
      return res.status(400).json({ error: 'Nedostaju obavezna polja' })
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          surname,
          full_name: `${name} ${surname}`,
          role: 'user',
          ip_address: ip,
          ip_city: city,
          ip_country: country,
          ip_region: region,
          ip_latitude: lat,
          ip_longitude: lon,
          user_agent: req.headers['user-agent'],
          registered_at: new Date().toISOString()
        }
      }
    })

    if (error) throw error
    return res.status(200).json({ success: true, message: 'Registracija uspešna' })
  } catch (error) {
    console.error('Greška:', error)
    return res.status(400).json({ success: false, error: error.message })
  }
}
