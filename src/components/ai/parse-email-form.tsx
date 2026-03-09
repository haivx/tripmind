'use client'

import { useState } from 'react'
import { Loader2, Mail, Check, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Place, PlaceCategory } from '@/types'

interface ExtractedPlace {
  name: string
  category: PlaceCategory
  address: string | null
  visit_date: string | null
  visit_time: string | null
  booking_ref: string | null
  price: number | null
  currency: string
  notes: string | null
}

interface Props {
  tripId: string
  onPlaceAdded?: (place: Place) => void
}

const CATEGORY_COLOR: Record<string, string> = {
  accommodation: 'bg-blue-100 text-blue-700',
  restaurant: 'bg-orange-100 text-orange-700',
  attraction: 'bg-purple-100 text-purple-700',
  transport: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-700',
}

export function ParseEmailForm({ tripId, onPlaceAdded }: Props) {
  const [emailContent, setEmailContent] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [extracted, setExtracted] = useState<ExtractedPlace | null>(null)

  async function handleParse() {
    if (!emailContent.trim() || isParsing) return
    setIsParsing(true)
    setExtracted(null)

    try {
      const res = await fetch('/api/ai/parse-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailContent }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to parse email')
        return
      }
      setExtracted(json.data as ExtractedPlace)
    } catch {
      toast.error('Network error')
    } finally {
      setIsParsing(false)
    }
  }

  async function handleSave() {
    if (!extracted) return
    setIsSaving(true)

    try {
      const res = await fetch(`/api/trips/${tripId}/places`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: tripId,
          name: extracted.name,
          category: extracted.category,
          address: extracted.address,
          visit_date: extracted.visit_date,
          visit_time: extracted.visit_time,
          booking_ref: extracted.booking_ref,
          price: extracted.price,
          currency: extracted.currency ?? 'JPY',
          notes: extracted.notes,
          booked: !!(extracted.booking_ref),
          source_email: emailContent.slice(0, 500),
        }),
      })

      const json = await res.json() as { data?: Place; error?: string }
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to save')
        return
      }

      toast.success(`${extracted.name} added to places`)
      setEmailContent('')
      setExtracted(null)
      if (json.data) onPlaceAdded?.(json.data)
    } catch {
      toast.error('Network error')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          placeholder="Paste a booking confirmation email here..."
          className="min-h-[160px] text-sm font-mono"
        />
        <Button
          onClick={handleParse}
          disabled={!emailContent.trim() || isParsing}
          size="sm"
          className="w-full"
        >
          {isParsing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Parsing...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Extract booking info
            </>
          )}
        </Button>
      </div>

      {extracted && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              Extracted booking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base">{extracted.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                  CATEGORY_COLOR[extracted.category] ?? CATEGORY_COLOR.other
                }`}
              >
                {extracted.category}
              </span>
            </div>

            {extracted.address && (
              <p className="text-muted-foreground text-xs">{extracted.address}</p>
            )}

            <div className="flex flex-wrap gap-2">
              {extracted.visit_date && (
                <Badge variant="outline" className="text-xs">
                  {extracted.visit_date}
                  {extracted.visit_time ? ` ${extracted.visit_time}` : ''}
                </Badge>
              )}
              {extracted.booking_ref && (
                <Badge variant="outline" className="text-xs font-mono">
                  Ref: {extracted.booking_ref}
                </Badge>
              )}
              {extracted.price != null && (
                <Badge variant="outline" className="text-xs">
                  {extracted.price.toLocaleString()} {extracted.currency}
                </Badge>
              )}
            </div>

            {extracted.notes && (
              <p className="text-muted-foreground text-xs">{extracted.notes}</p>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Add to places
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setExtracted(null)}
                disabled={isSaving}
              >
                Discard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
