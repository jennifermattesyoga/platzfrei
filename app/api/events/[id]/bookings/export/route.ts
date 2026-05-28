import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getAdminSession } from '@/lib/auth'
import { formatDateTime } from '@/lib/utils'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const isAdmin = await getAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })

  const { id } = await params
  const supabase = createServerClient()

  const { data: event } = await supabase.from('events').select('title, start_date').eq('id', id).single()
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('event_id', id)
    .neq('status', 'cancelled')
    .order('created_at', { ascending: true })

  const rows = [
    ['Nr.', 'Status', 'Vorname', 'Nachname', 'E-Mail', 'Angemeldet am'],
    ...(bookings ?? []).map((b, i) => [
      String(i + 1),
      b.status === 'waitlist' ? 'Warteliste' : 'Bestätigt',
      b.first_name,
      b.last_name,
      b.email,
      formatDateTime(b.created_at),
    ]),
  ]

  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
  const filename = `${event?.title ?? 'Termin'} - Teilnehmerliste.csv`

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
    },
  })
}
