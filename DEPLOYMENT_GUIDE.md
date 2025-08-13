# 🚀 Deployment Guide - Free Hosting Options

## 📋 Overview

This guide covers deploying the ESCOM Citizen Scientist Assistant to free hosting platforms. The app consists of:
- **Frontend**: React app (Vite)
- **Backend**: Node.js API (Express + MongoDB)
- **Bot**: Telegram Bot (Telegraf)
- **Database**: MongoDB

## 🆓 Free Hosting Options

### **1. Render (Recommended)**

#### **Frontend Deployment**
```bash
# 1. Create account at render.com
# 2. Connect your GitHub repository
# 3. Create new Static Site
# 4. Configure:
Build Command: npm run build
Publish Directory: dist
```

#### **Backend Deployment**
```bash
# 1. Create new Web Service
# 2. Connect GitHub repository
# 3. Configure:
Build Command: npm install
Start Command: npm start
Environment Variables:
  - MONGODB_URI=mongodb+srv://...
  - JWT_SECRET=your-secret-key
  - BOT_TOKEN=your-telegram-bot-token
  - PORT=3001
```

#### **MongoDB Atlas (Free Tier)**
```bash
# 1. Create account at mongodb.com/atlas
# 2. Create free cluster
# 3. Get connection string
# 4. Add to environment variables
```

### **2. Railway**

#### **Full Stack Deployment**
```bash
# 1. Create account at railway.app
# 2. Connect GitHub repository
# 3. Add environment variables
# 4. Deploy automatically
```

### **3. Vercel**

#### **Frontend Only**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configure environment variables in dashboard
```

### **4. Netlify**

#### **Frontend Deployment**
```bash
# 1. Create account at netlify.com
# 2. Connect GitHub repository
# 3. Configure build settings:
Build command: npm run build
Publish directory: dist
```

### **5. Heroku (Free Tier Discontinued)**

#### **Alternative: Render or Railway**
- Heroku discontinued free tier
- Use Render or Railway instead

## 🔧 Environment Setup

### **1. Environment Variables**
Create `.env` file:
```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/escom

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Telegram Bot
BOT_TOKEN=your-telegram-bot-token

# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-app-name.onrender.com
```

### **2. Database Setup**
```bash
# 1. Create MongoDB Atlas account
# 2. Create free cluster
# 3. Get connection string
# 4. Add to environment variables
```

### **3. Telegram Bot Setup**
```bash
# 1. Message @BotFather on Telegram
# 2. Create new bot: /newbot
# 3. Get bot token
# 4. Add to environment variables
```

## 🚀 Deployment Steps

### **Step 1: Prepare Repository**
```bash
# 1. Push code to GitHub
git add .
git commit -m "Initial deployment"
git push origin main

# 2. Ensure all files are included:
# - package.json
# - src/mongo-api/admin-api.js
# - src/bot.js
# - scripts/load-demo-accounts.js
# - .env (for local testing)
```

### **Step 2: Deploy Backend (Render)**
```bash
# 1. Go to render.com
# 2. Create new Web Service
# 3. Connect GitHub repository
# 4. Configure:
Name: escom-admin-api
Environment: Node
Build Command: npm install
Start Command: npm start
```

### **Step 3: Deploy Frontend (Render)**
```bash
# 1. Create new Static Site
# 2. Connect same repository
# 3. Configure:
Name: escom-frontend
Build Command: npm run build
Publish Directory: dist
```

### **Step 4: Configure Environment Variables**
```bash
# Backend Environment Variables:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/escom
JWT_SECRET=your-super-secret-key-here
BOT_TOKEN=your-telegram-bot-token
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://escom-frontend.onrender.com
```

### **Step 5: Update Frontend API URL**
```javascript
// In src/App.jsx, update API calls:
const API_BASE_URL = 'https://escom-admin-api.onrender.com';

// Update fetch calls:
fetch(`${API_BASE_URL}/api/admin/dashboard`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
  }
});
```

## 📊 Free Tier Limits

### **Render**
- **Static Sites**: Unlimited
- **Web Services**: 750 hours/month
- **Custom Domains**: Free
- **SSL**: Free

### **Railway**
- **Projects**: 5
- **Deployments**: 500/month
- **Custom Domains**: Free
- **SSL**: Free

### **MongoDB Atlas**
- **Storage**: 512MB
- **RAM**: Shared
- **Connections**: 500
- **Backup**: Free

### **Vercel**
- **Projects**: Unlimited
- **Bandwidth**: 100GB/month
- **Custom Domains**: Free
- **SSL**: Free

## 🔄 Continuous Deployment

### **Automatic Deployment**
```bash
# 1. Connect GitHub repository
# 2. Enable auto-deploy
# 3. Push changes to trigger deployment
git push origin main
```

### **Environment Variables Management**
```bash
# 1. Set in hosting platform dashboard
# 2. Never commit .env files
# 3. Use platform-specific secrets
```

## 🧪 Testing Deployment

### **1. Health Check**
```bash
# Test backend health
curl https://your-api-url.onrender.com/health

# Expected response:
{
  "status": "OK",
  "timestamp": "2024-01-20T...",
  "database": "connected"
}
```

### **2. API Testing**
```bash
# Test admin login
curl -X POST https://your-api-url.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"telegramId": 123456789}'
```

### **3. Frontend Testing**
```bash
# 1. Visit your frontend URL
# 2. Test admin functionality
# 3. Verify API connections
```

## 🚨 Troubleshooting

### **Common Issues**

#### **Backend Not Starting**
```bash
# Check logs in hosting platform
# Verify environment variables
# Check MongoDB connection
# Ensure PORT is set correctly
```

#### **Frontend API Errors**
```bash
# Check CORS configuration
# Verify API URL is correct
# Check network tab for errors
# Ensure backend is running
```

#### **Database Connection Issues**
```bash
# Verify MongoDB Atlas connection string
# Check IP whitelist (0.0.0.0/0 for all)
# Ensure database user has correct permissions
# Test connection locally first
```

### **Debug Commands**
```bash
# Check backend logs
# In hosting platform dashboard

# Test database connection
node test-db.js

# Load demo data
npm run load-demo

# Test bot locally
npm run bot
```

## 📱 Mobile Testing

### **Telegram Web App**
```bash
# 1. Deploy frontend to HTTPS URL
# 2. Update bot web app URL
# 3. Test in Telegram
# 4. Verify mobile responsiveness
```

### **PWA Features**
```bash
# 1. Add manifest.json
# 2. Configure service worker
# 3. Test offline functionality
# 4. Verify app installation
```

## 🔒 Security Considerations

### **Environment Variables**
```bash
# Never commit secrets
# Use platform-specific secrets
# Rotate JWT secrets regularly
# Use strong passwords
```

### **CORS Configuration**
```javascript
// In backend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### **Rate Limiting**
```javascript
// Add rate limiting for production
const rateLimit = require('express-rate-limit');
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

## 📈 Monitoring

### **Free Monitoring Tools**
- **Uptime Robot**: Monitor uptime
- **LogRocket**: Error tracking
- **Sentry**: Error monitoring
- **Google Analytics**: User tracking

### **Health Checks**
```bash
# Set up automated health checks
# Monitor API response times
# Track error rates
# Monitor database performance
```

## 💰 Cost Optimization

### **Free Tier Best Practices**
```bash
# 1. Use efficient queries
# 2. Implement caching
# 3. Optimize bundle size
# 4. Use CDN for static assets
# 5. Monitor resource usage
```

### **Scaling Considerations**
```bash
# When free tier limits are reached:
# 1. Upgrade to paid plans
# 2. Consider alternative hosting
# 3. Optimize application
# 4. Implement caching strategies
```

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html) 