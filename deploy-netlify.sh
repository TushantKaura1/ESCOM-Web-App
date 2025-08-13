#!/bin/bash

echo "🚀 Deploying ESCOM Citizen Scientist App to Netlify..."

# Build the frontend
echo "📦 Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Netlify
    echo "🌐 Deploying to Netlify..."
    netlify deploy --prod --dir=dist
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "🌐 Your app is live at: https://citisci.netlify.app/"
        echo ""
        echo "⚠️  IMPORTANT: You still need to deploy your backend!"
        echo "📖 Follow the guide in NETLIFY_DEPLOYMENT_GUIDE.md"
        echo ""
        echo "🔑 Admin Login: admin@escom.com / admin123"
    else
        echo "❌ Netlify deployment failed!"
        echo "💡 Make sure you're logged in to Netlify CLI"
    fi
else
    echo "❌ Build failed!"
    echo "💡 Check for errors in the build output"
fi 