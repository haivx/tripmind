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

const CATEGORY_ICON: Record<string, string> = {
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

const CARD_STYLE = {
  background: '#13162a',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
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
        <div style={CARD_STYLE} className="p-4">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold text-white">Booking Progress</span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {bookedCount} of {allPlaces.length} booked
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${bookingPct}%`, background: '#E11D48' }}
            />
          </div>
          <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {bookingPct}% complete
          </p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div style={CARD_STYLE} className="p-4">
          <div className="flex items-center gap-1.5 text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <CalendarDays className="h-3.5 w-3.5" />
            Duration
          </div>
          <p className="text-2xl font-bold text-white">{duration}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>days</p>
        </div>

        <div style={CARD_STYLE} className="p-4">
          <div className="flex items-center gap-1.5 text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <MapPin className="h-3.5 w-3.5" style={{ color: '#E11D48' }} />
            Places
          </div>
          <p className="text-2xl font-bold text-white">{allPlaces.length}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>saved</p>
        </div>

        <div style={CARD_STYLE} className="p-4">
          <div className="flex items-center gap-1.5 text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <CheckSquare className="h-3.5 w-3.5" style={{ color: '#4ade80' }} />
            Booked
          </div>
          <p className="text-2xl font-bold text-white">{bookedCount}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>of {allPlaces.length}</p>
        </div>

        <div style={CARD_STYLE} className="p-4">
          <div className="flex items-center gap-1.5 text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <Clock className="h-3.5 w-3.5" />
            Starts
          </div>
          <p className="text-base font-bold text-white leading-tight">{t.start_date}</p>
        </div>
      </div>

      {/* Description */}
      {t.description && (
        <div style={CARD_STYLE} className="p-4">
          <h3 className="text-sm font-semibold text-white mb-2">Notes</h3>
          <p className="text-sm whitespace-pre-wrap" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {t.description}
          </p>
        </div>
      )}

      {/* Places by category */}
      {allPlaces.length > 0 && (
        <div style={CARD_STYLE} className="p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Saved places</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(byCategory).map(([cat, count]) => (
              <div
                key={cat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <span>{CATEGORY_ICON[cat] ?? '📍'}</span>
                <span>{CATEGORY_LABEL[cat] ?? cat}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>({count})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          asChild
          size="sm"
          className="rounded-full cursor-pointer transition-colors duration-200"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <Link href={`${base}/places`}>
            <MapPin className="h-4 w-4 mr-1.5" />
            Manage places
          </Link>
        </Button>
        <Button
          asChild
          size="sm"
          className="rounded-full cursor-pointer transition-all duration-200 hover:-translate-y-px"
          style={{
            background: '#E11D48',
            boxShadow: '0 0 16px rgba(225,29,72,0.3)',
            color: 'white',
          }}
        >
          <Link href={`${base}/chat`}>
            <MessageSquare className="h-4 w-4 mr-1.5" />
            Ask AI
          </Link>
        </Button>
      </div>

      {/* Empty state */}
      {allPlaces.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <MapPin className="h-6 w-6" style={{ color: 'rgba(255,255,255,0.2)' }} />
          </div>
          <div>
            <p className="text-white font-medium mb-1">No places yet</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Start adding spots to your trip!</p>
          </div>
          <Button
            asChild
            size="sm"
            className="cursor-pointer transition-all duration-200 hover:-translate-y-px"
            style={{ background: '#E11D48', borderRadius: '10px', color: 'white' }}
          >
            <Link href={`${base}/places`}>Add your first place</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
