'use client'

import Link from 'next/link'
import { MapPin, Calendar, MoreVertical, Pencil, Trash2 } from 'lucide-react'
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

const STATUS_STYLES: Record<TripStatus, { label: string; bg: string; color: string }> = {
  planning:  { label: 'Planning',  bg: 'rgba(225,29,72,0.12)',  color: '#FB7185' },
  active:    { label: 'Active',    bg: 'rgba(34,197,94,0.12)',  color: '#4ade80' },
  completed: { label: 'Completed', bg: 'rgba(255,255,255,0.08)',color: 'rgba(255,255,255,0.5)' },
  cancelled: { label: 'Cancelled', bg: 'rgba(239,68,68,0.12)', color: '#f87171' },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function TripCard({ trip, onEdit, onDelete }: TripCardProps) {
  const status = STATUS_STYLES[trip.status]

  return (
    <div className="relative group">
      <div
        className="relative rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background: '#13162a',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(225,29,72,0.3)'
          el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(225,29,72,0.08)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget
          el.style.borderColor = 'rgba(255,255,255,0.07)'
          el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-white text-base leading-snug line-clamp-1 mb-1"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              {trip.title}
            </h3>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: '#E11D48' }} />
              <span className="text-sm truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {trip.destination}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 relative z-20">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer transition-opacity duration-200"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Trip actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                style={{ background: '#13162a', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <DropdownMenuItem
                  onClick={() => onEdit(trip)}
                  className="cursor-pointer"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(trip)}
                  className="cursor-pointer"
                  style={{ color: '#f87171' }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.25)' }} />
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
          </span>
        </div>

        {trip.description && (
          <p className="mt-2.5 text-sm line-clamp-2" style={{ color: 'rgba(255,255,255,0.38)' }}>
            {trip.description}
          </p>
        )}
      </div>

      <Link
        href={`/trips/${trip.id}`}
        className="absolute inset-0 rounded-2xl z-10"
        aria-label={trip.title}
      />
    </div>
  )
}
