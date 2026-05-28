import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getAdminSession } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createServerClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*, bookings(status)')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })

  const bookings = event.bookings as { status: string }[] ?? []
  return NextResponse.json({
    ...event,
    bookings: undefined,
    confirmed_count: bookings.filter((b) => b.status === 'confirmed').length,
    waitlist_count: bookings.filter((b) => b.status === 'waitlist').length,
  })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await getAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('events')
    .update({
      title: body.title,
      description: body.description,
      image_url: body.image_url,
      start_date: body.start_date,
      end_date: body.end_date,
      location: body.location,
      max_spots: body.max_spots,
      price: body.price,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await getAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })

  const { id } = await params
  const supabase = createServerClient()

  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
