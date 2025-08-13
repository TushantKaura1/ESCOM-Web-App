# 🚀 Netlify Deployment Guide for ESCOM Citizen Scientist App

## 📋 Current Status
- ✅ **Frontend**: Deployed on Netlify at [https://citisci.netlify.app/](https://citisci.netlify.app/)
- ✅ **Backend**: Running locally on `localhost:3002`
- ❌ **Issue**: Frontend can't connect to backend when deployed

## 🔧 Solution: Deploy Backend to Cloud

### **Option 1: Render (Recommended - Free)**
1. **Sign up** at [render.com](https://render.com)
2. **Create New Web Service**
3. **Connect your GitHub repository**
4. **Configure:**
   ```
   Name: escom-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```
5. **Add Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/escom
   PORT=3002
   JWT_SECRET=your-secret-key
   ```

### **Option 2: Railway (Alternative - Free)**
1. **Sign up** at [railway.app](https://railway.app)
2. **Create New Project**
3. **Deploy from GitHub**
4. **Set environment variables**

### **Option 3: Heroku (Alternative)**
1. **Sign up** at [heroku.com](https://heroku.com)
2. **Create New App**
3. **Deploy from GitHub**

## 🗄️ Database Setup

### **MongoDB Atlas (Free Cloud Database)**
1. **Sign up** at [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create Free Cluster**
3. **Get Connection String**
4. **Update backend environment variables**

## 🔄 Update Frontend Configuration

### **Step 1: Update config.js**
```javascript
// src/config.js
const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.onrender.com'  // ← Change this!
    : 'http://localhost:3002',
  // ... rest of config
};
```

### **Step 2: Rebuild and Deploy**
```bash
# Build frontend
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 🧪 Test Your Deployment

### **1. Test Backend API**
```bash
curl https://your-backend-url.onrender.com/api/admin/dashboard
```

### **2. Test Frontend Connection**
- Visit [https://citisci.netlify.app/](https://citisci.netlify.app/)
- Try to login with: `admin@escom.com` / `admin123`
- Check browser console for API calls

## 🔑 Admin Login Credentials
- **Email**: `admin@escom.com`
- **Password**: `admin123`

## 🚨 Troubleshooting

### **Common Issues:**
1. **CORS Error**: Backend needs to allow Netlify domain
2. **Database Connection**: Check MongoDB Atlas connection string
3. **Environment Variables**: Ensure all are set in cloud platform
4. **Port Conflicts**: Backend should use `process.env.PORT`

### **Debug Steps:**
1. Check backend logs in cloud platform
2. Check browser console for errors
3. Verify API endpoints are accessible
4. Test database connection

## 📱 Final Result
Once deployed, your app will be fully functional at:
- **Frontend**: [https://citisci.netlify.app/](https://citisci.netlify.app/)
- **Backend**: `https://your-backend-url.onrender.com`
- **Database**: MongoDB Atlas (cloud)

## 🎯 Next Steps
1. Deploy backend to Render/Railway
2. Update `config.js` with backend URL
3. Rebuild and redeploy frontend
4. Test all functionality
5. Share your live app!

---
**Need Help?** Check the backend logs and browser console for specific error messages. 