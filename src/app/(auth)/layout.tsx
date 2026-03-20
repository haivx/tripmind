import type { Metadata } from 'next'
import { Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign in — TripMind',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: '#0d0f1a', fontFamily: 'var(--font-jakarta), sans-serif' }}
    >
      {/* Radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(225,29,72,0.09) 0%, transparent 60%)' }}
      />

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8 relative">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: '#E11D48', boxShadow: '0 0 20px rgba(225,29,72,0.4)' }}
        >
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span
          className="text-2xl font-bold text-white"
          style={{ fontFamily: 'var(--font-sora), sans-serif' }}
        >
          TripMind
        </span>
      </div>

      <div className="relative w-full max-w-sm">
        {children}
      </div>
    </div>
  )
}
