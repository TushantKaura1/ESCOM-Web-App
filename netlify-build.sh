#!/bin/bash

echo "🚀 Starting Netlify Build Process..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/
rm -rf node_modules/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the project
echo "🔨 Building project..."
npm run build

# Verify build output
echo "✅ Build completed. Checking dist folder:"
ls -la dist/

# Check for critical files
echo "🔍 Verifying critical files:"
if [ -f "dist/index.html" ]; then
    echo "✅ index.html exists"
else
    echo "❌ index.html missing!"
    exit 1
fi

if [ -f "dist/assets/index-DxtwNULl.js" ] || [ -f "dist/assets/index-*.js" ]; then
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

echo "🎉 Netlify build ready!"
echo "📁 Dist folder contents:"
find dist/ -type f -exec ls -la {} \;
