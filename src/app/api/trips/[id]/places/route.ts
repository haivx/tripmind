import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

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

  const { data, error } = await supabase
    .from('places')
    .insert({ ...parsed.data, trip_id: tripId, user_id: user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
