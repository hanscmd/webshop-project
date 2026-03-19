import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  try {
    const { name, surname, email, password } = req.body

    if (!name || !surname || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Nedostaju obavezna polja'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Lozinka mora imati najmanje 6 karaktera'
      })
    }

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      null

    const city = req.headers['x-vercel-ip-city'] || null
    const country = req.headers['x-vercel-ip-country'] || null
    const region = req.headers['x-vercel-ip-country-region'] || null
    const latitude = req.headers['x-vercel-ip-latitude'] || null
    const longitude = req.headers['x-vercel-ip-longitude'] || null
    const timezone = req.headers['x-vercel-ip-timezone'] || null
    const userAgent = req.headers['user-agent'] || null

    const metadata = {
      name,
      surname,
      full_name: `${name} ${surname}`,
      role: 'user',
      ip_address: ip,
      ip_country: country,
      ip_city: city,
      ip_region: region,
      ip_latitude: latitude,
      ip_longitude: longitude,
      ip_timezone: timezone,
      user_agent: userAgent,
      registered_at: new Date().toISOString()
    }

    console.log('REGISTER METADATA:', metadata)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    if (error) {
      console.error('SUPABASE SIGNUP ERROR:', error)
      return res.status(400).json({
        success: false,
        error: error.message || 'Greška pri registraciji'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Registracija uspešna. Proverite email radi potvrde naloga.',
      data
    })
  } catch (error) {
    console.error('REGISTER API ERROR:', error)
    return res.status(500).json({
      success: false,
      error: 'Serverska greška'
    })
  }
}
