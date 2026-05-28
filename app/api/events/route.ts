import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const supabase = createServerClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('*, bookings(status)')
    .order('start_date', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const eventsWithCounts = events.map((event) => {
    const bookings = event.bookings as { status: string }[] ?? []
    return {
      ...event,
      bookings: undefined,
      confirmed_count: bookings.filter((b) => b.status === 'confirmed').length,
      waitlist_count: bookings.filter((b) => b.status === 'waitlist').length,
    }
  })

  return NextResponse.json(eventsWithCounts)
}

export async function POST(request: NextRequest) {
  const isAdmin = await getAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })

  const body = await request.json()
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('events')
    .insert({
      title: body.title,
      description: body.description,
      image_url: body.image_url,
      start_date: body.start_date,
      end_date: body.end_date,
      location: body.location,
      max_spots: body.max_spots,
      price: body.price,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
