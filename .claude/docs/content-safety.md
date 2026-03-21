# Content Safety — AI Hallucination Prevention

> TripMind handles real travel information. Wrong data = user gets hurt.

## Rules for AI Features

### Chat (`getChatSystemPrompt`)
- NEVER fabricate prices → say "I don't have current pricing"
- NEVER fabricate opening hours → say "Please verify opening hours online"
- NEVER fabricate visa/immigration information
- WHEN suggesting → base on saved places, don't invent new ones
- ALWAYS caveat: "Based on my training data. Please verify before booking."

### Email Parsing (`getParseEmailPrompt`)
- ONLY extract information that EXISTS in the email
- Unclear fields → return null, NEVER guess
- Price must be exact match from email

### Itinerary Suggestion (`getItinerarySuggestionPrompt`)
- ONLY use places the user has already added
- NEVER add new places
- Respect visit_date already set

### Smart Alerts (`getAlertsPrompt`)
- ONLY alert based on actual data
- NEVER alert based on assumptions
- Max 5 alerts, actionable, factual

## When implementing a new AI feature
- [ ] AI only uses data the user has provided?
- [ ] AI adds caveats when uncertain?
- [ ] AI doesn't fabricate prices/dates/addresses?
- [ ] Response validated with Zod?
- [ ] Error case → user sees a sensible error message?
