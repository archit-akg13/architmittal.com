const fs = require('fs')
const path = require('path')

/**
 * Reads KEY=VALUE pairs from an untracked secrets file.
 *
 * The Next.js standalone server does not load .env files (check
 * .next/standalone/server.js — there is no loadEnvConfig call), so anything the
 * server needs at runtime has to arrive through the pm2 env block. Secrets are
 * kept out of this committed file and read from .env.server instead, which is
 * gitignored and survives `git reset --hard` during deploys because it is
 * untracked.
 *
 * Create it on the VPS:
 *   printf 'NOTIFY_SECRET=%s\n' "$(openssl rand -hex 32)" > /var/www/architmittal.com/.env.server
 *   chmod 600 /var/www/architmittal.com/.env.server
 */
function readEnvFile(filePath) {
  const out = {}
  try {
    for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
      const [key, ...rest] = trimmed.split('=')
      out[key.trim()] = rest.join('=').trim()
    }
  } catch {
    // Missing file is not fatal — the app still boots, it just cannot notify.
  }
  return out
}

const secrets = readEnvFile(path.join(__dirname, '.env.server'))

module.exports = {
  apps: [{
    name: 'architmittal-website',
    script: '.next/standalone/server.js',
    cwd: '/var/www/architmittal.com',
    env: {
      NODE_ENV: 'production',
      PORT: 3002,
      HOSTNAME: '0.0.0.0',
      NOTIFY_SECRET: secrets.NOTIFY_SECRET || '',

      // Must be absolute and outside .next/. The standalone server chdir's to
      // its own directory, and `next build` overwrites .next/standalone/data/
      // from the repo copy — so a cwd-relative path silently lost every lead
      // on each deploy. See lib/data-store.ts.
      DATA_DIR: '/var/www/architmittal.com/data',
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '256M',
  }],
}
