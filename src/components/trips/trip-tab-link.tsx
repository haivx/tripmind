'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TripTabLinkProps {
  href: string
  label: string
}

export function TripTabLink({ href, label }: TripTabLinkProps) {
  const pathname = usePathname()

  // Overview: exact match (e.g. /trips/uuid)
  // Sub-tabs: prefix match (e.g. /trips/uuid/places)
  const segments = href.split('/trips/')[1]?.split('/') ?? []
  const isOverview = segments.length === 1
  const isActive = isOverview ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        'px-3 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors',
        isActive
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      )}
    >
      {label}
    </Link>
  )
}
