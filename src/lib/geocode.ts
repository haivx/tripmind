interface GeoResult {
  latitude: number
  longitude: number
}

export interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
}

/**
 * Search Nominatim for matching locations (client-side use).
 * Returns up to 5 results. Returns [] on any error.
 */
export async function searchLocations(query: string): Promise<NominatimResult[]> {
  if (!query.trim() || query.trim().length < 2) return []
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'TripMind/1.0' },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return []
    return (await res.json()) as NominatimResult[]
  } catch {
    return []
  }
}

/**
 * Geocode a free-form address string using Nominatim (OpenStreetMap).
 * Returns null if the address can't be resolved or on any error.
 */
export async function geocodeAddress(address: string): Promise<GeoResult | null> {
  if (!address.trim()) return null

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'TripMind/1.0' },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null

    const results = (await res.json()) as { lat: string; lon: string }[]
    if (!results.length) return null

    return {
      latitude: parseFloat(results[0].lat),
      longitude: parseFloat(results[0].lon),
    }
  } catch {
    return null
  }
}
