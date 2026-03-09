import { createClient } from '@/lib/supabase/server'
import type { Place } from '@/types'

interface PageProps {
  params: Promise<{ tripId: string }>
}

const CATEGORY_EMOJI: Record<string, string> = {
  accommodation: '🏨',
  restaurant: '🍜',
  attraction: '🎡',
  transport: '🚇',
  other: '🛍',
}

const CATEGORY_LABEL: Record<string, string> = {
  accommodation: 'Accommodation',
  restaurant: 'Food & Drink',
  attraction: 'Activities',
  transport: 'Transport',
  other: 'Shopping',
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
      <div className="text-center py-16 text-[#717171] text-sm">
        <p className="text-3xl mb-3">💰</p>
        <p className="font-medium text-[#1A1A2E]">No prices added yet</p>
        <p className="mt-1">Add prices to places to see your budget breakdown.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.entries(byCurrency).map(([currency, categories]) => {
        const total = Object.values(categories).reduce((a, b) => a + b, 0)
        const categoryEntries = Object.entries(categories).sort((a, b) => b[1] - a[1])
        const topCategory = categoryEntries[0]

        return (
          <div key={currency} className="space-y-4">
            {/* Total summary card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#717171] mb-0.5">Total in {currency}</p>
                  <p className="text-3xl font-bold text-[#1A1A2E]">{formatAmount(total, currency)}</p>
                  <p className="text-xs text-[#717171] mt-1">{categoryEntries.length} categories</p>
                </div>
                {/* SVG donut showing top category vs rest */}
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#F3F4F6" strokeWidth="12" />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      fill="none"
                      stroke="#FF385C"
                      strokeWidth="12"
                      strokeDasharray={`${2 * Math.PI * 30 * (topCategory[1] / total)} ${2 * Math.PI * 30}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl">{CATEGORY_EMOJI[topCategory[0]] ?? '💰'}</span>
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF385C]" />
                  <span className="text-xs text-[#717171]">{CATEGORY_LABEL[topCategory[0]] ?? topCategory[0]}</span>
                  <span className="text-xs font-semibold text-[#1A1A2E]">
                    {Math.round((topCategory[1] / total) * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <span className="text-xs text-[#717171]">Other</span>
                  <span className="text-xs font-semibold text-[#1A1A2E]">
                    {Math.round(((total - topCategory[1]) / total) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Category breakdown grid */}
            <h3 className="text-sm font-semibold text-[#1A1A2E] px-1">Category Breakdown</h3>
            <div className="grid grid-cols-2 gap-3">
              {categoryEntries.map(([cat, amount]) => {
                const pct = Math.round((amount / total) * 100)
                const isHighest = cat === topCategory[0]
                return (
                  <div
                    key={cat}
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-2xl">{CATEGORY_EMOJI[cat] ?? '📍'}</span>
                      <span className="text-sm font-semibold text-[#1A1A2E] leading-tight">
                        {CATEGORY_LABEL[cat] ?? cat}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-[#1A1A2E] mb-2.5">
                      {formatAmount(amount, currency)}
                    </p>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1.5">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: isHighest ? '#FF385C' : '#FF385C',
                          opacity: isHighest ? 1 : 0.6,
                        }}
                      />
                    </div>
                    <p className="text-xs text-[#717171]">{pct}% of total</p>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
