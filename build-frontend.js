#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting frontend build process...');

try {
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found. Please run from project root.');
  }

  // Check if dist directory exists and clean it
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    console.log('🧹 Cleaning existing dist directory...');
    fs.rmSync(distPath, { recursive: true, force: true });
  }

  // Install all dependencies (including devDependencies for build tools)
  console.log('📦 Installing dependencies...');
  execSync('npm ci --no-audit --no-fund', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Run the build using local vite
  console.log('🔨 Building frontend with Vite...');
  execSync('./node_modules/.bin/vite build', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });

  // Verify build output
  if (!fs.existsSync(distPath)) {
    throw new Error('Build failed: dist directory not created');
  }

  const files = fs.readdirSync(distPath);
  console.log(`✅ Build successful! Generated ${files.length} files in dist/`);
  console.log('📁 Build files:', files.join(', '));

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
