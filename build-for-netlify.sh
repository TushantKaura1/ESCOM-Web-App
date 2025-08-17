#!/bin/bash

echo "🚀 Netlify Build Script - Using Pre-built Files"
echo "📁 Current directory: $(pwd)"
echo "📦 Checking for dist folder..."

if [ -d "dist" ]; then
    echo "✅ Dist folder found!"
    echo "📋 Dist folder contents:"
    ls -la dist/
    
    echo "📁 Assets folder contents:"
    ls -la dist/assets/
    
    echo "🔍 Checking critical files:"
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html exists"
    else
        echo "❌ index.html missing!"
        exit 1
    fi
    
    # Check for JavaScript bundle (more flexible pattern)
    echo "🔍 Looking for JavaScript bundle..."
    JS_FILES=$(find dist/assets -name "index-*.js" 2>/dev/null | head -1)
    if [ -n "$JS_FILES" ]; then
        echo "✅ Main JavaScript bundle exists: $(basename "$JS_FILES")"
        echo "   Full path: $JS_FILES"
    else
        echo "❌ Main JavaScript bundle missing!"
        echo "   Available JS files:"
        find dist/assets -name "*.js" 2>/dev/null || echo "   No JS files found"
        exit 1
    fi
    
    # Check for CSS bundle (more flexible pattern)
    echo "🔍 Looking for CSS bundle..."
    CSS_FILES=$(find dist/assets -name "index-*.css" 2>/dev/null | head -1)
    if [ -n "$CSS_FILES" ]; then
        echo "✅ CSS bundle exists: $(basename "$CSS_FILES")"
        echo "   Full path: $CSS_FILES"
    else
        echo "❌ CSS bundle missing!"
        echo "   Available CSS files:"
        find dist/assets -name "*.css" 2>/dev/null || echo "   No CSS files found"
        exit 1
    fi
    
    echo "🎉 All critical files present! Build successful!"
else
    echo "❌ Dist folder not found! Building now..."
    npm run build
fi
