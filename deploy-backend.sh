#!/bin/bash

echo "🚀 Deploying Citizen Science Backend to Render..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit - Citizen Science Backend"
fi

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found!"
    echo "Please add your GitHub repository as remote origin:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Update backend with Telegram webhook and data APIs"
git push origin main

echo ""
echo "✅ Backend code pushed to GitHub!"
echo ""
echo "🔧 Next steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Create a new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Set the following environment variables:"
echo "   - DB_URI: mongodb+srv://tushantkaura:Lavanyanavya12#6Ttk@cluster0.we1rghs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
echo "   - JWT_SECRET: (generate a strong random string)"
echo "   - TELEGRAM_TOKEN: (your bot token from @BotFather)"
echo "5. Set build command: cd src/mongo-api && npm install"
echo "6. Set start command: cd src/mongo-api && node server.js"
echo "7. Deploy!"
echo ""
echo "🌐 Your backend will be available at: https://your-service-name.onrender.com"
echo "📱 Telegram webhook: https://your-service-name.onrender.com/webhook"
echo "📊 Data APIs: https://your-service-name.onrender.com/api/get_data, /api/save_data" 