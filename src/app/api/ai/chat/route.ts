import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/claude'
import { getChatSystemPrompt } from '@/lib/prompts'
import { simpleRateLimit } from '@/lib/rate-limit-simple'
import type { Trip, Place } from '@/types'

const MAX_MESSAGES = 20

const bodySchema = z.object({
  tripId: z.string().uuid(),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
})

export async function POST(req: NextRequest): Promise<Response> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  // Fix #1: Rate limiting
  const limited = simpleRateLimit(user.id, 10, 60_000)
  if (limited) return limited

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 })

  const { tripId, messages } = parsed.data

  const [{ data: trip }, { data: places }] = await Promise.all([
    supabase.from('trips').select('*').eq('id', tripId).eq('user_id', user.id).single(),
    supabase.from('places').select('*').eq('trip_id', tripId).eq('user_id', user.id),
  ])

  if (!trip) return Response.json({ error: 'Trip not found' }, { status: 404 })

  const lastMessage = messages[messages.length - 1]
  if (lastMessage?.role === 'user') {
    await supabase.from('chat_messages').insert({
      trip_id: tripId,
      user_id: user.id,
      role: 'user',
      content: lastMessage.content,
    })
  }

  const systemPrompt = getChatSystemPrompt(trip as Trip, (places ?? []) as Place[])

  // Fix #2: Sliding window — only send last 20 messages
  const recentMessages = messages.length > MAX_MESSAGES
    ? messages.slice(-MAX_MESSAGES)
    : messages
  const trimmedMessages = recentMessages[0]?.role === 'assistant'
    ? recentMessages.slice(1)
    : recentMessages

  const readable = new ReadableStream({
    async start(controller) {
      let assistantText = ''

      // Fix #3: try/catch/finally ensures stream always closes
      try {
        const stream = anthropic.messages.stream({
          model: 'claude-sonnet-4-5',
          max_tokens: 1024,
          system: systemPrompt,
          messages: trimmedMessages.map((m) => ({ role: m.role, content: m.content })),
        })

        stream.on('text', (text) => {
          assistantText += text
          controller.enqueue(new TextEncoder().encode(text))
        })

        await stream.done()
      } catch (err) {
        const errorMsg = '\n\n[Error: Failed to get response. Please try again.]'
        controller.enqueue(new TextEncoder().encode(errorMsg))
        console.error('Chat stream error:', err)
      } finally {
        controller.close()

        // Fix #4: Proper error handling instead of void fire-and-forget
        if (assistantText) {
          supabase.from('chat_messages').insert({
            trip_id: tripId,
            user_id: user.id,
            role: 'assistant',
            content: assistantText,
          }).then(({ error }) => {
            if (error) console.error('Failed to save assistant message:', error)
          })
        }
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
