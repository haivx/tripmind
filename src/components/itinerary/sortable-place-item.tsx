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

const CATEGORY_COLOR: Record<string, { bg: string; color: string }> = {
  accommodation: { bg: 'rgba(59,130,246,0.15)', color: '#93c5fd' },
  restaurant:    { bg: 'rgba(249,115,22,0.15)', color: '#fdba74' },
  attraction:    { bg: 'rgba(168,85,247,0.15)', color: '#d8b4fe' },
  transport:     { bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)' },
  other:         { bg: 'rgba(34,197,94,0.12)',  color: '#86efac' },
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

  const catColor = CATEGORY_COLOR[place.category] ?? CATEGORY_COLOR.other

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 p-2.5 rounded-xl transition-colors group"
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="mt-0.5 shrink-0 cursor-grab active:cursor-grabbing touch-none opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: 'rgba(255,255,255,0.3)' }}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span className="text-base mt-0.5 w-5 shrink-0">
        {CATEGORY_EMOJI[place.category] ?? '📍'}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-white">{place.name}</p>
          {place.booked && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(34,197,94,0.15)', color: '#86efac' }}
            >
              booked
            </span>
          )}
        </div>
        <div className="flex gap-3 mt-0.5 flex-wrap">
          {place.visit_time && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <Clock className="h-3 w-3" style={{ color: '#E11D48' }} />
              {place.visit_time}
            </span>
          )}
          {place.address && (
            <span className="flex items-center gap-1 text-xs truncate max-w-[200px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
              <MapPin className="h-3 w-3 shrink-0" style={{ color: '#E11D48' }} />
              {place.address}
            </span>
          )}
          {place.duration_minutes && (
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {place.duration_minutes} min
            </span>
          )}
        </div>
        {place.notes && (
          <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {place.notes}
          </p>
        )}
      </div>

      <span
        className="px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
        style={{ background: catColor.bg, color: catColor.color }}
      >
        {CATEGORY_LABEL[place.category] ?? place.category}
      </span>
    </div>
  )
}
