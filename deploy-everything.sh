#!/bin/bash

echo "🚀 ESCOM Citizen Scientist - Complete Deployment Script"
echo "======================================================"
echo ""

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

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Requirements check passed!"
    print_status "Node.js version: $(node --version)"
    print_status "npm version: $(npm --version)"
    echo ""
}

# Install dependencies
install_dependencies() {
    print_status "Installing frontend dependencies..."
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed successfully!"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
    
    print_status "Installing backend dependencies..."
    cd src/mongo-api
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Backend dependencies installed successfully!"
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
    
    cd ../..
    echo ""
}

# Build frontend
build_frontend() {
    print_status "Building frontend for production..."
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Frontend built successfully!"
        print_status "Build output directory: dist/"
        
        # Check if dist folder exists and has content
        if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
            print_success "Build artifacts verified!"
            ls -la dist/
        else
            print_error "Build artifacts not found or empty!"
            exit 1
        fi
    else
        print_error "Frontend build failed!"
        exit 1
    fi
    
    echo ""
}

# Test backend locally
test_backend() {
    print_status "Testing backend locally..."
    cd src/mongo-api
    
    # Check if server.js exists
    if [ ! -f "server.js" ]; then
        print_error "server.js not found in src/mongo-api/"
        exit 1
    fi
    
    print_status "Backend files verified:"
    ls -la
    
    cd ../..
    echo ""
}

# Check configuration files
check_config() {
    print_status "Checking configuration files..."
    
    # Check if config.js exists
    if [ ! -f "src/config.js" ]; then
        print_error "src/config.js not found!"
        exit 1
    fi
    
    # Check if render.yaml exists
    if [ ! -f "render.yaml" ]; then
        print_error "render.yaml not found!"
        exit 1
    fi
    
    # Check if netlify.toml exists
    if [ ! -f "netlify.toml" ]; then
        print_error "netlify.toml not found!"
        exit 1
    fi
    
    print_success "Configuration files verified!"
    echo ""
}

# Show deployment instructions
show_deployment_instructions() {
    print_status "Deployment Instructions:"
    echo ""
    echo "🌐 FRONTEND (Netlify):"
    echo "1. Go to https://netlify.com"
    echo "2. Connect your GitHub repository"
    echo "3. Configure build settings:"
    echo "   - Build command: npm run build"
    echo "   - Publish directory: dist"
    echo "4. Deploy!"
    echo ""
    echo "🚀 BACKEND (Render):"
    echo "1. Go to https://render.com"
    echo "2. Connect your GitHub repository"
    echo "3. Create new Web Service:"
    echo "   - Name: citiscience-backend"
    echo "   - Environment: Node"
    echo "   - Build Command: cd src/mongo-api && npm install"
    echo "   - Start Command: cd src/mongo-api && node server.js"
    echo "   - Health Check Path: /health"
    echo "4. Set environment variables:"
    echo "   - NODE_ENV=production"
    echo "   - PORT=3001"
    echo "   - DB_URI=your_mongodb_connection_string"
    echo "   - JWT_SECRET=your_secret_key"
    echo "5. Deploy!"
    echo ""
    echo "🔗 UPDATE CONFIG:"
    echo "After backend deployment, update src/config.js:"
    echo "API_BASE_URL: 'https://your-backend.onrender.com'"
    echo ""
}

# Main deployment process
main() {
    echo "🚀 Starting ESCOM Citizen Scientist deployment process..."
    echo ""
    
    # Check requirements
    check_requirements
    
    # Install dependencies
    install_dependencies
    
    # Build frontend
    build_frontend
    
    # Test backend
    test_backend
    
    # Check configuration
    check_config
    
    # Show deployment instructions
    show_deployment_instructions
    
    print_success "Deployment preparation complete! 🎉"
    echo ""
    print_status "Next steps:"
    echo "1. Deploy backend to Render"
    echo "2. Deploy frontend to Netlify"
    echo "3. Update API_BASE_URL in config.js"
    echo "4. Test all functionality"
    echo ""
    print_status "For detailed instructions, see DEPLOYMENT_GUIDE.md"
}

# Run main function
main 