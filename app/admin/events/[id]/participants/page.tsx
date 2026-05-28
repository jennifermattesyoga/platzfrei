import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { formatDateTime } from '@/lib/utils'
import type { Booking } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function ParticipantsPage({ params }: Props) {
  const { id } = await params
  const supabase = createServerClient()

  const { data: event } = await supabase.from('events').select('*').eq('id', id).single()
  if (!event) notFound()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('event_id', id)
    .neq('status', 'cancelled')
    .order('created_at', { ascending: true })

  const confirmed = (bookings ?? []).filter((b) => b.status === 'confirmed')
  const waitlist = (bookings ?? []).filter((b) => b.status === 'waitlist')

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Zurück
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{formatDateTime(event.start_date)}</p>
        </div>
        <a
          href={`/api/events/${id}/bookings/export`}
          className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          CSV
        </a>
      </div>

      <section className="mb-6">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Angemeldete Teilnehmer ({confirmed.length}/{event.max_spots})
        </h2>
        {confirmed.length === 0 ? (
          <p className="text-sm text-gray-400 py-3">Noch keine Buchungen.</p>
        ) : (
          <BookingTable bookings={confirmed} />
        )}
      </section>

      {waitlist.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-amber-600 uppercase tracking-wider mb-3">
            Warteliste ({waitlist.length})
          </h2>
          <BookingTable bookings={waitlist} />
        </section>
      )}
    </div>
  )
}

function BookingTable({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
            <th className="text-left px-4 py-2.5">#</th>
            <th className="text-left px-4 py-2.5">Name</th>
            <th className="text-left px-4 py-2.5">E-Mail</th>
            <th className="text-left px-4 py-2.5">Angemeldet</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, i) => (
            <tr key={b.id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3 text-gray-400">{i + 1}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{b.first_name} {b.last_name}</td>
              <td className="px-4 py-3 text-gray-600">
                <a href={`mailto:${b.email}`} className="hover:text-[#0042C2]">{b.email}</a>
              </td>
              <td className="px-4 py-3 text-gray-400 text-xs">{formatDateTime(b.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
