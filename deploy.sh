#!/bin/bash
# ==============================================================================
# ReplyX AI — 100% Automated Deployment Script for Hostinger & Linux Servers
# ==============================================================================
# Usage in Hostinger SSH / Terminal / Git Webhook:
#   bash deploy.sh
# ==============================================================================

set -e

echo "🚀 [ReplyX AI] Starting Hostinger Deployment..."

# 1. Ensure Node.js and NPM are in PATH
export PATH=$PATH:/usr/local/bin:/usr/bin:~/.nvm/versions/node/$(node -v 2>/dev/null || echo "v20.0.0")/bin

# 2. Check or create .env file if missing
if [ ! -f ".env" ]; then
  echo "📝 [ReplyX AI] Creating default .env file..."
  cat <<EOT >> .env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="replyx_ai_super_secret_jwt_key_2026_bd_secure_hostinger"
ENCRYPTION_KEY="replyx_32_bytes_secret_key_2026!"
NODE_ENV="production"
PORT=3000
APP_URL="http://localhost:3000"
EOT
fi

# 3. Install Dependencies
echo "📦 [ReplyX AI] Installing NPM dependencies..."
npm install --production=false

# 4. Generate Prisma Client & Sync Database
echo "🗄️ [ReplyX AI] Preparing Prisma Client & Database..."
npx prisma generate
npx prisma db push --accept-data-loss || true

# 5. Build Next.js Production Bundle & Mirror Static Assets
echo "🏗️ [ReplyX AI] Building Next.js application..."
npm run build

# 6. Ensure permissions for SQLite & static assets
mkdir -p prisma public _next/static tmp
chmod -R 755 .
chmod -R 777 prisma || true
if [ -f "prisma/dev.db" ]; then
  chmod 666 prisma/dev.db || true
fi

# 7. Restart Application (for Phusion Passenger or PM2)
if command -v pm2 &> /dev/null; then
  echo "🔄 [ReplyX AI] Reloading PM2 process..."
  pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js || true
fi

touch tmp/restart.txt 2>/dev/null || true

echo "✅ [ReplyX AI] Hostinger deployment completed successfully!"
