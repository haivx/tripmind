'use client'

import { useState } from 'react'
import { AlertTriangle, X, RefreshCw, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
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

    if (!alertId.startsWith('tmp-')) {
      fetch(`/api/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dismissed: true }),
      }).catch(console.error)
    }
  }

  const refreshBtn = (
    <div className="flex justify-end">
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors duration-200 disabled:opacity-50"
        style={{ color: 'rgba(255,255,255,0.4)', background: 'transparent' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
      >
        {isGenerating ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <RefreshCw className="h-3.5 w-3.5" />
        )}
        {alerts.length === 0 ? 'Check alerts' : 'Refresh alerts'}
      </button>
    </div>
  )

  if (alerts.length === 0) return refreshBtn

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-start gap-3 rounded-xl px-3 py-2.5"
          style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
          <p className="flex-1 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{alert.message}</p>
          <button
            onClick={() => handleDismiss(alert.id)}
            className="shrink-0 cursor-pointer transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      {refreshBtn}
    </div>
  )
}
