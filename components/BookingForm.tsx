'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface BookingFormProps {
  eventId: string
  isFull: boolean
  isCancelled: boolean
}

export function BookingForm({ eventId, isFull, isCancelled }: BookingFormProps) {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '' })
  const [agb, setAgb] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error' | 'waitlist'; message: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!agb) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch(`/api/events/${eventId}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setResult({ type: 'error', message: data.error ?? 'Ein Fehler ist aufgetreten.' })
      } else if (data.isWaitlist) {
        setResult({ type: 'waitlist', message: 'Du wurdest auf die Warteliste gesetzt. Wir informieren dich, wenn ein Platz frei wird.' })
      } else {
        setResult({ type: 'success', message: 'Buchung erfolgreich! Eine Bestätigung wurde an deine E-Mail gesendet.' })
      }
    } catch {
      setResult({ type: 'error', message: 'Verbindungsfehler. Bitte versuche es erneut.' })
    } finally {
      setLoading(false)
    }
  }

  if (isCancelled) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-100 p-5 text-red-700 text-sm">
        Dieser Termin wurde leider abgesagt.
      </div>
    )
  }

  if (result?.type === 'success' || result?.type === 'waitlist') {
    return (
      <div className={`rounded-xl p-5 text-sm ${result.type === 'success' ? 'bg-green-50 border border-green-100 text-green-800' : 'bg-amber-50 border border-amber-100 text-amber-800'}`}>
        {result.message}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isFull && (
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-800">
          Dieser Termin ist ausgebucht. Du kannst dich auf die Warteliste eintragen.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vorname</label>
          <input
            required
            type="text"
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2A2FF] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nachname</label>
          <input
            required
            type="text"
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2A2FF] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail-Adresse</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2A2FF] focus:border-transparent"
          placeholder="deine@email.de"
        />
      </div>

      <div className="flex items-start gap-2.5">
        <input
          id="agb"
          type="checkbox"
          checked={agb}
          onChange={(e) => setAgb(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0042C2] focus:ring-[#D2A2FF]"
        />
        <label htmlFor="agb" className="text-sm text-gray-600">
          Ich habe die{' '}
          <a href="/agb" target="_blank" className="text-[#0042C2] underline underline-offset-2">
            Allgemeinen Geschäftsbedingungen
          </a>{' '}
          gelesen und akzeptiere sie.
        </label>
      </div>

      {result?.type === 'error' && (
        <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-700">
          {result.message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !agb}
        className="w-full bg-[#0042C2] hover:bg-[#0035a0] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isFull ? 'Auf Warteliste eintragen' : 'Jetzt buchen'}
      </button>
    </form>
  )
}
