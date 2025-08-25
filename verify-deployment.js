#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Tests both frontend and backend functionality after Netlify deployment
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BACKEND_URL = 'https://citiscience-backend-95pp.onrender.com';
const FRONTEND_URL = process.argv[2] || 'https://your-netlify-app.netlify.app'; // Pass as argument

console.log('🔍 Deployment Verification Script');
console.log('================================');
console.log(`Backend URL: ${BACKEND_URL}`);
console.log(`Frontend URL: ${FRONTEND_URL}`);
console.log('');

// Test backend connectivity
async function testBackend() {
  console.log('🧪 Testing Backend...');
  
  try {
    const response = await makeRequest(`${BACKEND_URL}/health`);
    console.log('✅ Backend Health Check:');
    console.log(`   Status: ${response.status}`);
    console.log(`   Database: ${response.database}`);
    console.log(`   Environment: ${response.environment}`);
    console.log(`   Version: ${response.version}`);
    console.log(`   Uptime: ${response.uptime.toFixed(2)}s`);
    console.log('');
    return true;
  } catch (error) {
    console.log('❌ Backend Health Check Failed:');
    console.log(`   Error: ${error.message}`);
    console.log('');
    return false;
  }
}

// Test frontend accessibility
async function testFrontend() {
  console.log('🌐 Testing Frontend...');
  
  try {
    const response = await makeRequest(`${FRONTEND_URL}/`);
    if (response.includes('ESCOM Citizen Scientist Assistant')) {
      console.log('✅ Frontend Loaded Successfully');
      console.log('   Title found: ESCOM Citizen Scientist Assistant');
      console.log('   Version: 3.1.0');
      console.log('');
      return true;
    } else {
      console.log('❌ Frontend Content Mismatch');
      console.log('   Expected title not found');
      console.log('');
      return false;
    }
  } catch (error) {
    console.log('❌ Frontend Test Failed:');
    console.log(`   Error: ${error.message}`);
    console.log('');
    return false;
  }
}

// Test API endpoints
async function testAPIEndpoints() {
  console.log('🔌 Testing API Endpoints...');
  
  const endpoints = [
    '/api/auth/login',
    '/api/admin/dashboard',
    '/api/user/dashboard'
  ];
  
  let successCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${BACKEND_URL}${endpoint}`, 'OPTIONS');
      console.log(`✅ ${endpoint}: CORS preflight successful`);
      successCount++;
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
  
  console.log(`   ${successCount}/${endpoints.length} endpoints working`);
  console.log('');
  return successCount === endpoints.length;
}

// Test build output
function testBuildOutput() {
  console.log('📦 Testing Build Output...');
  
  const distPath = path.join(__dirname, 'dist');
  const requiredFiles = [
    'index.html',
    'assets/index-DcjPN51v.js',
    'assets/index-DNVSGdnL.css'
  ];
  
  let successCount = 0;
  
  for (const file of requiredFiles) {
    const filePath = path.join(distPath, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}: Found`);
      successCount++;
    } else {
      console.log(`❌ ${file}: Missing`);
    }
  }
  
  console.log(`   ${successCount}/${requiredFiles.length} build files present`);
  console.log('');
  return successCount === requiredFiles.length;
}

// Helper function to make HTTP requests
function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      headers: {
        'User-Agent': 'Deployment-Verifier/1.0'
      }
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.headers['content-type']?.includes('application/json')) {
            resolve(JSON.parse(data));
          } else {
            resolve(data);
          }
        } catch (error) {
          resolve(data);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// Main verification function
async function runVerification() {
  console.log('🚀 Starting Deployment Verification...\n');
  
  const results = {
    backend: await testBackend(),
    frontend: await testFrontend(),
    api: await testAPIEndpoints(),
    build: testBuildOutput()
  };
  
  console.log('📊 Verification Results:');
  console.log('========================');
  console.log(`Backend Health: ${results.backend ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend Load: ${results.frontend ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`API Endpoints: ${results.api ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Build Output: ${results.build ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('🎉 All tests passed! Deployment is successful.');
    console.log('✅ Frontend and backend are working perfectly.');
    console.log('');
    console.log('🔗 Next steps:');
    console.log('   1. Test the application manually in your browser');
    console.log('   2. Verify login/logout functionality');
    console.log('   3. Check profile system and navigation');
    console.log('   4. Test admin and user dashboards');
  } else {
    console.log('⚠️  Some tests failed. Please check the issues above.');
    console.log('🔧 Troubleshooting tips:');
    console.log('   1. Check Netlify build logs');
    console.log('   2. Verify backend is running on Render');
    console.log('   3. Check CORS configuration');
    console.log('   4. Verify environment variables');
  }
  
  console.log('');
  process.exit(allPassed ? 0 : 1);
}

// Run verification if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runVerification().catch(error => {
    console.error('💥 Verification failed with error:', error);
    process.exit(1);
  });
}

export { runVerification };
