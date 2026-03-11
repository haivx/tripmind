import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { TripTabLink } from '@/components/trips/trip-tab-link'
import { ShareButton } from '@/components/trips/share-button'
import type { Trip } from '@/types'

const STATUS_BADGE: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  planning: 'secondary',
  active: 'default',
  completed: 'outline',
  cancelled: 'destructive',
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

  return (
    <div className="space-y-4">
      {/* Trip header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-bold tracking-tight">{t.title}</h1>
          <Badge variant={STATUS_BADGE[t.status] ?? 'secondary'}>{t.status}</Badge>
          <div className="ml-auto">
            <ShareButton tripId={tripId} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {t.destination} &middot; {t.start_date} → {t.end_date}
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b overflow-x-auto">
        {TABS.map(({ suffix, label }) => (
          <TripTabLink key={suffix} href={`${base}${suffix}`} label={label} />
        ))}
      </div>

      <div className="pt-2">{children}</div>
    </div>
  )
}
