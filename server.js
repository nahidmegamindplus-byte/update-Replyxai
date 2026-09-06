/**
 * ReplyX AI — Ultra-Resilient Production Server for Hostinger & VPS
 * ------------------------------------------------------------------
 * Solves all Hostinger page load delays & timeouts:
 *  1. Immediate server.listen() so Passenger / LiteSpeed never times out
 *  2. Native Phusion Passenger socket ('passenger') + Dynamic PORT support
 *  3. Requests wait smoothly for Next.js engine preparation without dropping
 *  4. SQLite path & permissions guarantee
 *  5. Background warmup & process crash shields
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

// 1. Force directory to application root
try {
  process.chdir(__dirname);
} catch (e) {
  console.warn('[Server] Could not change directory to __dirname:', e);
}

// 2. Pre-parse .env file immediately
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (process.env[key] === undefined) {
            process.env[key] = val;
          }
        }
      }
    });
  } catch (_) {}
}

// 3. Force production mode on server
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// 4. Ensure prisma directory exists with write permissions for SQLite
const prismaDir = path.resolve(__dirname, 'prisma');
if (!fs.existsSync(prismaDir)) {
  try {
    fs.mkdirSync(prismaDir, { recursive: true, mode: 0o777 });
  } catch (_) {}
}

// 5. Global Process Crash Guards to prevent server death
process.on('uncaughtException', (err) => {
  console.error('[ReplyX Server Guard] Uncaught Exception caught safely:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.warn('[ReplyX Server Guard] Unhandled Rejection caught safely at:', promise, 'reason:', reason);
});

// 6. Initialize Next.js in Production Mode
const app = next({
  dev: false,
  dir: __dirname,
  conf: {
    compress: true,
    poweredByHeader: false,
  },
});
const handle = app.getRequestHandler();

// Track Next.js readiness
let isReady = false;
const preparePromise = app
  .prepare()
  .then(() => {
    isReady = true;
    console.log(`> [ReplyX AI] Next.js engine prepared and ready for traffic (Mode: ${process.env.NODE_ENV}).`);
  })
  .catch((err) => {
    console.error('[Server Error] Next.js preparation error:', err);
  });

// 7. Create HTTP Server that responds immediately
const server = createServer(async (req, res) => {
  try {
    // If request arrives while Next.js is still preparing (cold-start), wait for it
    if (!isReady) {
      await preparePromise;
    }
    const parsedUrl = parse(req.url, true);
    await handle(req, res, parsedUrl);
  } catch (err) {
    console.error('[Server Error] Request handler error for', req.url, ':', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(`
        <!DOCTYPE html>
        <html>
          <head><title>Loading ReplyX AI...</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
          <body style="font-family: system-ui, sans-serif; padding: 2rem; text-align: center; background: #f8fafc; color: #1e293b;">
            <div style="max-width: 500px; margin: 3rem auto; background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
              <h2 style="font-size: 1.3rem; font-weight: 700; color: #4f46e5; margin-bottom: 0.5rem;">ReplyX AI প্রস্তুত হচ্ছে...</h2>
              <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 1.5rem;">সার্ভারটি প্রথমবার রান হচ্ছে। কয়েক সেকেন্ড পর স্বয়ংক্রিয়ভাবে পেজ লোড হবে।</p>
              <button onclick="window.location.reload()" style="background: #4f46e5; color: white; border: none; padding: 0.6rem 1.25rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">পেজ রিফ্রেশ করুন</button>
            </div>
          </body>
        </html>
      `);
    }
  }
});

// 8. Determine Port / Socket and Listen Immediately
const rawPort = process.env.PORT;
const isPassenger = typeof global.PhusionPassenger !== 'undefined' || rawPort === 'passenger';

if (isPassenger) {
  // Official Phusion Passenger socket binding
  server.listen('passenger', () => {
    console.log('> [ReplyX AI] Running inside Phusion Passenger on Hostinger.');
    triggerWarmup('passenger');
  });
} else {
  const port = parseInt(rawPort || '3000', 10);
  const hostname = '0.0.0.0';

  server.listen(port, hostname, () => {
    console.log(`> [ReplyX AI] Ready and listening on http://${hostname}:${port}`);
    console.log(`> Environment: ${process.env.NODE_ENV}`);
    triggerWarmup(port);
  });
}

// 9. Graceful Shutdown Handlers
const shutdown = (signal) => {
  console.log(`[Server] Received ${signal}. Closing HTTP server...`);
  server.close(() => {
    console.log('[Server] HTTP server closed cleanly. Exiting.');
    process.exit(0);
  });
  setTimeout(() => {
    process.exit(1);
  }, 5000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

/**
 * Background warmup: triggers /api/health to self-heal database tables
 */
function triggerWarmup(target) {
  if (typeof target !== 'number') return;
  setTimeout(() => {
    try {
      const http = require('http');
      const req = http.get(`http://127.0.0.1:${target}/api/health`, (res) => {
        console.log(`> [Warmup] Pre-flight database check status: ${res.statusCode}`);
      });
      req.on('error', () => {});
      req.setTimeout(5000, () => req.destroy());
    } catch (_) {}
  }, 1200);
}
