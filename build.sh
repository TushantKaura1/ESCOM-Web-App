#!/bin/bash

# Bulletproof Build Script for Netlify
set -e

echo "🚀 Starting bulletproof build process..."

# Show environment info
echo "📦 Node version: $(node --version)"
echo "📦 NPM version: $(npm --version)"
echo "📦 Current directory: $(pwd)"
echo "📦 Directory contents:"
ls -la

# Clean install dependencies
echo "📥 Installing dependencies..."
npm install --force

# Verify Vite is available
echo "🔍 Verifying Vite installation..."
if [ -f "./node_modules/.bin/vite" ]; then
    echo "✅ Vite found in node_modules/.bin/"
    export PATH="./node_modules/.bin:$PATH"
else
    echo "❌ Vite not found, installing explicitly..."
    npm install vite@^5.0.8 --save
    export PATH="./node_modules/.bin:$PATH"
fi

# Double-check Vite is available
echo "🔍 Final Vite check..."
if command -v vite &> /dev/null; then
    echo "✅ Vite is available in PATH"
    vite --version
else
    echo "❌ Vite still not available, using npx..."
    npx vite --version
fi

# Build the project
echo "🏗️ Building project..."
npm run build

# Verify build output
echo "📁 Build output verification:"
ls -la dist/

# Check critical files
echo "🔍 Checking critical files..."
if [ -f "dist/index.html" ]; then
    echo "✅ index.html exists"
else
    echo "❌ index.html missing!"
    exit 1
fi

if ls dist/assets/*.js 1> /dev/null 2>&1; then
    echo "✅ JavaScript bundles exist"
else
    echo "❌ JavaScript bundles missing!"
    exit 1
fi

if ls dist/assets/*.css 1> /dev/null 2>&1; then
    echo "✅ CSS bundles exist"
else
    echo "❌ CSS bundles missing!"
    exit 1
fi

echo "✅ Bulletproof build completed successfully!"
echo "🚀 Your app is ready for deployment!"
