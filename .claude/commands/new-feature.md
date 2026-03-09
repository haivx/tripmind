# /new-feature

Create a new feature for TripMind following project conventions.

Feature to build: $ARGUMENTS

## Implementation workflow:

1. **Analyze requirements** — Understand what the feature needs to do, which parts of the app it affects

2. **Check before coding:**
   - Are there any shadcn/ui components we can use? (Button, Card, Dialog, Sheet, Form, Input, Select, Textarea, Badge, Tabs, Separator, Skeleton)
   - Does the feature need a new Supabase table? If so, write SQL migration
   - Does the feature need a new API route?
   - Does the feature have AI integration?

3. **Create files in order:**
   - Types first (`src/types/index.ts`)
   - API route if needed (`src/app/api/...`)
   - Component(s) (`src/components/...`)
   - Page if needed (`src/app/(app)/...`)

4. **Post-code checklist:**
   - [ ] TypeScript has no errors (`npm run type-check`)
   - [ ] No `any` types
   - [ ] Mobile responsive (test at 375px width)
   - [ ] Loading state exists
   - [ ] Error state exists
   - [ ] Empty state exists (if it's a list)
   - [ ] Supabase RLS is correct

5. **Finish:** Summarize what was created/changed
