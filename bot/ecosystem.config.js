module.exports = {
  apps: [{
    name: 'archit-telegram-bot',
    script: 'bot.js',
    cwd: '/var/www/architmittal.com/bot',
    autorestart: true,
    max_memory_restart: '128M',
  }],
}
