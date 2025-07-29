#!/bin/bash

echo "🚀 Preparing Lynks Lawn Care website for GitHub Pages deployment..."

# Clean previous build
rm -rf dist/public
mkdir -p dist/public

# Build static version
echo "📦 Building static website..."
vite build --config vite.config.static.ts

# Create GitHub Pages configuration files
echo "⚙️ Creating GitHub Pages configuration..."

# CNAME for custom domain
echo "lynkslawncare.com" > dist/public/CNAME

# Prevent Jekyll processing
touch dist/public/.nojekyll

# Copy index.html to 404.html for client-side routing
cp dist/public/index.html dist/public/404.html

# Remove any development scripts from HTML
echo "🧹 Cleaning production files..."
sed -i 's|<script type="text/javascript" src="https://replit.com/public/js/replit-dev-banner.js"></script>||g' dist/public/index.html
sed -i 's|<script type="text/javascript" src="https://replit.com/public/js/replit-dev-banner.js"></script>||g' dist/public/404.html

echo "✅ Static build complete! Files ready for GitHub Pages:"
echo "📁 dist/public/"
echo "   ├── index.html (main page)"
echo "   ├── 404.html (fallback for routing)"
echo "   ├── CNAME (custom domain: lynkslawncare.com)"
echo "   ├── .nojekyll (prevents Jekyll processing)"
echo "   └── assets/ (optimized CSS, JS, images)"
echo ""
echo "🌐 Ready for deployment to: https://lynkslawncare.com"