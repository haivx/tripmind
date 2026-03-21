# Skill: Verification Before Completion

> "Run the test. Read the output. THEN claim done."

## When to activate

MUST apply when:
- Completing any feature or bug fix
- Before saying "Done", "Completed", "Finished"
- Before suggesting commit or push

## Verification Checklist

### Level 1: Code Quality (MANDATORY)

```bash
npm run type-check 2>&1
npm run lint 2>&1
```

- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 errors
- [ ] No new `any` types
- [ ] No unused imports

### Level 2: Functional (MANDATORY for features)

**New/modified API Route:**
- [ ] Auth check present (401 when unauthorized)
- [ ] Zod validation rejects bad input (400)
- [ ] Rate limiting added (if AI route)
- [ ] Error handling does not leak sensitive data

**New/modified Component:**
- [ ] Component < 200 lines
- [ ] Mobile responsive (375px)
- [ ] Loading state exists
- [ ] Error state exists
- [ ] aria-label on icon-only buttons

**AI Feature:**
- [ ] Error handling for Claude API call
- [ ] Response JSON validated (Zod if non-streaming)
- [ ] Token count is reasonable

**Database change:**
- [ ] RLS enabled + policies sufficient
- [ ] Indexes for queried columns
- [ ] TypeScript types updated

### Level 3: Integration (SHOULD DO)

- [ ] `npm run build` succeeds
- [ ] Does not break existing features

## Output Format (MANDATORY)

```
## ✅ Task Complete: [task name]

### Changes Made
- [file]: [description of change]

### Verification Results
- TypeScript: ✅ 0 errors
- ESLint: ✅ passed
- Build: ✅ / ⏭️ skipped (reason)
- Functional: ✅ [description of how verified]

### Known Limitations
- [if any]

### Next Steps
- [if any]
```

## If CANNOT verify

```
## ⚠️ Task Complete (Unverified): [task name]

### Cannot verify because:
- [reason]

### What needs manual testing:
- [checklist for user]
```

NEVER say "Done!" without showing proof.
