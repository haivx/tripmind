import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { geocodeAddress } from '@/lib/geocode'

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  category: z.enum(['accommodation', 'restaurant', 'attraction', 'transport', 'other']).optional(),
  address: z.string().max(500).nullish(),
  notes: z.string().max(2000).nullish(),
  price: z.number().nonnegative().nullish(),
  currency: z.string().length(3).optional(),
  booked: z.boolean().optional(),
  booking_ref: z.string().max(100).nullish(),
  visit_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  checkout_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  visit_time: z.string().nullish(),
  duration_minutes: z.number().int().positive().nullish(),
})

interface RouteContext {
  params: Promise<{ placeId: string }>
}

export async function PATCH(req: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  const { placeId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body: unknown = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 })
  }

  // Re-geocode if address was explicitly included in the update payload
  let coordsUpdate: { latitude: number | null; longitude: number | null } | undefined
  if ('address' in parsed.data) {
    const coords = parsed.data.address ? await geocodeAddress(parsed.data.address) : null
    coordsUpdate = coords ?? { latitude: null, longitude: null }
  }

  const { data, error } = await supabase
    .from('places')
    .update({ ...parsed.data, ...coordsUpdate })
    .eq('id', placeId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(_req: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  const { placeId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('places')
    .delete()
    .eq('id', placeId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
