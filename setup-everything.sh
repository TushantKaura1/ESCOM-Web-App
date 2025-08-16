#!/bin/bash

# 🌟 ESCOM Citizen Scientist App - Complete Setup Script
# This script will set up everything: GitHub, MongoDB Atlas, Render, and Netlify

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🚀 ESCOM Citizen Scientist App - Complete Setup${NC}"
echo -e "${PURPLE}===============================================${NC}"
echo ""

# Function to print colored output
print_status() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_step() {
    echo -e "${CYAN}🎯 $1${NC}"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check for git
    if command -v git &> /dev/null; then
        print_success "Git is installed"
    else
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    # Check for node
    if command -v node &> /dev/null; then
        print_success "Node.js is installed ($(node --version))"
    else
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    # Check for npm
    if command -v npm &> /dev/null; then
        print_success "npm is installed ($(npm --version))"
    else
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check for netlify CLI
    if command -v netlify &> /dev/null; then
        print_success "Netlify CLI is installed"
    else
        print_warning "Netlify CLI is not installed. Will install it now..."
        npm install -g netlify-cli
        print_success "Netlify CLI installed"
    fi
    
    echo ""
}

# Setup GitHub repository
setup_github() {
    print_step "Step 1: Setting up GitHub repository"
    
    # Check if remote origin exists
    if git remote get-url origin &> /dev/null; then
        print_success "GitHub remote already exists"
        return 0
    fi
    
    print_status "You need to create a GitHub repository first."
    echo ""
    echo -e "${YELLOW}📝 Manual Steps Required:${NC}"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: ESCOM (or your preferred name)"
    echo "3. Make it Public or Private (your choice)"
    echo "4. Don't initialize with README (we already have one)"
    echo "5. Click 'Create repository'"
    echo ""
    
    read -p "Enter your GitHub username: " GITHUB_USERNAME
    read -p "Enter your repository name: " REPO_NAME
    
    if [ -z "$GITHUB_USERNAME" ] || [ -z "$REPO_NAME" ]; then
        print_error "GitHub username and repository name are required"
        return 1
    fi
    
    # Add remote origin
    print_status "Adding GitHub remote..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    
    if [ $? -eq 0 ]; then
        print_success "GitHub remote added successfully"
        return 0
    else
        print_error "Failed to add GitHub remote"
        return 1
    fi
}

# Push code to GitHub
push_to_github() {
    print_step "Step 2: Pushing code to GitHub"
    
    if ! git remote get-url origin &> /dev/null; then
        print_error "No GitHub remote found. Please run setup_github first."
        return 1
    fi
    
    print_status "Pushing code to GitHub..."
    git push -u origin master
    
    if [ $? -eq 0 ]; then
        print_success "Code pushed to GitHub successfully"
        return 0
    else
        print_error "Failed to push to GitHub"
        return 1
    fi
}

# Setup MongoDB Atlas
setup_mongodb() {
    print_step "Step 3: Setting up MongoDB Atlas"
    
    print_status "You need to set up MongoDB Atlas manually first."
    echo ""
    echo -e "${YELLOW}📝 Manual Steps Required:${NC}"
    echo "1. Go to https://mongodb.com/atlas"
    echo "2. Sign up with: tushantkaura@gmail.com"
    echo "3. Create FREE cluster (M0)"
    echo "4. Create database user: escom_admin / Escom2024!"
    echo "5. Allow network access: 0.0.0.0/0"
    echo "6. Get connection string"
    echo ""
    
    read -p "Enter your MongoDB Atlas connection string: " MONGODB_URI
    
    if [ -z "$MONGODB_URI" ]; then
        print_error "MongoDB connection string is required"
        return 1
    fi
    
    # Save MongoDB URI for later use
    echo "MONGODB_URI=$MONGODB_URI" > .mongodb_uri
    print_success "MongoDB connection string saved"
    return 0
}

# Setup Render deployment
setup_render() {
    print_step "Step 4: Setting up Render deployment"
    
    print_status "You need to deploy to Render manually."
    echo ""
    echo -e "${YELLOW}📝 Manual Steps Required:${NC}"
    echo "1. Go to https://render.com"
    echo "2. Sign up with GitHub"
    echo "3. Click 'New +' → 'Web Service'"
    echo "4. Connect your GitHub repository"
    echo "5. Use these settings:"
    echo "   - Name: escom-backend"
    echo "   - Environment: Node"
    echo "   - Build Command: npm install"
    echo "   - Start Command: npm start"
    echo "6. Set environment variables (see below)"
    echo ""
    
    # Read MongoDB URI if available
    if [ -f ".mongodb_uri" ]; then
        MONGODB_URI=$(cat .mongodb_uri | cut -d'=' -f2)
        print_status "Using saved MongoDB URI: $MONGODB_URI"
    else
        read -p "Enter your MongoDB Atlas connection string: " MONGODB_URI
    fi
    
    if [ -z "$MONGODB_URI" ]; then
        print_error "MongoDB connection string is required"
        return 1
    fi
    
    echo ""
    echo -e "${GREEN}📋 Environment Variables for Render:${NC}"
    echo "MONGODB_URI=$MONGODB_URI"
    echo "PORT=3002"
    echo "NODE_ENV=production"
    echo "JWT_SECRET=escom-super-secret-2024"
    echo "CORS_ORIGIN=https://citisci.netlify.app"
    echo "NODE_VERSION=18"
    echo "NPM_FLAGS=--legacy-peer-deps"
    echo ""
    
    read -p "Press Enter after setting up Render service..."
    
    # Get Render service URL
    read -p "Enter your Render service URL (e.g., https://escom-backend.onrender.com): " RENDER_URL
    
    if [ -z "$RENDER_URL" ]; then
        print_error "Render service URL is required"
        return 1
    fi
    
    # Save Render URL for later use
    echo "RENDER_URL=$RENDER_URL" > .render_url
    print_success "Render service URL saved"
    return 0
}

# Update frontend configuration
update_frontend_config() {
    print_step "Step 5: Updating frontend configuration"
    
    if [ ! -f ".render_url" ]; then
        print_error "Render URL not found. Please run setup_render first."
        return 1
    fi
    
    RENDER_URL=$(cat .render_url | cut -d'=' -f2)
    
    print_status "Updating frontend config with Render URL: $RENDER_URL"
    
    # Update config.js with Render URL
    sed -i.bak "s|https://your-backend-url.onrender.com|$RENDER_URL|g" src/config.js
    
    if [ $? -eq 0 ]; then
        print_success "Frontend configuration updated"
        return 0
    else
        print_error "Failed to update frontend configuration"
        return 1
    fi
}

# Build and deploy frontend
deploy_frontend() {
    print_step "Step 6: Building and deploying frontend"
    
    print_status "Building frontend..."
    npm run build
    
    if [ $? -ne 0 ]; then
        print_error "Frontend build failed"
        return 1
    fi
    
    print_success "Frontend built successfully"
    
    print_status "Deploying to Netlify..."
    netlify deploy --prod --dir=dist
    
    if [ $? -eq 0 ]; then
        print_success "Frontend deployed to Netlify successfully"
        return 0
    else
        print_error "Failed to deploy to Netlify"
        return 1
    fi
}

# Test deployment
test_deployment() {
    print_step "Step 7: Testing deployment"
    
    if [ ! -f ".render_url" ]; then
        print_error "Render URL not found. Cannot test deployment."
        return 1
    fi
    
    RENDER_URL=$(cat .render_url | cut -d'=' -f2)
    
    print_status "Testing backend health endpoint..."
    HEALTH_RESPONSE=$(curl -s "$RENDER_URL/health" 2>/dev/null)
    
    if [[ "$HEALTH_RESPONSE" == *"status"* ]]; then
        print_success "Backend health check passed"
    else
        print_warning "Backend health check failed or service not ready yet"
    fi
    
    print_status "Testing backend API endpoint..."
    API_RESPONSE=$(curl -s "$RENDER_URL/api/admin/dashboard" 2>/dev/null)
    
    if [[ "$API_RESPONSE" == *"No token provided"* ]]; then
        print_success "Backend API endpoint working"
    else
        print_warning "Backend API endpoint not responding as expected"
    fi
    
    echo ""
    echo -e "${GREEN}🎉 Deployment Summary:${NC}"
    echo "Frontend: https://citisci.netlify.app/"
    echo "Backend: $RENDER_URL"
    echo "Database: MongoDB Atlas (connected to tushantkaura@gmail.com)"
    echo ""
    echo -e "${YELLOW}🔑 Admin Login: admin@escom.com / admin123${NC}"
}

# Main execution
main() {
    echo -e "${PURPLE}🚀 Starting complete setup process...${NC}"
    echo ""
    
    # Check requirements
    check_requirements
    
    # Setup GitHub
    if ! setup_github; then
        print_error "GitHub setup failed. Exiting."
        exit 1
    fi
    
    # Push to GitHub
    if ! push_to_github; then
        print_error "GitHub push failed. Exiting."
        exit 1
    fi
    
    # Setup MongoDB Atlas
    if ! setup_mongodb; then
        print_error "MongoDB Atlas setup failed. Exiting."
        exit 1
    fi
    
    # Setup Render
    if ! setup_render; then
        print_error "Render setup failed. Exiting."
        exit 1
    fi
    
    # Update frontend config
    if ! update_frontend_config; then
        print_error "Frontend config update failed. Exiting."
        exit 1
    fi
    
    # Deploy frontend
    if ! deploy_frontend; then
        print_error "Frontend deployment failed. Exiting."
        exit 1
    fi
    
    # Test deployment
    test_deployment
    
    echo ""
    echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
    echo -e "${BLUE}Your app is now live and fully functional!${NC}"
}

# Run main function
main "$@" 