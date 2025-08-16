#!/bin/bash

echo "🚀 Deploying Citizen Science Frontend to Netlify..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Citizen Science Frontend"
fi

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found!"
    echo "Please add your GitHub repository as remote origin:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    exit 1
fi

# Build the frontend
echo "🔨 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Build frontend for production"
git push origin main

echo ""
echo "✅ Frontend code pushed to GitHub!"
echo ""
echo "🔧 Next steps:"
echo "1. Go to https://app.netlify.com"
echo "2. Click 'New site from Git'"
echo "3. Connect your GitHub repository"
echo "4. Set build settings:"
echo "   - Build command: npm run build"
echo "   - Publish directory: dist"
echo "5. Add environment variable:"
echo "   - BACKEND_URL: https://your-backend-name.onrender.com"
echo "6. Deploy!"
echo ""
echo "🌐 Your Mini App will be available at: https://citiscience.netlify.app"
echo "📱 Users can access it through your Telegram bot" 