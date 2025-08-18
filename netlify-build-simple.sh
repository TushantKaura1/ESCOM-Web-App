#!/bin/bash

# Simple Netlify Build Script
echo "🚀 Starting Netlify build process..."

# Set Node.js version
echo "📦 Using Node.js version:"
node --version
npm --version

# Install dependencies
echo "📥 Installing dependencies..."
npm ci --prefer-offline --no-audit

# Verify Vite is available
echo "🔍 Verifying Vite installation..."
if [ -f "./node_modules/.bin/vite" ]; then
    echo "✅ Vite found in node_modules/.bin/"
else
    echo "❌ Vite not found, installing..."
    npm install vite@^5.0.8 --save-dev
fi

# Build the project
echo "🏗️ Building project..."
npm run build

# Check build output
echo "📁 Build output:"
ls -la dist/

# Verify critical files
echo "🔍 Verifying critical files:"
if [ -f "dist/index.html" ]; then
    echo "✅ index.html exists"
else
    echo "❌ index.html missing!"
    exit 1
fi

if [ -f "dist/assets/index-*.js" ] || [ -f "dist/assets/index-*.js" ]; then
    echo "✅ Main JavaScript bundle exists"
else
    echo "❌ Main JavaScript bundle missing!"
    exit 1
fi

if [ -f "dist/assets/index-*.css" ]; then
    echo "✅ CSS bundle exists"
else
    echo "❌ CSS bundle missing!"
    exit 1
fi

echo "✅ Build process completed successfully!"
