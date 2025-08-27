#!/bin/bash

echo "🚀 Netlify Deployment Script for efop77392@gmail.com"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Starting Netlify deployment process..."

# Step 1: Build the project
print_status "Step 1: Building the project..."
if npm run build; then
    print_success "Build completed successfully!"
else
    print_error "Build failed!"
    exit 1
fi

# Step 2: Check if dist folder exists
if [ ! -d "dist" ]; then
    print_error "dist folder not found after build!"
    exit 1
fi

print_success "dist folder created successfully!"

# Step 3: Check Netlify status
print_status "Step 2: Checking Netlify status..."
if netlify status > /dev/null 2>&1; then
    print_success "Netlify CLI is working and project is linked!"
    
    # Get project info
    PROJECT_INFO=$(netlify status 2>/dev/null | grep "Current project:")
    SITE_URL=$(netlify status 2>/dev/null | grep "Project URL:" | awk '{print $3}')
    
    print_status "Project: $PROJECT_INFO"
    print_status "Site URL: $SITE_URL"
else
    print_error "Netlify CLI not working properly!"
fi

# Step 4: Try different deployment methods
print_status "Step 3: Attempting deployment..."

# Method 1: Try direct deploy
print_status "Trying Method 1: Direct deploy..."
if netlify deploy --prod --dir=dist 2>/dev/null; then
    print_success "Deployment successful using direct method!"
    exit 0
else
    print_warning "Direct deploy failed, trying alternative methods..."
fi

# Method 2: Try build then deploy
print_status "Trying Method 2: Build then deploy..."
if netlify build && netlify deploy --prod --dir=dist 2>/dev/null; then
    print_success "Deployment successful using build + deploy method!"
    exit 0
else
    print_warning "Build + deploy method failed..."
fi

# Method 3: Manual deployment instructions
print_status "Step 4: Providing manual deployment instructions..."
echo ""
echo "🔧 MANUAL DEPLOYMENT REQUIRED"
echo "============================="
echo ""
echo "Since automated deployment is having issues, please deploy manually:"
echo ""
echo "1. Go to: https://app.netlify.com/projects/whimsical-licorice-fa2bd7"
echo "2. Login with: efop77392@gmail.com"
echo "3. Click 'Deploys' tab"
echo "4. Click 'Trigger deploy' → 'Deploy site'"
echo "5. Or drag & drop the 'dist' folder contents"
echo ""
echo "Your build is ready in the 'dist' folder!"
echo "Site URL: https://whimsical-licorice-fa2bd7.netlify.app"
echo ""

# Step 5: Verify build contents
print_status "Step 5: Verifying build contents..."
echo "📁 Build contents in dist folder:"
ls -la dist/

echo ""
print_success "Build verification complete!"
print_status "Your app is ready for deployment with all features implemented!"
print_status "Please use the manual deployment method above."
