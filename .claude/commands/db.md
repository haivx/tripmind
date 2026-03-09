# /db

Create or update Supabase database schema: $ARGUMENTS

## Implementation:

### If creating new table:
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
       -- direct ownership
       auth.uid() = user_id
       -- or via parent table
       -- exists (select 1 from trips where trips.id = <table>.trip_id and trips.user_id = auth.uid())
     );
   ```

3. Indexes for commonly queried columns:
   ```sql
   create index on <table>(trip_id);
   create index on <table>(user_id);
   ```

4. Update `src/lib/supabase/types.ts` with new TypeScript types

### If updating existing table:
- Write migration SQL (ALTER TABLE)
- Update TypeScript types
- Check if any components need updates

### Existing tables:
- `trips` — trip information
- `places` — locations (hotel, attraction, restaurant, transport)
- `itinerary_days` — days in itinerary
- `alerts` — warnings and reminders
- `chat_messages` — AI chat history

### After writing SQL:
Remind user to run this SQL in Supabase Dashboard > SQL Editor
