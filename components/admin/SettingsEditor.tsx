'use client'

import { useState } from 'react'
import { Loader2, Check } from 'lucide-react'

interface SettingsEditorProps {
  initialAgb: string
  initialDatenschutz: string
}

export function SettingsEditor({ initialAgb, initialDatenschutz }: SettingsEditorProps) {
  const [agb, setAgb] = useState(initialAgb)
  const [datenschutz, setDatenschutz] = useState(initialDatenschutz)
  const [saving, setSaving] = useState<'agb' | 'datenschutz' | null>(null)
  const [saved, setSaved] = useState<'agb' | 'datenschutz' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function save(key: 'agb' | 'datenschutz', value: string) {
    setSaving(key)
    setError(null)
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    })
    setSaving(null)
    if (res.ok) {
      setSaved(key)
      setTimeout(() => setSaved(null), 2500)
    } else {
      const data = await res.json()
      setError(data.error ?? 'Fehler beim Speichern')
    }
  }

  return (
    <div className="space-y-10 max-w-2xl">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-700">{error}</div>
      )}

      <Section
        title="AGB"
        hint="Wird unter /agb angezeigt und von der Buchungsseite verlinkt."
        value={agb}
        onChange={setAgb}
        onSave={() => save('agb', agb)}
        saving={saving === 'agb'}
        saved={saved === 'agb'}
        placeholder="AGB-Text eingeben..."
      />

      <Section
        title="Datenschutzerklärung"
        hint="Wird unter /datenschutz angezeigt und von der Buchungsseite verlinkt."
        value={datenschutz}
        onChange={setDatenschutz}
        onSave={() => save('datenschutz', datenschutz)}
        saving={saving === 'datenschutz'}
        saved={saved === 'datenschutz'}
        placeholder="Datenschutztext eingeben..."
      />
    </div>
  )
}

function Section({
  title, hint, value, onChange, onSave, saving, saved, placeholder,
}: {
  title: string
  hint: string
  value: string
  onChange: (v: string) => void
  onSave: () => void
  saving: boolean
  saved: boolean
  placeholder: string
}) {
  return (
    <div>
      <div className="flex items-start justify-between mb-2 gap-4">
        <div>
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="shrink-0 inline-flex items-center gap-1.5 bg-[#0042C2] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0035a0] disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4" />
          ) : null}
          {saved ? 'Gespeichert' : 'Speichern'}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={18}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2A2FF] font-mono leading-relaxed"
        placeholder={placeholder}
      />
    </div>
  )
}
