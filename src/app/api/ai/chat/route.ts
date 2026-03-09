import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/claude'
import { getChatSystemPrompt } from '@/lib/prompts'
import type { Trip, Place } from '@/types'

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

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 })

  const { tripId, messages } = parsed.data

  // Fetch trip and places for context
  const [{ data: trip }, { data: places }] = await Promise.all([
    supabase.from('trips').select('*').eq('id', tripId).eq('user_id', user.id).single(),
    supabase.from('places').select('*').eq('trip_id', tripId).eq('user_id', user.id),
  ])

  if (!trip) return Response.json({ error: 'Trip not found' }, { status: 404 })

  // Save user message (last in the array)
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

  const readable = new ReadableStream({
    async start(controller) {
      let assistantText = ''

      const stream = anthropic.messages.stream({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      })

      stream.on('text', (text) => {
        assistantText += text
        controller.enqueue(new TextEncoder().encode(text))
      })

      await stream.done()
      controller.close()

      // Save assistant message (best-effort after stream)
      void supabase.from('chat_messages').insert({
        trip_id: tripId,
        user_id: user.id,
        role: 'assistant',
        content: assistantText,
      })
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
