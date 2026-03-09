import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock } from 'lucide-react'
import { SuggestItineraryButton } from '@/components/ai/suggest-itinerary-button'
import type { Place } from '@/types'

interface PageProps {
  params: Promise<{ tripId: string }>
}

function groupByDate(places: Place[]): Map<string, Place[]> {
  const map = new Map<string, Place[]>()
  const undated: Place[] = []

  for (const p of places) {
    if (!p.visit_date) {
      undated.push(p)
    } else {
      const existing = map.get(p.visit_date) ?? []
      map.set(p.visit_date, [...existing, p])
    }
  }

  const sorted = new Map([...map.entries()].sort())
  if (undated.length > 0) sorted.set('undated', undated)
  return sorted
}

function formatDate(dateStr: string): string {
  if (dateStr === 'undated') return 'No date set'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

const CATEGORY_EMOJI: Record<string, string> = {
  accommodation: '🏨',
  restaurant: '🍜',
  attraction: '🗼',
  transport: '🚄',
  other: '📍',
}

export default async function ItineraryPage({ params }: PageProps) {
  const { tripId } = await params
  const supabase = await createClient()

  const { data: places, error } = await supabase
    .from('places')
    .select('*')
    .eq('trip_id', tripId)
    .order('visit_date', { ascending: true, nullsFirst: false })
    .order('visit_time', { ascending: true, nullsFirst: false })

  if (error) {
    return <p className="text-sm text-destructive">Failed to load itinerary: {error.message}</p>
  }

  const allPlaces = (places ?? []) as Place[]

  if (allPlaces.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">
        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
        <p>No places yet. Add places and set visit dates to build your itinerary.</p>
      </div>
    )
  }

  const grouped = groupByDate(allPlaces)

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <SuggestItineraryButton tripId={tripId} />
      </div>
      {[...grouped.entries()].map(([date, dayPlaces]) => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
              {formatDate(date)}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-2 pl-2 border-l-2 border-muted ml-1">
            {dayPlaces.map((place) => (
              <div key={place.id} className="flex items-start gap-3 pb-2">
                <span className="text-base mt-0.5 w-5 shrink-0">
                  {CATEGORY_EMOJI[place.category] ?? '📍'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{place.name}</p>
                    {place.booked && (
                      <Badge variant="outline" className="text-xs py-0">booked</Badge>
                    )}
                  </div>
                  <div className="flex gap-3 mt-0.5 flex-wrap">
                    {place.visit_time && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {place.visit_time}
                      </span>
                    )}
                    {place.address && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground truncate max-w-[200px]">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {place.address}
                      </span>
                    )}
                    {place.duration_minutes && (
                      <span className="text-xs text-muted-foreground">
                        {place.duration_minutes} min
                      </span>
                    )}
                  </div>
                  {place.notes && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {place.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
