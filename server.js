/**
 * ReplyX AI — Production Server Entry Point for Hostinger, VPS, and CloudLinux/Passenger
 * --------------------------------------------------------------------------------------
 * Supports:
 *  - Hostinger Cloud / Shared Web Hosting (hPanel Node.js Application Manager / Phusion Passenger)
 *  - Hostinger VPS (Ubuntu/Debian with PM2, Nginx, or Docker)
 *  - Dynamic PORT assignment (including Unix sockets, named pipes, and numeric ports)
 *  - Automatic SQLite path guarantee & permissions
 *  - Port fallback on EADDRINUSE
 *  - Background database warmup & graceful shutdown
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

// 1. Force current working directory to application root
try {
  process.chdir(__dirname);
} catch (e) {
  console.warn('[Server] Could not change directory to __dirname:', e);
}

// 2. Load .env file manually if present so process.env.PORT and other vars are immediately accessible
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

// 3. Ensure NODE_ENV defaults to production on Hostinger unless explicitly set to development
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// 4. Ensure prisma directory exists and has write permissions for SQLite
const prismaDir = path.resolve(__dirname, 'prisma');
if (!fs.existsSync(prismaDir)) {
  try {
    fs.mkdirSync(prismaDir, { recursive: true, mode: 0o777 });
  } catch (e) {
    console.warn('[Server] Could not create prisma dir:', e);
  }
}

// 5. Configure Next.js instance
const dev = process.env.NODE_ENV === 'development';
const app = next({
  dev,
  dir: __dirname,
  conf: {
    compress: true,
    poweredByHeader: false,
  },
});
const handle = app.getRequestHandler();

// 6. Resolve Dynamic Port or Socket
let rawPort = process.env.PORT || '3000';
const isNumericPort = !isNaN(Number(rawPort)) && typeof rawPort === 'string' && !rawPort.startsWith('/');
let port = isNumericPort ? parseInt(rawPort, 10) : rawPort;
const hostname = '0.0.0.0';

// 7. Global Process Crash Guards to prevent server death
process.on('uncaughtException', (err) => {
  console.error('[ReplyX Server Guard] Uncaught Exception caught safely:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.warn('[ReplyX Server Guard] Unhandled Rejection caught safely at:', promise, 'reason:', reason);
});

console.log(`[Server] Preparing ReplyX AI Next.js application (Mode: ${process.env.NODE_ENV})...`);

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('[Server Error] Error handling request to', req.url, ':', err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(`
            <!DOCTYPE html>
            <html>
              <head><title>Server Error</title><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
              <body style="font-family: system-ui, sans-serif; padding: 2rem; text-align: center; background: #f8fafc; color: #1e293b;">
                <div style="max-width: 500px; margin: 3rem auto; background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
                  <h1 style="font-size: 1.5rem; font-weight: 700; color: #ef4444; margin-bottom: 0.5rem;">সাময়িক সার্ভার লোডিং ত্রুটি</h1>
                  <p style="color: #64748b; font-size: 0.95rem; margin-bottom: 1.5rem;">সার্ভারটি শুরু হচ্ছে অথবা অনুরোধ প্রক্রিয়াকরণে সমস্যা হয়েছে। অনুগ্রহ করে কয়েক সেকেন্ড পর পেজটি রিফ্রেশ করুন।</p>
                  <button onclick="window.location.reload()" style="background: #4f46e5; color: white; border: none; padding: 0.6rem 1.25rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">পেজ রিফ্রেশ করুন</button>
                </div>
              </body>
            </html>
          `);
        }
      }
    });

    // 8. Port Resilience & Error Handling
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && typeof port === 'number' && !process.env.STRICT_PORT) {
        console.warn(`[Server] Port ${port} is busy. Trying fallback port ${port + 1}...`);
        port = port + 1;
        setTimeout(() => startListening(port), 400);
      } else {
        console.error('[Fatal Server Socket Error]', err);
        process.exit(1);
      }
    });

    // 9. Listen on Port or Socket
    function startListening(targetPort) {
      if (typeof targetPort === 'number') {
        server.listen(targetPort, hostname, () => {
          console.log(`> [ReplyX AI] Ready and listening on http://${hostname}:${targetPort}`);
          console.log(`> Environment: ${process.env.NODE_ENV}`);
          triggerWarmup(targetPort);
        });
      } else {
        // Unix Socket / Phusion Passenger pipe
        server.listen(targetPort, () => {
          console.log(`> [ReplyX AI] Ready and listening on socket: ${targetPort}`);
          console.log(`> Environment: ${process.env.NODE_ENV}`);
        });
      }
    }

    startListening(port);

    // 10. Graceful Shutdown Handlers
    const shutdown = (signal) => {
      console.log(`[Server] Received ${signal}. Gracefully closing HTTP server...`);
      server.close(() => {
        console.log('[Server] HTTP server closed cleanly. Exiting.');
        process.exit(0);
      });
      setTimeout(() => {
        console.error('[Server] Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 8000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  })
  .catch((err) => {
    console.error('[Fatal Error] Failed to prepare Next.js app:', err);
    process.exit(1);
  });

/**
 * Perform a fast internal GET request to /api/health to self-heal
 * and warm up database tables before real traffic hits the application.
 */
function triggerWarmup(targetPort) {
  setTimeout(() => {
    try {
      const http = require('http');
      const req = http.get(`http://127.0.0.1:${targetPort}/api/health`, (res) => {
        console.log(`> [Warmup] Pre-flight database check status: ${res.statusCode}`);
      });
      req.on('error', () => {
        // Safe to ignore if self-healing runs on demand
      });
      req.setTimeout(5000, () => req.destroy());
    } catch (_) {}
  }, 1000);
}
