import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { MapPin, CalendarDays, Clock, CheckSquare, MessageSquare } from 'lucide-react'
import { AlertsBanner } from '@/components/ai/alerts-banner'
import type { Trip, Place, Alert } from '@/types'

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
  accommodation: 'Accommodation',
  restaurant: 'Food & Drink',
  attraction: 'Attractions',
  transport: 'Transport',
  other: 'Other',
}

function tripDuration(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1
}

export default async function TripOverviewPage({ params }: PageProps) {
  const { tripId } = await params
  const supabase = await createClient()

  const [{ data: trip }, { data: places }, { data: alerts }] = await Promise.all([
    supabase.from('trips').select('*').eq('id', tripId).single(),
    supabase.from('places').select('*').eq('trip_id', tripId),
    supabase.from('alerts').select('*').eq('trip_id', tripId).eq('dismissed', false).order('created_at', { ascending: true }),
  ])

  if (!trip) notFound()

  const t = trip as Trip
  const allPlaces = (places ?? []) as Place[]
  const bookedCount = allPlaces.filter((p) => p.booked).length
  const duration = tripDuration(t.start_date, t.end_date)
  const base = `/trips/${tripId}`
  const bookingPct = allPlaces.length > 0 ? Math.round((bookedCount / allPlaces.length) * 100) : 0

  const byCategory = allPlaces.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1
    return acc
  }, {})

  const allAlerts = (alerts ?? []) as Alert[]

  return (
    <div className="space-y-4">
      {/* Alerts */}
      <AlertsBanner tripId={tripId} initialAlerts={allAlerts} />

      {/* Booking progress bar */}
      {allPlaces.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold text-[#1A1A2E]">Booking Progress</span>
            <span className="text-xs text-[#717171]">{bookedCount} of {allPlaces.length} booked</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF385C] rounded-full transition-all"
              style={{ width: `${bookingPct}%` }}
            />
          </div>
          <p className="text-xs text-[#717171] mt-1.5">{bookingPct}% complete</p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-[#717171] text-xs mb-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Duration
          </div>
          <p className="text-2xl font-bold text-[#1A1A2E]">{duration}</p>
          <p className="text-xs text-[#717171]">days</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-[#717171] text-xs mb-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#FF385C]" />
            Places
          </div>
          <p className="text-2xl font-bold text-[#1A1A2E]">{allPlaces.length}</p>
          <p className="text-xs text-[#717171]">saved</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-[#717171] text-xs mb-1.5">
            <CheckSquare className="h-3.5 w-3.5 text-[#FF385C]" />
            Booked
          </div>
          <p className="text-2xl font-bold text-[#1A1A2E]">{bookedCount}</p>
          <p className="text-xs text-[#717171]">of {allPlaces.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-[#717171] text-xs mb-1.5">
            <Clock className="h-3.5 w-3.5" />
            Starts
          </div>
          <p className="text-base font-bold text-[#1A1A2E] leading-tight">{t.start_date}</p>
        </div>
      </div>

      {/* Description */}
      {t.description && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[#1A1A2E] mb-2">Notes</h3>
          <p className="text-sm text-[#717171] whitespace-pre-wrap">{t.description}</p>
        </div>
      )}

      {/* Places by category */}
      {allPlaces.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">Saved places</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(byCategory).map(([cat, count]) => (
              <div
                key={cat}
                className="flex items-center gap-1.5 bg-[#F7F7F7] px-3 py-1.5 rounded-full text-sm border border-gray-100"
              >
                <span>{CATEGORY_EMOJI[cat] ?? '📍'}</span>
                <span className="text-[#1A1A2E] capitalize">{CATEGORY_LABEL[cat] ?? cat}</span>
                <span className="text-[#717171]">({count})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 pt-1">
        <Button asChild size="sm" variant="outline" className="rounded-full">
          <Link href={`${base}/places`}>
            <MapPin className="h-4 w-4 mr-1" />
            Manage places
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="rounded-full">
          <Link href={`${base}/chat`}>
            <MessageSquare className="h-4 w-4 mr-1" />
            Ask AI
          </Link>
        </Button>
      </div>

      {/* Empty state */}
      {allPlaces.length === 0 && (
        <div className="text-center py-10 text-[#717171] text-sm">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p>No places yet.</p>
          <Button asChild size="sm" className="mt-3">
            <Link href={`${base}/places`}>Add your first place</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
