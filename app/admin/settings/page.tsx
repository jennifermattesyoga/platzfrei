import { createServerClient } from '@/lib/supabase/server'
import { SettingsEditor } from '@/components/admin/SettingsEditor'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = createServerClient()
  const { data } = await supabase.from('settings').select('key, value')
  const settings = Object.fromEntries(
    (data ?? []).map(({ key, value }: { key: string; value: string }) => [key, value])
  )

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-1">Texte</h1>
      <p className="text-sm text-gray-500 mb-6">AGB und Datenschutzerklärung bearbeiten</p>
      <SettingsEditor
        initialAgb={settings.agb ?? ''}
        initialDatenschutz={settings.datenschutz ?? ''}
      />
    </div>
  )
}
