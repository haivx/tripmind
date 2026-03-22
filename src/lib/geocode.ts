interface GeoResult {
  latitude: number
  longitude: number
}

export interface NominatimResult {
  place_id: string
  display_name: string
  lat: string
  lon: string
}

interface GoogleGeocodeResponse {
  status: string
  results: Array<{
    place_id: string
    formatted_address: string
    geometry: { location: { lat: number; lng: number } }
  }>
}

/**
 * Search for matching locations (client-side use).
 * Calls /api/geocode/search which proxies to Google Geocoding API server-side.
 * Returns up to 5 results. Returns [] on any error.
 */
export async function searchLocations(query: string): Promise<NominatimResult[]> {
  if (!query.trim() || query.trim().length < 2) return []
  try {
    const res = await fetch(
      `/api/geocode/search?q=${encodeURIComponent(query)}`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) return []
    return (await res.json()) as NominatimResult[]
  } catch {
    return []
  }
}

/**
 * Geocode a free-form address string using Google Maps Geocoding API (server-side only).
 * Returns null if the address can't be resolved or on any error.
 */
export async function geocodeAddress(address: string): Promise<GeoResult | null> {
  if (!address.trim()) return null

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    console.error('GOOGLE_MAPS_API_KEY is not set')
    return null
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json')
    url.searchParams.set('address', address)
    url.searchParams.set('key', apiKey)

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null

    const data: GoogleGeocodeResponse = await res.json()
    if (data.status !== 'OK' || !data.results.length) return null

    const { lat, lng } = data.results[0].geometry.location
    return { latitude: lat, longitude: lng }
  } catch {
    return null
  }
}
