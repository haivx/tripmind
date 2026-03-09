'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { MoreHorizontal, MapPin, Calendar, DollarSign, CheckCircle2, Circle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PlaceForm, type PlacePayload } from './place-form'
import type { Place } from '@/types'

const CATEGORY_COLOR: Record<string, string> = {
  accommodation: 'bg-blue-100 text-blue-800',
  restaurant: 'bg-orange-100 text-orange-800',
  attraction: 'bg-green-100 text-green-800',
  transport: 'bg-purple-100 text-purple-800',
  other: 'bg-gray-100 text-gray-800',
}

const CATEGORY_LABEL: Record<string, string> = {
  accommodation: 'Stay',
  restaurant: 'Food',
  attraction: 'See',
  transport: 'Travel',
  other: 'Other',
}

interface PlaceCardProps {
  place: Place
  onUpdated: (place: Place) => void
  onDeleted: (id: string) => void
}

export function PlaceCard({ place, onUpdated, onDeleted }: PlaceCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function toggleBooked() {
    const res = await fetch(`/api/places/${place.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booked: !place.booked }),
    })
    const json = await res.json() as { data?: Place; error?: string }
    if (json.error) { toast.error(json.error); return }
    onUpdated(json.data!)
  }

  async function handleEdit(values: PlacePayload) {
    setLoading(true)
    const res = await fetch(`/api/places/${place.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    const json = await res.json() as { data?: Place; error?: string }
    setLoading(false)
    if (json.error) { toast.error(json.error); return }
    toast.success('Place updated')
    onUpdated(json.data!)
    setEditOpen(false)
  }

  async function handleDelete() {
    const res = await fetch(`/api/places/${place.id}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('Failed to delete'); return }
    toast.success('Place deleted')
    onDeleted(place.id)
  }

  return (
    <>
      <Card className="relative">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={`inline-flex text-xs px-1.5 py-0.5 rounded font-medium ${CATEGORY_COLOR[place.category]}`}
                >
                  {CATEGORY_LABEL[place.category]}
                </span>
                {place.booked ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-700">
                    <CheckCircle2 className="h-3 w-3" /> Booked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Circle className="h-3 w-3" /> Not booked
                  </span>
                )}
              </div>

              <p className="font-medium text-sm truncate">{place.name}</p>

              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                {place.visit_date && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {place.visit_date}
                  </span>
                )}
                {place.address && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground truncate max-w-[160px]">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {place.address}
                  </span>
                )}
                {place.price != null && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <DollarSign className="h-3 w-3" />
                    {place.price.toLocaleString()} {place.currency}
                  </span>
                )}
              </div>

              {place.notes && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{place.notes}</p>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleBooked}>
                  {place.booked ? 'Mark as not booked' : 'Mark as booked'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleDelete}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit place</DialogTitle>
          </DialogHeader>
          <PlaceForm
            defaultValues={place}
            onSubmit={handleEdit}
            onCancel={() => setEditOpen(false)}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
