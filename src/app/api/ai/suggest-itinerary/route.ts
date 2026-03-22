import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/claude'
import { getItinerarySuggestionPrompt } from '@/lib/prompts'
import { simpleRateLimit } from '@/lib/rate-limit-simple'
import type { Trip, Place } from '@/types'

const bodySchema = z.object({
  tripId: z.string().uuid(),
})

interface ItineraryDay {
  date: string
  title: string
  places: string[]
}

interface TravelSegment {
  from: string
  to: string
  duration_minutes: number
  mode: string
}

interface EnrichedItineraryDay extends ItineraryDay {
  travel_times: TravelSegment[]
}

interface GoogleDirectionsResponse {
  status: string
  routes: Array<{
    legs: Array<{
      duration: { value: number }
    }>
  }>
}

async function getTravelMinutes(origin: string, destination: string): Promise<number | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) return null

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/directions/json')
    url.searchParams.set('origin', origin)
    url.searchParams.set('destination', destination)
    url.searchParams.set('mode', 'transit')
    url.searchParams.set('key', apiKey)

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null

    const data: GoogleDirectionsResponse = await res.json()
    if (data.status !== 'OK' || !data.routes[0]?.legs[0]) return null

    return Math.round(data.routes[0].legs[0].duration.value / 60)
  } catch {
    return null
  }
}

async function enrichWithTravelTimes(
  itinerary: ItineraryDay[],
  places: Place[]
): Promise<EnrichedItineraryDay[]> {
  const placeMap = new Map(places.map((p) => [p.name, p]))

  return Promise.all(
    itinerary.map(async (day) => {
      if (day.places.length < 2) return { ...day, travel_times: [] }

      const segments = await Promise.all(
        day.places.slice(0, -1).map(async (fromName, i) => {
          const toName = day.places[i + 1]
          const from = placeMap.get(fromName)
          const to = placeMap.get(toName)
          if (!from || !to) return null

          const origin =
            from.address ??
            (from.latitude != null && from.longitude != null
              ? `${from.latitude},${from.longitude}`
              : null)
          const dest =
            to.address ??
            (to.latitude != null && to.longitude != null
              ? `${to.latitude},${to.longitude}`
              : null)
          if (!origin || !dest) return null

          const minutes = await getTravelMinutes(origin, dest)
          if (minutes === null) return null

          return { from: fromName, to: toName, duration_minutes: minutes, mode: 'transit' }
        })
      )

      return {
        ...day,
        travel_times: segments.filter((s): s is TravelSegment => s !== null),
      }
    })
  )
}

function isItineraryDay(val: unknown): val is ItineraryDay {
  if (!val || typeof val !== 'object') return false
  const v = val as Record<string, unknown>
  return (
    typeof v.date === 'string' &&
    typeof v.title === 'string' &&
    Array.isArray(v.places) &&
    v.places.every((p) => typeof p === 'string')
  )
}

export async function POST(req: NextRequest): Promise<Response> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const limited = simpleRateLimit(user.id, 5, 60_000)
  if (limited) return limited

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 })

  const { tripId } = parsed.data

  const [{ data: trip }, { data: places }] = await Promise.all([
    supabase.from('trips').select('*').eq('id', tripId).eq('user_id', user.id).single(),
    supabase.from('places').select('*').eq('trip_id', tripId).eq('user_id', user.id),
  ])

  if (!trip) return Response.json({ error: 'Trip not found' }, { status: 404 })

  const allPlaces = (places ?? []) as Place[]
  if (allPlaces.length === 0) {
    return Response.json({ error: 'Add some places first before generating an itinerary' }, { status: 400 })
  }

  const prompt = getItinerarySuggestionPrompt(trip as Trip, allPlaces)

  let message: Awaited<ReturnType<typeof anthropic.messages.create>>
  try {
    message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })
  } catch (err) {
    console.error('Anthropic API error:', err)
    return Response.json({ error: 'Failed to generate itinerary' }, { status: 500 })
  }

  const text = message.content[0]?.type === 'text' ? message.content[0].text : ''

  let itinerary: unknown
  try {
    const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
    itinerary = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse itinerary' }, { status: 422 })
  }

  if (!Array.isArray(itinerary) || !itinerary.every(isItineraryDay)) {
    return Response.json({ data: itinerary })
  }

  // Enrich with travel times between consecutive places (graceful: skips on any error)
  let enriched: EnrichedItineraryDay[]
  try {
    enriched = await enrichWithTravelTimes(itinerary, allPlaces)
  } catch (err) {
    console.error('Travel time enrichment failed:', err)
    return Response.json({ data: itinerary })
  }

  return Response.json({ data: enriched })
}
