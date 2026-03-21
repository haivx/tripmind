# TripMind — Claude Code Behavior Rules

> 9 core principles. Apply to EVERY task, EVERY session.
> Read this file BEFORE starting any task.

---

## 1. Plan Mode Default

**Enter plan mode for ANY non-trivial task** (3+ steps or architecture changes).

- Define BOTH execution + verification steps before writing code
- If something breaks → STOP and re-plan
- Write detailed specs to remove ambiguity

**Trigger:** Task touches more than 1 file, or involves new logic.

---

## 2. Subagent Strategy

**Use subagents aggressively** for complex problems.

- Split tasks: research, execution, analysis
- One task per agent for clarity
- Parallelize thinking, not just execution

---

## 3. Self-Improvement Loop

**After ANY mistake → log it.**

- Convert mistakes into rules
- Review past lessons before starting a similar task
- Write lessons to `.claude/memory/today.md` → "Recent Decisions"

---

## 4. Verification Before Done ⭐

**NEVER mark done without proofs.**

- Run `npm run type-check` — read the output
- Check logs, simulate real usage
- Compare expected vs actual
- Ask: "Would a senior engineer approve this?"

Follow: `.claude/skills/verification-before-completion/SKILL.md`

---

## 5. Demand Elegance

Before submitting: **"Is there a simpler / cleaner way?"**

- Avoid hacky or temporary fixes
- Optimize for long-term maintainability
- Skip overengineering for small fixes

---

## 6. Autonomous Bug Fixing

When encountering a bug:
1. Trace logs, errors, failing tests — read error messages CAREFULLY
2. Find root cause, not symptoms — ask "Why?" at least 2 times
3. Fix CI failures proactively

**Anti-pattern:** Comment out code or add blind try/catch.

---

## 7. Skills = System Layer

- Skills include code, scripts, data, workflows — not just markdown
- Use skills for: verification, automation, data analysis, scaffolding
- Existing skills: shadcn-nextjs, ui-ux-pro-max, verification-before-completion, session-end

---

## 8. File System = Context Engine

- Structure > verbosity (good structure beats writing lots)
- Create file structure FIRST, code AFTER
- Enable progressive disclosure

---

## 9. Avoid Over-Constraining AI

- Provide context, not micromanagement
- Let AI adapt to the problem
- Flexibility > strict instructions
- Guidelines (e.g.: "< 200 lines") are not hard rules

---

## Task Management Workflow

1. Plan first → write checklist
2. Verify before execution
3. Track progress → update memory/today.md
4. Explain changes at each step
5. Document results clearly
6. Capture lessons after completion

## Core Principles

- Simplicity First → minimal, clean solutions
- Systems > Prompts
- Verification > Generation
- Iteration > Perfection
- No Lazy Fixes → solve root cause
