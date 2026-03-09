import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { TripList, TripListSkeleton } from '@/components/trips/trip-list'
import type { Trip } from '@/types'

async function TripsData() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">
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
      <div className="text-center py-16 text-destructive text-sm">
        Failed to load trips: {error.message}
      </div>
    )
  }

  return <TripList initialTrips={(trips as Trip[]) ?? []} />
}

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Plan and track your adventures</p>
      </div>
      <Suspense fallback={<TripListSkeleton />}>
        <TripsData />
      </Suspense>
    </div>
  )
}
