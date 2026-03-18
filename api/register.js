import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, name, surname } = req.body

    // Validacija
    if (!email || !password || !name || !surname) {
      return res.status(400).json({ error: 'Sva polja su obavezna' })
    }

    // Dohvati IP iz headers
    const clientIp = req.headers['x-forwarded-for'] || 
                     req.socket.remoteAddress || 
                     'unknown'

    // Dohvati geolokaciju iz Vercel headers
    const geo = {
      country: req.headers['x-vercel-ip-country'] || null,
      city: req.headers['x-vercel-ip-city'] || null,
      region: req.headers['x-vercel-ip-country-region'] || null,
      latitude: req.headers['x-vercel-ip-latitude'] || null,
      longitude: req.headers['x-vercel-ip-longitude'] || null
    }

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    )

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          surname,
          full_name: `${name} ${surname}`,
          role: 'user',
          ip_address: clientIp,
          ip_country: geo.country,
          ip_city: geo.city,
          ip_region: geo.region,
          ip_latitude: geo.latitude,
          ip_longitude: geo.longitude,
          user_agent: req.headers['user-agent'] || null,
          registered_at: new Date().toISOString()
        }
      }
    })

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({ 
      success: true,
      message: 'Registracija uspešna. Proverite email za potvrdu.'
    })

  } catch (error) {
    console.error('Server error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}