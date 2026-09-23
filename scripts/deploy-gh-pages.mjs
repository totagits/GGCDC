import { execSync } from 'node:child_process';
import { copyFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

console.log('==> Building static bundle for GitHub Pages...');
execSync('npx vite build --config vite.pages.config.ts', { stdio: 'inherit' });

console.log('==> Prepping SPA fallback and .nojekyll...');
copyFileSync('dist-pages/index.html', 'dist-pages/404.html');
writeFileSync('dist-pages/.nojekyll', '');
if (existsSync('public/favicon.svg')) {
  copyFileSync('public/favicon.svg', 'dist-pages/favicon.svg');
}

console.log('==> Pushing to origin gh-pages...');
execSync('git -C dist-pages init -b gh-pages', { stdio: 'inherit' });
execSync('git -C dist-pages add .', { stdio: 'inherit' });
const timestamp = new Date().toISOString();
try {
  execSync(`git -C dist-pages commit --allow-empty -m "Deploy GGCDC static platform: ${timestamp}"`, { stdio: 'inherit' });
} catch (e) {
  console.log('Commit note:', e.message);
}

try {
  execSync('git -C dist-pages remote add origin https://github.com/totagits/GGCDC.git', { stdio: 'pipe' });
} catch {
  // Remote might already exist
}

execSync('git -C dist-pages push -f origin gh-pages', { stdio: 'inherit' });
console.log('==> Successfully deployed to gh-pages! Access at: https://totagits.github.io/GGCDC/');
