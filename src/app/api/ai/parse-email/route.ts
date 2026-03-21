import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/claude'
import { getParseEmailPrompt } from '@/lib/prompts'
import { simpleRateLimit } from '@/lib/rate-limit-simple'

const bodySchema = z.object({
  emailContent: z.string().min(10).max(8000),
})

export async function POST(req: NextRequest): Promise<Response> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const limited = simpleRateLimit(user.id, 5, 60_000)
  if (limited) return limited

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Invalid input' }, { status: 400 })

  const { emailContent } = parsed.data

  let message: Awaited<ReturnType<typeof anthropic.messages.create>>
  try {
    message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 512,
      messages: [{ role: 'user', content: getParseEmailPrompt(emailContent) }],
    })
  } catch (err) {
    console.error('Anthropic API error:', err)
    return Response.json({ error: 'Failed to parse email' }, { status: 500 })
  }

  const text = message.content[0]?.type === 'text' ? message.content[0].text : ''

  let extracted: unknown
  try {
    const cleaned = text.trim().replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '')
    extracted = JSON.parse(cleaned)
  } catch {
    return Response.json({ error: 'Failed to parse response' }, { status: 422 })
  }

  return Response.json({ data: extracted })
}
