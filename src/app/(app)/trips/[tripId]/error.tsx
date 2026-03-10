'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function TripError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
      <p className="text-4xl">✈️</p>
      <h2 className="text-lg font-semibold text-[#1A1A2E]">Could not load trip</h2>
      <p className="text-sm text-[#717171] max-w-sm">{error.message || 'An unexpected error occurred.'}</p>
      <div className="flex gap-2">
        <Button onClick={reset} variant="outline" className="rounded-full">
          Try again
        </Button>
        <Button asChild className="rounded-full">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
