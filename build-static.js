#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building static version for GitHub Pages...');

// Run vite build with static config
execSync('vite build --config vite.config.static.ts', { stdio: 'inherit' });

// Create CNAME file for custom domain
fs.writeFileSync('dist/public/CNAME', 'lynkslawncare.com');

// Create .nojekyll file to prevent Jekyll processing
fs.writeFileSync('dist/public/.nojekyll', '');

// Create a simple fallback for client-side routing
const indexPath = 'dist/public/index.html';
const notFoundPath = 'dist/public/404.html';

if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
}

console.log('Static build complete! Ready for GitHub Pages deployment.');
console.log('Files created:');
console.log('- CNAME (for custom domain)');
console.log('- .nojekyll (to prevent Jekyll processing)');
console.log('- 404.html (for client-side routing)');