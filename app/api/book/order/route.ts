import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import fs from 'fs/promises'
import path from 'node:path'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { SITE_URL } from '@/lib/constants'

// Paid 1:1 consultation — single product, fixed price. Pattern lifted from the proven
// own_indicator_project gateway (same Cashfree merchant, architmittal.com whitelisted).
const AMOUNT_INR = 2999
const CF_URL = process.env.CASHFREE_API_URL || 'https://api.cashfree.com/pg'
const CF_VER = process.env.CASHFREE_API_VERSION || '2023-08-01'

export async function POST(request: NextRequest) {
  try {
    const limit = rateLimit(`book:${clientIp(request)}`, 8, 60 * 60 * 1000)
    if (!limit.allowed) return NextResponse.json({ error: 'Too many attempts — try again later.' }, { status: 429 })

    const { name, email, phone, src } = await request.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
    const id = process.env.CASHFREE_APP_ID, secret = process.env.CASHFREE_SECRET_KEY
    if (!id || !secret) return NextResponse.json({ error: 'Payments not configured yet.' }, { status: 503 })

    const orderId = `CONSULT_${crypto.randomBytes(6).toString('hex')}_${Date.now().toString(36)}`
    const ph = String(phone ?? '').replace(/\D/g, '').slice(-10)
    const res = await fetch(`${CF_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-client-id': id, 'x-client-secret': secret, 'x-api-version': CF_VER },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: AMOUNT_INR,
        order_currency: 'INR',
        customer_details: {
          customer_id: crypto.createHash('sha1').update(String(email)).digest('hex').slice(0, 24),
          customer_email: email,
          customer_name: String(name || email.split('@')[0]).slice(0, 100),
          customer_phone: /^[6-9]\d{9}$/.test(ph) ? ph : '9999999999',
        },
        order_meta: { return_url: `${SITE_URL}/book/confirm?order_id=${orderId}` },
        order_note: '1:1 automation consultation (45 min) — credited against done-for-you projects',
        order_tags: { src: 'architmittal.com/book' },
      }),
    })
    const cf = await res.json()
    if (!res.ok || !cf.payment_session_id) {
      console.error('[book/order] cashfree error:', JSON.stringify(cf).slice(0, 300))
      return NextResponse.json({ error: cf.message || 'Could not start the payment.' }, { status: 502 })
    }
    const dir = path.join(process.cwd(), 'data')
    await fs.mkdir(dir, { recursive: true })
    const f = path.join(dir, 'bookings.json')
    const all = JSON.parse(await fs.readFile(f, 'utf-8').catch(() => '[]'))
    all.push({ orderId, name, email, phone: ph, amount: AMOUNT_INR, src: String(src || 'direct').slice(0, 60), status: 'created', createdAt: new Date().toISOString() })
    await fs.writeFile(f, JSON.stringify(all, null, 2))
    return NextResponse.json({ orderId, paymentSessionId: cf.payment_session_id, mode: 'production' })
  } catch (e) {
    console.error('[book/order]', (e as Error).message)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
