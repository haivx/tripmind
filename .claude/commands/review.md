# /review

Review code for file or feature: $ARGUMENTS

## Review Checklist

### TypeScript & Code Quality
- [ ] No `any` types — replace with proper types
- [ ] Async functions have proper error handling (try/catch)
- [ ] No unused imports, variables
- [ ] Functions are not over 50 lines — if longer, suggest splitting
- [ ] Props interface is clearly defined

### React / Next.js
- [ ] `use client` only when truly needed (event handlers, hooks, browser API)
- [ ] Server components are used correctly (data fetching)
- [ ] No unnecessary re-renders (useCallback, useMemo used correctly)
- [ ] Loading and error states are handled
- [ ] Keys in list render are unique and stable (don't use index if list can change)

### Supabase
- [ ] No queries bypassing RLS (don't use service role on client)
- [ ] Errors from Supabase are handled (check `error` before `data`)
- [ ] Realtime subscriptions are cleaned up in useEffect return

### AI / Claude API
- [ ] API key is not exposed on client-side
- [ ] Streaming response is handled correctly
- [ ] System prompt is not hardcoded inline — must be in `lib/prompts.ts`
- [ ] Max tokens is set reasonably

### UI / UX
- [ ] Mobile responsive — check at 375px, 768px, 1280px
- [ ] Touch targets ≥ 44px
- [ ] Accessible (aria labels for icon buttons, form labels)
- [ ] Shadcn/ui components are used instead of custom-built

### Security
- [ ] User input is sanitized/validated (use Zod)
- [ ] No sensitive data in console.log
- [ ] .env variables have correct prefix (NEXT_PUBLIC_ only for public data)

## Output format:
List issues by severity: 🔴 Critical | 🟡 Warning | 🟢 Suggestion
Then provide code fixes for Critical and Warning issues.
