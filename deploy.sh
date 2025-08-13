#!/bin/bash

# 🚀 ESCOM Citizen Scientist Assistant - Deployment Script
# This script helps you deploy the app to free hosting platforms

echo "🌊 ESCOM Citizen Scientist Assistant - Deployment Script"
echo "======================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/escom

# JWT Secret (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-here

# Telegram Bot Configuration
BOT_TOKEN=your_telegram_bot_token_here
WEBAPP_URL=https://your-domain.com

# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
EOF
    echo "✅ Created .env file"
    echo "⚠️  Please update the .env file with your actual values"
else
    echo "✅ .env file already exists"
fi

# Test database connection
echo "🔍 Testing database connection..."
node test-db.js

# Load demo accounts
echo "👥 Loading demo accounts..."
npm run load-demo

# Build frontend
echo "🏗️  Building frontend..."
npm run build

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env file with your actual values"
echo "2. Create MongoDB Atlas account (free)"
echo "3. Create Telegram bot with @BotFather"
echo "4. Deploy to Render or Railway"
echo ""
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "🚀 To start locally:"
echo "  Backend: npm start"
echo "  Frontend: npm run dev"
echo "  Bot: npm run bot"
echo ""
echo "🌐 Free hosting options:"
echo "  - Render (Recommended): render.com"
echo "  - Railway: railway.app"
echo "  - Vercel: vercel.com"
echo "  - Netlify: netlify.com"
echo ""
echo "💾 Database options:"
echo "  - MongoDB Atlas (Free): mongodb.com/atlas"
echo ""
echo "📱 Telegram Bot:"
echo "  - Message @BotFather to create bot"
echo "  - Get bot token and add to .env"
echo ""
echo "🔗 Useful links:"
echo "  - DEPLOYMENT_GUIDE.md: Detailed deployment instructions"
echo "  - ADMIN_FUNCTIONALITY_GUIDE.md: Admin features guide"
echo "  - DEMO_ACCOUNTS_GUIDE.md: Demo accounts information"
echo ""
echo "✨ Happy deploying!" 