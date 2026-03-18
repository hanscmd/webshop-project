import { geolocation, ipAddress } from '@vercel/functions'

export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  // CORS headers
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    // Dohvati IP i geolokaciju
    const clientIp = ipAddress(request) || 
                     request.headers.get('x-forwarded-for') || 
                     'unknown'
    
    const geo = geolocation(request)

    // Parsiraj body
    const body = await request.json()
    const { email, password, name, surname } = body

    // Validacija
    if (!email || !password || !name || !surname) {
      return new Response(
        JSON.stringify({ error: 'Sva polja su obavezna' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Dinamički import Supabase klijenta
    const { createClient } = await import('@supabase/supabase-js')
    
    // Proveri environment varijable
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Registracija sa Supabase
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
          ip_country: geo?.country || null,
          ip_city: geo?.city || null,
          ip_region: geo?.region || null,
          ip_latitude: geo?.latitude || null,
          ip_longitude: geo?.longitude || null,
          user_agent: request.headers.get('user-agent') || null,
          registered_at: new Date().toISOString()
        }
      }
    })

    if (error) {
      console.error('Supabase error:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Registracija uspešna. Proverite email za potvrdu.'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Server error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error: ' + error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}