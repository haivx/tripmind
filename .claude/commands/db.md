# /db

Create or update Supabase database schema: $ARGUMENTS

## Implementation

### If creating new table
1. Write SQL with complete:
   - Primary key (`uuid` default)
   - Foreign keys with `on delete cascade` if appropriate
   - Timestamps (`created_at`, `updated_at` if needed)
   - Reasonable default values
   - Check constraints if needed

2. **Mandatory:** Write RLS policies
   ```sql
   alter table <table> enable row level security;
   create policy "users own <table>" on <table>
     for all using (
       auth.uid() = user_id
     );
   ```

3. Indexes for commonly queried columns:
   ```sql
   create index on <table>(trip_id);
   create index on <table>(user_id);
   ```

4. Update `src/types/index.ts` with new TypeScript types

### If updating existing table
- Write migration SQL (ALTER TABLE)
- Update TypeScript types
- Check if any components need updates

### Existing tables
- `trips` — trip info (title, destination, dates, status, share_token)
- `places` — locations (name, category, address, price, currency, booked, visit_date, lat/lng, sort_order)
- `itinerary_days` — days in itinerary (date, title, notes) — NOT currently used in code
- `itinerary_items` — links places to days (day_id, place_id, sort_order) — NOT currently used in code
- `chat_messages` — AI chat history (trip_id, role, content)
- `alerts` — warnings and reminders (type, message, dismissed)

### After writing SQL
Remind user to run this SQL in Supabase Dashboard > SQL Editor
