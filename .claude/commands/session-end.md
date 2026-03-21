# /session-end

Wrap up the current development session.

Follow the session-end skill at `.claude/skills/session-end/SKILL.md`:

1. Run `git diff --stat` and `git status --short` to see changes
2. Run `npm run type-check` to verify no errors
3. Update `.claude/memory/today.md` with session summary
4. Suggest commit messages for uncommitted changes
5. Output formatted session summary
