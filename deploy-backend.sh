#!/bin/bash

echo "🚀 Preparing Backend for Cloud Deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - ESCOM Citizen Scientist App"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🌐 No remote origin found."
    echo "💡 Please add your GitHub repository as remote origin:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo ""
    echo "📋 Then push your code:"
    echo "   git push -u origin main"
else
    echo "✅ Remote origin found: $(git remote get-url origin)"
    echo "📤 Pushing latest changes..."
    git add .
    git commit -m "Ready for Render deployment - $(date)"
    git push
    echo "✅ Code pushed to GitHub"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Set up MongoDB Atlas (see BACKEND_DEPLOYMENT_GUIDE.md)"
echo "2. Deploy to Render (see BACKEND_DEPLOYMENT_GUIDE.md)"
echo "3. Update frontend config with your Render URL"
echo "4. Redeploy frontend to Netlify"
echo ""
echo "📖 Read BACKEND_DEPLOYMENT_GUIDE.md for detailed instructions"
echo "🌐 Your app will be live at: https://citisci.netlify.app/" 