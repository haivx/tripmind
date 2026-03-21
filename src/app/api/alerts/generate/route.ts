import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/claude'
import { getAlertsPrompt } from '@/lib/prompts'
import { simpleRateLimit } from '@/lib/rate-limit-simple'
import type { Trip, Place } from '@/types'

const bodySchema = z.object({
  tripId: z.string().uuid(),
})

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
  const prompt = getAlertsPrompt(trip as Trip, allPlaces)

  let message: Awaited<ReturnType<typeof anthropic.messages.create>>
  try {
    message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })
  } catch (err) {
    console.error('Anthropic API error:', err)
    return Response.json({ error: 'Failed to generate alerts' }, { status: 500 })
  }

  const text = message.content[0]?.type === 'text' ? message.content[0].text : '[]'

  let alerts: Array<{ type: string; message: string }>
  try {
    const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
    alerts = JSON.parse(cleaned)
  } catch {
    alerts = []
  }

  // Delete old undismissed alerts, insert new ones
  const { error: deleteError } = await supabase
    .from('alerts')
    .delete()
    .eq('trip_id', tripId)
    .eq('user_id', user.id)
    .eq('dismissed', false)

  if (deleteError) {
    console.error('Failed to delete old alerts:', deleteError)
    return Response.json({ error: 'Failed to update alerts' }, { status: 500 })
  }

  if (alerts.length > 0) {
    const { error: insertError } = await supabase.from('alerts').insert(
      alerts.map((a) => ({
        trip_id: tripId,
        user_id: user.id,
        type: a.type,
        message: a.message,
        dismissed: false,
      }))
    )
    if (insertError) {
      console.error('Failed to insert alerts:', insertError)
      return Response.json({ error: 'Failed to save alerts' }, { status: 500 })
    }
  }

  return Response.json({ data: alerts })
}
