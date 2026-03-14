'use client'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Calendar, MapPin } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { SortablePlaceItem } from './sortable-place-item'
import { SuggestItineraryButton } from '@/components/ai/suggest-itinerary-button'
import { ExportPdfButton } from '@/components/trips/export-pdf-button'
import type { Place } from '@/types'

interface ItineraryTimelineProps {
  initialPlaces: Place[]
  tripId: string
}

function groupByDate(places: Place[]): Map<string, Place[]> {
  const map = new Map<string, Place[]>()
  const undated: Place[] = []
  for (const p of places) {
    if (!p.visit_date) {
      undated.push(p)
    } else {
      const existing = map.get(p.visit_date) ?? []
      map.set(p.visit_date, [...existing, p])
    }
  }
  const sorted = new Map([...map.entries()].sort())
  if (undated.length > 0) sorted.set('undated', undated)
  return sorted
}

function formatDate(dateStr: string): string {
  if (dateStr === 'undated') return 'No date set'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

export function ItineraryTimeline({ initialPlaces, tripId }: ItineraryTimelineProps) {
  const [places, setPlaces] = useState<Place[]>(
    [...initialPlaces].sort((a, b) => a.sort_order - b.sort_order)
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  const handleDragEnd = useCallback(
    async (event: DragEndEvent, date: string) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      setPlaces(prev => {
        const dayPlaces = prev.filter(p => (p.visit_date ?? 'undated') === date)
        const otherPlaces = prev.filter(p => (p.visit_date ?? 'undated') !== date)

        const oldIdx = dayPlaces.findIndex(p => p.id === active.id)
        const newIdx = dayPlaces.findIndex(p => p.id === over.id)
        const reordered = arrayMove(dayPlaces, oldIdx, newIdx).map((p, i) => ({
          ...p,
          sort_order: i,
        }))

        // Persist in background
        const items = reordered.map(p => ({ id: p.id, sort_order: p.sort_order }))
        fetch(`/api/trips/${tripId}/places/reorder`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        }).catch(() => toast.error('Failed to save order'))

        return [...otherPlaces, ...reordered]
      })
    },
    [tripId]
  )

  if (places.length === 0) {
    return (
      <div className="text-center py-16 text-[#717171] dark:text-muted-foreground text-sm">
        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
        <p>No places yet. Add places and set visit dates to build your itinerary.</p>
      </div>
    )
  }

  const grouped = groupByDate(places)
  const dayEntries = [...grouped.entries()]

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2 no-print">
        <ExportPdfButton />
        <SuggestItineraryButton tripId={tripId} />
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3B82F6] via-[#3B82F6] to-gray-200 dark:to-gray-700 rounded-full" />

        <div className="space-y-8">
          {dayEntries.map(([date, dayPlaces], dayIndex) => {
            const sorted = [...dayPlaces].sort((a, b) => a.sort_order - b.sort_order)
            const ids = sorted.map(p => p.id)

            return (
              <div key={date} className="relative pl-14">
                {/* Day badge */}
                <div className="absolute left-0 top-0 w-10 h-10 bg-[#3B82F6] rounded-xl flex items-center justify-center shadow-sm">
                  {date === 'undated' ? (
                    <Calendar className="h-4 w-4 text-white" />
                  ) : (
                    <span className="text-white text-xs font-bold">{dayIndex + 1}</span>
                  )}
                </div>

                {/* Day card */}
                <div className="bg-white dark:bg-card rounded-2xl p-4 shadow-sm dark:border dark:border-border">
                  <div className="mb-3 pb-3 border-b border-gray-100 dark:border-border">
                    <h2 className="text-[#1A1A2E] dark:text-foreground font-bold">{formatDate(date)}</h2>
                    <p className="text-xs text-[#717171] dark:text-muted-foreground mt-0.5">
                      {sorted.length} place{sorted.length !== 1 ? 's' : ''} · drag to reorder
                    </p>
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={e => handleDragEnd(e, date)}
                  >
                    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                      <div className="space-y-1">
                        {sorted.map(place => (
                          <SortablePlaceItem key={place.id} place={place} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
