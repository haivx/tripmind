// ─── Trips ────────────────────────────────────────────────────────────────────

export type TripStatus = 'planning' | 'active' | 'completed' | 'cancelled'

export interface Trip {
  id: string
  user_id: string
  title: string
  destination: string
  start_date: string // ISO date "YYYY-MM-DD"
  end_date: string
  description: string | null
  cover_image: string | null
  status: TripStatus
  share_token: string | null
  created_at: string
  updated_at: string
}

export interface TripInsert {
  title: string
  destination: string
  start_date: string
  end_date: string
  description?: string | null
  cover_image?: string | null
  status?: TripStatus
}

export interface TripUpdate {
  title?: string
  destination?: string
  start_date?: string
  end_date?: string
  description?: string | null
  cover_image?: string | null
  status?: TripStatus
}

// ─── Places ───────────────────────────────────────────────────────────────────

export type PlaceCategory = 'accommodation' | 'restaurant' | 'attraction' | 'transport' | 'other'

export interface Place {
  id: string
  trip_id: string
  user_id: string
  name: string
  category: PlaceCategory
  address: string | null
  notes: string | null
  price: number | null
  currency: string
  booked: boolean
  booking_ref: string | null
  visit_date: string | null
  checkout_date: string | null
  visit_time: string | null
  duration_minutes: number | null
  source_email: string | null
  latitude: number | null
  longitude: number | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PlaceInsert {
  trip_id: string
  name: string
  category: PlaceCategory
  address?: string | null
  notes?: string | null
  price?: number | null
  currency?: string
  booked?: boolean
  booking_ref?: string | null
  visit_date?: string | null
  checkout_date?: string | null
  visit_time?: string | null
  duration_minutes?: number | null
}

export interface PlaceUpdate {
  name?: string
  category?: PlaceCategory
  address?: string | null
  notes?: string | null
  price?: number | null
  currency?: string
  booked?: boolean
  booking_ref?: string | null
  visit_date?: string | null
  checkout_date?: string | null
  visit_time?: string | null
  duration_minutes?: number | null
}

// ─── Itinerary ────────────────────────────────────────────────────────────────

export interface ItineraryDay {
  id: string
  trip_id: string
  user_id: string
  date: string
  title: string | null
  notes: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ItineraryItem {
  id: string
  day_id: string
  place_id: string
  user_id: string
  sort_order: number
  created_at: string
  place?: Place
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  trip_id: string
  user_id: string
  role: ChatRole
  content: string
  created_at: string
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export type AlertType = 'unbooked_hotel' | 'missing_date' | 'missing_transport' | 'budget_exceeded' | 'custom'

export interface Alert {
  id: string
  trip_id: string
  user_id: string
  type: AlertType
  message: string
  dismissed: boolean
  created_at: string
}
