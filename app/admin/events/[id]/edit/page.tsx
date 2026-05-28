import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { EventForm } from '@/components/admin/EventForm'
import { CancelEventButton } from '@/components/admin/CancelEventButton'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params
  const supabase = createServerClient()

  const { data: event } = await supabase.from('events').select('*').eq('id', id).single()
  if (!event) notFound()

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Zurück
      </Link>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Termin bearbeiten</h1>
        {event.status === 'active' && <CancelEventButton eventId={event.id} eventTitle={event.title} />}
      </div>
      <EventForm event={event} />
    </div>
  )
}
