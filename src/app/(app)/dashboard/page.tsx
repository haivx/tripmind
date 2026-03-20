import { Suspense } from 'react'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { TripList, TripListSkeleton } from '@/components/trips/trip-list'
import type { Trip } from '@/types'

export const metadata: Metadata = {
  title: 'Dashboard — TripMind',
}

async function TripsData() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="text-center py-16 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
        Please sign in to view your trips.
      </div>
    )
  }

  const { data: trips, error } = await supabase
    .from('trips')
    .select('*')
    .order('start_date', { ascending: true })

  if (error) {
    return (
      <div className="text-center py-16 text-sm" style={{ color: '#E11D48' }}>
        Failed to load trips: {error.message}
      </div>
    )
  }

  return <TripList initialTrips={(trips as Trip[]) ?? []} />
}

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-white mb-1"
          style={{ fontFamily: 'var(--font-sora), sans-serif', letterSpacing: '-0.02em' }}
        >
          Dashboard
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Plan and track your adventures
        </p>
      </div>
      <Suspense fallback={<TripListSkeleton />}>
        <TripsData />
      </Suspense>
    </div>
  )
}
