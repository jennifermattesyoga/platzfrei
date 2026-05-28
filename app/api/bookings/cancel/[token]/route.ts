import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { bookingCancellationHtml, bookingCancellationText } from '@/lib/emails/booking-cancellation'
import { waitlistPromotionHtml, waitlistPromotionText } from '@/lib/emails/waitlist-promotion'

export async function POST(_: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = createServerClient()

  // Find booking by token
  const { data: booking } = await supabase
    .from('bookings')
    .select('*, events(*)')
    .eq('cancellation_token', token)
    .single()

  if (!booking) return NextResponse.json({ error: 'Buchung nicht gefunden' }, { status: 404 })
  if (booking.status === 'cancelled') {
    return NextResponse.json({ error: 'Diese Buchung wurde bereits storniert' }, { status: 400 })
  }

  const event = booking.events as { id: string; title: string; start_date: string; location: string | null; max_spots: number; status: string }

  // Cancel the booking
  await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', booking.id)

  const resend = getResend()
  // Send cancellation confirmation
  await resend.emails.send({
    from: FROM_EMAIL(),
    to: booking.email,
    subject: `Stornierungsbestätigung: ${event.title}`,
    html: bookingCancellationHtml({
      firstName: booking.first_name,
      lastName: booking.last_name,
      eventTitle: event.title,
      eventDate: event.start_date,
    }),
    text: bookingCancellationText({
      firstName: booking.first_name,
      lastName: booking.last_name,
      eventTitle: event.title,
      eventDate: event.start_date,
    }),
  })

  // If it was a confirmed booking, promote first waitlist entry
  if (booking.status === 'confirmed' && event.status === 'active') {
    const { data: waitlistEntry } = await supabase
      .from('bookings')
      .select('*')
      .eq('event_id', event.id)
      .eq('status', 'waitlist')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (waitlistEntry) {
      await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', waitlistEntry.id)

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
      const cancellationUrl = `${baseUrl}/cancel/${waitlistEntry.cancellation_token}`

      await resend.emails.send({
        from: FROM_EMAIL(),
        to: waitlistEntry.email,
        subject: `Platz frei: ${event.title}`,
        html: waitlistPromotionHtml({
          firstName: waitlistEntry.first_name,
          lastName: waitlistEntry.last_name,
          eventTitle: event.title,
          eventDate: event.start_date,
          eventLocation: event.location,
          cancellationUrl,
        }),
        text: waitlistPromotionText({
          firstName: waitlistEntry.first_name,
          lastName: waitlistEntry.last_name,
          eventTitle: event.title,
          eventDate: event.start_date,
          eventLocation: event.location,
          cancellationUrl,
        }),
      })
    }
  }

  return NextResponse.json({ ok: true })
}
