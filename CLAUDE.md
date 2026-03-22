# TripMind — AI Travel Planner

> **Behavior Rules:** Read `.claude/rules/behaviors.md` for how you should work.
> **Content Safety:** Read `.claude/docs/content-safety.md` for AI feature rules.

## Project Overview
AI-powered travel planning app. Users manage trips, places, itinerary, budget — with AI-assisted chat, itinerary suggestions, and email booking parsing.

**Owner:** Solo project — Liam

**Goal:** Use for real Tokyo trip

**MVP Deadline:** 3 weeks from start date

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL + pgvector) |
| Auth | Supabase Auth |
| AI | Anthropic Claude API (`claude-sonnet-4-5`) |
| AI SDK | `ai` package (Vercel AI SDK) — for streaming |
| Deploy | Vercel |

---

## Key Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run type-check   # TypeScript check (tsc --noEmit)
npm run lint         # ESLint
npm run lint:fix     # ESLint auto-fix
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # login, signup pages
│   ├── (app)/            # authenticated pages
│   │   ├── layout.tsx    # sidebar + mobile bottom nav
│   │   ├── dashboard/
│   │   └── trips/[tripId]/
│   │       ├── page.tsx         # overview
│   │       ├── itinerary/
│   │       ├── places/
│   │       ├── budget/
│   │       └── chat/
│   └── api/
│       ├── ai/chat/route.ts
│       ├── ai/suggest-itinerary/route.ts
│       ├── ai/parse-email/route.ts
│       └── alerts/generate/route.ts
├── components/
│   ├── trips/
│   ├── itinerary/
│   ├── places/
│   ├── ai/
│   └── ui/               # shadcn components (DO NOT edit manually)
├── lib/
│   ├── supabase/
│   │   ├── client.ts     # browser client
│   │   ├── server.ts     # server client (cookies)
│   │   └── types.ts      # generated DB types
│   ├── claude.ts         # Anthropic client
│   ├── prompts.ts        # ALL system prompts go here
│   └── utils.ts
└── types/index.ts
```

---

## Code Standards

### TypeScript
- Strict mode is mandatory
- Don't use `any` — use `unknown` or specific types
- Prefer `interface` for object shapes, `type` for unions/computed
- Always type return value of async functions

### Components
- Functional components with hooks, no class components
- Each component file < 200 lines — if longer, split it
- Props interface placed right above component
- Use shadcn/ui components — don't write UI primitives from scratch

### Naming
- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Supabase tables: `snake_case`

### API Routes (Next.js)
- Always validate input with Zod
- Return consistent format: `{ data, error }` or Response.json()
- Handle errors — no unhandled promise rejections
- AI routes must stream response (non-blocking)

### Supabase
- Always use RLS — no queries without auth check
- Server components use `createClient()` from `lib/supabase/server.ts`
- Client components use `createClient()` from `lib/supabase/client.ts`
- Don't expose service role key on client-side

### AI / Claude API
- Model: `claude-sonnet-4-5` (balance speed/cost/quality)
- All system prompts centralized in `lib/prompts.ts`
- AI routes must have streaming — don't use non-streaming for chat
- Default max tokens: 1024 for chat, 2048 for itinerary suggestion

---

## Mobile-First Approach
- Design mobile first, desktop second
- Main breakpoint: `md` (768px)
- Mobile: bottom navigation (4 tabs)
- Desktop: sidebar navigation
- Minimum touch targets: 44px

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # server-side only
ANTHROPIC_API_KEY=               # server-side only
GOOGLE_MAPS_API_KEY=             # server-side only — geocoding + directions
```

---

## MCP Server (tripmind-maps-mcp)

TripMind uses a companion MCP server (`../tripmind-maps-mcp`) that gives Claude Code access to Google Maps tools during development.

**Setup:** The server is registered in `.mcp.json` at the project root. To use it:
1. Build the MCP server: `cd ../tripmind-maps-mcp && npm run build`
2. Set `GOOGLE_MAPS_API_KEY` in your shell (the MCP server reads it from env)
3. Restart Claude Code — run `/mcp` to confirm `tripmind-maps` is connected

**Available tools:**
- `maps_search_places` — search for places by text or nearby
- `maps_place_details` — get opening hours, reviews, contact info by place_id
- `maps_geocode` — forward/reverse geocoding
- `maps_directions` — route calculation with travel time
- `maps_distance_matrix` — multi-origin/destination distances
- `maps_timezone` — timezone lookup by coordinates

**Note:** The MCP server is for Claude Code's dev workflow only. TripMind's runtime calls Google APIs directly (via `src/lib/geocode.ts` and the `/api/ai/suggest-itinerary` route).

---

## Git Workflow
- Branch: `feature/feature-name` or `fix/bug-name`
- Commit: conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`)
- Don't commit directly to `main`
- Don't commit `.env.local`

---

## What NOT to do
- Don't install additional UI libraries (use existing shadcn/ui)
- Don't use LangChain or LlamaIndex (call Anthropic SDK directly)
- Don't expose API keys in client-side code
- Don't write raw SQL — use Supabase client
- Don't create new components if shadcn/ui already has them
