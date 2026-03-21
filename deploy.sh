#!/bin/bash
set -e
cd /var/www/architmittal.com

echo "📦 Pulling latest code..."
git pull origin main

echo "📥 Installing dependencies..."
npm ci

echo "🔨 Building..."
npm run build

echo "📁 Copying static files..."
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

echo "📁 Ensuring data directory exists..."
mkdir -p data
[ -f data/subscribers.json ] || echo '[]' > data/subscribers.json
[ -f data/inquiries.json ] || echo '[]' > data/inquiries.json

echo "🔄 Restarting PM2..."
pm2 restart architmittal-website || pm2 start ecosystem.config.js

echo "✅ Deploy complete!"
