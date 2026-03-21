import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { TELEGRAM_NOTIFY_URL } from '@/lib/constants'

const DATA_FILE = path.join(process.cwd(), 'data', 'inquiries.json')

export async function POST(request: NextRequest) {
  try {
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

    const inquiry = {
      fullName,
      company,
      email,
      phone: phone || '',
      automationNeeds,
      budget: budget || 'Not specified',
      source: source || 'Not specified',
      submittedAt: new Date().toISOString(),
    }
    inquiries.push(inquiry)
    await fs.writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2))

    // Telegram notification (fire and forget)
    fetch(TELEGRAM_NOTIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `🔔 New inquiry!\nName: ${fullName}\nCompany: ${company}\nEmail: ${email}\nBudget: ${budget || 'Not specified'}\nNeeds: ${automationNeeds.substring(0, 200)}`,
      }),
    }).catch(() => {})

    return NextResponse.json({
      success: true,
      message: "Thanks! I'll get back to you within 24 hours.",
    })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
