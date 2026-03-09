import { MessageSquare } from 'lucide-react'

export default function ChatPage() {
  return (
    <div className="text-center py-16 text-muted-foreground text-sm">
      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
      <p className="font-medium">AI Chat</p>
      <p className="mt-1">Coming in Week 2 — ask Claude anything about your trip.</p>
    </div>
  )
}
