#!/usr/bin/env node

// Test Backend Readiness for Cloud Deployment
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Backend Readiness for Cloud Deployment...\n');

let allTestsPassed = true;

// Test 1: Check if package.json exists and has correct scripts
console.log('1. 📦 Checking package.json...');
if (fs.existsSync('package.json')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.scripts && packageJson.scripts.start) {
    console.log('   ✅ package.json exists with start script');
  } else {
    console.log('   ❌ package.json missing start script');
    allTestsPassed = false;
  }
} else {
  console.log('   ❌ package.json not found');
  allTestsPassed = false;
}

// Test 2: Check if main backend file exists
console.log('\n2. 🔧 Checking backend files...');
if (fs.existsSync('src/mongo-api/admin-api.js')) {
  console.log('   ✅ admin-api.js exists');
} else {
  console.log('   ❌ admin-api.js not found');
  allTestsPassed = false;
}

// Test 3: Check if .env.example exists
console.log('\n3. ⚙️ Checking environment configuration...');
if (fs.existsSync('env.example')) {
  console.log('   ✅ env.example exists');
} else {
  console.log('   ❌ env.example not found');
  allTestsPassed = false;
}

// Test 4: Check if render.yaml exists
console.log('\n4. 🚀 Checking deployment configuration...');
if (fs.existsSync('render.yaml')) {
  console.log('   ✅ render.yaml exists');
} else {
  console.log('   ❌ render.yaml not found');
  allTestsPassed = false;
}

// Test 5: Check if MongoDB connection is configured
console.log('\n5. 🗄️ Checking MongoDB configuration...');
const adminApiContent = fs.readFileSync('src/mongo-api/admin-api.js', 'utf8');
if (adminApiContent.includes('process.env.MONGODB_URI')) {
  console.log('   ✅ MongoDB URI uses environment variable');
} else {
  console.log('   ❌ MongoDB URI not configured for environment variables');
  allTestsPassed = false;
}

// Test 6: Check if CORS is configured for production
console.log('\n6. 🌐 Checking CORS configuration...');
if (adminApiContent.includes('citisci.netlify.app')) {
  console.log('   ✅ CORS configured for Netlify domain');
} else {
  console.log('   ❌ CORS not configured for Netlify domain');
  allTestsPassed = false;
}

// Test 7: Check if port is configurable
console.log('\n7. 🔌 Checking port configuration...');
if (adminApiContent.includes('process.env.PORT')) {
  console.log('   ✅ Port uses environment variable');
} else {
  console.log('   ❌ Port not configured for environment variables');
  allTestsPassed = false;
}

console.log('\n' + '='.repeat(50));

if (allTestsPassed) {
  console.log('🎉 All tests passed! Your backend is ready for cloud deployment.');
  console.log('\n📋 Next steps:');
  console.log('1. Set up MongoDB Atlas (free cloud database)');
  console.log('2. Deploy to Render using the render.yaml file');
  console.log('3. Update frontend config with your Render URL');
  console.log('4. Redeploy frontend to Netlify');
  console.log('\n📖 Read BACKEND_DEPLOYMENT_GUIDE.md for detailed instructions');
} else {
  console.log('❌ Some tests failed. Please fix the issues before deploying.');
  console.log('\n💡 Check the errors above and fix them.');
}

console.log('\n🌐 Your app will be live at: https://citisci.netlify.app/'); 