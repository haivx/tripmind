import type { Metadata } from 'next'
import { Plane } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign in — TripMind',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Plane className="h-6 w-6 text-primary" />
        <span className="text-2xl font-bold tracking-tight">TripMind</span>
      </div>
      {children}
    </div>
  )
}
