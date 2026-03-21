const requests = new Map<string, { count: number; resetAt: number }>()

export function simpleRateLimit(
  userId: string,
  maxRequests: number,
  windowMs: number
): Response | null {
  const now = Date.now()
  const entry = requests.get(userId)

  if (!entry || now > entry.resetAt) {
    requests.set(userId, { count: 1, resetAt: now + windowMs })
    return null
  }

  if (entry.count >= maxRequests) {
    return Response.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  entry.count++
  return null
}

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of requests) {
    if (now > entry.resetAt) requests.delete(key)
  }
}, 5 * 60 * 1000)
