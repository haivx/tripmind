'use client'

import { useState, useRef, useEffect, memo } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types'

const SUGGESTED_QUESTIONS = [
  'Help me plan Day 1',
  'What areas should I stay in?',
  'What should I know before going?',
  'Suggest a budget breakdown',
]

interface Props {
  tripId: string
  initialMessages: ChatMessage[]
}

interface DisplayMessage {
  role: 'user' | 'assistant'
  content: string
}

// Memoized — skips re-render entirely while streaming is happening
const MessageBubble = memo(({ message }: { message: DisplayMessage }) => (
  <div className={cn('flex gap-2.5', message.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
    <div
      className={cn(
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs',
        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      )}
    >
      {message.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
    </div>
    <div
      className={cn(
        'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm',
        message.role === 'user'
          ? 'bg-primary text-primary-foreground rounded-tr-sm'
          : 'bg-muted text-foreground rounded-tl-sm'
      )}
    >
      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
    </div>
  </div>
))

MessageBubble.displayName = 'MessageBubble'

// Isolated — ONLY this component re-renders on every token during streaming
function StreamingBubble({ content, isStreaming }: { content: string; isStreaming: boolean }) {
  return (
    <div className="flex gap-2.5 flex-row">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs bg-muted text-muted-foreground">
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm bg-muted text-foreground rounded-tl-sm">
        {content === '' && isStreaming ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        )}
      </div>
    </div>
  )
}

export function ChatInterface({ tripId, initialMessages }: Props) {
  const [messages, setMessages] = useState<DisplayMessage[]>(
    initialMessages.map((m) => ({ role: m.role, content: m.content }))
  )
  const [streamingContent, setStreamingContent] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const streamingContentRef = useRef('')

  // Only scroll when a new complete message is committed — not on every token
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text: string) {
    const content = text.trim()
    if (!content || isStreaming) return

    setInput('')
    const updated: DisplayMessage[] = [...messages, { role: 'user', content }]
    setMessages(updated)
    setIsStreaming(true)
    setStreamingContent('')         // show streaming bubble immediately
    streamingContentRef.current = ''

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId,
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok || !res.body) {
        setStreamingContent(null)
        setMessages([...updated, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
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

      // Commit final content to history
      const finalContent = streamingContentRef.current
      setStreamingContent(null)     // hide streaming bubble
      setMessages([...updated, { role: 'assistant', content: finalContent }])

    } catch {
      setStreamingContent(null)
      setMessages([...updated, { role: 'assistant', content: 'Network error. Please try again.' }])
    } finally {
      setIsStreaming(false)
      streamingContentRef.current = ''
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const isEmpty = messages.length === 0 && streamingContent === null

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] min-h-[400px]">
      <div className="flex-1 overflow-y-auto space-y-4 pb-2">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-8">
            <Bot className="h-10 w-10 text-muted-foreground/40" />
            <div>
              <p className="font-medium text-sm">Ask me anything about your trip</p>
              <p className="text-xs text-muted-foreground mt-1">I know your saved places and dates</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-sm">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/50 hover:bg-muted transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* History — memoized, not affected by streaming */}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {/* Streaming bubble — isolated, only re-renders during active stream */}
        {streamingContent !== null && (
          <StreamingBubble content={streamingContent} isStreaming={isStreaming} />
        )}

        <div ref={bottomRef} />
      </div>

      {!isEmpty && !isStreaming && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/50 hover:bg-muted transition-colors whitespace-nowrap shrink-0"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-2 border-t">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your trip..."
          className="min-h-[44px] max-h-32 resize-none text-sm"
          rows={1}
          disabled={isStreaming}
        />
        <Button
          size="icon"
          onClick={() => send(input)}
          disabled={!input.trim() || isStreaming}
          className="shrink-0 self-end"
        >
          {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
