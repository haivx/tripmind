'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Place, PlaceCategory } from '@/types'

const CATEGORIES: { value: PlaceCategory; label: string }[] = [
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'restaurant', label: 'Restaurant / Food' },
  { value: 'attraction', label: 'Attraction' },
  { value: 'transport', label: 'Transport' },
  { value: 'other', label: 'Other' },
]

const placeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  category: z.enum(['accommodation', 'restaurant', 'attraction', 'transport', 'other']),
  address: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  price: z.string().optional(),
  currency: z.string().min(1).max(5),
  booked: z.boolean(),
  booking_ref: z.string().max(100).optional(),
  visit_date: z.string().optional(),
})

type PlaceFormValues = z.infer<typeof placeSchema>

export type PlacePayload = Omit<PlaceFormValues, 'price'> & { price: number | null }

interface PlaceFormProps {
  defaultValues?: Partial<Place>
  onSubmit: (values: PlacePayload) => Promise<void>
  onCancel: () => void
  loading: boolean
}

export function PlaceForm({ defaultValues, onSubmit, onCancel, loading }: PlaceFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PlaceFormValues>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      category: defaultValues?.category ?? 'attraction',
      address: defaultValues?.address ?? '',
      notes: defaultValues?.notes ?? '',
      price: defaultValues?.price != null ? String(defaultValues.price) : '',
      currency: defaultValues?.currency ?? 'JPY',
      booked: defaultValues?.booked ?? false,
      booking_ref: defaultValues?.booking_ref ?? '',
      visit_date: defaultValues?.visit_date ?? '',
    },
  })

  const booked = watch('booked')

  async function handleFormSubmit({ price: priceStr, ...rest }: PlaceFormValues) {
    const rawPrice = parseFloat(priceStr ?? '')
    const price = priceStr && !isNaN(rawPrice) ? rawPrice : null
    await onSubmit({ ...rest, price })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-1">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" placeholder="e.g. Park Hyatt Tokyo" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* Category */}
      <div className="space-y-1">
        <Label>Category *</Label>
        <Select
          defaultValue={defaultValues?.category ?? 'attraction'}
          onValueChange={(v) => setValue('category', v as PlaceCategory)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Visit date */}
      <div className="space-y-1">
        <Label htmlFor="visit_date">Visit date</Label>
        <Input id="visit_date" type="date" {...register('visit_date')} />
      </div>

      {/* Price + currency */}
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 space-y-1">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" min="0" step="1" placeholder="0" {...register('price')} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" maxLength={3} placeholder="JPY" {...register('currency')} />
        </div>
      </div>

      {/* Booked */}
      <div className="flex items-center gap-2">
        <input
          id="booked"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          {...register('booked')}
        />
        <Label htmlFor="booked">Already booked</Label>
      </div>

      {/* Booking ref — only when booked */}
      {booked && (
        <div className="space-y-1">
          <Label htmlFor="booking_ref">Booking reference</Label>
          <Input id="booking_ref" placeholder="e.g. ABC123" {...register('booking_ref')} />
        </div>
      )}

      {/* Address */}
      <div className="space-y-1">
        <Label htmlFor="address">Address</Label>
        <Input id="address" placeholder="Street address or area" {...register('address')} />
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" rows={3} placeholder="Any details…" {...register('notes')} />
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end pt-1">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
