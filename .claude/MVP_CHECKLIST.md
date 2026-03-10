# TripMind MVP Checklist
> Goal: Ready to use for Tokyo trip in April 2026

## Week 1 — Core CRUD + Auth

### Setup
- [x] `create-next-app` with TypeScript + Tailwind + App Router
- [x] Install shadcn/ui (`npx shadcn@latest init`)
- [x] Install dependencies: `@supabase/supabase-js @supabase/ssr @anthropic-ai/sdk ai zod react-hook-form @hookform/resolvers sonner`
- [x] Supabase project created
- [x] Run SQL schema (trips, places, itinerary_days, alerts, chat_messages)
- [x] `.env.local` fully configured
- [ ] Deploy to Vercel (even when app is empty)

### Auth
- [x] Supabase Auth setup (email/password)
- [x] Login page
- [x] Signup page
- [x] Logout
- [x] Protected routes (middleware)

### Trips
- [x] Dashboard — trip list
- [x] Create new trip (form)
- [x] Trip detail page (layout with tabs)
- [x] Edit trip
- [x] Delete trip

### Places
- [x] List of places in trip
- [x] Add place manually (form)
- [x] Edit place (booked status, price, date)
- [x] Delete place
- [x] Filter by category

### Itinerary
- [x] Timeline view by day
- [ ] Drag and drop sorting (optional — can skip for MVP)

### Layout
- [x] Desktop: sidebar navigation
- [x] Mobile: bottom navigation (4 tabs)
- [x] Responsive layout working at 375px and 1280px

---

## Week 2 — AI Features

### AI Chat
- [x] Chat UI (bubble messages, input, send button)
- [x] Streaming response from Claude API
- [x] System prompt inject trip context
- [x] Save conversation history to Supabase
- [x] Suggested questions (quick prompts)

### Parse Email
- [x] UI: textarea paste email content
- [x] Claude extract booking information
- [x] Preview card displaying extracted data
- [x] User confirm → save to places table

### Suggest Itinerary
- [x] Button "AI suggest itinerary"
- [x] Claude receives list of places → returns JSON itinerary
- [x] Preview suggested itinerary
- [x] User confirm → apply to itinerary_days + places

### Smart Alerts
- [x] Check for unbooked hotels on specific dates
- [x] Check places without specific dates
- [x] Alert banner on trip overview
- [x] Dismiss alert

---

## Week 3 — Polish + Deploy

### Budget
- [x] Total cost by currency
- [x] Breakdown by category
- [x] Progress bar (spent / budget)
- [x] VND ↔ JPY conversion (fixed rate OK for MVP)

### Polish
- [x] Empty states for all lists
- [x] Error boundaries
- [x] Loading skeletons
- [x] Toast notifications for actions
- [x] Page titles and meta tags

### Deploy & Test
- [x] `npm run build` without errors
- [ ] Test on real mobile device (iPhone Safari)
- [ ] Enter real Tokyo trip data for Liam
- [ ] Test AI chat with real questions
- [ ] Share URL with 1-2 users for testing

---

## Backlog (post-MVP)
- [ ] Google Calendar sync
- [ ] Dark mode
- [ ] Drag and drop itinerary
- [ ] Export itinerary as PDF
- [ ] Share trip with others (read-only link)
- [ ] Map view with locations
- [ ] Weather integration
- [ ] Multi-currency realtime exchange rate
