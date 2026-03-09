import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { anthropic } from '@/lib/claude'
import { getParseEmailPrompt } from '@/lib/prompts'

const bodySchema = z.object({
  emailContent: z.string().min(10).max(8000),
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

  const { emailContent } = parsed.data

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
    messages: [{ role: 'user', content: getParseEmailPrompt(emailContent) }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  let extracted: unknown
  try {
    extracted = JSON.parse(text.trim())
  } catch {
    return Response.json({ error: 'Failed to parse response' }, { status: 422 })
  }

  return Response.json({ data: extracted })
}
