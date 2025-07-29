#!/usr/bin/env node

// Backup build script for GitHub Actions in case shell script fails
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building Lynks Lawn Care website for GitHub Pages...');

try {
  // Clean previous build
  console.log('🧹 Cleaning previous build...');
  if (fs.existsSync('dist/public')) {
    fs.rmSync('dist/public', { recursive: true, force: true });
  }
  fs.mkdirSync('dist/public', { recursive: true });

  // Build with Vite
  console.log('📦 Building static website...');
  execSync('vite build --config vite.config.static.ts', { stdio: 'inherit' });

  // Create GitHub Pages configuration files
  console.log('⚙️ Creating GitHub Pages configuration...');
  
  // CNAME for custom domain
  fs.writeFileSync('dist/public/CNAME', 'lynkslawncare.com');
  
  // Prevent Jekyll processing
  fs.writeFileSync('dist/public/.nojekyll', '');
  
  // Copy index.html to 404.html for client-side routing
  fs.copyFileSync('dist/public/index.html', 'dist/public/404.html');

  console.log('✅ Static build complete! Files ready for GitHub Pages.');
  console.log('🌐 Ready for deployment to: https://lynkslawncare.com');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}