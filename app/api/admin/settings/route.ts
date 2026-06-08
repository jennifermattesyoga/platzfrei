import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  const supabase = createServerClient()
  const { data } = await supabase.from('settings').select('key, value')
  const result = Object.fromEntries((data ?? []).map(({ key, value }: { key: string; value: string }) => [key, value]))
  return NextResponse.json(result)
}

export async function PATCH(request: NextRequest) {
  const isAdmin = await getAdminSession()
  if (!isAdmin) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })

  const { key, value } = await request.json()
  const supabase = createServerClient()

  const { error } = await supabase.from('settings').upsert({ key, value })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
