'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AppError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <p className="text-4xl">⚠️</p>
      <h2 className="text-lg font-semibold text-[#1A1A2E]">Something went wrong</h2>
      <p className="text-sm text-[#717171] max-w-sm">{error.message || 'An unexpected error occurred.'}</p>
      <Button onClick={reset} variant="outline" className="rounded-full">
        Try again
      </Button>
    </div>
  )
}
