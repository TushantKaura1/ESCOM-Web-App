#!/bin/bash

echo "🚀 Building for Netlify deployment..."

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "📦 Building project..."
    npm run build
else
    echo "✅ Using existing dist folder"
fi

# Verify dist folder contents
echo "📁 Dist folder contents:"
ls -la dist/

echo "✅ Build ready for Netlify!"
