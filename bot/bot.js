require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const { exec, execFile } = require('child_process')
const fs = require('fs')
const http = require('http')
const path = require('path')
const crypto = require('crypto')
const { parseAllowedChatIds, createAuthorizer } = require('./auth')

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
const CHAT_ID = process.env.TELEGRAM_CHAT_ID
const SITE_DIR = process.env.SITE_DIR || '/var/www/architmittal.com'
const PORT = parseInt(process.env.NOTIFICATION_PORT || '3003')

// ---------------------------------------------------------------------------
// Authorization
//
// Every handler below exposes something sensitive: /leads and /subscribers
// disclose personal data, /deploy and EXECUTE_TASK run commands on the VPS.
// Telegram lets anyone who knows the bot's @name start a chat with it, so
// without this check the entire surface is open to the public internet.
//
// Fails closed: if no allowlist is configured the bot refuses everything.
// ---------------------------------------------------------------------------
const ALLOWED_CHAT_IDS = parseAllowedChatIds(
  process.env.TELEGRAM_ALLOWED_CHAT_IDS || process.env.TELEGRAM_CHAT_ID
)

const AUTH_LOG = process.env.BOT_AUTH_LOG || path.join(__dirname, 'auth-rejections.log')

const { authorized } = createAuthorizer({
  allowedChatIds: ALLOWED_CHAT_IDS,
  logPath: AUTH_LOG,
})

/**
 * Matches /name and /name@BotName at the start of a message.
 * The original patterns were unanchored, so any message merely containing
 * "/deploy" anywhere in its text triggered a deploy.
 */
function command(name) {
  return new RegExp(`^\\/${name}(?:@\\w+)?(?:\\s|$)`)
}

/** Wraps a handler so it only runs for allowlisted chats. */
function guard(name, handler) {
  return (msg, ...rest) => {
    if (!authorized(msg, name)) return
    return handler(msg, ...rest)
  }
}

if (ALLOWED_CHAT_IDS.length === 0) {
  console.warn(
    '⚠️  TELEGRAM_ALLOWED_CHAT_IDS is not set — the bot will refuse every command.\n' +
      '    Set it in bot/.env (see .env.example) and restart.'
  )
} else {
  console.log(`🔒 Authorized chat IDs: ${ALLOWED_CHAT_IDS.length}`)
}

// /status command
bot.onText(command('status'), guard('status', (msg) => {
  exec('pm2 jlist', (err, stdout) => {
    if (err) return bot.sendMessage(msg.chat.id, '❌ Error getting status')
    try {
      const processes = JSON.parse(stdout)
      const site = processes.find(p => p.name === 'architmittal-website')
      if (site) {
        const uptime = Math.floor((Date.now() - site.pm2_env.pm_uptime) / 1000 / 60)
        bot.sendMessage(msg.chat.id,
          `📊 Status:\n• ${site.name}: ${site.pm2_env.status}\n• Uptime: ${uptime} min\n• Restarts: ${site.pm2_env.restart_time}\n• Memory: ${Math.round(site.monit.memory / 1024 / 1024)}MB`)
      } else {
        bot.sendMessage(msg.chat.id, '⚠️ architmittal-website not found in PM2')
      }
    } catch (e) {
      bot.sendMessage(msg.chat.id, '❌ Error parsing PM2 output')
    }
  })
}))

// /deploy command
bot.onText(command('deploy'), guard('deploy', (msg) => {
  bot.sendMessage(msg.chat.id, '🚀 Starting deploy...')
  runTask('deploy', msg)
}))

// /logs command
bot.onText(command('logs'), guard('logs', (msg) => {
  exec('pm2 logs architmittal-website --lines 20 --nostream 2>&1', (err, stdout) => {
    const logs = (stdout || 'No logs available').slice(-3000)
    bot.sendMessage(msg.chat.id, `📋 Recent logs:\n\`\`\`\n${logs}\n\`\`\``, { parse_mode: 'Markdown' })
  })
}))

// /health command
bot.onText(command('health'), guard('health', async (msg) => {
  try {
    const start = Date.now()
    const res = await fetch('https://architmittal.com')
    const ms = Date.now() - start
    bot.sendMessage(msg.chat.id, `🏥 Health: ${res.status === 200 ? '✅ UP' : '⚠️ ' + res.status}\n• Response: ${ms}ms`)
  } catch (e) {
    bot.sendMessage(msg.chat.id, `🏥 Health: ❌ DOWN\n• Error: ${e.message}`)
  }
}))

// /leads command — discloses personal data (names, companies, emails)
bot.onText(command('leads'), guard('leads', (msg) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(SITE_DIR, 'data/inquiries.json'), 'utf-8'))
    if (data.length === 0) return bot.sendMessage(msg.chat.id, '📭 No inquiries yet')
    const recent = data.slice(-5).reverse()
    const text = recent.map(i => `• ${i.fullName} (${i.company}) — ${i.budget}\n  ${i.email}`).join('\n')
    bot.sendMessage(msg.chat.id, `📋 Inquiries (${data.length} total):\n${text}`)
  } catch (e) {
    bot.sendMessage(msg.chat.id, '📭 No inquiries file found')
  }
}))

// /subscribers command — discloses personal data (names, emails)
bot.onText(command('subscribers'), guard('subscribers', (msg) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(SITE_DIR, 'data/subscribers.json'), 'utf-8'))
    if (data.length === 0) return bot.sendMessage(msg.chat.id, '📧 No subscribers yet')
    const recent = data.slice(-3).reverse()
    const text = recent.map(s => `• ${s.name} — ${s.email}`).join('\n')
    bot.sendMessage(msg.chat.id, `📧 Subscribers: ${data.length} total\nRecent:\n${text}`)
  } catch (e) {
    bot.sendMessage(msg.chat.id, '📧 No subscribers file found')
  }
}))

// ---------------------------------------------------------------------------
// Tasks
//
// Fixed allowlist. The task name selects an entry; nothing from the message is
// ever interpolated into a command. execFile (not exec) means no shell is
// involved at all, so there is no metacharacter to escape.
//
// The previous version matched with `task.includes('deploy')` on a free-form
// string, so "please deploy" and "deploy; anything" both ran the deploy.
// ---------------------------------------------------------------------------
const TASKS = {
  deploy: { file: 'bash', args: ['deploy.sh'], cwd: SITE_DIR },
}

function runTask(name, msg) {
  const task = Object.prototype.hasOwnProperty.call(TASKS, name) ? TASKS[name] : null
  if (!task) {
    bot.sendMessage(msg.chat.id, `⚠️ Unknown task. Supported: ${Object.keys(TASKS).join(', ')}`)
    return
  }

  execFile(
    task.file,
    task.args,
    { cwd: task.cwd, maxBuffer: 1024 * 1024, timeout: 300000 },
    (err, stdout) => {
      if (err) {
        bot.sendMessage(msg.chat.id, `❌ Task failed:\n${(stdout || err.message).slice(-500)}`)
      } else {
        bot.sendMessage(msg.chat.id, `✅ Task complete!\n${stdout.slice(-300)}`)
      }
    }
  )
}

// EXECUTE_TASK handler (from Cowork)
bot.on('message', (msg) => {
  if (!msg.text || !msg.text.startsWith('EXECUTE_TASK:')) return
  if (!authorized(msg, 'EXECUTE_TASK')) return

  // Only the first bare word is read, and only to look up a key in TASKS.
  const name = msg.text.slice('EXECUTE_TASK:'.length).trim().split(/\s+/)[0].toLowerCase()

  if (!Object.prototype.hasOwnProperty.call(TASKS, name)) {
    bot.sendMessage(msg.chat.id, `⚠️ Unknown task. Supported: ${Object.keys(TASKS).join(', ')}`)
    return
  }

  bot.sendMessage(msg.chat.id, `📝 Running task: ${name}\n⏳ Processing...`)
  runTask(name, msg)
})

// ---------------------------------------------------------------------------
// Notification HTTP server
//
// Bound to 127.0.0.1, but that only keeps out the public internet — any process
// on the box could previously POST here and send arbitrary Telegram messages as
// Archit. The shared secret makes the caller prove it is the website.
//
// Fails closed: without NOTIFY_SECRET set, /notify refuses everything.
// ---------------------------------------------------------------------------
const NOTIFY_SECRET = process.env.NOTIFY_SECRET || ''

/** Constant-time comparison, so a wrong secret leaks nothing via response timing. */
function secretMatches(provided) {
  if (!NOTIFY_SECRET || typeof provided !== 'string') return false
  const a = Buffer.from(provided)
  const b = Buffer.from(NOTIFY_SECRET)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/notify') {
    if (!secretMatches(req.headers['x-notify-secret'])) {
      console.warn(`[notify] refused request from ${req.socket.remoteAddress}`)
      res.writeHead(401, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'unauthorized' }))
      return
    }

    let body = ''
    req.on('data', chunk => {
      body += chunk
      if (body.length > 16384) req.destroy() // bound the buffer
    })
    req.on('end', () => {
      try {
        const { message } = JSON.parse(body)
        if (!message) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'message field required' }))
          return
        }
        bot.sendMessage(CHAT_ID, message)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: true }))
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }
    })
  } else {
    res.writeHead(404)
    res.end('Not found')
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🔔 Notification server listening on 127.0.0.1:${PORT}`)
  if (!NOTIFY_SECRET) {
    console.warn(
      '⚠️  NOTIFY_SECRET is not set — /notify will refuse every request, so you will\n' +
        '    stop receiving new-lead and new-subscriber alerts. Leads are still saved\n' +
        '    to data/inquiries.json. Set NOTIFY_SECRET in bot/.env and in the site env.'
    )
  }
})

console.log('🤖 @ArchitBrandMachineBot is running...')
