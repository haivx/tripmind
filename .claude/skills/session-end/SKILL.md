# Skill: Session End — Auto Wrap-up

> Activate when user says "done", "wrap up", "end session",
> or uses the command `/session-end`.

## Workflow

### Step 1: Gather Session Info

```bash
git diff --stat
git status --short
git branch --show-current
npm run type-check 2>&1 | tail -3
```

### Step 2: Update `.claude/memory/today.md`

Overwrite the file with this format:

```markdown
# TripMind — Session Log

## Last Session
- **Date:** YYYY-MM-DD HH:MM
- **Branch:** [branch name]
- **Files Changed:** N files (+X / -Y lines)

## What Was Done
- [1 bullet per change]

## What's In Progress
- [tasks not yet completed]

## Blockers / Open Questions
- [issues that need resolving]

## Next Steps
- [ ] [next task]

## Recent Decisions
- [decision + reason]
```

### Step 3: Suggest Commit

If there are uncommitted changes, suggest git commit commands.

### Step 4: Output Summary

```
═══════════════════════════════════════
  📋 SESSION SUMMARY
═══════════════════════════════════════

  Branch:   [branch]
  Changed:  N files (+X / -Y)
  Status:   N uncommitted

  ✅ Done: [list]
  🔄 In Progress: [list]

  📝 memory/today.md updated
  💡 Next session: [suggestion]
═══════════════════════════════════════
```
