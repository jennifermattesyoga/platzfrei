import Link from 'next/link'
import { Plus, Users, Calendar, XCircle } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { formatDate, formatTime, cn } from '@/lib/utils'
import type { EventWithBookingCount } from '@/types'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = createServerClient()

  const { data: events } = await supabase
    .from('events')
    .select('*, bookings(status)')
    .order('start_date', { ascending: false })

  const eventsWithCounts: EventWithBookingCount[] = (events ?? []).map((event) => {
    const bookings = event.bookings as { status: string }[] ?? []
    return {
      ...event,
      bookings: undefined,
      confirmed_count: bookings.filter((b) => b.status === 'confirmed').length,
      waitlist_count: bookings.filter((b) => b.status === 'waitlist').length,
    }
  })

  const upcoming = eventsWithCounts.filter((e) => new Date(e.start_date) >= new Date())
  const past = eventsWithCounts.filter((e) => new Date(e.start_date) < new Date())

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Termine</h1>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-1.5 bg-[#0042C2] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0035a0] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Neuer Termin
        </Link>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Kommende Termine</h2>
          <div className="space-y-2">
            {upcoming.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Vergangene Termine</h2>
          <div className="space-y-2 opacity-60">
            {past.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {eventsWithCounts.length === 0 && (
        <div className="text-center text-gray-400 py-16">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Noch keine Termine. Erstelle deinen ersten Termin!</p>
        </div>
      )}
    </div>
  )
}

function EventRow({ event }: { event: EventWithBookingCount }) {
  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-100 px-4 py-3 flex items-center justify-between gap-4',
      event.status === 'cancelled' && 'opacity-50'
    )}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900 truncate">{event.title}</p>
          {event.status === 'cancelled' && (
            <span className="flex items-center gap-1 text-xs text-red-500 shrink-0">
              <XCircle className="w-3.5 h-3.5" />
              Abgesagt
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-0.5">
          {formatDate(event.start_date)}, {formatTime(event.start_date)} Uhr
        </p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Users className="w-4 h-4 text-[#D2A2FF]" />
          <span>{event.confirmed_count}/{event.max_spots}</span>
          {event.waitlist_count > 0 && (
            <span className="text-amber-500">+{event.waitlist_count}</span>
          )}
        </div>
        <Link
          href={`/admin/events/${event.id}/edit`}
          className="text-sm text-[#0042C2] hover:underline"
        >
          Bearbeiten
        </Link>
        <Link
          href={`/admin/events/${event.id}/participants`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          Teilnehmer
        </Link>
      </div>
    </div>
  )
}
