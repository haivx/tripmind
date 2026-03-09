'use client'

import { useState } from 'react'
import { AlertTriangle, X, RefreshCw, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { Alert } from '@/types'

interface Props {
  tripId: string
  initialAlerts: Alert[]
}

export function AlertsBanner({ tripId, initialAlerts }: Props) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts.filter((a) => !a.dismissed))
  const [isGenerating, setIsGenerating] = useState(false)

  async function handleGenerate() {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/alerts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId }),
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to check alerts')
        return
      }
      // Refetch from DB by simulating the new list — we need actual IDs for dismiss
      // Instead, re-fetch alerts from Supabase via a GET endpoint is cleaner,
      // but for simplicity use the returned data and mark them as non-dismissed with fake IDs
      const newAlerts = json.data as Array<{ type: string; message: string }>
      setAlerts(
        newAlerts.map((a, i) => ({
          id: `tmp-${i}`,
          trip_id: tripId,
          user_id: '',
          type: a.type as Alert['type'],
          message: a.message,
          dismissed: false,
          created_at: new Date().toISOString(),
        }))
      )
      if (newAlerts.length === 0) toast.success('No issues found!')
    } catch {
      toast.error('Network error')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleDismiss(alertId: string) {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId))

    // Only dismiss real DB alerts (not tmp ones from generate response)
    if (!alertId.startsWith('tmp-')) {
      fetch(`/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dismissed: true }),
      }).catch(console.error)
    }
  }

  if (alerts.length === 0) {
    return (
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="text-muted-foreground text-xs"
        >
          {isGenerating ? (
            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
          )}
          Check alerts
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 px-3 py-2.5"
        >
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="flex-1 text-sm text-amber-800 dark:text-amber-200">{alert.message}</p>
          <button
            onClick={() => handleDismiss(alert.id)}
            className="text-amber-500 hover:text-amber-700 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="text-muted-foreground text-xs"
        >
          {isGenerating ? (
            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
          )}
          Refresh alerts
        </Button>
      </div>
    </div>
  )
}
