#!/bin/bash

# Netlify Build Script
# This script ensures proper dependency installation and build process

echo "🚀 Starting Netlify build process..."

# Set Node.js version
echo "📦 Setting Node.js version..."
nvm use 18 || echo "Node 18 not available, continuing..."

# Install dependencies
echo "📥 Installing dependencies..."
npm ci --prefer-offline --no-audit

# Verify vite is available
echo "🔍 Verifying Vite installation..."
if ! command -v vite &> /dev/null; then
    echo "❌ Vite not found in PATH, checking node_modules..."
    if [ -f "./node_modules/.bin/vite" ]; then
        echo "✅ Vite found in node_modules/.bin/"
        export PATH="./node_modules/.bin:$PATH"
    else
        echo "❌ Vite not found anywhere, installing..."
        npm install vite@^5.0.8 --save-dev
    fi
fi

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build process completed!"
