'use client'

import { useState } from 'react'
import { Plus, Plane } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TripCard } from './trip-card'
import { TripForm } from './trip-form'
import { DeleteConfirmDialog } from './delete-confirm-dialog'
import type { Trip, TripInsert } from '@/types'

interface TripListProps {
  initialTrips: Trip[]
}

export function TripList({ initialTrips }: TripListProps) {
  const [trips, setTrips] = useState<Trip[]>(initialTrips)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  function openCreate() {
    setEditingTrip(null)
    setIsFormOpen(true)
  }

  function openEdit(trip: Trip) {
    setEditingTrip(trip)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingTrip(null)
  }

  async function handleSubmit(values: TripInsert): Promise<void> {
    setIsSubmitting(true)
    try {
      if (editingTrip) {
        const res = await fetch(`/api/trips/${editingTrip.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        const json = await res.json() as { data?: Trip; error?: string }
        if (!res.ok) throw new Error(json.error ?? 'Failed to update trip')
        setTrips((prev) => prev.map((t) => (t.id === editingTrip.id ? json.data! : t)))
        toast.success('Trip updated')
      } else {
        const res = await fetch('/api/trips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        const json = await res.json() as { data?: Trip; error?: string }
        if (!res.ok) throw new Error(json.error ?? 'Failed to create trip')
        setTrips((prev) => [...prev, json.data!])
        toast.success('Trip created')
      }
      closeForm()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(): Promise<void> {
    if (!deletingTrip) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/trips/${deletingTrip.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const json = await res.json() as { error?: string }
        throw new Error(json.error ?? 'Failed to delete trip')
      }
      setTrips((prev) => prev.filter((t) => t.id !== deletingTrip.id))
      toast.success('Trip deleted')
      setDeletingTrip(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">My Trips</h2>
        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4 mr-1.5" />
          New Trip
        </Button>
      </div>

      {trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-3">
          <Plane className="h-10 w-10 opacity-30" />
          <p className="text-sm">No trips yet. Plan your first adventure!</p>
          <Button variant="outline" size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1.5" />
            Create Trip
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onEdit={openEdit}
              onDelete={setDeletingTrip}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTrip ? 'Edit Trip' : 'New Trip'}</DialogTitle>
          </DialogHeader>
          <TripForm
            defaultValues={editingTrip ?? undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        trip={deletingTrip}
        onConfirm={handleDelete}
        onCancel={() => setDeletingTrip(null)}
        isLoading={isDeleting}
      />
    </div>
  )
}

export function TripListSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}
