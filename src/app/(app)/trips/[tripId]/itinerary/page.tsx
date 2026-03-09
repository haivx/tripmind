import { createClient } from '@/lib/supabase/server'
import { MapPin, Clock, Calendar } from 'lucide-react'
import { SuggestItineraryButton } from '@/components/ai/suggest-itinerary-button'
import type { Place } from '@/types'

interface PageProps {
  params: Promise<{ tripId: string }>
}

const CATEGORY_EMOJI: Record<string, string> = {
  accommodation: '🏨',
  restaurant: '🍜',
  attraction: '🗼',
  transport: '🚄',
  other: '📍',
}

const CATEGORY_LABEL: Record<string, string> = {
  accommodation: 'Stay',
  restaurant: 'Food',
  attraction: 'Sightseeing',
  transport: 'Transport',
  other: 'Other',
}

const CATEGORY_COLOR: Record<string, string> = {
  accommodation: 'bg-blue-100 text-blue-700',
  restaurant: 'bg-orange-100 text-orange-700',
  attraction: 'bg-purple-100 text-purple-700',
  transport: 'bg-gray-100 text-gray-700',
  other: 'bg-green-100 text-green-700',
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
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
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
      <div className="text-center py-16 text-[#717171] text-sm">
        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
        <p>No places yet. Add places and set visit dates to build your itinerary.</p>
      </div>
    )
  }

  const grouped = groupByDate(allPlaces)
  const dayEntries = [...grouped.entries()]

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <SuggestItineraryButton tripId={tripId} />
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FF385C] via-[#FF385C] to-gray-200 rounded-full" />

        <div className="space-y-8">
          {dayEntries.map(([date, dayPlaces], dayIndex) => (
            <div key={date} className="relative pl-14">
              {/* Day badge */}
              <div className="absolute left-0 top-0 w-10 h-10 bg-[#FF385C] rounded-xl flex items-center justify-center shadow-sm">
                {date === 'undated' ? (
                  <Calendar className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-white text-xs font-bold">{dayIndex + 1}</span>
                )}
              </div>

              {/* Day card */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <h2 className="text-[#1A1A2E] font-bold">{formatDate(date)}</h2>
                  <p className="text-xs text-[#717171] mt-0.5">{dayPlaces.length} place{dayPlaces.length !== 1 ? 's' : ''}</p>
                </div>

                <div className="space-y-1">
                  {dayPlaces.map((place) => (
                    <div
                      key={place.id}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F7F7F7] transition-colors"
                    >
                      <span className="text-base mt-0.5 w-5 shrink-0">
                        {CATEGORY_EMOJI[place.category] ?? '📍'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-[#1A1A2E]">{place.name}</p>
                          {place.booked && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                              booked
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3 mt-0.5 flex-wrap">
                          {place.visit_time && (
                            <span className="flex items-center gap-1 text-xs text-[#717171]">
                              <Clock className="h-3 w-3 text-[#FF385C]" />
                              {place.visit_time}
                            </span>
                          )}
                          {place.address && (
                            <span className="flex items-center gap-1 text-xs text-[#717171] truncate max-w-[200px]">
                              <MapPin className="h-3 w-3 shrink-0 text-[#FF385C]" />
                              {place.address}
                            </span>
                          )}
                          {place.duration_minutes && (
                            <span className="text-xs text-[#717171]">
                              {place.duration_minutes} min
                            </span>
                          )}
                        </div>
                        {place.notes && (
                          <p className="text-xs text-[#717171] mt-0.5 line-clamp-1">{place.notes}</p>
                        )}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${CATEGORY_COLOR[place.category] ?? 'bg-gray-100 text-gray-700'}`}>
                        {CATEGORY_LABEL[place.category] ?? place.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
