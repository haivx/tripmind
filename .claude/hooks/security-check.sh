#!/bin/bash
# =============================================================================
# .claude/hooks/security-check.sh
# Claude Code PreToolUse hook — blocks `git push` if security issues found
# =============================================================================

# Read JSON input from stdin
INPUT=$(cat)

# Extract the bash command being run
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('command',''))" 2>/dev/null)

# Only intercept git push commands
if ! echo "$COMMAND" | grep -qE "^git push"; then
  exit 0
fi

# ─── Run security checks ────────────────────────────────────────────────────

ISSUES=()

# 1. Check for committed .env files
ENV_FILES=$(git ls-files 2>/dev/null | grep -E "^\.env(\.|$)" || true)
if [ -n "$ENV_FILES" ]; then
  ISSUES+=("🔴 CRITICAL: .env files are tracked by git: $ENV_FILES")
fi

# 2. Check for hardcoded secrets in source files
SECRET_SCAN=$(git grep -rn -E "(sk-[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16}|password\s*=\s*['\"][^'\"]{4,})" \
  --include="*.ts" --include="*.tsx" --include="*.js" 2>/dev/null | head -3 || true)
if [ -n "$SECRET_SCAN" ]; then
  ISSUES+=("🔴 CRITICAL: Possible hardcoded secrets found in source files")
fi

# 3. Check .gitignore has .env entries
if [ -f ".gitignore" ]; then
  if ! grep -q "\.env" .gitignore 2>/dev/null; then
    ISSUES+=("🟡 WARNING: .gitignore does not exclude .env files")
  fi
else
  ISSUES+=("🔴 CRITICAL: No .gitignore file found")
fi

# 4. Check server secrets used in client components
CLIENT_LEAK=$(grep -rln '"use client"' src/ 2>/dev/null | \
  xargs grep -l "ANTHROPIC_API_KEY\|SUPABASE_SERVICE_ROLE_KEY\|OPENAI_API_KEY" 2>/dev/null || true)
if [ -n "$CLIENT_LEAK" ]; then
  ISSUES+=("🔴 CRITICAL: Server secrets referenced in client components: $CLIENT_LEAK")
fi

# 5. Check next.config for ignoreBuildErrors
if ls next.config.* 2>/dev/null | head -1 | xargs grep -l "ignoreBuildErrors.*true" 2>/dev/null | grep -q .; then
  ISSUES+=("🟡 WARNING: next.config has ignoreBuildErrors: true — build errors are hidden")
fi

# ─── Decision ────────────────────────────────────────────────────────────────

if [ ${#ISSUES[@]} -gt 0 ]; then
  echo ""
  echo "╔══════════════════════════════════════════════════════╗"
  echo "║         🔒 SECURITY CHECK FAILED — PUSH BLOCKED      ║"
  echo "╚══════════════════════════════════════════════════════╝"
  echo ""
  for issue in "${ISSUES[@]}"; do
    echo "  $issue"
  done
  echo ""
  echo "  Fix the issues above before pushing."
  echo "  Run: /security-audit for a full detailed report."
  echo ""
  # Exit code 2 = block the action and send message back to Claude
  exit 2
fi

# All clear
echo "✅ Security checks passed — proceeding with git push"
exit 0
