# Streaming Chat UI — Anti-Jank Pattern

One of the trickier problems in TripMind's AI chat: **how do you stream 300+ tokens from Claude without the message list stuttering on every single token?**

The naive approach kills performance. This doc explains the pattern we landed on, why it works, and the key architectural rules behind it.

---

## The Problem

When building streaming chat, the obvious implementation is to append each incoming token directly to the last message in the `messages` array:

```tsx
// ❌ Anti-pattern — full list re-render on every token
setMessages((prev) => {
  const last = prev[prev.length - 1]
  return [...prev.slice(0, -1), { ...last, content: last.content + token }]
})
```

This causes three compounding issues:

1. **Full list re-render** — React diffs every message bubble on every token arrival
2. **Immutable string concatenation** — each `last.content + token` creates a new string
3. **Scroll jitter** — if you also scroll on state change, you get 300+ scroll calls per response

The previous implementation used `requestAnimationFrame` + a `bufferRef` to batch updates. This helped but still mutated `messages[]` on every rAF frame (~60fps), and introduced timing edge cases when the buffer flushed at stream end.

---

## The Solution: Isolated Streaming Bubble

**Core idea:** keep streaming content *completely separate* from the committed message history.

```
messages[]          → committed history, only changes when a full response completes
streamingContent    → isolated state, only StreamingBubble reads it
streamingContentRef → raw accumulator string, zero re-render cost
```

During streaming, `messages[]` is **frozen**. Only `StreamingBubble` re-renders. When the stream ends, we flip atomically: hide the bubble, push the final string into `messages[]`.

---

## Architecture

### State

```tsx
const [messages, setMessages] = useState<DisplayMessage[]>([...])
const [streamingContent, setStreamingContent] = useState<string | null>(null)
const [isStreaming, setIsStreaming] = useState(false)
const streamingContentRef = useRef('')   // accumulates without re-rendering
```

`streamingContent === null` → no bubble shown
`streamingContent === ''` → bubble visible, spinner shown (waiting for first token)
`streamingContent === 'some text...'` → bubble visible, content rendering

### Two Components, Two Jobs

```tsx
// Memoized — bails out of re-render entirely while streaming is happening
const MessageBubble = memo(({ message }) => ( ... ))

// Isolated — ONLY this re-renders per token batch during streaming
function StreamingBubble({ content, isStreaming }) { ... }
```

`memo()` on `MessageBubble` means React won't even diff the history list while the stream is active — it only looks at `StreamingBubble`.

### Throttled Updates (50ms)

Instead of updating on every token (or every rAF frame), we throttle `setStreamingContent` to fire at most once every 50ms:

```tsx
let lastUpdate = 0
const THROTTLE_MS = 50

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  streamingContentRef.current += decoder.decode(value, { stream: true })

  const now = Date.now()
  if (now - lastUpdate >= THROTTLE_MS) {
    lastUpdate = now
    setStreamingContent(streamingContentRef.current)
  }
}
```

50ms is the sweet spot — imperceptible lag, significant CPU reduction. Claude.ai production uses ~30–60ms.

### Atomic Commit on Completion

```tsx
const finalContent = streamingContentRef.current
setStreamingContent(null)   // hide bubble first
setMessages([...updated, { role: 'assistant', content: finalContent }])
```

`null` before the `setMessages` call prevents a double-bubble flash where both the streaming bubble and the committed message are visible at the same time.

### Scroll — Only on Completed Messages

```tsx
// ✅ Fires once when a new complete message lands
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])

// ❌ Don't do this — fires on every token
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [streamingContent])
```

---

## Before / After

|  | Before | After |
|---|---|---|
| Re-render scope | Entire message list per rAF frame | Only `StreamingBubble` |
| Update frequency | ~60fps (every rAF) | Throttled every 50ms |
| Scroll trigger | Every `messages` mutation | Only on new complete message |
| Complexity | `bufferRef` + `rafRef` + flush-on-end | Single `streamingContentRef` |
| CPU during stream | High | ~3–5x lower |

---

## Key Rules

| Rule | Why |
|------|-----|
| Never push partial content into `messages[]` | Prevents full list re-render on every token |
| Accumulate in `ref`, trigger render via `state` | `ref` has no re-render cost |
| `memo()` on `MessageBubble` | History bubbles skip diffing during streaming |
| 50ms throttle, not rAF | rAF fires 60fps regardless of token rate; 50ms is enough for smooth UX |
| `setStreamingContent(null)` before committing | Avoids duplicate bubble flash |
| Scroll only on `messages` change | Prevents scroll jank mid-stream |

---

## Implementation

The pattern lives in [src/components/ai/chat-interface.tsx](../src/components/ai/chat-interface.tsx).
