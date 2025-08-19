#!/bin/bash

# Deployment Verification Script
echo "🔍 VERIFYING DEPLOYMENT READINESS"
echo "=================================="
echo ""

# Check if we're in the right directory
echo "📁 Current directory: $(pwd)"
echo "📁 Directory contents:"
ls -la | head -10
echo ""

# Verify package.json exists
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    echo "📦 Package name: $(grep '"name"' package.json | cut -d'"' -f4)"
    echo "📦 Package version: $(grep '"version"' package.json | cut -d'"' -f4)"
else
    echo "❌ package.json NOT found!"
    exit 1
fi

# Verify netlify.toml exists
if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml found"
    echo "🔧 Build command: $(grep 'command =' netlify.toml | cut -d'"' -f2)"
    echo "📁 Publish directory: $(grep 'publish =' netlify.toml | cut -d'"' -f2)"
else
    echo "❌ netlify.toml NOT found!"
    exit 1
fi

# Verify source files exist
echo ""
echo "🔍 Checking source files..."
if [ -d "src" ]; then
    echo "✅ src directory found"
    echo "📁 Source components:"
    ls src/components/ | head -5
else
    echo "❌ src directory NOT found!"
    exit 1
fi

# Clean install dependencies
echo ""
echo "📥 Installing dependencies..."
npm ci --prefer-offline --no-audit

# Verify Vite is available
echo ""
echo "🔍 Verifying Vite installation..."
if [ -f "./node_modules/.bin/vite" ]; then
    echo "✅ Vite found in node_modules/.bin/"
    export PATH="./node_modules/.bin:$PATH"
else
    echo "❌ Vite not found, installing..."
    npm install vite@^5.0.8 --save-dev
fi

# Build the project
echo ""
echo "🏗️ Building project..."
npm run build

# Verify build output
echo ""
echo "📁 Build output verification:"
ls -la dist/

# Check critical files
echo ""
echo "🔍 Checking critical files..."
if [ -f "dist/index.html" ]; then
    echo "✅ index.html exists"
    echo "📄 File size: $(du -h dist/index.html | cut -f1)"
else
    echo "❌ index.html missing!"
    exit 1
fi

if ls dist/assets/*.js 1> /dev/null 2>&1; then
    echo "✅ JavaScript bundles exist"
    echo "📄 JS files:"
    ls -la dist/assets/*.js
else
    echo "❌ JavaScript bundles missing!"
    exit 1
fi

if ls dist/assets/*.css 1> /dev/null 2>&1; then
    echo "✅ CSS bundles exist"
    echo "📄 CSS files:"
    ls -la dist/assets/*.css
else
    echo "❌ CSS bundles missing!"
    exit 1
fi

# Check if new features are in the build
echo ""
echo "🔍 Checking for new features in build..."
if grep -q "Enhanced Admin & User Features" dist/index.html; then
    echo "✅ New features detected in build"
else
    echo "⚠️ New features may not be in build"
fi

echo ""
echo "🎯 DEPLOYMENT VERIFICATION COMPLETE!"
echo "===================================="
echo ""
echo "📋 Next Steps for Netlify:"
echo "1. Go to your Netlify dashboard"
echo "2. Verify build settings:"
echo "   - Build command: npm ci && npm run build"
echo "   - Publish directory: dist"
echo "3. Trigger a new deploy with 'Clear cache and deploy site'"
echo "4. Monitor build logs for any errors"
echo ""
echo "🚀 Your enhanced frontend is ready for deployment!"
