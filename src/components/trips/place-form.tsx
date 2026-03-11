'use client'

import { useState } from 'react'
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
import { LocationPicker } from '@/components/trips/location-picker'
import type { Place, PlaceCategory } from '@/types'

const CATEGORIES: { value: PlaceCategory; label: string }[] = [
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'restaurant', label: 'Restaurant / Food' },
  { value: 'attraction', label: 'Attraction' },
  { value: 'transport', label: 'Transport' },
  { value: 'other', label: 'Other' },
]

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const placeSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(200, 'Max 200 characters'),
    category: z.enum(['accommodation', 'restaurant', 'attraction', 'transport', 'other']),
    address: z.string().max(500, 'Max 500 characters').optional(),
    notes: z.string().max(2000, 'Max 2000 characters').optional(),
    price: z
      .string()
      .optional()
      .refine((v) => !v || (!isNaN(parseFloat(v)) && parseFloat(v) >= 0), {
        message: 'Must be a positive number',
      }),
    currency: z
      .string()
      .min(1, 'Currency is required')
      .max(3, 'Max 3 characters')
      .regex(/^[A-Za-z]+$/, 'Letters only'),
    booked: z.boolean(),
    booking_ref: z.string().max(100, 'Max 100 characters').optional(),
    visit_date: z
      .string()
      .optional()
      .refine((v) => !v || DATE_RE.test(v), { message: 'Invalid date' }),
    checkout_date: z
      .string()
      .optional()
      .refine((v) => !v || DATE_RE.test(v), { message: 'Invalid date' }),
  })
  .superRefine((data, ctx) => {
    if (data.category === 'accommodation' && !data.checkout_date) {
      ctx.addIssue({
        code: 'custom',
        message: 'Check-out date is required for accommodation',
        path: ['checkout_date'],
      })
    }
    if (data.visit_date && data.checkout_date && data.checkout_date <= data.visit_date) {
      ctx.addIssue({
        code: 'custom',
        message: 'Check-out must be after check-in',
        path: ['checkout_date'],
      })
    }
  })

type PlaceFormValues = z.infer<typeof placeSchema>

export type PlacePayload = Omit<PlaceFormValues, 'price'> & {
  price: number | null
  latitude?: number | null
  longitude?: number | null
}

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
      checkout_date: defaultValues?.checkout_date ?? '',
    },
  })

  const booked = watch('booked')
  const category = watch('category')
  const isAccommodation = category === 'accommodation'

  const [pickedCoords, setPickedCoords] = useState<{ latitude: number; longitude: number } | null>(
    defaultValues?.latitude != null && defaultValues?.longitude != null
      ? { latitude: defaultValues.latitude, longitude: defaultValues.longitude }
      : null
  )

  async function handleFormSubmit({ price: priceStr, visit_date, checkout_date, ...rest }: PlaceFormValues) {
    const rawPrice = parseFloat(priceStr ?? '')
    const price = priceStr && !isNaN(rawPrice) ? rawPrice : null
    await onSubmit({
      ...rest,
      price,
      visit_date: visit_date || undefined,
      checkout_date: checkout_date || undefined,
      ...(pickedCoords ?? {}),
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Name */}
      <div className="space-y-1">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          placeholder="e.g. Park Hyatt Tokyo"
          {...register('name')}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* Category */}
      <div className="space-y-1">
        <Label>Category *</Label>
        <Select
          defaultValue={defaultValues?.category ?? 'attraction'}
          onValueChange={(v) => setValue('category', v as PlaceCategory, { shouldValidate: true })}
        >
          <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
      </div>

      {/* Check-in date (or Visit date) */}
      <div className="space-y-1">
        <Label htmlFor="visit_date">{isAccommodation ? 'Check-in date *' : 'Visit date'}</Label>
        <Input
          id="visit_date"
          type="date"
          {...register('visit_date')}
          className={errors.visit_date ? 'border-destructive' : ''}
        />
        {errors.visit_date && <p className="text-xs text-destructive">{errors.visit_date.message}</p>}
      </div>

      {/* Check-out date — accommodation only */}
      {isAccommodation && (
        <div className="space-y-1">
          <Label htmlFor="checkout_date">Check-out date *</Label>
          <Input
            id="checkout_date"
            type="date"
            {...register('checkout_date')}
            className={errors.checkout_date ? 'border-destructive' : ''}
          />
          {errors.checkout_date && (
            <p className="text-xs text-destructive">{errors.checkout_date.message}</p>
          )}
        </div>
      )}

      {/* Price + currency */}
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 space-y-1">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            {...register('price')}
            className={errors.price ? 'border-destructive' : ''}
          />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            maxLength={3}
            placeholder="JPY"
            {...register('currency')}
            className={errors.currency ? 'border-destructive' : ''}
          />
          {errors.currency && <p className="text-xs text-destructive">{errors.currency.message}</p>}
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
          <Input
            id="booking_ref"
            placeholder="e.g. ABC123"
            {...register('booking_ref')}
            className={errors.booking_ref ? 'border-destructive' : ''}
          />
          {errors.booking_ref && (
            <p className="text-xs text-destructive">{errors.booking_ref.message}</p>
          )}
        </div>
      )}

      {/* Address / Location */}
      <LocationPicker
        initialValue={defaultValues?.address ?? ''}
        onSelect={(selection) => {
          if (selection) {
            setValue('address', selection.display_name, { shouldValidate: true })
            setPickedCoords({ latitude: selection.latitude, longitude: selection.longitude })
          } else {
            setValue('address', '', { shouldValidate: false })
            setPickedCoords(null)
          }
        }}
        error={errors.address?.message}
      />

      {/* Notes */}
      <div className="space-y-1">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={3}
          placeholder="Any details…"
          {...register('notes')}
          className={errors.notes ? 'border-destructive' : ''}
        />
        {errors.notes && <p className="text-xs text-destructive">{errors.notes.message}</p>}
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
