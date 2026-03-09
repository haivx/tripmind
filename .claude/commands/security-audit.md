Do a thorough security audit of this Next.js project.

Check for:

**1. Hardcoded secrets**
Scan all `.ts`, `.tsx`, `.js` files for API keys, tokens, passwords embedded directly in code (not via `process.env`). Also run: `git ls-files | grep -E '\.env'` to detect any committed env files.

**2. API routes missing auth**
Read every `route.ts` in `src/app/api/**/`. For routes with POST/PUT/DELETE/PATCH handlers, verify `supabase.auth.getUser()` or equivalent auth check is present. List any unprotected mutation routes.

**3. Server secrets in client components**
Search for `ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY` in any file that contains `"use client"`. Also check `next.config.*` for server secrets exposed in the `env:` block.

**4. Input validation gaps**
For each API route, check if `request.json()` result is validated with Zod or similar schema. Flag routes that use raw JSON without validation.

**5. Unsafe Supabase queries**
Look for template literals used directly in query filters or column names — signs of potential injection.

**6. Missing RLS**
Read all files in `supabase/migrations/`. For each `CREATE TABLE`, check if there's a matching `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`. List tables without RLS.

**7. Sensitive data in API responses**
Check if routes return sensitive fields like `password_hash`, `service_role`, or admin-only data to the client.

**8. .gitignore**
Read `.gitignore`. Verify `.env`, `.env.local`, `.env.*.local`, `.env.production` are all excluded.

**9. next.config**
Read `next.config.ts` or `next.config.js`. Flag `dangerouslyAllowBrowser`, `typescript.ignoreBuildErrors: true`, server secrets in the `env:` block.

**10. Middleware protection**
Read `middleware.ts`. Verify the `matcher` covers all authenticated routes. Identify routes that should be protected but are missing.

---

For each issue found, report in this format:
```
[SEVERITY: HIGH/MEDIUM/LOW] Category
File: path/to/file.ts
Line: XX
Issue: what is wrong
Fix: how to fix it
```

For clean categories write: `✅ Category: No issues found`

End with a summary table:
| Severity | Count |
|----------|-------|
| HIGH     | X     |
| MEDIUM   | X     |
| LOW      | X     |
