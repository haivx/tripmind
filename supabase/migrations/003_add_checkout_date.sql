-- Add checkout_date to places for accommodation stays
ALTER TABLE places ADD COLUMN IF NOT EXISTS checkout_date date;
