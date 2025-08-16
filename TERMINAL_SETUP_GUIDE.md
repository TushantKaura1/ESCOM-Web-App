# 🖥️ Terminal Setup Guide - Complete Deployment

## 🚀 **Complete Setup Using Terminal Commands**

This guide will walk you through setting up everything step by step using terminal commands.

---

## **Step 1: GitHub Repository Setup**

### 1.1 Create GitHub Repository (Manual)
1. **Go to**: https://github.com/new
2. **Repository name**: `ESCOM` (or your preferred name)
3. **Make it**: Public or Private (your choice)
4. **Don't initialize** with README (we already have one)
5. **Click**: "Create repository"

### 1.2 Add GitHub Remote (Terminal)
```bash
# Replace YOUR_USERNAME and REPO_NAME with your actual values
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Verify remote was added
git remote -v
```

### 1.3 Push Code to GitHub (Terminal)
```bash
# Add all files
git add .

# Commit changes
git commit -m "Complete ESCOM Citizen Scientist App"

# Push to GitHub
git push -u origin master
```

---

## **Step 2: MongoDB Atlas Setup (Manual + Terminal)**

### 2.1 Create MongoDB Atlas Account
1. **Go to**: https://mongodb.com/atlas
2. **Sign up** with: `tushantkaura@gmail.com`
3. **Create password**: `Escom2024!` (or your choice)

### 2.2 Create Free Database
1. **Click**: "Build a Database"
2. **Choose**: "FREE" tier (M0)
3. **Provider**: Google Cloud
4. **Region**: Choose closest to you
5. **Click**: "Create"

### 2.3 Set Up Database Access
1. **Username**: `escom_admin`
2. **Password**: `Escom2024!`
3. **Network Access**: `0.0.0.0/0` (Allow all IPs)

### 2.4 Get Connection String
1. **Click**: "Connect" on your cluster
2. **Choose**: "Connect your application"
3. **Copy** the connection string
4. **Modify** to include `/escom` at the end

**Example Connection String:**
```
mongodb+srv://escom_admin:Escom2024!@cluster0.xxxxx.mongodb.net/escom?retryWrites=true&w=majority
```

### 2.5 Test Connection (Terminal)
```bash
# Test MongoDB connection (replace with your actual connection string)
mongosh "mongodb+srv://escom_admin:Escom2024!@cluster0.xxxxx.mongodb.net/escom"
```

---

## **Step 3: Render Backend Deployment (Manual + Terminal)**

### 3.1 Create Render Account
1. **Go to**: https://render.com
2. **Sign up** with GitHub

### 3.2 Deploy Backend Service
1. **Click**: "New +" → "Web Service"
2. **Connect**: Your GitHub repository
3. **Configure**:
   - **Name**: `escom-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3.3 Set Environment Variables
Click "Environment" tab and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `PORT` | `3002` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `escom-super-secret-2024` |
| `CORS_ORIGIN` | `https://citisci.netlify.app` |
| `NODE_VERSION` | `18` |
| `NPM_FLAGS` | `--legacy-peer-deps` |

### 3.4 Deploy
1. **Click**: "Create Web Service"
2. **Wait**: 2-3 minutes for deployment
3. **Copy** your service URL (e.g., `https://escom-backend.onrender.com`)

### 3.5 Test Backend (Terminal)
```bash
# Test health endpoint
curl https://your-backend-name.onrender.com/health

# Test API endpoint
curl https://your-backend-name.onrender.com/api/admin/dashboard
```

---

## **Step 4: Update Frontend Configuration (Terminal)**

### 4.1 Update config.js
```bash
# Replace YOUR_BACKEND_URL with your actual Render URL
sed -i.bak "s|https://your-backend-url.onrender.com|https://your-backend-name.onrender.com|g" src/config.js

# Verify the change
grep "API_BASE_URL" src/config.js
```

### 4.2 Commit and Push Changes
```bash
# Add changes
git add .

# Commit
git commit -m "Update frontend config with Render backend URL"

# Push to GitHub
git push
```

---

## **Step 5: Deploy Frontend to Netlify (Terminal)**

### 5.1 Build Frontend
```bash
# Build the frontend
npm run build

# Verify build was successful
ls -la dist/
```

### 5.2 Deploy to Netlify
```bash
# Deploy to Netlify
netlify deploy --prod --dir=dist

# Verify deployment
curl -s https://citisci.netlify.app/ | head -c 100
```

---

## **Step 6: Test Everything (Terminal)**

### 6.1 Test Backend
```bash
# Test backend health
curl https://your-backend-name.onrender.com/health

# Test backend API
curl https://your-backend-name.onrender.com/api/admin/dashboard
```

### 6.2 Test Frontend
```bash
# Test frontend
curl -s https://citisci.netlify.app/ | head -c 100
```

### 6.3 Test Complete App
1. **Visit**: https://citisci.netlify.app/
2. **Login**: `admin@escom.com` / `admin123`
3. **Should work** without network errors!

---

## **🎉 Final Result**

After completing all steps, you'll have:

- **Frontend**: https://citisci.netlify.app/ ✅ (Always online)
- **Backend**: https://your-backend-name.onrender.com ✅ (Always online)
- **Database**: MongoDB Atlas ✅ (Connected to tushantkaura@gmail.com)
- **Full App**: Working from anywhere in the world! 🌍

---

## **🔑 Admin Login Credentials**
- **Email**: `admin@escom.com`
- **Password**: `admin123`

---

## **🚨 Troubleshooting**

### **If Backend Fails:**
1. Check Render logs for errors
2. Verify environment variables are set correctly
3. Ensure MongoDB connection string is valid

### **If Frontend Fails:**
1. Check browser console for errors
2. Verify backend URL in config.js
3. Ensure backend is running and accessible

### **If Database Fails:**
1. Check MongoDB Atlas connection string
2. Verify network access settings
3. Test connection from terminal

---

## **📱 Quick Commands Summary**

```bash
# Complete setup in one go
./setup-everything.sh

# Or follow step by step using the commands above
```

**Need Help?** Each step has detailed instructions. Take your time and follow them carefully! 