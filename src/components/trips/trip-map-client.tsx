'use client'

import dynamic from 'next/dynamic'
import type { Place } from '@/types'

const TripMap = dynamic(
  () => import('@/components/trips/trip-map').then((m) => m.TripMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-sm text-sm text-[#717171]">
        Loading map…
      </div>
    ),
  }
)

interface Props {
  places: Place[]
}

export function TripMapClient({ places }: Props) {
  return <TripMap places={places} />
}
