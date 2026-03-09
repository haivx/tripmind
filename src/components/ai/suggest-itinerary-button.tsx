'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Sparkles, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

interface SuggestedDay {
  date: string
  title: string
  places: string[]
}

interface Props {
  tripId: string
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function SuggestItineraryButton({ tripId }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [suggestion, setSuggestion] = useState<SuggestedDay[] | null>(null)
  const [open, setOpen] = useState(false)

  async function handleSuggest() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/ai/suggest-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to generate itinerary')
        return
      }
      setSuggestion(json.data as SuggestedDay[])
      setOpen(true)
    } catch {
      toast.error('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleApply() {
    if (!suggestion) return
    setIsApplying(true)

    try {
      // Fetch current places to get IDs mapped to names
      const res = await fetch(`/api/trips/${tripId}/places`)
      const json = await res.json()
      if (!res.ok) {
        toast.error('Failed to fetch places')
        return
      }

      const places = json.data as Array<{ id: string; name: string }>

      // Build a map: normalized name → place id
      const nameToId = new Map(
        places.map((p) => [p.name.toLowerCase().trim(), p.id])
      )

      // Apply dates to matching places
      const updates: Array<Promise<void>> = []
      for (const day of suggestion) {
        for (const placeName of day.places) {
          const placeId = nameToId.get(placeName.toLowerCase().trim())
          if (!placeId) continue
          updates.push(
            fetch(`/api/places/${placeId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ visit_date: day.date }),
            }).then(() => {})
          )
        }
      }

      await Promise.all(updates)
      toast.success('Itinerary applied!')
      setOpen(false)
      setSuggestion(null)
      router.refresh()
    } catch {
      toast.error('Failed to apply itinerary')
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={handleSuggest}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            Thinking...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-1.5" />
            AI suggest
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Suggested Itinerary</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {suggestion?.map((day) => (
              <div key={day.date}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {formatDate(day.date)}
                  </Badge>
                  {day.title && (
                    <span className="text-sm font-medium">{day.title}</span>
                  )}
                </div>
                <ul className="space-y-1 pl-2 border-l-2 border-muted ml-1">
                  {day.places.map((name, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/40 shrink-0" />
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isApplying}>
              Discard
            </Button>
            <Button onClick={handleApply} disabled={isApplying}>
              {isApplying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Apply dates
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
