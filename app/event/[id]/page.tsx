import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { BookingForm } from '@/components/BookingForm'
import { formatDate, formatTime, formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EventPage({ params }: Props) {
  const { id } = await params
  const supabase = createServerClient()

  const { data: event } = await supabase
    .from('events')
    .select('*, bookings(status)')
    .eq('id', id)
    .single()

  if (!event) notFound()

  const bookings = event.bookings as { status: string }[] ?? []
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length
  const spotsLeft = event.max_spots - confirmedCount
  const isFull = spotsLeft <= 0

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Alle Termine
      </Link>

      {event.image_url && (
        <div className="relative h-56 rounded-2xl overflow-hidden mb-6">
          <Image src={event.image_url} alt={event.title} fill className="object-cover" />
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D2A2FF] shrink-0" />
            <span>{formatDate(event.start_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D2A2FF] shrink-0" />
            <span>
              {formatTime(event.start_date)} Uhr
              {event.end_date && ` – ${formatTime(event.end_date)} Uhr`}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D2A2FF] shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#D2A2FF] shrink-0" />
            {event.status === 'cancelled' ? (
              <span className="text-red-500">Abgesagt</span>
            ) : isFull ? (
              <span className="text-amber-600">Ausgebucht — Warteliste möglich</span>
            ) : (
              <span>{spotsLeft} von {event.max_spots} Plätzen frei</span>
            )}
          </div>
          {event.price !== null && (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 text-[#D2A2FF] shrink-0 font-bold text-xs flex items-center justify-center">€</span>
              <span className="font-semibold text-gray-900">{formatPrice(event.price)}</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="mt-5 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{event.description}</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">
          {isFull ? 'Auf Warteliste eintragen' : 'Platz reservieren'}
        </h2>
        <BookingForm eventId={event.id} isFull={isFull} isCancelled={event.status === 'cancelled'} />
      </div>
    </main>
  )
}
