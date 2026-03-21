# /new-feature

Create a new feature for TripMind following project conventions.

Feature to build: $ARGUMENTS

## Implementation workflow

### 1. Analyze requirements
Understand what the feature needs to do, which parts of the app it affects.

### 2. Check before coding
- Are there any shadcn/ui components we can use? (Button, Card, Dialog, Sheet, Form, Input, Select, Textarea, Badge, Tabs, Separator, Skeleton)
- Does the feature need a new Supabase table? If so, use `/db` command
- Does the feature need a new API route?
- Does the feature have AI integration? If so, use `/ai-feature` command instead

### 3. Create files in order
- Types first (`src/types/index.ts`)
- API route if needed (`src/app/api/...`)
- Component(s) (`src/components/...`)
- Page if needed (`src/app/(app)/...`)

### 4. Post-code verification
Follow `.claude/skills/verification-before-completion/SKILL.md`

### 5. Finish
Summarize what was created/changed using the verification output format.
