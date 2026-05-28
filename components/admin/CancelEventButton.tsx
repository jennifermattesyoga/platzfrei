'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { XCircle, Loader2 } from 'lucide-react'

interface Props {
  eventId: string
  eventTitle: string
}

export function CancelEventButton({ eventId, eventTitle }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  async function handleCancel() {
    setLoading(true)
    const res = await fetch(`/api/events/${eventId}/cancel`, { method: 'POST' })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    }
    setLoading(false)
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 max-w-xs">
          Alle Teilnehmer werden per Email benachrichtigt.
        </span>
        <button
          onClick={handleCancel}
          disabled={loading}
          className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
          Bestätigen
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          Abbrechen
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
    >
      <XCircle className="w-4 h-4" />
      Termin absagen
    </button>
  )
}
