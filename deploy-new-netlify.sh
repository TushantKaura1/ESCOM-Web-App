#!/bin/bash

# New Netlify Project Deployment Script
echo "🚀 NEW NETLIFY PROJECT DEPLOYMENT SCRIPT"
echo "========================================"
echo ""

# Check if we're ready to deploy
echo "🔍 Checking deployment readiness..."

# Verify build script exists and is executable
if [ -f "./build.sh" ] && [ -x "./build.sh" ]; then
    echo "✅ Build script is ready"
else
    echo "❌ Build script not found or not executable"
    exit 1
fi

# Verify package.json has all dependencies
if grep -q "@vitejs/plugin-react" package.json; then
    echo "✅ React plugin dependency found"
else
    echo "❌ React plugin dependency missing"
    exit 1
fi

# Verify vite config exists
if [ -f "vite.config.js" ]; then
    echo "✅ Vite configuration found"
else
    echo "❌ Vite configuration missing"
    exit 1
fi

# Test build locally
echo ""
echo "🧪 Testing build locally..."
if ./build.sh; then
    echo "✅ Local build successful!"
else
    echo "❌ Local build failed!"
    exit 1
fi

echo ""
echo "🎯 DEPLOYMENT READY!"
echo "===================="
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://netlify.com"
echo "2. Click 'New site from Git'"
echo "3. Choose your GitHub repository"
echo "4. Set build command: ./build.sh"
echo "5. Set publish directory: dist"
echo "6. Click 'Deploy site'"
echo ""
echo "🔗 Your backend is already connected at:"
echo "   https://citiscience-backend-95pp.onrender.com"
echo ""
echo "🚀 Your new Netlify project will be live in minutes!"
echo ""
echo "📚 See NEW_NETLIFY_DEPLOYMENT.md for detailed instructions"
