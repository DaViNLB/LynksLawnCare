#!/usr/bin/env node

// Simplified GitHub Pages build script
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Building Lynks Lawn Care for GitHub Pages...');

try {
  // Clean previous build
  if (fs.existsSync('dist/public')) {
    fs.rmSync('dist/public', { recursive: true, force: true });
  }

  // Build static frontend only
  console.log('📦 Building frontend...');
  execSync('npx vite build --config ./vite.config.static.ts', { 
    stdio: 'inherit'
  });

  // Create GitHub Pages files
  console.log('⚙️ Configuring for GitHub Pages...');
  
  fs.writeFileSync('dist/public/CNAME', 'lynkslawncare.com');
  fs.writeFileSync('dist/public/.nojekyll', '');
  fs.copyFileSync('dist/public/index.html', 'dist/public/404.html');

  console.log('✅ Build complete! Ready for GitHub Pages deployment.');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}