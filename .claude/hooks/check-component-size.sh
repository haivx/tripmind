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

if [[ "$FILE" != *.tsx ]]; then exit 0; fi
if [[ ! -f "$FILE" ]]; then exit 0; fi

LINES=$(wc -l < "$FILE" | tr -d ' ')

if [ "$LINES" -gt 200 ]; then
  echo ""
  echo "⚠️  $FILE is $LINES lines (limit: 200)"
  echo "   Consider splitting into smaller components."
  echo ""
fi
exit 0
