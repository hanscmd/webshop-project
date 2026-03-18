import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST
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

    // Proveri environment varijable
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables')
      return res.status(500).json({ error: 'Server configuration error' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Registracija sa Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          surname
        }
      }
    })

    if (error) {
      console.error('Supabase error:', error)
      return res.status(400).json({ error: error.message })
    }

    // Uspešna registracija
    return res.status(200).json({ 
      success: true,
      message: 'Registracija uspešna. Proverite email za potvrdu.'
    })

  } catch (error) {
    console.error('Server error:', error)
    return res.status(500).json({ error: 'Internal server error: ' + error.message })
  }
}