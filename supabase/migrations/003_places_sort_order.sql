-- Add sort_order to places for drag-and-drop itinerary ordering
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- Initialize sort_order based on visit_time within each (trip_id, visit_date) group
UPDATE public.places p
SET sort_order = sub.row_num
FROM (
  SELECT id,
    ROW_NUMBER() OVER (
      PARTITION BY trip_id, visit_date
      ORDER BY visit_time NULLS LAST, created_at
    ) - 1 AS row_num
  FROM public.places
) sub
WHERE p.id = sub.id;

CREATE INDEX IF NOT EXISTS places_sort_order_idx ON public.places(trip_id, visit_date, sort_order);
