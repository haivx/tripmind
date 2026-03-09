import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { PlacesList } from '@/components/trips/places-list'
import { Skeleton } from '@/components/ui/skeleton'
import type { Place } from '@/types'

interface PageProps {
  params: Promise<{ tripId: string }>
}

async function PlacesData({ tripId }: { tripId: string }) {
  const supabase = await createClient()

  const { data: places, error } = await supabase
    .from('places')
    .select('*')
    .eq('trip_id', tripId)
    .order('visit_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })

  if (error) {
    return (
      <p className="text-sm text-destructive">Failed to load places: {error.message}</p>
    )
  }

  return <PlacesList tripId={tripId} initialPlaces={(places ?? []) as Place[]} />
}

function PlacesSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  )
}

export default async function PlacesPage({ params }: PageProps) {
  const { tripId } = await params
  return (
    <Suspense fallback={<PlacesSkeleton />}>
      <PlacesData tripId={tripId} />
    </Suspense>
  )
}
