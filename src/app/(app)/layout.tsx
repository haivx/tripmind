"use client";

import { LayoutDashboard, Plane, Sparkles, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trips', label: 'Trips', icon: Plane },
]

const SIDEBAR: React.CSSProperties = {
  background: '#13162a',
  borderRight: '1px solid rgba(255,255,255,0.07)',
}

const MOBILE_BAR: React.CSSProperties = {
  background: '#13162a',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
}

const MOBILE_NAV: React.CSSProperties = {
  background: '#13162a',
  borderTop: '1px solid rgba(255,255,255,0.07)',
}

function SidebarLogout() {
  const router = useRouter()
  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }
  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-colors duration-200"
      style={{ color: 'rgba(255,255,255,0.35)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
        e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = 'rgba(255,255,255,0.35)'
      }}
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen" style={{ background: '#0d0f1a', fontFamily: 'var(--font-jakarta), sans-serif' }}>
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex flex-col w-60 shrink-0" style={SIDEBAR}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-16">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#E11D48', boxShadow: '0 0 16px rgba(225,29,72,0.4)' }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span
            className="font-bold text-white text-lg"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            TripMind
          </span>
        </div>

        <div className="mx-4 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1 mt-2">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer"
                style={{
                  background: active ? 'rgba(225,29,72,0.12)' : 'transparent',
                  color: active ? '#FB7185' : 'rgba(255,255,255,0.5)',
                  borderLeft: active ? '2px solid #E11D48' : '2px solid transparent',
                }}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 pb-5">
          <SidebarLogout />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <header className="flex md:hidden items-center justify-between px-4 h-14 shrink-0" style={MOBILE_BAR}>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: '#E11D48' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span
              className="font-bold text-white"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              TripMind
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">{children}</main>
      </div>

      {/* Bottom nav — mobile only */}
      <nav className="fixed bottom-0 inset-x-0 flex md:hidden z-10" style={MOBILE_NAV}>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors duration-200 cursor-pointer"
              style={{ color: active ? '#E11D48' : 'rgba(255,255,255,0.4)' }}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
