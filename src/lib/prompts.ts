import type { Trip, Place } from '@/types'

export function getChatSystemPrompt(trip: Trip, places: Place[]): string {
  const today = new Date().toISOString().split('T')[0]
  const daysUntil = Math.ceil(
    (new Date(trip.start_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  const placesSummary =
    places.length === 0
      ? 'No places added yet.'
      : places
          .map((p) => {
            const parts = [`- ${p.name} (${p.category})`]
            if (p.visit_date) parts[0] += ` on ${p.visit_date}`
            if (p.booked) parts[0] += ' [booked]'
            if (p.notes) parts.push(`  Notes: ${p.notes}`)
            return parts.join('\n')
          })
          .join('\n')

  return `You are a helpful travel planning assistant for a trip to ${trip.destination}.

Trip: "${trip.title}"
Dates: ${trip.start_date} to ${trip.end_date} (${daysUntil > 0 ? `${daysUntil} days away` : 'trip is ongoing or past'})
Today: ${today}
${trip.description ? `Description: ${trip.description}` : ''}

Places saved for this trip:
${placesSummary}

Help the user plan their trip. Be concise and practical. When suggesting places or activities, consider the saved places above to avoid duplicates. Format lists with bullet points.

You have access to Google Maps tools for searching places, getting directions, and looking up place details. Use maps_search_places when the user asks for recommendations. Use maps_directions when they ask how to get somewhere. Use maps_place_details to get opening hours, reviews, or contact info. These tools work when connected — if unavailable, rely on your built-in knowledge.`
}

export function getItinerarySuggestionPrompt(trip: Trip, places: Place[]): string {
  const placesList = places
    .map((p) => `- ${p.name} (${p.category}${p.visit_date ? `, already on ${p.visit_date}` : ''})`)
    .join('\n')

  return `You are a travel itinerary planner.

Trip: "${trip.title}" to ${trip.destination}
Dates: ${trip.start_date} to ${trip.end_date}

Places to schedule:
${placesList || 'No places yet.'}

Create a day-by-day itinerary. Respond ONLY with a valid JSON array (no markdown, no explanation):
[
  {
    "date": "YYYY-MM-DD",
    "title": "Day title",
    "places": ["Place Name 1", "Place Name 2"]
  }
]

Rules:
- Only include dates between ${trip.start_date} and ${trip.end_date}
- Group nearby places on the same day for efficiency
- Places already dated should stay on their assigned date
- Return ONLY the JSON array`
}

export function getParseEmailPrompt(emailContent: string): string {
  return `Extract booking information from this travel confirmation email. Respond ONLY with a valid JSON object (no markdown, no explanation):
{
  "name": "Place or business name",
  "category": "accommodation" | "restaurant" | "attraction" | "transport" | "other",
  "address": "full address or null",
  "visit_date": "YYYY-MM-DD or null",
  "visit_time": "HH:MM or null",
  "booking_ref": "confirmation/booking reference code or null",
  "price": number or null,
  "currency": "3-letter currency code or JPY",
  "notes": "any other relevant info or null"
}

Email content:
${emailContent.slice(0, 4000)}`
}

export function getAlertsPrompt(trip: Trip, places: Place[]): string {
  const today = new Date().toISOString().split('T')[0]
  const placesSummary = places.map((p) => ({
    name: p.name,
    category: p.category,
    booked: p.booked,
    visit_date: p.visit_date,
  }))

  return `Analyze this trip for potential issues. Respond ONLY with a valid JSON array:
[
  {
    "type": "unbooked_hotel" | "missing_date" | "missing_transport" | "custom",
    "message": "Short, actionable alert message (max 100 chars)"
  }
]

Trip: ${trip.destination}, ${trip.start_date} to ${trip.end_date}
Today: ${today}
Places: ${JSON.stringify(placesSummary)}

Check for:
1. Accommodation not booked (type: unbooked_hotel)
2. Places with no visit_date set (type: missing_date)
3. No transport added (type: missing_transport)

Return empty array [] if no issues. Max 5 alerts.`
}
