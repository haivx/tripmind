# /ai-feature

Build AI feature for TripMind: $ARGUMENTS

## Implementation steps:

### 1. Identify AI feature type
- **Chat/Q&A** → use streaming, save history to `chat_messages`
- **Generation** (itinerary, suggestions) → non-streaming OK, return JSON
- **Extraction** (parse email, detect info) → non-streaming, return structured data
- **Search + AI** (RAG) → need vector search first, then LLM

### 2. Write system prompt in `lib/prompts.ts`
```typescript
export const PROMPT_<NAME> = `
You are [specific role] for TripMind.

CONTEXT:
[inject dynamic data here]

TASK:
- [clear bullet points]

OUTPUT FORMAT:
[if JSON needed, describe schema clearly]
[if chat, describe tone and style]
`
```

### 3. Create API route at `src/app/api/ai/<feature-name>/route.ts`
- Validate input with Zod
- Build context from Supabase data
- Call Claude API
- **Chat features:** stream response
- **Generation features:** parse JSON response, validate, return
- Handle errors gracefully

### 4. Create React hook `src/hooks/use<FeatureName>.ts`
- Encapsulate API call logic
- Handle loading/error states
- For streaming: handle ReadableStream

### 5. Integrate into UI component

### 6. Test cases to check:
- [ ] Happy path works
- [ ] Empty/null data doesn't crash
- [ ] API error is displayed to user
- [ ] Streaming doesn't cut-off midway
- [ ] Cost is reasonable (estimate tokens used)

## Model & Params defaults:
```typescript
model: "claude-sonnet-4-5"
max_tokens: 1024  // chat
max_tokens: 2048  // generation/extraction
temperature: 0    // extraction (needs accuracy)
temperature: 0.7  // generation/chat (needs creativity)
```
