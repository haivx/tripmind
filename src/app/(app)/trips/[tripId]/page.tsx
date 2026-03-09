import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, CalendarDays, Clock, CheckSquare, MessageSquare } from 'lucide-react'
import { AlertsBanner } from '@/components/ai/alerts-banner'
import type { Trip, Place, Alert } from '@/types'

interface PageProps {
  params: Promise<{ tripId: string }>
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

  const byCategory = allPlaces.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1
    return acc
  }, {})

  const allAlerts = (alerts ?? []) as Alert[]

  return (
    <div className="space-y-4">
      {/* Alerts */}
      <AlertsBanner tripId={tripId} initialAlerts={allAlerts} />

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <CalendarDays className="h-3.5 w-3.5" />
              Duration
            </div>
            <p className="text-2xl font-bold">{duration}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <MapPin className="h-3.5 w-3.5" />
              Places
            </div>
            <p className="text-2xl font-bold">{allPlaces.length}</p>
            <p className="text-xs text-muted-foreground">saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <CheckSquare className="h-3.5 w-3.5" />
              Booked
            </div>
            <p className="text-2xl font-bold">{bookedCount}</p>
            <p className="text-xs text-muted-foreground">of {allPlaces.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
              <Clock className="h-3.5 w-3.5" />
              Starts
            </div>
            <p className="text-lg font-bold leading-tight">{t.start_date}</p>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {t.description && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{t.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Places by category */}
      {allPlaces.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Places by category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(byCategory).map(([cat, count]) => (
                <Badge key={cat} variant="secondary" className="capitalize">
                  {cat} ({count})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 pt-1">
        <Button asChild size="sm" variant="outline">
          <Link href={`${base}/places`}>
            <MapPin className="h-4 w-4 mr-1" />
            Manage places
          </Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href={`${base}/chat`}>
            <MessageSquare className="h-4 w-4 mr-1" />
            Ask AI
          </Link>
        </Button>
      </div>

      {/* Empty state */}
      {allPlaces.length === 0 && (
        <div className="text-center py-10 text-muted-foreground text-sm">
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
