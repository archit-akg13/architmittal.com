import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'node:path'
import { DATA_DIR } from '@/lib/data-store'
import { notifyTelegram } from '@/lib/notify'

const CF_URL = process.env.CASHFREE_API_URL || 'https://api.cashfree.com/pg'
const CF_VER = process.env.CASHFREE_API_VERSION || '2023-08-01'
// Where the buyer books the slot after paying. Set to the cal.com event when it exists.
// Runtime-read var (NEXT_PUBLIC_* gets inlined at build time and was built empty once).
const SLOT_URL = process.env.CONSULT_CAL_URL || process.env.NEXT_PUBLIC_CONSULT_CAL_URL || ''

export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('order_id') ?? ''
  if (!/^CONSULT_[a-f0-9]+_[a-z0-9]+$/.test(orderId)) return NextResponse.json({ error: 'bad order id' }, { status: 400 })
  const id = process.env.CASHFREE_APP_ID, secret = process.env.CASHFREE_SECRET_KEY
  if (!id || !secret) return NextResponse.json({ error: 'not configured' }, { status: 503 })
  try {
    const res = await fetch(`${CF_URL}/orders/${encodeURIComponent(orderId)}`, {
      headers: { 'x-client-id': id, 'x-client-secret': secret, 'x-api-version': CF_VER },
    })
    const cf = await res.json()
    const paid = cf.order_status === 'PAID'
    if (paid) {
      const f = path.join(DATA_DIR, 'bookings.json')
      const all = JSON.parse(await fs.readFile(f, 'utf-8').catch(() => '[]'))
      const rec = all.find((b: { orderId: string }) => b.orderId === orderId)
      if (rec && rec.status !== 'paid') {
        rec.status = 'paid'
        rec.paidAt = new Date().toISOString()
        await fs.writeFile(f, JSON.stringify(all, null, 2))
        notifyTelegram(`💰 PAID CONSULTATION ₹2999\n${rec.name || ''} ${rec.email}\nOrder ${orderId}\n${SLOT_URL ? 'Cal link shown.' : 'NO CAL LINK SET — email them a slot!'}`)
      }
    }
    return NextResponse.json({ paid, status: cf.order_status ?? 'UNKNOWN', slotUrl: paid ? SLOT_URL : null, calConfigured: Boolean(SLOT_URL) })
  } catch (e) {
    console.error('[book/verify]', (e as Error).message)
    return NextResponse.json({ error: 'verify failed' }, { status: 500 })
  }
}
