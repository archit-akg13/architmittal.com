module.exports = {
  apps: [{
    name: 'architmittal-website',
    script: '.next/standalone/server.js',
    cwd: '/var/www/architmittal.com',
    env: {
      NODE_ENV: 'production',
      PORT: 3002,
      HOSTNAME: '0.0.0.0',
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '256M',
  }],
}
