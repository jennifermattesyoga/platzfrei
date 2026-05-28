import Image from 'next/image'
import { createServerClient } from '@/lib/supabase/server'
import { EventCard } from '@/components/EventCard'
import type { EventWithBookingCount } from '@/types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createServerClient()

  const { data: events } = await supabase
    .from('events')
    .select('*, bookings(status)')
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })

  const eventsWithCounts: EventWithBookingCount[] = (events ?? []).map((event) => {
    const bookings = event.bookings as { status: string }[] ?? []
    return {
      ...event,
      bookings: undefined,
      confirmed_count: bookings.filter((b) => b.status === 'confirmed').length,
      waitlist_count: bookings.filter((b) => b.status === 'waitlist').length,
    }
  })

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <Image
          src="/jennifer-mattes_logo_final_jm_wortmarke_2.png"
          alt="platzfrei"
          width={160}
          height={60}
          className="object-contain"
          priority
        />
        <p className="mt-3 text-gray-500 text-sm text-center">Yoga Termine buchen</p>
      </div>

      {eventsWithCounts.length === 0 ? (
        <div className="text-center text-gray-400 py-16">
          <p className="text-lg">Aktuell keine Termine verfügbar.</p>
          <p className="text-sm mt-1">Schau bald wieder vorbei!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {eventsWithCounts.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  )
}
