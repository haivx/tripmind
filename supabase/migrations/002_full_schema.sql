-- ============================================================
-- TripMind — Full Schema (run after 001_create_trips.sql)
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- PLACES
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('accommodation', 'restaurant', 'attraction', 'transport', 'other')),
  address TEXT,
  notes TEXT,
  price NUMERIC(12, 2),
  currency TEXT DEFAULT 'JPY',
  booked BOOLEAN NOT NULL DEFAULT false,
  booking_ref TEXT,
  visit_date DATE,
  visit_time TEXT,
  duration_minutes INTEGER,
  source_email TEXT,        -- raw email content if parsed from email
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own places"
  ON public.places FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own places"
  ON public.places FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own places"
  ON public.places FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own places"
  ON public.places FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER places_updated_at
  BEFORE UPDATE ON public.places
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ────────────────────────────────────────────────────────────
-- ITINERARY DAYS
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.itinerary_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT,          -- optional day title, e.g. "Day 1 — Shinjuku"
  notes TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(trip_id, date)
);

ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own itinerary days"
  ON public.itinerary_days FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own itinerary days"
  ON public.itinerary_days FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own itinerary days"
  ON public.itinerary_days FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own itinerary days"
  ON public.itinerary_days FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER itinerary_days_updated_at
  BEFORE UPDATE ON public.itinerary_days
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Link places to itinerary days (many-to-many, ordered)
CREATE TABLE public.itinerary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id UUID NOT NULL REFERENCES public.itinerary_days(id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own itinerary items"
  ON public.itinerary_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own itinerary items"
  ON public.itinerary_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own itinerary items"
  ON public.itinerary_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own itinerary items"
  ON public.itinerary_items FOR DELETE
  USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- CHAT MESSAGES
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat messages"
  ON public.chat_messages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat messages"
  ON public.chat_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat messages"
  ON public.chat_messages FOR DELETE
  USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- ALERTS
-- ────────────────────────────────────────────────────────────
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('unbooked_hotel', 'missing_date', 'missing_transport', 'budget_exceeded', 'custom')),
  message TEXT NOT NULL,
  dismissed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON public.alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own alerts"
  ON public.alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON public.alerts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
  ON public.alerts FOR DELETE
  USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- INDEXES (performance)
-- ────────────────────────────────────────────────────────────
CREATE INDEX places_trip_id_idx ON public.places(trip_id);
CREATE INDEX places_category_idx ON public.places(category);
CREATE INDEX places_visit_date_idx ON public.places(visit_date);
CREATE INDEX itinerary_days_trip_id_idx ON public.itinerary_days(trip_id);
CREATE INDEX itinerary_days_date_idx ON public.itinerary_days(date);
CREATE INDEX itinerary_items_day_id_idx ON public.itinerary_items(day_id);
CREATE INDEX chat_messages_trip_id_idx ON public.chat_messages(trip_id);
CREATE INDEX chat_messages_created_at_idx ON public.chat_messages(created_at);
CREATE INDEX alerts_trip_id_idx ON public.alerts(trip_id);
CREATE INDEX alerts_dismissed_idx ON public.alerts(dismissed);
