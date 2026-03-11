import { ImageResponse } from 'next/og'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface OgImageProps {
  params: Promise<{ token: string }>
}

export default async function OgImage({ params }: OgImageProps) {
  const { token } = await params
  const supabase = createAdminClient()
  const { data: trip } = await supabase
    .from('trips')
    .select('title, destination, start_date, end_date')
    .eq('share_token', token)
    .single()

  const title = trip?.title ?? 'My Trip'
  const destination = trip?.destination ?? ''
  const dates =
    trip?.start_date && trip?.end_date
      ? `${trip.start_date} → ${trip.end_date}`
      : ''
  const duration =
    trip?.start_date && trip?.end_date
      ? Math.round(
          (new Date(trip.end_date).getTime() -
            new Date(trip.start_date).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : null

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: '#F7F7F7',
          fontFamily: 'sans-serif',
          padding: '60px',
          justifyContent: 'space-between',
        }}
      >
        {/* Top: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: '#FF385C',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            ✈️
          </div>
          <span
            style={{ fontSize: '28px', fontWeight: 700, color: '#1A1A2E' }}
          >
            TripMind
          </span>
        </div>

        {/* Center: Trip info card */}
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '48px 56px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          <div
            style={{
              fontSize: '56px',
              fontWeight: 800,
              color: '#1A1A2E',
              lineHeight: 1.1,
              letterSpacing: '-1px',
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            {destination && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '28px',
                  color: '#717171',
                }}
              >
                <span>📍</span>
                <span>{destination}</span>
              </div>
            )}
            {dates && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '28px',
                  color: '#717171',
                }}
              >
                <span>🗓</span>
                <span>{dates}</span>
              </div>
            )}
            {duration && (
              <div
                style={{
                  background: '#FF385C',
                  color: 'white',
                  borderRadius: '999px',
                  padding: '6px 20px',
                  fontSize: '22px',
                  fontWeight: 600,
                }}
              >
                {duration} days
              </div>
            )}
          </div>
        </div>

        {/* Bottom: tagline */}
        <div style={{ fontSize: '20px', color: '#717171' }}>
          Shared via{' '}
          <span style={{ color: '#FF385C', fontWeight: 600 }}>TripMind</span>
          {' '}· AI Travel Planner
        </div>
      </div>
    ),
    { ...size }
  )
}
