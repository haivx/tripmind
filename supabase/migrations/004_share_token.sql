-- Add share_token to trips for read-only public sharing
ALTER TABLE trips ADD COLUMN IF NOT EXISTS share_token UUID DEFAULT gen_random_uuid();

-- Backfill any existing rows that might have NULL share_token
UPDATE trips SET share_token = gen_random_uuid() WHERE share_token IS NULL;

-- Index for fast token lookup
CREATE INDEX IF NOT EXISTS trips_share_token_idx ON trips(share_token);
