import { NextResponse } from 'next/server'
import { getPublicContent } from '@/lib/content-server'

export const dynamic = 'force-dynamic'

/**
 * Public read of all live-site content. Uses the service role server-side so
 * the website always reflects what is in the database (no RLS/client JWT issues).
 */
export async function GET() {
  try {
    const payload = await getPublicContent()
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (err) {
    console.error('content API error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
