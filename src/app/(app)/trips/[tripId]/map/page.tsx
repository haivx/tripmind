import { createClient } from '@/lib/supabase/server'
import { MapPin } from 'lucide-react'
import { TripMapClient } from '@/components/trips/trip-map-client'
import type { Place } from '@/types'

interface PageProps {
  params: Promise<{ tripId: string }>
}

export default async function MapPage({ params }: PageProps) {
  const { tripId } = await params
  const supabase = await createClient()

  const { data: places, error } = await supabase
    .from('places')
    .select('*')
    .eq('trip_id', tripId)
    .order('visit_date', { ascending: true, nullsFirst: false })
    .order('sort_order', { ascending: true })

  if (error) {
    return <p className="text-sm text-destructive">Failed to load places: {error.message}</p>
  }

  const allPlaces = (places ?? []) as Place[]
  const withCoords = allPlaces.filter((p) => p.latitude != null && p.longitude != null)
  const withoutCoords = allPlaces.filter((p) => p.latitude == null || p.longitude == null)

  if (allPlaces.length === 0) {
    return (
      <div className="text-center py-16 text-[#717171] text-sm">
        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
        <p>No places yet. Add places to see them on the map.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <TripMapClient places={allPlaces} />

      {withCoords.length > 0 && withoutCoords.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-[#717171] mb-2">
            {withoutCoords.length} place{withoutCoords.length !== 1 ? 's' : ''} without GPS
            coordinates:
          </p>
          <div className="flex flex-wrap gap-2">
            {withoutCoords.map((p) => (
              <span
                key={p.id}
                className="text-xs bg-[#F7F7F7] border border-gray-100 px-3 py-1 rounded-full text-[#1A1A2E]"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
