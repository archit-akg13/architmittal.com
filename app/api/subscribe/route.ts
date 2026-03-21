import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { TELEGRAM_NOTIFY_URL } from '@/lib/constants'

const DATA_FILE = path.join(process.cwd(), 'data', 'subscribers.json')

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    let subscribers: Array<{ name: string; email: string; subscribedAt: string }> = []
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8')
      subscribers = JSON.parse(data)
    } catch {
      // file doesn't exist yet — start fresh
    }

    if (subscribers.some((s) => s.email === email)) {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 })
    }

    subscribers.push({ name, email, subscribedAt: new Date().toISOString() })
    await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2))

    // Telegram notification (fire and forget)
    fetch(TELEGRAM_NOTIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `📧 New subscriber!\nName: ${name}\nEmail: ${email}`,
      }),
    }).catch(() => {})

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
