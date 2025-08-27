#!/bin/bash

echo "🚀 Deploying Backend to Render..."
echo "📧 Using email: efop77392@gmail.com"
echo ""

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "❌ Render CLI not found. Installing..."
    curl -sL https://render.com/download.sh | sh
    echo "✅ Render CLI installed"
else
    echo "✅ Render CLI found"
fi

# Login to Render
echo "🔐 Logging into Render..."
render login

# Deploy the backend
echo "📦 Deploying backend service..."
cd src/mongo-api

# Create a simple package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo "📝 Creating package.json for backend..."
    cat > package.json << EOF
{
  "name": "citiscience-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.21.2",
    "cors": "^2.8.5",
    "dotenv": "^17.2.0",
    "mongodb": "^6.17.0",
    "mongoose": "^8.17.1",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^6.0.0"
  }
}
EOF
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Go back to root
cd ../..

echo ""
echo "✅ Backend deployment setup complete!"
echo "🌐 Your backend will be available at: https://citiscience-backend.onrender.com"
echo "📧 Login to Render with: efop77392@gmail.com"
echo ""
echo "🔧 Next steps:"
echo "1. Go to https://render.com"
echo "2. Login with efop77392@gmail.com"
echo "3. Connect your GitHub repository"
echo "4. Set environment variables (MONGODB_URI, JWT_SECRET, etc.)"
echo "5. Deploy the service"
echo ""
echo "🚀 Backend will auto-deploy when you push to GitHub!"
