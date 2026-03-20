import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { TripTabLink } from '@/components/trips/trip-tab-link'
import { ShareButton } from '@/components/trips/share-button'
import type { Trip, TripStatus } from '@/types'

const STATUS_STYLES: Record<TripStatus, { label: string; bg: string; color: string }> = {
  planning:  { label: 'Planning',  bg: 'rgba(225,29,72,0.12)',   color: '#FB7185' },
  active:    { label: 'Active',    bg: 'rgba(34,197,94,0.12)',   color: '#4ade80' },
  completed: { label: 'Completed', bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' },
  cancelled: { label: 'Cancelled', bg: 'rgba(239,68,68,0.12)',  color: '#f87171' },
}

const TABS = [
  { suffix: '', label: 'Overview' },
  { suffix: '/places', label: 'Places' },
  { suffix: '/itinerary', label: 'Itinerary' },
  { suffix: '/map', label: 'Map' },
  { suffix: '/budget', label: 'Budget' },
  { suffix: '/chat', label: 'AI Chat' },
]

interface TripLayoutProps {
  children: React.ReactNode
  params: Promise<{ tripId: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ tripId: string }> }): Promise<Metadata> {
  const { tripId } = await params
  const supabase = await createClient()
  const { data: trip } = await supabase.from('trips').select('title, destination').eq('id', tripId).single()
  if (!trip) return { title: 'Trip — TripMind' }
  return {
    title: `${trip.title} (${trip.destination}) — TripMind`,
    description: `Plan and manage your trip to ${trip.destination} with TripMind.`,
  }
}

export default async function TripLayout({ children, params }: TripLayoutProps) {
  const { tripId } = await params
  const supabase = await createClient()

  const { data: trip } = await supabase
    .from('trips')
    .select('*')
    .eq('id', tripId)
    .single()

  if (!trip) notFound()

  const t = trip as Trip
  const base = `/trips/${tripId}`
  const status = STATUS_STYLES[t.status as TripStatus] ?? STATUS_STYLES.planning

  return (
    <div className="space-y-4">
      {/* Trip header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1
            className="text-xl font-bold text-white"
            style={{ fontFamily: 'var(--font-sora), sans-serif', letterSpacing: '-0.01em' }}
          >
            {t.title}
          </h1>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: status.bg, color: status.color }}
          >
            {status.label}
          </span>
          <div className="ml-auto">
            <ShareButton tripId={tripId} />
          </div>
        </div>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {t.destination} &middot; {t.start_date} → {t.end_date}
        </p>
      </div>

      {/* Tab navigation */}
      <div
        className="flex overflow-x-auto"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        {TABS.map(({ suffix, label }) => (
          <TripTabLink key={suffix} href={`${base}${suffix}`} label={label} />
        ))}
      </div>

      <div className="pt-2">{children}</div>
    </div>
  )
}
