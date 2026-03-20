'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { Place } from '@/types'

const CATEGORY_EMOJI: Record<string, string> = {
  accommodation: '🏨',
  restaurant: '🍜',
  attraction: '🗼',
  transport: '🚄',
  other: '📍',
}

function createMarkerIcon(category: string) {
  const emoji = CATEGORY_EMOJI[category] ?? '📍'
  return L.divIcon({
    html: `<div style="font-size:1.4rem;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,.35))">${emoji}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  })
}

interface TripMapProps {
  places: Place[]
}

export function TripMap({ places }: TripMapProps) {
  const mapped = places.filter((p) => p.latitude != null && p.longitude != null)

  if (mapped.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center h-64 rounded-2xl gap-2 text-center"
        style={{
          background: '#13162a',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <span className="text-3xl">🗺️</span>
        <p className="text-sm text-white font-medium">No location data yet.</p>
        <p className="text-xs max-w-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Places with GPS coordinates will appear here. Add latitude/longitude to your places to see
          them on the map.
        </p>
      </div>
    )
  }

  const lats = mapped.map((p) => p.latitude!)
  const lngs = mapped.map((p) => p.longitude!)
  const center: [number, number] = [
    (Math.min(...lats) + Math.max(...lats)) / 2,
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
  ]

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '480px', borderRadius: '1rem' }}
      className="shadow-sm"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mapped.map((place) => (
        <Marker
          key={place.id}
          position={[place.latitude!, place.longitude!]}
          icon={createMarkerIcon(place.category)}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{place.name}</p>
              {place.address && <p className="text-xs text-gray-500 mt-0.5">{place.address}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
