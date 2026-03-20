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
    return (
      <p className="text-sm" style={{ color: '#f87171' }}>
        Failed to load places: {error.message}
      </p>
    )
  }

  const allPlaces = (places ?? []) as Place[]
  const withCoords = allPlaces.filter((p) => p.latitude != null && p.longitude != null)
  const withoutCoords = allPlaces.filter((p) => p.latitude == null || p.longitude == null)

  if (allPlaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <MapPin className="h-6 w-6" style={{ color: 'rgba(255,255,255,0.2)' }} />
        </div>
        <div>
          <p className="text-white font-medium mb-1">No places yet</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Add places to see them on the map.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <TripMapClient places={allPlaces} />

      {withCoords.length > 0 && withoutCoords.length > 0 && (
        <div
          className="rounded-2xl p-4"
          style={{ background: '#13162a', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {withoutCoords.length} place{withoutCoords.length !== 1 ? 's' : ''} without GPS coordinates:
          </p>
          <div className="flex flex-wrap gap-2">
            {withoutCoords.map((p) => (
              <span
                key={p.id}
                className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.65)',
                }}
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
