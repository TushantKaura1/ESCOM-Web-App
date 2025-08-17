#!/bin/bash

echo "🚀 Netlify Build Script - Using Pre-built Files"
echo "📁 Current directory: $(pwd)"
echo "📦 Checking for dist folder..."

if [ -d "dist" ]; then
    echo "✅ Dist folder found!"
    echo "📋 Dist folder contents:"
    ls -la dist/
    
    echo "🔍 Checking critical files:"
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
    
    echo "🎉 All critical files present! Build successful!"
else
    echo "❌ Dist folder not found! Building now..."
    npm run build
fi
