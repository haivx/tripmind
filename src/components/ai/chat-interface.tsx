'use client'

import { useState, useRef, useEffect, memo } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
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

const MessageBubble = memo(({ message }: { message: DisplayMessage }) => (
  <div className={`flex gap-2.5 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs"
      style={
        message.role === 'user'
          ? { background: '#E11D48', color: 'white' }
          : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }
      }
    >
      {message.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
    </div>
    <div
      className="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm"
      style={
        message.role === 'user'
          ? { background: '#E11D48', color: 'white', borderTopRightRadius: '4px' }
          : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)', borderTopLeftRadius: '4px' }
      }
    >
      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
    </div>
  </div>
))

MessageBubble.displayName = 'MessageBubble'

function StreamingBubble({ content, isStreaming }: { content: string; isStreaming: boolean }) {
  return (
    <div className="flex gap-2.5 flex-row">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs"
        style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
      >
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div
        className="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm"
        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)', borderTopLeftRadius: '4px' }}
      >
        {content === '' && isStreaming ? (
          <Loader2 className="h-4 w-4 animate-spin" style={{ color: 'rgba(255,255,255,0.4)' }} />
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
    setStreamingContent('')
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

      const finalContent = streamingContentRef.current
      setStreamingContent(null)
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
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(225,29,72,0.12)', border: '1px solid rgba(225,29,72,0.2)' }}
            >
              <Bot className="h-6 w-6" style={{ color: '#E11D48' }} />
            </div>
            <div>
              <p className="font-medium text-sm text-white">Ask me anything about your trip</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                I know your saved places and dates
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-sm">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors duration-200 text-left"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.65)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

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
              className="text-xs px-3 py-1.5 rounded-full cursor-pointer transition-colors duration-200 whitespace-nowrap shrink-0"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.55)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your trip..."
          className="flex-1 min-h-[44px] max-h-32 resize-none text-sm rounded-xl px-3 py-2.5 outline-none transition-colors duration-200"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'white',
          }}
          rows={1}
          disabled={isStreaming}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(225,29,72,0.5)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || isStreaming}
          className="shrink-0 self-end w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 disabled:opacity-40 hover:-translate-y-px"
          style={{ background: '#E11D48', boxShadow: '0 0 16px rgba(225,29,72,0.35)', color: 'white' }}
        >
          {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
