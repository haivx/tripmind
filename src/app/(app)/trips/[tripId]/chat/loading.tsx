import { Skeleton } from '@/components/ui/skeleton'

export default function ChatLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-220px)] space-y-3">
      <div className="flex-1 space-y-3 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className={`h-12 rounded-lg ${i % 2 === 0 ? 'w-3/4' : 'w-2/3 ml-auto'}`} />
        ))}
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
    </div>
  )
}
