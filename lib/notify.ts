import { TELEGRAM_NOTIFY_URL } from './constants'

/**
 * Sends a Telegram notification via the bot's local listener.
 *
 * SERVER ONLY — this reads NOTIFY_SECRET. Never import it from a client
 * component. It deliberately does not live in lib/constants.ts, which is
 * imported by client components and therefore ships to the browser.
 *
 * Fire and forget: a notification failure must never fail the request that
 * triggered it, because the lead itself has already been persisted.
 */
export function notifyTelegram(message: string): void {
  const secret = process.env.NOTIFY_SECRET

  if (!secret) {
    // Loud, because losing lead notifications silently is worse than the noise.
    console.warn('[notify] NOTIFY_SECRET is not set — Telegram notification skipped')
    return
  }

  fetch(TELEGRAM_NOTIFY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-notify-secret': secret,
    },
    body: JSON.stringify({ message }),
  }).catch(() => {})
}
