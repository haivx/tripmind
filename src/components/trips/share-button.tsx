'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import { toast } from 'sonner'

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
    <button
      onClick={handleShare}
      disabled={loading}
      className="no-print flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all duration-200 disabled:opacity-50"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.65)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
        e.currentTarget.style.color = 'white'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
      }}
    >
      <Share2 className="h-3.5 w-3.5" />
      Share
    </button>
  )
}
