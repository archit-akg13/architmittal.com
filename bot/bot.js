require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const { exec } = require('child_process')
const fs = require('fs')
const http = require('http')
const path = require('path')

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
const CHAT_ID = process.env.TELEGRAM_CHAT_ID
const SITE_DIR = process.env.SITE_DIR || '/var/www/architmittal.com'
const PORT = parseInt(process.env.NOTIFICATION_PORT || '3003')

// /status command
bot.onText(/\/status/, (msg) => {
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
})

// /deploy command
bot.onText(/\/deploy/, (msg) => {
  bot.sendMessage(msg.chat.id, '🚀 Starting deploy...')
  exec(`cd ${SITE_DIR} && bash deploy.sh 2>&1`, { maxBuffer: 1024 * 1024, timeout: 300000 }, (err, stdout) => {
    if (err) {
      bot.sendMessage(msg.chat.id, `❌ Deploy failed:\n${(stdout || err.message).slice(-500)}`)
    } else {
      bot.sendMessage(msg.chat.id, `✅ Deploy complete!\n${stdout.slice(-300)}`)
    }
  })
})

// /logs command
bot.onText(/\/logs/, (msg) => {
  exec('pm2 logs architmittal-website --lines 20 --nostream 2>&1', (err, stdout) => {
    const logs = (stdout || 'No logs available').slice(-3000)
    bot.sendMessage(msg.chat.id, `📋 Recent logs:\n\`\`\`\n${logs}\n\`\`\``, { parse_mode: 'Markdown' })
  })
})

// /health command
bot.onText(/\/health/, async (msg) => {
  try {
    const start = Date.now()
    const res = await fetch('https://architmittal.com')
    const ms = Date.now() - start
    bot.sendMessage(msg.chat.id, `🏥 Health: ${res.status === 200 ? '✅ UP' : '⚠️ ' + res.status}\n• Response: ${ms}ms`)
  } catch (e) {
    bot.sendMessage(msg.chat.id, `🏥 Health: ❌ DOWN\n• Error: ${e.message}`)
  }
})

// /leads command
bot.onText(/\/leads/, (msg) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(SITE_DIR, 'data/inquiries.json'), 'utf-8'))
    if (data.length === 0) return bot.sendMessage(msg.chat.id, '📭 No inquiries yet')
    const recent = data.slice(-5).reverse()
    const text = recent.map(i => `• ${i.fullName} (${i.company}) — ${i.budget}\n  ${i.email}`).join('\n')
    bot.sendMessage(msg.chat.id, `📋 Inquiries (${data.length} total):\n${text}`)
  } catch (e) {
    bot.sendMessage(msg.chat.id, '📭 No inquiries file found')
  }
})

// /subscribers command
bot.onText(/\/subscribers/, (msg) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(SITE_DIR, 'data/subscribers.json'), 'utf-8'))
    if (data.length === 0) return bot.sendMessage(msg.chat.id, '📧 No subscribers yet')
    const recent = data.slice(-3).reverse()
    const text = recent.map(s => `• ${s.name} — ${s.email}`).join('\n')
    bot.sendMessage(msg.chat.id, `📧 Subscribers: ${data.length} total\nRecent:\n${text}`)
  } catch (e) {
    bot.sendMessage(msg.chat.id, '📧 No subscribers file found')
  }
})

// EXECUTE_TASK handler (from Cowork)
bot.on('message', (msg) => {
  if (msg.text && msg.text.startsWith('EXECUTE_TASK:')) {
    const task = msg.text.replace('EXECUTE_TASK:', '').trim()
    bot.sendMessage(msg.chat.id, `📝 Received task: ${task}\n⏳ Processing...`)

    if (task.toLowerCase().includes('deploy')) {
      exec(`cd ${SITE_DIR} && bash deploy.sh 2>&1`, { maxBuffer: 1024 * 1024, timeout: 300000 }, (err, stdout) => {
        if (err) {
          bot.sendMessage(msg.chat.id, `❌ Task failed:\n${(stdout || err.message).slice(-500)}`)
        } else {
          bot.sendMessage(msg.chat.id, `✅ Task complete!\n${stdout.slice(-300)}`)
        }
      })
    } else {
      bot.sendMessage(msg.chat.id, `⚠️ Unknown task type. Supported: deploy`)
    }
  }
})

// Notification HTTP server
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/notify') {
    let body = ''
    req.on('data', chunk => body += chunk)
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
})

console.log('🤖 @ArchitBrandMachineBot is running...')
