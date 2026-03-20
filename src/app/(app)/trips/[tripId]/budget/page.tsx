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

// Fixed exchange rates → JPY (updated approx. March 2026)
const TO_JPY: Record<string, number> = {
  JPY: 1,
  VND: 0.006,
  USD: 150,
  EUR: 165,
  GBP: 190,
  KRW: 0.11,
  THB: 4.3,
  SGD: 112,
}

function toJPY(amount: number, currency: string): number {
  const rate = TO_JPY[currency.toUpperCase()] ?? 1
  return amount * rate
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

const CARD_STYLE = {
  background: '#13162a',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
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

  const byCurrency: Record<string, Record<string, number>> = {}
  for (const p of allPlaces) {
    if (!p.price) continue
    const cur = p.currency ?? 'JPY'
    if (!byCurrency[cur]) byCurrency[cur] = {}
    byCurrency[cur][p.category] = (byCurrency[cur][p.category] ?? 0) + p.price
  }

  const totalJPY = allPlaces.reduce((sum, p) => {
    if (!p.price) return sum
    return sum + toJPY(p.price, p.currency ?? 'JPY')
  }, 0)

  const currencies = Object.keys(byCurrency)
  const hasMultipleCurrencies = currencies.length > 1 || (currencies.length === 1 && currencies[0] !== 'JPY')

  if (allPlaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          💰
        </div>
        <div>
          <p className="text-white font-medium mb-1">No prices added yet</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Add prices to places to see your budget breakdown.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Grand total in JPY */}
      {hasMultipleCurrencies && (
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(225,29,72,0.15) 0%, rgba(225,29,72,0.08) 100%)',
            border: '1px solid rgba(225,29,72,0.25)',
          }}
        >
          <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Estimated Total (JPY)</p>
          <p className="text-3xl font-bold text-white">{formatAmount(Math.round(totalJPY), 'JPY')}</p>
          <p className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Converted at fixed rates &middot; for reference only
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-3 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)' }}>
            {Object.entries(TO_JPY)
              .filter(([cur]) => currencies.includes(cur) && cur !== 'JPY')
              .map(([cur, rate]) => (
                <span key={cur}>1 {cur} = ¥{rate}</span>
              ))}
          </div>
        </div>
      )}

      {Object.entries(byCurrency).map(([currency, categories]) => {
        const total = Object.values(categories).reduce((a, b) => a + b, 0)
        const categoryEntries = Object.entries(categories).sort((a, b) => b[1] - a[1])
        const topCategory = categoryEntries[0]

        return (
          <div key={currency} className="space-y-4">
            {/* Total summary card */}
            <div style={CARD_STYLE} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Total in {currency}
                  </p>
                  <p className="text-3xl font-bold text-white">{formatAmount(total, currency)}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {categoryEntries.length} categories
                  </p>
                </div>
                {/* SVG donut */}
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      fill="none"
                      stroke="#E11D48"
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
              <div
                className="flex gap-3 mt-4 pt-4 flex-wrap"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#E11D48' }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {CATEGORY_LABEL[topCategory[0]] ?? topCategory[0]}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {Math.round((topCategory[1] / total) * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Other</span>
                  <span className="text-xs font-semibold text-white">
                    {Math.round(((total - topCategory[1]) / total) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            <h3 className="text-sm font-semibold text-white px-1">Category Breakdown</h3>
            <div className="grid grid-cols-2 gap-3">
              {categoryEntries.map(([cat, amount]) => {
                const pct = Math.round((amount / total) * 100)
                return (
                  <div key={cat} style={CARD_STYLE} className="p-4">
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-2xl">{CATEGORY_EMOJI[cat] ?? '📍'}</span>
                      <span
                        className="text-sm font-semibold leading-tight"
                        style={{ color: 'rgba(255,255,255,0.85)' }}
                      >
                        {CATEGORY_LABEL[cat] ?? cat}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-white mb-2.5">
                      {formatAmount(amount, currency)}
                    </p>
                    <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: '#E11D48', opacity: cat === topCategory[0] ? 1 : 0.5 }}
                      />
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{pct}% of total</p>
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
