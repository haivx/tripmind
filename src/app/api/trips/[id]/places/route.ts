import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { geocodeAddress } from '@/lib/geocode'

const placeSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.enum(['accommodation', 'restaurant', 'attraction', 'transport', 'other']),
  address: z.string().max(500).nullish(),
  notes: z.string().max(2000).nullish(),
  price: z.number().nonnegative().nullish(),
  currency: z.string().length(3).default('JPY'),
  booked: z.boolean().default(false),
  booking_ref: z.string().max(100).nullish(),
  visit_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  checkout_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  visit_time: z.string().nullish(),
  duration_minutes: z.number().int().positive().nullish(),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish(),
})

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_req: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  const { id: tripId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('places')
    .select('*')
    .eq('trip_id', tripId)
    .order('visit_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  const { id: tripId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body: unknown = await req.json()
  const parsed = placeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }

  let coords: { latitude: number | null; longitude: number | null } | null = null
  if (parsed.data.latitude != null && parsed.data.longitude != null) {
    coords = { latitude: parsed.data.latitude, longitude: parsed.data.longitude }
  } else if (parsed.data.address) {
    coords = await geocodeAddress(parsed.data.address)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { latitude: _lat, longitude: _lng, ...placeData } = parsed.data

  const { data, error } = await supabase
    .from('places')
    .insert({ ...placeData, trip_id: tripId, user_id: user.id, ...coords })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
