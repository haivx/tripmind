'use client'

import { useEffect } from 'react'
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
import type { Trip, TripInsert } from '@/types'

const tripFormSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(100),
    destination: z.string().min(1, 'Destination is required').max(200),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    description: z.string().max(1000).optional(),
    status: z.enum(['planning', 'active', 'completed', 'cancelled']),
  })
  .refine((d) => d.end_date >= d.start_date, {
    message: 'End date must be after start date',
    path: ['end_date'],
  })

type TripFormValues = z.infer<typeof tripFormSchema>

interface TripFormProps {
  defaultValues?: Partial<Trip>
  onSubmit: (values: TripInsert) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export function TripForm({ defaultValues, onSubmit, onCancel, isLoading }: TripFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      destination: defaultValues?.destination ?? '',
      start_date: defaultValues?.start_date ?? '',
      end_date: defaultValues?.end_date ?? '',
      description: defaultValues?.description ?? '',
      status: defaultValues?.status ?? 'planning',
    },
  })

  useEffect(() => {
    if (defaultValues) {
      reset({
        title: defaultValues.title ?? '',
        destination: defaultValues.destination ?? '',
        start_date: defaultValues.start_date ?? '',
        end_date: defaultValues.end_date ?? '',
        description: defaultValues.description ?? '',
        status: defaultValues.status ?? 'planning',
      })
    }
  }, [defaultValues, reset])

  const statusValue = watch('status')

  async function handleFormSubmit(values: TripFormValues) {
    await onSubmit({
      title: values.title,
      destination: values.destination,
      start_date: values.start_date,
      end_date: values.end_date,
      description: values.description || null,
      status: values.status,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Trip Name *</Label>
        <Input id="title" placeholder="e.g. Tokyo Spring 2026" {...register('title')} />
        {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="destination">Destination *</Label>
        <Input id="destination" placeholder="e.g. Tokyo, Japan" {...register('destination')} />
        {errors.destination && <p className="text-destructive text-xs">{errors.destination.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="start_date">Start Date *</Label>
          <Input id="start_date" type="date" {...register('start_date')} />
          {errors.start_date && <p className="text-destructive text-xs">{errors.start_date.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end_date">End Date *</Label>
          <Input id="end_date" type="date" {...register('end_date')} />
          {errors.end_date && <p className="text-destructive text-xs">{errors.end_date.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="status">Status</Label>
        <Select
          value={statusValue}
          onValueChange={(val) => setValue('status', val as TripFormValues['status'])}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Notes about this trip..."
          rows={3}
          {...register('description')}
        />
        {errors.description && <p className="text-destructive text-xs">{errors.description.message}</p>}
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : defaultValues?.id ? 'Save Changes' : 'Create Trip'}
        </Button>
      </div>
    </form>
  )
}
