interface GeoResult {
  latitude: number
  longitude: number
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
