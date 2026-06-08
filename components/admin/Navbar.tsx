'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export function AdminNavbar() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <Link href="/admin" className="flex items-center gap-2">
        <Image src="/jennifer-mattes_logo.png" alt="platzfrei" width={28} height={28} className="rounded" />
        <span className="font-semibold text-gray-900">platzfrei Admin</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/admin/settings" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          Texte
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Abmelden
        </button>
      </div>
    </nav>
  )
}
