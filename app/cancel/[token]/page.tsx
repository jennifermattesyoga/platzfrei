'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { use } from 'react'

export default function CancelPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleCancel() {
    setState('loading')
    try {
      const res = await fetch(`/api/bookings/cancel/${token}`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setState('success')
        setMessage('Deine Buchung wurde erfolgreich storniert.')
      } else {
        setState('error')
        setMessage(data.error ?? 'Fehler beim Stornieren.')
      }
    } catch {
      setState('error')
      setMessage('Verbindungsfehler. Bitte versuche es erneut.')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        {state === 'idle' && (
          <>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Buchung stornieren</h1>
            <p className="text-sm text-gray-500 mb-6">
              Bist du sicher, dass du deine Buchung stornieren möchtest?
            </p>
            <button
              onClick={handleCancel}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Ja, Buchung stornieren
            </button>
            <Link href="/" className="block mt-3 text-sm text-gray-500 hover:text-gray-900">
              Abbrechen
            </Link>
          </>
        )}

        {state === 'loading' && (
          <div className="py-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#D2A2FF] mx-auto" />
            <p className="mt-3 text-sm text-gray-500">Wird storniert...</p>
          </div>
        )}

        {state === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Storniert</h2>
            <p className="text-sm text-gray-500 mb-5">{message}</p>
            <Link href="/" className="text-sm text-[#0042C2] hover:underline">
              Zurück zur Terminübersicht
            </Link>
          </>
        )}

        {state === 'error' && (
          <>
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Fehler</h2>
            <p className="text-sm text-gray-500 mb-5">{message}</p>
            <Link href="/" className="text-sm text-[#0042C2] hover:underline">
              Zurück zur Terminübersicht
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
