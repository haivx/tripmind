import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/claude'
import { getItinerarySuggestionPrompt } from '@/lib/prompts'
import type { Trip, Place } from '@/types'

const bodySchema = z.object({
  tripId: z.string().uuid(),
})

export async function POST(req: NextRequest): Promise<Response> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

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

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  let itinerary: unknown
  try {
    // Strip any markdown code fences if present
    const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
    itinerary = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse itinerary' }, { status: 422 })
  }

  return Response.json({ data: itinerary })
}
