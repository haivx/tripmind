import { redirect } from 'next/navigation'

// /trips redirects to /dashboard (trips are managed from there)
export default function TripsPage() {
  redirect('/dashboard')
}
