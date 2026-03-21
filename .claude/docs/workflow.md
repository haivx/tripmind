# Claude Code Workflow — TripMind

> Complete reference for how Claude Code is configured in this project.
> Everything runs from `.claude/` — commands, agents, skills, hooks, rules.

---

## Quick Reference

| Need to... | Use |
|---|---|
| Build a new feature | `/new-feature <description>` |
| Build an AI feature | `/ai-feature <description>` |
| Add/update DB schema | `/db <description>` |
| Deploy to Vercel | `/ship` |
| Wrap up session | `/session-end` |
| Security audit | `/security-audit` |

---

## Commands (`/`)

Slash commands are pre-defined workflows stored in `.claude/commands/`.
Invoke with `/command-name description`.

### `/new-feature`
Build a standard feature (UI + API + DB).

**Workflow:**
1. Analyze requirements
2. Check shadcn/ui components available
3. Create: types → API route → components → page
4. Verify with `verification-before-completion` skill

**Use when:** Adding any new UI feature, CRUD operation, or page.

---

### `/ai-feature`
Build an AI-powered feature using Claude API.

**Workflow:**
1. Identify type: chat / generation / extraction
2. Write prompt in `lib/prompts.ts`
3. Create API route with auth + rate limiting + Zod validation
4. Validate AI response with Zod (non-streaming)
5. Integrate into UI

**Use when:** Building chat, itinerary generation, email parsing, smart alerts, or any Claude API integration.

---

### `/db`
Create or update Supabase database schema.

**Workflow:**
1. Write SQL migration (table + RLS policies + indexes)
2. Update `src/types/index.ts`
3. Remind user to run SQL in Supabase Dashboard

**Use when:** New table needed, or modifying existing table structure.

---

### `/ship`
Pre-deploy checklist and deploy steps.

**Covers:**
- TypeScript + ESLint + build check
- Security check via `hooks/security-check.sh`
- Vercel env vars checklist
- Supabase RLS + migrations checklist
- Mobile/tablet UI check
- AI feature smoke test

---

### `/session-end`
Wrap up the current development session.

**Does:**
1. `git diff --stat` + `git status --short`
2. `npm run type-check`
3. Updates `.claude/memory/today.md`
4. Suggests commit messages
5. Prints formatted session summary

**Use at:** End of every coding session to preserve context for next session.

---

### `/security-audit`
Full security audit of the Next.js project.

**Checks:** API key exposure, auth gaps, RLS policies, input validation, XSS/injection risks.

---

## Agents

Agents are specialized AI personas stored in `.claude/agents/`.
They activate automatically based on context, or can be invoked explicitly.

### `code-reviewer`
Reviews code after feature completion.

**Invoked:** After `/new-feature`, `/ai-feature`, or manually for any changed files.

**Review tiers:**
- 🔴 Critical — security, data loss, TypeScript errors, RLS gaps, AI safety
- 🟡 Warning — performance, UX, mobile, code quality, accessibility
- 🟢 Suggestion — naming, refactoring, optimization

---

## Skills

Skills are reusable workflows stored in `.claude/skills/`.
Claude applies them at the right moment without being asked.

### `verification-before-completion`
**Path:** `.claude/skills/verification-before-completion/SKILL.md`

Enforces a verification checklist before any task is marked done.

**Levels:**
- Level 1 (required): `npm run type-check` + `npm run lint` — 0 errors
- Level 2 (required for features): auth check, Zod validation, loading/error states, RLS
- Level 3 (recommended): `npm run build` — no regression

**Output format:** Structured `## ✅ Task Complete` block with proof of verification.

---

### `session-end`
**Path:** `.claude/skills/session-end/SKILL.md`

Automated session wrap-up. Gathers git diff, runs type-check, writes `memory/today.md`, suggests commits, prints summary.

Triggered by `/session-end` command.

---

### `shadcn-nextjs`
**Path:** `.claude/skills/shadcn-nextjs/SKILL.md`

TripMind-specific patterns for React Hook Form + Zod + shadcn/ui:
- Form pattern
- Dialog + Form combo
- Inline edit pattern

> Does NOT duplicate patterns already in CLAUDE.md.

---

### `ui-ux-pro-max`
**Path:** `.claude/skills/ui-ux-pro-max/SKILL.md`

UI/UX design intelligence for Next.js + shadcn/ui stack.
Covers: palettes, font pairings, component patterns, accessibility, dark mode.

---

## Hooks

Hooks are shell scripts that run automatically at key moments.
Configured in `settings.json` under `"hooks"`.

### SessionStart → `session-start.sh`
Runs at the start of every session. Displays:
- Current branch + uncommitted file count
- Last 3 commits
- TypeScript error count
- Previous session notes (from `memory/today.md`)

---

### PostToolUse (Write *.tsx / *.ts) → 3 hooks run in sequence

**1. TypeScript check**
Runs `npx tsc --noEmit --skipLibCheck` after every `.ts`/`.tsx` write. Shows last 5 lines of output.

**2. `check-component-size.sh`**
Warns if a `.tsx` file exceeds 200 lines after a write.
```
⚠️  src/components/... is 291 lines (limit: 200)
   Consider splitting into smaller components.
```

**3. `verify-completion.sh`**
Reminds about verification checklist when an API route (`route.ts`) is modified.
```
📋 API Route modified: src/app/api/...
   Verify: auth check, Zod validation, error handling, rate limiting
```

---

### PreToolUse (Bash) → `security-check.sh`
Blocks dangerous commands (API key exposure, force push to main, .env commits).
Runs before every Bash tool call.

---

## Rules

**Path:** `.claude/rules/behaviors.md`

9 core principles applied to every task:

1. **Plan Mode Default** — enter plan mode for any task touching 2+ files
2. **Subagent Strategy** — split research/execution/analysis across agents
3. **Self-Improvement Loop** — log mistakes to `memory/today.md`
4. **Verification Before Done** — no "done" without proof
5. **Demand Elegance** — ask "is there a simpler way?" before submitting
6. **Autonomous Bug Fixing** — trace to root cause, not symptoms
7. **Skills = System Layer** — use skills for verification, automation, scaffolding
8. **File System = Context Engine** — structure first, code second
9. **Avoid Over-Constraining AI** — provide context, not micromanagement

---

## Memory

### `memory/today.md`
Session log — updated by `/session-end` after each session.

**Contains:**
- Last session date + branch + files changed
- What was done
- What's in progress
- Blockers / open questions
- Next steps
- Recent decisions + rationale

**Note:** Excluded from git (in `.gitignore`) — session-local context only.

---

## Docs

Additional reference documents in `.claude/docs/`:

### `content-safety.md`
Rules to prevent AI hallucination in TripMind features.
- Chat: no invented prices, hours, visa info
- Email parsing: only extract what's in the email
- Itinerary: only use user's saved places
- Alerts: only fact-based, max 5

### `workflow.md`
This file.

---

## Settings (`settings.json`)

Key configuration:

```json
{
  "model": "claude-sonnet-4-5",
  "permissions": {
    "deny": [".env.local reads", "production writes", "rm -rf", "force push"]
  },
  "hooks": {
    "PreToolUse": ["rm-rf block", "security-check"],
    "PostToolUse": ["tsc check", "component size check", "route verification"],
    "SessionStart": ["session-start.sh"]
  }
}
```

---

## Directory Map

```
.claude/
├── agents/
│   └── code-reviewer.md          # Post-feature code review agent
├── commands/
│   ├── ai-feature.md             # /ai-feature
│   ├── db.md                     # /db
│   ├── new-feature.md            # /new-feature
│   ├── security-audit.md         # /security-audit
│   ├── session-end.md            # /session-end
│   └── ship.md                   # /ship
├── docs/
│   ├── content-safety.md         # AI hallucination prevention rules
│   └── workflow.md               # This file
├── hooks/
│   ├── check-component-size.sh   # Warn if .tsx > 200 lines
│   ├── security-check.sh         # Block dangerous bash commands
│   ├── session-start.sh          # Session banner + context
│   └── verify-completion.sh      # Remind about API route checklist
├── memory/
│   └── today.md                  # Session log (not committed)
├── rules/
│   └── behaviors.md              # 9 core behavior principles
├── skills/
│   ├── session-end/SKILL.md      # Session wrap-up workflow
│   ├── shadcn-nextjs/SKILL.md    # Form + dialog patterns
│   ├── ui-ux-pro-max/SKILL.md    # UI/UX design intelligence
│   └── verification-before-completion/SKILL.md
├── MVP_CHECKLIST.md              # Feature completion tracker
├── settings.json                 # Hooks + permissions config
└── .gitignore                    # Excludes settings.local.json, memory/today.md
```
