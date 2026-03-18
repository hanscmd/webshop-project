import { supabase } from '../src/supabase/client'
import { geolocation, ipAddress } from '@vercel/functions'

export const config = {
  runtime: 'edge',
  regions: ['iad1']
}

export default async function handler(request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers, status: 204 })
  }

  try {
    const clientIp = ipAddress(request) || request.headers.get('x-forwarded-for') || 'unknown'
    const geo = geolocation(request) || {}
    const body = await request.json()
    const { email, password, name, surname } = body

    if (!email || !password || !name || !surname) {
      return new Response(JSON.stringify({ error: 'Sva polja su obavezna' }), { headers, status: 400 })
    }

    // Registracija u Supabase sa svim meta-podacima
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          surname,
          full_name: `${name} ${surname}`,
          role: 'user',
          ip_address: clientIp,
          ip_country: geo.country || null,
          ip_city: geo.city || null,
          ip_region: geo.region || null,
          ip_latitude: geo.latitude?.toString() || null,
          ip_longitude: geo.longitude?.toString() || null,
          user_agent: request.headers.get('user-agent') || 'unknown',
        }
      }
    })

    if (signUpError) {
      return new Response(JSON.stringify({ error: signUpError.message }), { headers, status: 400 })
    }

    return new Response(JSON.stringify({ success: true, user: data.user }), { headers, status: 200 })

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server Error', details: err.message }), { headers, status: 500 })
  }
}