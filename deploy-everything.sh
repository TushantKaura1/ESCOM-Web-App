#!/bin/bash

echo "🚀 ESCOM Citizen Scientist App - Complete Cloud Deployment"
echo "=========================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 This script will help you deploy your app to the cloud permanently${NC}"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}📁 Initializing Git repository...${NC}"
    git init
    git add .
    git commit -m "Initial commit - ESCOM Citizen Scientist App"
    echo -e "${GREEN}✅ Git repository initialized${NC}"
else
    echo -e "${GREEN}✅ Git repository already exists${NC}"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo ""
    echo -e "${YELLOW}🌐 No remote origin found.${NC}"
    echo -e "${BLUE}💡 Please add your GitHub repository as remote origin:${NC}"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo ""
    echo -e "${BLUE}📋 Then push your code:${NC}"
    echo "   git push -u origin main"
    echo ""
else
    echo -e "${GREEN}✅ Remote origin found: $(git remote get-url origin)${NC}"
    echo -e "${BLUE}📤 Pushing latest changes...${NC}"
    git add .
    git commit -m "Ready for cloud deployment - $(date)"
    git push
    echo -e "${GREEN}✅ Code pushed to GitHub${NC}"
fi

echo ""
echo -e "${BLUE}🎯 Complete Deployment Checklist:${NC}"
echo "=========================================="
echo ""
echo -e "${YELLOW}1. 🗄️  MongoDB Atlas Setup${NC}"
echo "   📧 Email: tushantkaura@gmail.com"
echo "   📖 Read: MONGODB_ATLAS_SETUP.md"
echo "   🔗 Go to: https://mongodb.com/atlas"
echo ""
echo -e "${YELLOW}2. 🚀 Render Backend Deployment${NC}"
echo "   📖 Read: RENDER_DEPLOYMENT_GUIDE.md"
echo "   🔗 Go to: https://render.com"
echo ""
echo -e "${YELLOW}3. 🔄 Update Frontend Config${NC}"
echo "   📝 Edit: src/config.js with your Render URL"
echo "   🏗️  Build: npm run build"
echo "   🌐 Deploy: netlify deploy --prod --dir=dist"
echo ""
echo -e "${GREEN}✅ Your app will be permanently live at: https://citisci.netlify.app/${NC}"
echo ""
echo -e "${BLUE}📚 Available Guides:${NC}"
echo "   📖 MONGODB_ATLAS_SETUP.md - Database setup with Gmail"
echo "   📖 RENDER_DEPLOYMENT_GUIDE.md - Backend deployment"
echo "   📖 BACKEND_DEPLOYMENT_GUIDE.md - General backend info"
echo "   📖 NETLIFY_DEPLOYMENT_GUIDE.md - Frontend deployment"
echo ""
echo -e "${YELLOW}🎉 After completing these steps, your app will be:${NC}"
echo "   🌟 Always online and accessible"
echo "   🌍 Working from anywhere in the world"
echo "   🔒 Connected to your Gmail MongoDB account"
echo "   💰 Completely free hosting"
echo ""
echo -e "${BLUE}Need help? Check the guide files above for detailed instructions!${NC}" 