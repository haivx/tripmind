import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Plane, MapPin, CalendarDays, Clock } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Trip, Place } from '@/types'

interface PageProps {
  params: Promise<{ token: string }>
}

const CATEGORY_EMOJI: Record<string, string> = {
  accommodation: '🏨',
  restaurant: '🍜',
  attraction: '🗼',
  transport: '🚄',
  other: '📍',
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

function groupByDate(places: Place[]): Map<string, Place[]> {
  const map = new Map<string, Place[]>()
  const undated: Place[] = []
  for (const p of places) {
    if (!p.visit_date) {
      undated.push(p)
    } else {
      map.set(p.visit_date, [...(map.get(p.visit_date) ?? []), p])
    }
  }
  const sorted = new Map([...map.entries()].sort())
  if (undated.length > 0) sorted.set('undated', undated)
  return sorted
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params
  const supabase = createAdminClient()
  const { data: trip } = await supabase
    .from('trips')
    .select('title, destination, start_date, end_date')
    .eq('share_token', token)
    .single()
  if (!trip) return { title: 'Shared Trip — TripMind' }

  const duration =
    Math.round(
      (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1
  const description = `${duration}-day trip to ${trip.destination} · ${trip.start_date} → ${trip.end_date}. Planned with TripMind AI.`
  const ogTitle = `${trip.title} · ${trip.destination}`

  return {
    title: `${ogTitle} — TripMind`,
    description,
    openGraph: {
      title: ogTitle,
      description,
      type: 'website',
      siteName: 'TripMind',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
    },
  }
}

export default async function SharePage({ params }: PageProps) {
  const { token } = await params
  const supabase = createAdminClient()

  const [{ data: trip }, ] = await Promise.all([
    supabase.from('trips').select('*').eq('share_token', token).single(),
  ])

  if (!trip) notFound()

  const { data: places } = await supabase
    .from('places')
    .select('*')
    .eq('trip_id', trip.id)
    .order('visit_date', { ascending: true, nullsFirst: false })
    .order('sort_order', { ascending: true })
    .order('visit_time', { ascending: true, nullsFirst: false })

  const t = trip as Trip
  const allPlaces = (places ?? []) as Place[]
  const grouped = groupByDate(allPlaces)
  const duration =
    Math.round(
      (new Date(t.end_date).getTime() - new Date(t.start_date).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex items-center gap-2">
        <Plane className="h-5 w-5 text-[#FF385C]" />
        <span className="font-semibold text-[#1A1A2E]">TripMind</span>
        <span className="ml-2 text-xs bg-[#F7F7F7] border rounded-full px-2 py-0.5 text-[#717171]">
          Shared trip
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Trip title */}
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">{t.title}</h1>
          <p className="text-sm text-[#717171] mt-0.5">
            {t.destination} &middot; {t.start_date} → {t.end_date}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <CalendarDays className="h-4 w-4 mx-auto mb-1 text-[#FF385C]" />
            <p className="text-2xl font-bold text-[#1A1A2E]">{duration}</p>
            <p className="text-xs text-[#717171]">days</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <MapPin className="h-4 w-4 mx-auto mb-1 text-[#FF385C]" />
            <p className="text-2xl font-bold text-[#1A1A2E]">{allPlaces.length}</p>
            <p className="text-xs text-[#717171]">places</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <Clock className="h-4 w-4 mx-auto mb-1 text-[#FF385C]" />
            <p className="text-sm font-bold text-[#1A1A2E] leading-tight">{t.start_date}</p>
            <p className="text-xs text-[#717171]">start date</p>
          </div>
        </div>

        {/* Description */}
        {t.description && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-2">About this trip</h3>
            <p className="text-sm text-[#717171] whitespace-pre-wrap">{t.description}</p>
          </div>
        )}

        {/* Day-by-day itinerary */}
        {allPlaces.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-[#1A1A2E] mb-3">Itinerary</h2>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FF385C] via-[#FF385C] to-gray-200 rounded-full" />
              <div className="space-y-5">
                {[...grouped.entries()].map(([date, dayPlaces], idx) => (
                  <div key={date} className="relative pl-14">
                    <div className="absolute left-0 top-0 w-10 h-10 bg-[#FF385C] rounded-xl flex items-center justify-center shadow-sm">
                      {date === 'undated' ? (
                        <MapPin className="h-4 w-4 text-white" />
                      ) : (
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <p className="font-bold text-[#1A1A2E] mb-3">
                        {date === 'undated' ? 'No date set' : formatDate(date)}
                      </p>
                      <div className="space-y-2">
                        {[...dayPlaces]
                          .sort((a, b) => a.sort_order - b.sort_order)
                          .map((place) => (
                            <div key={place.id} className="flex items-start gap-3 py-1.5">
                              <span className="text-base mt-0.5 shrink-0">
                                {CATEGORY_EMOJI[place.category] ?? '📍'}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#1A1A2E]">{place.name}</p>
                                <div className="flex gap-3 mt-0.5 flex-wrap">
                                  {place.visit_time && (
                                    <span className="text-xs text-[#717171]">🕐 {place.visit_time}</span>
                                  )}
                                  {place.address && (
                                    <span className="text-xs text-[#717171] truncate max-w-[200px]">
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
                                  <p className="text-xs text-[#717171] mt-0.5">{place.notes}</p>
                                )}
                              </div>
                              {place.booked && (
                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium shrink-0">
                                  booked
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-[#717171] pt-4 pb-8">
          Shared via{' '}
          <span className="font-semibold text-[#FF385C]">TripMind</span> · AI Travel Planner
        </p>
      </main>
    </div>
  )
}
