'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Users } from 'lucide-react'
import { formatDate, formatTime, formatPrice, cn } from '@/lib/utils'
import type { EventWithBookingCount } from '@/types'

interface EventCardProps {
  event: EventWithBookingCount
}

export function EventCard({ event }: EventCardProps) {
  const spotsLeft = event.max_spots - event.confirmed_count
  const isFull = spotsLeft <= 0
  const isCancelled = event.status === 'cancelled'

  return (
    <Link href={`/event/${event.id}`} className="block group">
      <div className={cn(
        'rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md',
        isCancelled && 'opacity-60'
      )}>
        {event.image_url && (
          <div className="relative h-44 w-full">
            <Image src={event.image_url} alt={event.title} fill className="object-cover" />
            {isCancelled && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">Abgesagt</span>
              </div>
            )}
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-[#0042C2] transition-colors leading-tight">
              {event.title}
            </h3>
            {event.price !== null && (
              <span className="text-sm font-semibold text-[#0042C2] whitespace-nowrap">
                {formatPrice(event.price)}
              </span>
            )}
          </div>

          <div className="mt-3 space-y-1.5 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#D2A2FF]" />
              <span>{formatDate(event.start_date)}, {formatTime(event.start_date)} Uhr</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#D2A2FF]" />
                <span>{event.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#D2A2FF]" />
              {isCancelled ? (
                <span className="text-red-500">Abgesagt</span>
              ) : isFull ? (
                <span className="text-amber-600">Ausgebucht — Warteliste möglich</span>
              ) : (
                <span>{spotsLeft} von {event.max_spots} Plätzen frei</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
