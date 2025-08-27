#!/bin/bash

echo "🚀 Deploying Frontend to Netlify..."
echo "📧 Using email: efop77392@gmail.com"
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
    echo "✅ Netlify CLI installed"
else
    echo "✅ Netlify CLI found"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi

echo "✅ Build completed successfully!"

# Login to Netlify
echo "🔐 Logging into Netlify..."
netlify login

# Initialize Netlify (if not already done)
if [ ! -f ".netlify/state.json" ]; then
    echo "🚀 Initializing Netlify project..."
    netlify init
fi

# Deploy to production
echo "📦 Deploying to Netlify production..."
netlify deploy --prod --dir=dist

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Frontend deployed successfully to Netlify!"
    echo "🌐 Your app is now live!"
    echo "📧 Login to Netlify with: efop77392@gmail.com"
    echo ""
    echo "🔧 Next steps:"
    echo "1. Go to https://app.netlify.com"
    echo "2. Login with efop77392@gmail.com"
    echo "3. Connect your GitHub repository for auto-deploy"
    echo "4. Set environment variables if needed"
    echo "5. Configure custom domain (optional)"
    echo ""
    echo "🚀 Frontend will auto-deploy when you push to GitHub!"
else
    echo "❌ Deployment failed! Please check the errors above."
    exit 1
fi
