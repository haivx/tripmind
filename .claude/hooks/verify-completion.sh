#!/bin/bash
INPUT=$(cat)
FILE=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('file_path', ''))
except:
    print('')
" 2>/dev/null)

if [[ "$FILE" != src/* ]]; then exit 0; fi

if [[ "$FILE" == *"route.ts"* ]]; then
  echo ""
  echo "📋 API Route modified: $FILE"
  echo "   Verify: auth check, Zod validation, error handling, rate limiting"
  echo ""
fi
exit 0
