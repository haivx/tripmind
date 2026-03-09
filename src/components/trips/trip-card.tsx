'use client'

import Link from 'next/link'
import { MapPin, Calendar, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Trip, TripStatus } from '@/types'

interface TripCardProps {
  trip: Trip
  onEdit: (trip: Trip) => void
  onDelete: (trip: Trip) => void
}

const STATUS_LABELS: Record<TripStatus, string> = {
  planning: 'Planning',
  active: 'Active',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const STATUS_VARIANTS: Record<TripStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  planning: 'secondary',
  active: 'default',
  completed: 'outline',
  cancelled: 'destructive',
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function TripCard({ trip, onEdit, onDelete }: TripCardProps) {
  return (
    <div className="relative">
      <Link href={`/trips/${trip.id}`} className="absolute inset-0 rounded-lg z-0" aria-label={trip.title} />
      <Card className="relative group hover:shadow-md transition-shadow">
        <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-snug line-clamp-1">{trip.title}</h3>
            <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{trip.destination}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 relative z-10">
            <Badge variant={STATUS_VARIANTS[trip.status]}>{STATUS_LABELS[trip.status]}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Trip actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(trip)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(trip)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDate(trip.start_date)} — {formatDate(trip.end_date)}</span>
          </div>
          {trip.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{trip.description}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
