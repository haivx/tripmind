'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface ShareButtonProps {
  tripId: string
}

export function ShareButton({ tripId }: ShareButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleShare() {
    setLoading(true)
    try {
      const res = await fetch(`/api/trips/${tripId}/share`, { method: 'POST' })
      const { data: token, error } = await res.json()
      if (error || !token) throw new Error(error ?? 'Failed to get share link')

      const url = `${window.location.origin}/share/${token}`
      await navigator.clipboard.writeText(url)
      toast.success('Share link copied to clipboard')
    } catch {
      toast.error('Failed to copy share link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full no-print"
      onClick={handleShare}
      disabled={loading}
    >
      <Share2 className="h-4 w-4 mr-1.5" />
      Share
    </Button>
  )
}
