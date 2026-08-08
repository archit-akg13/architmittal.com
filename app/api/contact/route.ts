import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import { notifyTelegram } from '@/lib/notify'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { FIELD_LIMITS, MAX_INQUIRIES, atCapacity, capped } from '@/lib/submission-guards'
import { DATA_DIR, INQUIRIES_FILE } from '@/lib/data-store'

const DATA_FILE = INQUIRIES_FILE

const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request)
    const limit = rateLimit(`contact:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)

    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
      )
    }

    const body = await request.json()
    const { fullName, company, email, phone, automationNeeds, budget, source } = body

    if (!fullName || !company || !email || !automationNeeds) {
      return NextResponse.json({ error: 'Please fill all required fields' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    let inquiries: Array<Record<string, string>> = []
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8')
      inquiries = JSON.parse(data)
    } catch {
      // file doesn't exist yet
    }

    if (atCapacity(inquiries, MAX_INQUIRIES)) {
      // Loud, not silent: a full store means leads are being dropped.
      console.error(
        `[contact] REFUSED: inquiries.json holds ${inquiries.length} records (cap ${MAX_INQUIRIES}). ` +
          `New inquiries are being turned away — archive the file.`
      )
      return NextResponse.json(
        { error: 'We are unable to accept submissions right now. Please email instead.' },
        { status: 503 }
      )
    }

    // Cap every field so one request cannot write a megabyte into the file.
    const inquiry = {
      fullName: capped(fullName, FIELD_LIMITS.fullName),
      company: capped(company, FIELD_LIMITS.company),
      email: capped(email, FIELD_LIMITS.email),
      phone: capped(phone, FIELD_LIMITS.phone),
      automationNeeds: capped(automationNeeds, FIELD_LIMITS.automationNeeds),
      budget: capped(budget, FIELD_LIMITS.budget) || 'Not specified',
      source: capped(source, FIELD_LIMITS.source) || 'Not specified',
      submittedAt: new Date().toISOString(),
    }
    inquiries.push(inquiry)
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2))

    // Telegram notification (fire and forget)
    notifyTelegram(
      `🔔 New inquiry!\nName: ${inquiry.fullName}\nCompany: ${inquiry.company}\nEmail: ${inquiry.email}\nBudget: ${inquiry.budget}\nNeeds: ${inquiry.automationNeeds.substring(0, 200)}`
    )

    return NextResponse.json({
      success: true,
      message: "Thanks! I'll get back to you within 24 hours.",
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
