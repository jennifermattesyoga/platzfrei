import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { EventForm } from '@/components/admin/EventForm'

export default function NewEventPage() {
  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Zurück
      </Link>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Neuen Termin erstellen</h1>
      <EventForm />
    </div>
  )
}
