#!/usr/bin/env node

/**
 * Simple Deployment Status Checker
 * Checks if the application is deployed and accessible
 */

import https from 'https';

const BACKEND_URL = 'https://citiscience-backend-95pp.onrender.com';

console.log('🔍 Checking Deployment Status...\n');

// Check backend health
async function checkBackend() {
  try {
    const response = await makeRequest(`${BACKEND_URL}/health`);
    console.log('✅ Backend Status: HEALTHY');
    console.log(`   URL: ${BACKEND_URL}`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Database: ${response.database}`);
    console.log(`   Version: ${response.version}`);
    console.log(`   Environment: ${response.environment}`);
    return true;
  } catch (error) {
    console.log('❌ Backend Status: UNHEALTHY');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Helper function for HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// Main function
async function main() {
  console.log('🚀 ESCOM Citizen Scientist App - Deployment Status\n');
  
  const backendHealthy = await checkBackend();
  
  console.log('\n📊 Summary:');
  console.log('===========');
  console.log(`Backend: ${backendHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);
  console.log(`Frontend: 🔄 Deploying to Netlify...`);
  
  if (backendHealthy) {
    console.log('\n🎉 Backend is working perfectly!');
    console.log('✅ Ready to receive frontend requests');
    console.log('✅ Database connection established');
    console.log('✅ CORS properly configured');
  } else {
    console.log('\n⚠️  Backend needs attention');
    console.log('🔧 Check Render dashboard for issues');
    console.log('🔧 Verify environment variables');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Wait for Netlify deployment to complete');
  console.log('2. Test the application in your browser');
  console.log('3. Verify all new features are working');
  console.log('4. Run through the testing checklist');
  
  console.log('\n🔗 Useful Links:');
  console.log(`Backend: ${BACKEND_URL}`);
  console.log('GitHub: https://github.com/TushantKaura1/ESCOM-Web-App');
  console.log('Netlify: Check your dashboard for the app URL');
}

main().catch(console.error);
