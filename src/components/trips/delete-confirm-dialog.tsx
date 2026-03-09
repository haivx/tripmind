'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Trip } from '@/types'

interface DeleteConfirmDialogProps {
  trip: Trip | null
  onConfirm: () => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export function DeleteConfirmDialog({ trip, onConfirm, onCancel, isLoading }: DeleteConfirmDialogProps) {
  return (
    <Dialog open={!!trip} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Trip</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{trip?.title}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
