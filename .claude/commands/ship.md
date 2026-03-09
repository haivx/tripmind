# /ship

Prepare to deploy TripMind to Vercel: $ARGUMENTS

## Pre-deploy Checklist

### Code Quality
- [ ] `npm run type-check` — no TypeScript errors
- [ ] `npm run lint` — no ESLint errors
- [ ] `npm run build` — builds successfully locally

### Security
Run the automated security check first — it catches secrets, .env leaks, and client-side exposure:
```bash
bash .claude/hooks/security-check.sh <<< '{"tool_input":{"command":"git push origin main"}}'
```
If it fails, fix all reported issues before continuing.

- [ ] Vercel environment variables fully configured:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ANTHROPIC_API_KEY`
- [ ] RLS enabled on all Supabase tables

### Supabase
- [ ] All migrations run on production DB
- [ ] RLS policies work correctly (test with real user)
- [ ] Indexes created for commonly used queries

### UI / UX
- [ ] Test on mobile (375px) — Chrome DevTools
- [ ] Test on tablet (768px)
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Empty states have helpful content

### AI Features
- [ ] Chat streaming works
- [ ] AI suggest itinerary works
- [ ] Parse email works
- [ ] Rate limiting / error handling when Claude API fails

## Deploy Steps:
```bash
# 1. Commit all changes
git add -A
git commit -m "feat: <description>"

# 2. Push to GitHub
git push origin <branch>

# 3. Merge to main (create PR or merge directly)
# 4. Vercel auto-deploys when pushed to main

# 5. Verify on production URL
```

## Post-deploy:
- [ ] Test login/signup
- [ ] Test creating new trip
- [ ] Test AI chat
- [ ] Check Vercel logs if errors occur
