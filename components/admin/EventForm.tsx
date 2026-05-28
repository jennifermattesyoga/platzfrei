'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2, Upload, X } from 'lucide-react'
import type { Event } from '@/types'

interface EventFormProps {
  event?: Event
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toLocalDatetime = (iso: string) => iso.slice(0, 16)

  const [form, setForm] = useState({
    title: event?.title ?? '',
    description: event?.description ?? '',
    image_url: event?.image_url ?? '',
    start_date: event?.start_date ? toLocalDatetime(event.start_date) : '',
    end_date: event?.end_date ? toLocalDatetime(event.end_date) : '',
    location: event?.location ?? '',
    max_spots: event?.max_spots ?? 10,
    price: event?.price ?? '',
  })

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)

    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)

    if (res.ok) {
      setForm((f) => ({ ...f, image_url: data.url }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const body = {
      ...form,
      price: form.price !== '' ? Number(form.price) : null,
      end_date: form.end_date || null,
      image_url: form.image_url || null,
    }

    const url = event ? `/api/events/${event.id}` : '/api/events'
    const method = event ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Fehler beim Speichern')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Titel *</label>
        <input
          required
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2A2FF]"
          placeholder="z.B. Yin Yoga Abend"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2A2FF]"
          placeholder="Beschreibe den Termin..."
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beginn *</label>
          <input
            required
            type="datetime-local"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2A2FF]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ende</label>
          <input
            type="datetime-local"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2A2FF]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ort</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2A2FF]"
            placeholder="z.B. Yogastudio Mitte"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max. Plätze *</label>
          <input
            required
            type="number"
            min={1}
            value={form.max_spots}
            onChange={(e) => setForm({ ...form, max_spots: Number(e.target.value) })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2A2FF]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preis (€)</label>
        <input
          type="number"
          min={0}
          step="0.01"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2A2FF]"
          placeholder="z.B. 18.00"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Foto</label>
        {form.image_url ? (
          <div className="relative">
            <div className="relative h-40 rounded-xl overflow-hidden">
              <Image src={form.image_url} alt="Event" fill className="object-cover" />
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, image_url: '' })}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-[#D2A2FF] transition-colors">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            ) : (
              <>
                <Upload className="w-5 h-5 text-gray-400 mb-1" />
                <span className="text-sm text-gray-500">Foto hochladen</span>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
          </label>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="flex-1 border border-gray-200 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#0042C2] text-white font-semibold py-2.5 rounded-xl hover:bg-[#0035a0] disabled:opacity-50 transition-colors text-sm flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {event ? 'Speichern' : 'Termin erstellen'}
        </button>
      </div>
    </form>
  )
}
