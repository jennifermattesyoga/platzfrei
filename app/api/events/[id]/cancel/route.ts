import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getAdminSession } from '@/lib/auth'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { eventCancellationHtml, eventCancellationText } from '@/lib/emails/event-cancellation'

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await getAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })

  const { id } = await params
  const supabase = createServerClient()

  // Load event + all active bookings
  const { data: event } = await supabase.from('events').select('*').eq('id', id).single()
  if (!event) return NextResponse.json({ error: 'Termin nicht gefunden' }, { status: 404 })

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('event_id', id)
    .neq('status', 'cancelled')

  // Mark event as cancelled
  await supabase.from('events').update({ status: 'cancelled' }).eq('id', id)

  const resend = getResend()
  // Send cancellation emails to all participants (confirmed + waitlist)
  const emailPromises = (bookings ?? []).map((booking) =>
    resend.emails.send({
      from: FROM_EMAIL(),
      to: booking.email,
      subject: `Termin abgesagt: ${event.title}`,
      html: eventCancellationHtml({
        firstName: booking.first_name,
        lastName: booking.last_name,
        eventTitle: event.title,
        eventDate: event.start_date,
        isWaitlist: booking.status === 'waitlist',
      }),
      text: eventCancellationText({
        firstName: booking.first_name,
        lastName: booking.last_name,
        eventTitle: event.title,
        eventDate: event.start_date,
        isWaitlist: booking.status === 'waitlist',
      }),
    })
  )

  await Promise.allSettled(emailPromises)

  return NextResponse.json({ ok: true, notified: (bookings ?? []).length })
}
