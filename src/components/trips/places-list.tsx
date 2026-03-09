'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PlaceCard } from './place-card'
import { PlaceForm, type PlacePayload } from './place-form'
import type { Place, PlaceCategory } from '@/types'

const FILTER_CATEGORIES: { value: PlaceCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'accommodation', label: 'Stays' },
  { value: 'restaurant', label: 'Food' },
  { value: 'attraction', label: 'Attractions' },
  { value: 'transport', label: 'Transport' },
  { value: 'other', label: 'Other' },
]

interface PlacesListProps {
  tripId: string
  initialPlaces: Place[]
}

export function PlacesList({ tripId, initialPlaces }: PlacesListProps) {
  const [places, setPlaces] = useState<Place[]>(initialPlaces)
  const [filter, setFilter] = useState<PlaceCategory | 'all'>('all')
  const [addOpen, setAddOpen] = useState(false)
  const [adding, setAdding] = useState(false)

  const visible = filter === 'all' ? places : places.filter((p) => p.category === filter)

  async function handleAdd(values: PlacePayload) {
    setAdding(true)
    const res = await fetch(`/api/trips/${tripId}/places`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    const json = await res.json() as { data?: Place; error?: string }
    setAdding(false)
    if (json.error) { toast.error(json.error); return }
    toast.success('Place added')
    setPlaces((prev) => [...prev, json.data!])
    setAddOpen(false)
  }

  function handleUpdated(updated: Place) {
    setPlaces((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  function handleDeleted(id: string) {
    setPlaces((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-semibold text-sm text-muted-foreground">
          {places.length} place{places.length !== 1 ? 's' : ''}
        </h2>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add place
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add place</DialogTitle>
            </DialogHeader>
            <PlaceForm
              onSubmit={handleAdd}
              onCancel={() => setAddOpen(false)}
              loading={adding}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTER_CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              filter === value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-30" />
          {places.length === 0 ? (
            <>
              <p>No places yet.</p>
              <Button size="sm" className="mt-3" onClick={() => setAddOpen(true)}>
                Add your first place
              </Button>
            </>
          ) : (
            <p>No places in this category.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-2">
          {visible.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onUpdated={handleUpdated}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  )
}
