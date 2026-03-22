import { NextRequest } from 'next/server'

interface GoogleGeocodeResult {
  place_id: string
  formatted_address: string
  geometry: {
    location: { lat: number; lng: number }
  }
}

interface GoogleGeocodeResponse {
  status: string
  results: GoogleGeocodeResult[]
}

export async function GET(req: NextRequest): Promise<Response> {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) return Response.json([], { status: 200 })

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) return Response.json([], { status: 200 })

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
    url.searchParams.set('address', q)
    url.searchParams.set('key', apiKey)

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return Response.json([], { status: 200 })

    const data: GoogleGeocodeResponse = await res.json()
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Geocode API error:', data.status)
      return Response.json([], { status: 200 })
    }

    const suggestions = data.results.slice(0, 5).map((r) => ({
      place_id: r.place_id,
      display_name: r.formatted_address,
      lat: String(r.geometry.location.lat),
      lon: String(r.geometry.location.lng),
    }))

    return Response.json(suggestions)
  } catch (err) {
    console.error('Geocode search error:', err)
    return Response.json([], { status: 200 })
  }
}
