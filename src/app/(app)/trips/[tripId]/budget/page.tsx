import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Place } from '@/types'

interface PageProps {
  params: Promise<{ tripId: string }>
}

const CATEGORY_LABEL: Record<string, string> = {
  accommodation: 'Accommodation',
  restaurant: 'Food & Drink',
  attraction: 'Attractions',
  transport: 'Transport',
  other: 'Other',
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function BudgetPage({ params }: PageProps) {
  const { tripId } = await params
  const supabase = await createClient()

  const { data: places } = await supabase
    .from('places')
    .select('*')
    .eq('trip_id', tripId)
    .not('price', 'is', null)

  const allPlaces = (places ?? []) as Place[]

  // Group by currency then category
  const byCurrency: Record<string, Record<string, number>> = {}
  for (const p of allPlaces) {
    if (!p.price) continue
    const cur = p.currency ?? 'JPY'
    if (!byCurrency[cur]) byCurrency[cur] = {}
    byCurrency[cur][p.category] = (byCurrency[cur][p.category] ?? 0) + p.price
  }

  if (allPlaces.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">
        No prices added yet. Add prices to places to see your budget breakdown.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {Object.entries(byCurrency).map(([currency, categories]) => {
        const total = Object.values(categories).reduce((a, b) => a + b, 0)
        return (
          <Card key={currency}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Total in {currency}</CardTitle>
                <span className="text-lg font-bold">{formatAmount(total, currency)}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(categories).map(([cat, amount]) => {
                const pct = Math.round((amount / total) * 100)
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">
                        {CATEGORY_LABEL[cat] ?? cat}
                      </span>
                      <span className="font-medium">
                        {formatAmount(amount, currency)}{' '}
                        <Badge variant="outline" className="text-xs ml-1">{pct}%</Badge>
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
