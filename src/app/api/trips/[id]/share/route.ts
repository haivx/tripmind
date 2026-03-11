import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteContext {
  params: Promise<{ id: string }>
}

// POST /api/trips/[id]/share — return the share token for this trip
export async function POST(_req: NextRequest, { params }: RouteContext): Promise<Response> {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: trip, error } = await supabase
    .from('trips')
    .select('share_token')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !trip) return Response.json({ error: 'Not found' }, { status: 404 })

  return Response.json({ data: trip.share_token })
}
