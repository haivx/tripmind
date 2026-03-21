# /ai-feature

Build AI feature for TripMind: $ARGUMENTS

## Implementation steps

### 1. Identify AI feature type
- **Chat/Q&A** → use streaming, save history to `chat_messages`
- **Generation** (itinerary, suggestions) → non-streaming OK, return JSON
- **Extraction** (parse email, detect info) → non-streaming, return structured data

### 2. Write system prompt in `lib/prompts.ts`
```typescript
export function get<Feature>Prompt(context: ...): string {
  return `
You are [specific role] for TripMind.

CONTEXT:
[inject dynamic data here]

TASK:
- [clear bullet points]

OUTPUT FORMAT:
[if JSON needed, describe schema clearly]
[if chat, describe tone and style]
`
}
```

### 3. Create API route at `src/app/api/ai/<feature-name>/route.ts`
- Validate input with Zod
- Check auth: `supabase.auth.getUser()`
- Add rate limiting: `checkRateLimit(generationRateLimit, user.id)`
- Build context from Supabase data
- Call Claude API with appropriate temperature
- **Chat features:** stream response with try/catch/finally
- **Generation features:** parse JSON response → validate with Zod → return
- Handle errors gracefully

### 4. Validate AI response (non-streaming features)
```typescript
const responseSchema = z.object({
  // define expected shape from Claude's output
})
const validated = responseSchema.safeParse(parsed)
if (!validated.success) {
  return Response.json({ error: 'Invalid AI response' }, { status: 422 })
}
```

### 5. Create UI component or integrate into existing page

### 6. Test cases
- [ ] Happy path works
- [ ] Empty/null data doesn't crash
- [ ] API error is displayed to user
- [ ] Streaming doesn't cut-off midway (chat only)
- [ ] Rate limit returns 429 correctly
- [ ] AI response validates against Zod schema

### 7. Verify
Follow `.claude/skills/verification-before-completion/SKILL.md`

## Model & Params defaults
```typescript
model: "claude-sonnet-4-5"
max_tokens: 1024    // chat
max_tokens: 2048    // generation/extraction
temperature: 0      // extraction (needs accuracy)
temperature: 0.7    // generation/chat (needs creativity)
```
