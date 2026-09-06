const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const nextStaticDir = path.join(rootDir, '.next', 'static');
const publicDir = path.join(rootDir, 'public');
const underscoreNextStaticDir = path.join(rootDir, '_next', 'static');

console.log('[Assets] Synchronizing static assets for Hostinger layout guarantee...');

// 1. Safe Directory Copy (with symlink removal & error protection)
function safeCopyDir(src, dest) {
  try {
    if (!fs.existsSync(src)) return;

    // If dest is a broken symlink or file, remove it cleanly
    try {
      const stat = fs.lstatSync(dest);
      if (stat.isSymbolicLink() || !stat.isDirectory()) {
        fs.unlinkSync(dest);
      }
    } catch (_) {}

    if (fs.cpSync) {
      fs.cpSync(src, dest, { recursive: true, force: true, dereference: true });
    } else {
      fs.mkdirSync(dest, { recursive: true });
      const entries = fs.readdirSync(src, { withFileTypes: true });
      for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
          safeCopyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
  } catch (err) {
    console.warn('[Assets Warning] Directory copy notice:', err.message);
  }
}

// 2. Mirror .next/static into _next/static safely
try {
  if (fs.existsSync(nextStaticDir)) {
    // Ensure parent _next exists
    const parentDir = path.join(rootDir, '_next');
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    safeCopyDir(nextStaticDir, underscoreNextStaticDir);
    console.log('[Assets] Static chunks mirrored to _next/static.');
  }
} catch (err) {
  console.warn('[Assets Warning] Mirroring notice:', err.message);
}

// 3. Extract compiled Tailwind CSS into public/global.css & root global.css
try {
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
} catch (err) {
  console.warn('[Assets Warning] CSS extraction notice:', err.message);
}

console.log('[Assets] Asset synchronization complete.');
