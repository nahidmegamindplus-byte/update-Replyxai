const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const nextStaticDir = path.join(rootDir, '.next', 'static');
const publicDir = path.join(rootDir, 'public');
const underscoreNextStaticDir = path.join(rootDir, '_next', 'static');

console.log('[Assets] Synchronizing static assets for Hostinger layout guarantee...');

// 1. Copy directory recursively
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 2. Mirror .next/static into root _next/static for LiteSpeed Web Server
if (fs.existsSync(nextStaticDir)) {
  copyRecursive(nextStaticDir, underscoreNextStaticDir);
  console.log('[Assets] Static chunks mirrored to _next/static.');
}

// 3. Extract compiled Tailwind CSS into public/global.css as a fail-safe fallback
const cssDir = path.join(nextStaticDir, 'css');
if (fs.existsSync(cssDir)) {
  const cssFiles = fs.readdirSync(cssDir).filter((f) => f.endsWith('.css'));
  if (cssFiles.length > 0) {
    let combinedCss = '';
    for (const cssFile of cssFiles) {
      combinedCss += fs.readFileSync(path.join(cssDir, cssFile), 'utf8') + '\n';
    }
    const targetGlobalCss = path.join(publicDir, 'global.css');
    fs.writeFileSync(targetGlobalCss, combinedCss, 'utf8');
    const targetRootGlobalCss = path.join(rootDir, 'global.css');
    fs.writeFileSync(targetRootGlobalCss, combinedCss, 'utf8');
    console.log(`[Assets] Created public/global.css & root global.css (${Math.round(combinedCss.length / 1024)} KB) - 100% bulletproof stylesheet.`);
  }
}

// 4. Generate 100% self-contained Tailwind HTML landing page
try {
  require('./generate-html-home.js');
} catch (err) {
  console.warn('[Assets] Error generating HTML home:', err);
}

console.log('[Assets] Asset synchronization complete.');
