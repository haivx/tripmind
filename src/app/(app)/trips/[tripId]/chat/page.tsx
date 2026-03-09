import { createClient } from '@/lib/supabase/server'
import { ChatInterface } from '@/components/ai/chat-interface'
import type { ChatMessage } from '@/types'

interface PageProps {
  params: Promise<{ tripId: string }>
}

export default async function ChatPage({ params }: PageProps) {
  const { tripId } = await params
  const supabase = await createClient()

  const { data: messages } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: true })
    .limit(100)

  return (
    <ChatInterface
      tripId={tripId}
      initialMessages={(messages ?? []) as ChatMessage[]}
    />
  )
}
