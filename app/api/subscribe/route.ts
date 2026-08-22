import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import { notifyTelegram } from '@/lib/notify'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { FIELD_LIMITS, MAX_SUBSCRIBERS, atCapacity, capped } from '@/lib/submission-guards'
import { DATA_DIR, SUBSCRIBERS_FILE } from '@/lib/data-store'

const DATA_FILE = SUBSCRIBERS_FILE

const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request)
    const limit = rateLimit(`subscribe:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)

    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }

    const body = await request.json()
    const email = body.email
    // /packs asks for email only; a missing name is recorded, not rejected.
    const name = body.name || 'packs'
    const source = typeof body.source === 'string' ? body.source.slice(0, 40) : 'site'

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    let subscribers: Array<{ name: string; email: string; source?: string; subscribedAt: string }> = []
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8')
      subscribers = JSON.parse(data)
    } catch {
      // file doesn't exist yet — start fresh
    }

    const cappedName = capped(name, FIELD_LIMITS.name)
    const cappedEmail = capped(email, FIELD_LIMITS.email)

    if (subscribers.some((s) => s.email === cappedEmail)) {
      // Already on the list is a success for the visitor — unlock, don't scold.
      return NextResponse.json({ success: true, message: 'Already on the list — unlocked.' })
    }

    if (atCapacity(subscribers, MAX_SUBSCRIBERS)) {
      console.error(
        `[subscribe] REFUSED: subscribers.json holds ${subscribers.length} records (cap ${MAX_SUBSCRIBERS}). ` +
          `New subscribers are being turned away — archive the file.`
      )
      return NextResponse.json(
        { error: 'We are unable to accept signups right now. Please try again later.' },
        { status: 503 }
      )
    }

    subscribers.push({
      name: cappedName,
      email: cappedEmail,
      source,
      subscribedAt: new Date().toISOString(),
    })
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2))

    // Telegram notification (fire and forget)
    notifyTelegram(`📧 New subscriber (${source})\nName: ${cappedName}\nEmail: ${cappedEmail}`)

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
