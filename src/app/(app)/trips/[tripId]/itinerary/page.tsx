import { createClient } from '@/lib/supabase/server'
import { MapPin } from 'lucide-react'
import { ItineraryTimeline } from '@/components/itinerary/itinerary-timeline'
import type { Place } from '@/types'

interface PageProps {
  params: Promise<{ tripId: string }>
}

export default async function ItineraryPage({ params }: PageProps) {
  const { tripId } = await params
  const supabase = await createClient()

  const { data: places, error } = await supabase
    .from('places')
    .select('*')
    .eq('trip_id', tripId)
    .order('visit_date', { ascending: true, nullsFirst: false })
    .order('sort_order', { ascending: true })
    .order('visit_time', { ascending: true, nullsFirst: false })

  if (error) {
    return <p className="text-sm text-destructive">Failed to load itinerary: {error.message}</p>
  }

  const allPlaces = (places ?? []) as Place[]

  if (allPlaces.length === 0) {
    return (
      <div className="text-center py-16 text-[#717171] dark:text-muted-foreground text-sm">
        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
        <p>No places yet. Add places and set visit dates to build your itinerary.</p>
      </div>
    )
  }

  return <ItineraryTimeline initialPlaces={allPlaces} tripId={tripId} />
}
