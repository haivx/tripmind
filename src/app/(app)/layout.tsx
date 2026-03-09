import { LayoutDashboard, Map, Plane } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { LogoutButton } from '@/components/ui/logout-button'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trips', label: 'Trips', icon: Plane },
  { href: '/explore', label: 'Explore', icon: Map },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex flex-col w-56 border-r bg-background shrink-0">
        <div className="flex items-center gap-2 px-4 h-14">
          <Plane className="h-5 w-5 text-primary" />
          <span className="font-semibold text-lg tracking-tight">TripMind</span>
        </div>
        <Separator />
        <nav className="flex flex-col gap-1 p-2 flex-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-2 pb-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </div>

      {/* Bottom nav — mobile only */}
      <nav className="fixed bottom-0 inset-x-0 border-t bg-background flex md:hidden z-10">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
