#!/bin/bash

echo "🚀 Citizen Science Mini App - Complete Deployment"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}📁 Initializing git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit - Citizen Science Mini App"
fi

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo -e "${RED}❌ No remote origin found!${NC}"
    echo ""
    echo "Please add your GitHub repository as remote origin:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo -e "${GREEN}✅ Git repository ready${NC}"
echo ""

# Step 1: Deploy Backend
echo -e "${BLUE}🚀 Step 1: Deploying Backend to Render${NC}"
echo "================================================"

# Check if backend dependencies are installed
if [ ! -d "src/mongo-api/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd src/mongo-api
    npm install
    cd ../..
fi

# Push backend code
echo "📤 Pushing backend code to GitHub..."
git add .
git commit -m "Deploy backend with Telegram webhook and data APIs"
git push origin main

echo -e "${GREEN}✅ Backend code pushed to GitHub!${NC}"
echo ""

# Step 2: Deploy Frontend
echo -e "${BLUE}🌐 Step 2: Deploying Frontend to Netlify${NC}"
echo "=================================================="

# Build frontend
echo "🔨 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi

# Push frontend
echo "📤 Pushing frontend to GitHub..."
git add .
git commit -m "Build frontend for production"
git push origin main

echo -e "${GREEN}✅ Frontend code pushed to GitHub!${NC}"
echo ""

# Step 3: Deployment Instructions
echo -e "${BLUE}📋 Step 3: Complete the Deployment${NC}"
echo "=========================================="
echo ""

echo -e "${YELLOW}🔧 Backend Deployment (Render):${NC}"
echo "1. Go to https://dashboard.render.com"
echo "2. Create new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Configure:"
echo "   - Name: citiscience-backend"
echo "   - Build: cd src/mongo-api && npm install"
echo "   - Start: cd src/mongo-api && node server.js"
echo "5. Set environment variables:"
echo "   - DB_URI: mongodb+srv://tushantkaura:Lavanyanavya12#6Ttk@cluster0.we1rghs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
echo "   - JWT_SECRET: (generate strong random string)"
echo "   - TELEGRAM_TOKEN: (your bot token)"
echo "   - DB_NAME: citiscience"
echo "6. Deploy!"
echo ""

echo -e "${YELLOW}🌐 Frontend Deployment (Netlify):${NC}"
echo "1. Go to https://app.netlify.com"
echo "2. New site from Git"
echo "3. Connect your GitHub repository"
echo "4. Build settings:"
echo "   - Build command: npm run build"
echo "   - Publish directory: dist"
echo "5. Environment variable:"
echo "   - BACKEND_URL: https://your-backend-name.onrender.com"
echo "6. Deploy!"
echo ""

echo -e "${YELLOW}🤖 Telegram Bot Setup:${NC}"
echo "1. Get your bot token from @BotFather"
echo "2. Set webhook:"
echo "   https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-backend.onrender.com/webhook"
echo "3. Test with /start command"
echo ""

echo -e "${GREEN}🎉 Your Mini App will be available at:${NC}"
echo "Frontend: https://citiscience.netlify.app"
echo "Backend: https://your-backend-name.onrender.com"
echo ""

echo -e "${BLUE}📖 For detailed instructions, see: FINAL_DEPLOYMENT_GUIDE.md${NC}"
echo ""

echo -e "${GREEN}✅ Deployment scripts completed!${NC}"
echo "Complete the manual steps above to go live." 