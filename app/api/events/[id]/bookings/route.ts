import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getAdminSession } from '@/lib/auth'
import { getResend, FROM_EMAIL, ADMIN_EMAIL } from '@/lib/resend'
import { bookingConfirmationHtml, bookingConfirmationText } from '@/lib/emails/booking-confirmation'
import { adminNotificationHtml, adminNotificationText } from '@/lib/emails/admin-notification'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await getAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })

  const { id } = await params
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('event_id', id)
    .neq('status', 'cancelled')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const supabase = createServerClient()

  // Load event
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*, bookings(status)')
    .eq('id', id)
    .single()

  if (eventError || !event) {
    return NextResponse.json({ error: 'Termin nicht gefunden' }, { status: 404 })
  }
  if (event.status === 'cancelled') {
    return NextResponse.json({ error: 'Dieser Termin wurde abgesagt' }, { status: 400 })
  }

  const bookings = event.bookings as { status: string }[] ?? []
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length
  const isWaitlist = confirmedCount >= event.max_spots

  // Check for duplicate booking
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('event_id', id)
    .eq('email', body.email)
    .neq('status', 'cancelled')
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Du bist für diesen Termin bereits angemeldet.' }, { status: 409 })
  }

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      event_id: id,
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      status: isWaitlist ? 'waitlist' : 'confirmed',
    })
    .select()
    .single()

  if (bookingError) return NextResponse.json({ error: bookingError.message }, { status: 500 })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const cancellationUrl = `${baseUrl}/cancel/${booking.cancellation_token}`

  const resend = getResend()
  // Send confirmation email
  await resend.emails.send({
    from: FROM_EMAIL(),
    to: body.email,
    subject: `Buchungsbestätigung: ${event.title}`,
    html: bookingConfirmationHtml({
      firstName: body.first_name,
      lastName: body.last_name,
      eventTitle: event.title,
      eventDate: event.start_date,
      eventLocation: event.location,
      cancellationUrl,
      price: event.price,
    }),
    text: bookingConfirmationText({
      firstName: body.first_name,
      lastName: body.last_name,
      eventTitle: event.title,
      eventDate: event.start_date,
      eventLocation: event.location,
      cancellationUrl,
      price: event.price,
    }),
  })

  // Notify admin
  await resend.emails.send({
    from: FROM_EMAIL(),
    to: ADMIN_EMAIL(),
    subject: `${isWaitlist ? '[Warteliste]' : '[Buchung]'} ${event.title}`,
    html: adminNotificationHtml({
      eventTitle: event.title,
      eventDate: event.start_date,
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      status: isWaitlist ? 'waitlist' : 'confirmed',
      confirmedCount: confirmedCount + (isWaitlist ? 0 : 1),
      maxSpots: event.max_spots,
    }),
    text: adminNotificationText({
      eventTitle: event.title,
      eventDate: event.start_date,
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      status: isWaitlist ? 'waitlist' : 'confirmed',
      confirmedCount: confirmedCount + (isWaitlist ? 0 : 1),
      maxSpots: event.max_spots,
    }),
  })

  return NextResponse.json({ booking, isWaitlist }, { status: 201 })
}
