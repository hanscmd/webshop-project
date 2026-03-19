// api/register.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { name, surname, email, password } = req.body

    if (!name || !surname || !email || !password) {
      return res.status(400).json({ success: false, error: 'Nedostaju obavezna polja' })
    }

    const ip =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      null

    const metadata = {
      name,
      surname,
      full_name: `${name} ${surname}`,
      role: 'user',
      ip_address: ip,
      ip_city: req.headers['x-vercel-ip-city'] || null,
      ip_country: req.headers['x-vercel-ip-country'] || null,
      ip_region: req.headers['x-vercel-ip-country-region'] || null,
      ip_latitude: req.headers['x-vercel-ip-latitude'] || null,
      ip_longitude: req.headers['x-vercel-ip-longitude'] || null,
      user_agent: req.headers['user-agent'] || null,
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

    console.log('SIGNUP DATA:', data)
    console.log('SIGNUP ERROR:', error)

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Registracija uspešna',
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
