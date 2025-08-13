# 🚀 Backend Deployment Guide - Render (Free Hosting)

## 📋 What We're Deploying
- **Backend API**: Node.js + Express + MongoDB
- **Hosting**: Render.com (Free Tier)
- **Database**: MongoDB Atlas (Free Tier)
- **Frontend**: Already deployed on Netlify ✅

## 🔧 Step 1: Set Up MongoDB Atlas (Free Cloud Database)

### 1.1 Create MongoDB Atlas Account
1. **Go to**: [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Sign up** for free account
3. **Create Free Cluster** (M0 - Free Tier)

### 1.2 Configure Database
1. **Create Database**: Name it `escom`
2. **Create User**: 
   - Username: `escom_user`
   - Password: `escom_password_123` (or your own)
3. **Network Access**: Allow access from anywhere (`0.0.0.0/0`)

### 1.3 Get Connection String
1. **Click "Connect"** on your cluster
2. **Choose "Connect your application"**
3. **Copy the connection string**
4. **Replace placeholders**:
   ```
   mongodb+srv://escom_user:escom_password_123@cluster0.xxxxx.mongodb.net/escom
   ```

## 🌐 Step 2: Deploy Backend to Render

### 2.1 Create Render Account
1. **Go to**: [render.com](https://render.com)
2. **Sign up** with GitHub
3. **Verify email**

### 2.2 Deploy from GitHub
1. **Click "New +"** → **"Web Service"**
2. **Connect your GitHub repository**
3. **Select your repo**: `CitizenScientistMiniApp`

### 2.3 Configure Service
```
Name: escom-backend
Environment: Node
Region: Choose closest to you
Branch: main (or your default branch)
Build Command: npm install
Start Command: npm start
```

### 2.4 Set Environment Variables
Click "Environment" tab and add:

| Key | Value | Description |
|-----|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://escom_user:escom_password_123@cluster0.xxxxx.mongodb.net/escom` | Your MongoDB connection string |
| `PORT` | `3002` | Server port |
| `NODE_ENV` | `production` | Environment |
| `JWT_SECRET` | `your-super-secret-key-here` | JWT signing secret |
| `CORS_ORIGIN` | `https://citisci.netlify.app` | Allow Netlify domain |

### 2.5 Deploy
1. **Click "Create Web Service"**
2. **Wait for build** (2-3 minutes)
3. **Copy your service URL** (e.g., `https://escom-backend.onrender.com`)

## 🔄 Step 3: Update Frontend Configuration

### 3.1 Update config.js
```javascript
// src/config.js
const config = {
  API_BASE_URL: (() => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3002';  // Local development
    } else {
      return 'https://escom-backend.onrender.com';  // ← Your Render URL!
    }
  })(),
  // ... rest of config
};
```

### 3.2 Rebuild and Deploy Frontend
```bash
# Build frontend
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 🧪 Step 4: Test Your Deployment

### 4.1 Test Backend API
```bash
# Test your deployed backend
curl https://escom-backend.onrender.com/api/admin/dashboard
```

### 4.2 Test Frontend Connection
1. **Visit**: [https://citisci.netlify.app/](https://citisci.netlify.app/)
2. **Open Console** (F12) - should see your Render URL
3. **Try to login** - should work now!

## 🔑 Admin Login Credentials
- **Email**: `admin@escom.com`
- **Password**: `admin123`

## 🚨 Troubleshooting

### Common Issues:
1. **Build Fails**: Check Render logs for errors
2. **Database Connection**: Verify MongoDB Atlas connection string
3. **CORS Error**: Ensure CORS_ORIGIN is set correctly
4. **Port Issues**: Render uses `process.env.PORT` automatically

### Debug Steps:
1. **Check Render logs** in your service dashboard
2. **Verify environment variables** are set correctly
3. **Test MongoDB connection** from Render
4. **Check browser console** for frontend errors

## 📱 Final Result
Once deployed, your app will be fully functional:
- **Frontend**: [https://citisci.netlify.app/](https://citisci.netlify.app/)
- **Backend**: `https://escom-backend.onrender.com`
- **Database**: MongoDB Atlas (cloud)
- **Users**: Can access from anywhere in the world!

## 🎯 Quick Commands
```bash
# Deploy backend (after setting up Render)
git add .
git commit -m "Ready for Render deployment"
git push

# Deploy frontend (after updating config)
npm run build
netlify deploy --prod --dir=dist
```

---
**Need Help?** Check Render logs and browser console for specific error messages. 