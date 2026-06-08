import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DatenschutzPage() {
  const supabase = createServerClient()
  const { data } = await supabase.from('settings').select('value').eq('key', 'datenschutz').single()
  const text = data?.value ?? ''

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Zurück
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Datenschutzerklärung</h1>

      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {text || (
          <p className="text-gray-400 italic">Die Datenschutzerklärung wurde noch nicht hinterlegt.</p>
        )}
      </div>
    </main>
  )
}
