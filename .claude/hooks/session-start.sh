#!/bin/bash
echo '═══════════════════════════════════════'
echo '  🚀 TripMind Dev Session'
echo '═══════════════════════════════════════'
echo ""

BRANCH=$(git branch --show-current 2>/dev/null || echo 'detached')
CHANGED=$(git status --short 2>/dev/null | wc -l | tr -d ' ')
echo "  Branch:      $BRANCH"
echo "  Uncommitted: $CHANGED files"
echo ""

echo "  Recent commits:"
git log --oneline -3 2>/dev/null | sed 's/^/    /'
echo ""

TSC_ERRORS=$(npx tsc --noEmit --skipLibCheck 2>&1 | grep "error TS" | wc -l | tr -d ' ')
if [ "$TSC_ERRORS" -gt 0 ]; then
  echo "  ⚠️  TypeScript: $TSC_ERRORS errors"
else
  echo "  ✅ TypeScript: clean"
fi
echo ""

if [ -f ".claude/memory/today.md" ]; then
  echo "  📋 Last session notes:"
  echo "  ─────────────────────"
  sed -n '/## What.*In Progress/,/^##/p' .claude/memory/today.md 2>/dev/null | head -6 | sed 's/^/    /'
  echo ""
  sed -n '/## Next Steps/,/^##/p' .claude/memory/today.md 2>/dev/null | head -6 | sed 's/^/    /'
  echo ""
  sed -n '/## Blockers/,/^##/p' .claude/memory/today.md 2>/dev/null | head -4 | sed 's/^/    /'
else
  echo "  📋 No previous session notes."
  echo "     Run /session-end to save progress."
fi

echo ""
echo '═══════════════════════════════════════'
echo '  📖 Rules: .claude/rules/behaviors.md'
echo '  📝 Tasks: .claude/MVP_CHECKLIST.md'
echo '═══════════════════════════════════════'
