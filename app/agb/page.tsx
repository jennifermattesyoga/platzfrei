import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AgbPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Zurück
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Allgemeine Geschäftsbedingungen</h1>

      {/* TODO: AGB-Text hier einfügen */}
      <div className="prose prose-sm text-gray-700 space-y-4">
        <p>
          <strong>Platzhalter:</strong> Die Allgemeinen Geschäftsbedingungen werden hier eingefügt.
        </p>
        <p>
          Bitte wende dich an die Betreiberin, um die vollständigen AGB zu erhalten.
        </p>
      </div>
    </main>
  )
}
