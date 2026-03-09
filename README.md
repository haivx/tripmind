# TripMind — AI Travel Planner

An AI-powered travel planning app. Manage trips, places, itinerary, and budget — with Claude AI chat, itinerary suggestions, and email booking parsing.

Built for a real Tokyo trip in April 2026.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (email/password) |
| AI | Anthropic Claude API |
| Deploy | Vercel |

## Features

- **Trips** — create, edit, delete trips with dates and status
- **Places** — add places by category (stay, food, attraction, transport), track booked status and price
- **Itinerary** — timeline view grouped by visit date
- **Budget** — cost breakdown by currency and category
- **AI Chat** — ask Claude anything about your trip *(Week 2)*
- **Parse Email** — paste a booking confirmation, Claude extracts the details *(Week 2)*
- **Suggest Itinerary** — Claude generates a day-by-day plan from your places *(Week 2)*

## Local Development

**1. Clone and install**

```bash
git clone https://github.com/haivx/tripmind.git
cd tripmind
npm install
```

**2. Set up Supabase**

Create a project at [supabase.com](https://supabase.com), then run the migrations in order via the SQL editor:

```
supabase/migrations/001_create_trips.sql
supabase/migrations/002_full_schema.sql
```

**3. Configure environment**

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
```

**4. Run**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

```bash
npm run dev          # Dev server (port 3000)
npm run build        # Production build
npm run type-check   # TypeScript check
npm run lint         # ESLint
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # login, signup
│   ├── (app)/            # authenticated pages
│   │   ├── dashboard/
│   │   └── trips/[tripId]/
│   │       ├── page.tsx        # overview
│   │       ├── places/
│   │       ├── itinerary/
│   │       ├── budget/
│   │       └── chat/
│   └── api/
│       ├── trips/
│       ├── places/
│       └── ai/             (Week 2)
├── components/
│   ├── trips/
│   └── ui/               # shadcn/ui components
├── lib/
│   └── supabase/
└── types/index.ts
```

## Environment Variables

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
