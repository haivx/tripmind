'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Clock, GripVertical, MapPin } from 'lucide-react'
import type { Place } from '@/types'

const CATEGORY_EMOJI: Record<string, string> = {
  accommodation: '🏨',
  restaurant: '🍜',
  attraction: '🗼',
  transport: '🚄',
  other: '📍',
}

const CATEGORY_LABEL: Record<string, string> = {
  accommodation: 'Stay',
  restaurant: 'Food',
  attraction: 'Sightseeing',
  transport: 'Transport',
  other: 'Other',
}

const CATEGORY_COLOR: Record<string, string> = {
  accommodation: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  restaurant: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  attraction: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  transport: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  other: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}

interface SortablePlaceItemProps {
  place: Place
}

export function SortablePlaceItem({ place }: SortablePlaceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: place.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F7F7F7] dark:hover:bg-white/5 transition-colors group"
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="mt-0.5 shrink-0 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 cursor-grab active:cursor-grabbing touch-none opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="text-base mt-0.5 w-5 shrink-0">
        {CATEGORY_EMOJI[place.category] ?? '📍'}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-[#1A1A2E] dark:text-foreground">{place.name}</p>
          {place.booked && (
            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full font-medium">
              booked
            </span>
          )}
        </div>
        <div className="flex gap-3 mt-0.5 flex-wrap">
          {place.visit_time && (
            <span className="flex items-center gap-1 text-xs text-[#717171] dark:text-muted-foreground">
              <Clock className="h-3 w-3 text-[#FF385C]" />
              {place.visit_time}
            </span>
          )}
          {place.address && (
            <span className="flex items-center gap-1 text-xs text-[#717171] dark:text-muted-foreground truncate max-w-[200px]">
              <MapPin className="h-3 w-3 shrink-0 text-[#FF385C]" />
              {place.address}
            </span>
          )}
          {place.duration_minutes && (
            <span className="text-xs text-[#717171] dark:text-muted-foreground">
              {place.duration_minutes} min
            </span>
          )}
        </div>
        {place.notes && (
          <p className="text-xs text-[#717171] dark:text-muted-foreground mt-0.5 line-clamp-1">{place.notes}</p>
        )}
      </div>

      <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${CATEGORY_COLOR[place.category] ?? 'bg-gray-100 text-gray-700'}`}>
        {CATEGORY_LABEL[place.category] ?? place.category}
      </span>
    </div>
  )
}
