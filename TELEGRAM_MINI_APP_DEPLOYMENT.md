# 🚀 Telegram Mini App Deployment Guide

## 📋 **Current Status**
- ✅ Frontend: Deployed to Netlify (https://citisci.netlify.app/)
- ✅ Backend: Running locally (localhost:3001)
- ✅ Database: MongoDB localhost:27017
- ✅ Authentication: JWT-based with localStorage persistence
- ✅ Page Reload Issue: FIXED with localStorage persistence

## 🎯 **Next Steps to Make This a Real Telegram Mini App**

### **Phase 1: Backend Deployment to Render.com**

#### **1.1 Prepare Backend for Production**
```bash
# In src/mongo-api/ directory
npm install
npm audit fix
```

#### **1.2 Create render.yaml for Auto-Deployment**
```yaml
services:
  - type: web
    name: citisci-backend
    env: node
    buildCommand: npm install
    startCommand: node simple-server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        value: mongodb+srv://your-username:your-password@your-cluster.mongodb.net/escom
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ORIGIN
        value: https://citisci.netlify.app
      - key: PORT
        value: 10000
```

#### **1.3 Deploy to Render.com**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Set environment variables
6. Deploy!

### **Phase 2: Database Migration to MongoDB Atlas**

#### **2.1 Create MongoDB Atlas Account**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Create new cluster (free tier)
4. Get connection string

#### **2.2 Update Backend Environment Variables**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/escom
```

### **Phase 3: Frontend Production Configuration**

#### **3.1 Update config.js**
```javascript
// Change this line in src/config.js
baseUrl = 'https://your-backend-name.onrender.com';  // Your actual Render URL
```

#### **3.2 Rebuild and Deploy Frontend**
```bash
npm run build
# Netlify will auto-deploy from GitHub
```

### **Phase 4: Telegram Bot Integration**

#### **4.1 Create Telegram Bot**
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot`
3. Choose bot name and username
4. Get bot token

#### **4.2 Set Up Web App**
1. Message BotFather: `/setmenubutton`
2. Choose your bot
3. Set button text: "Open ESCOM App"
4. Set Web App URL: `https://citisci.netlify.app`

#### **4.3 Add Bot Commands**
```
/start - Welcome message
/help - Show available commands
/app - Open the ESCOM Citizen Scientist app
```

### **Phase 5: Testing & Launch**

#### **5.1 Test Production Environment**
1. Test admin login
2. Test user registration/login
3. Test all features
4. Verify data persistence

#### **5.2 Launch Checklist**
- [ ] Backend deployed to Render
- [ ] Database migrated to Atlas
- [ ] Frontend updated with production URLs
- [ ] Telegram bot configured
- [ ] All features working
- [ ] Error handling tested

## 🔧 **Environment Variables for Production**

### **Backend (.env on Render)**
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/escom
JWT_SECRET=your-super-secret-jwt-key-here
CORS_ORIGIN=https://citisci.netlify.app
PORT=10000
```

### **Frontend (config.js)**
```javascript
API_BASE_URL: 'https://your-backend-name.onrender.com'
```

## 📱 **Telegram Mini App Features**

### **Current Features**
- ✅ User authentication (citizen/admin)
- ✅ FAQ management
- ✅ User management
- ✅ Updates/announcements
- ✅ Real-time data sync
- ✅ Mobile-optimized UI
- ✅ localStorage persistence

### **Future Enhancements**
- 🔄 Push notifications
- 📊 Data analytics
- 🌍 Multi-language support
- 🔐 Advanced security
- 📱 Offline support

## 🚨 **Troubleshooting**

### **Common Issues**
1. **CORS errors**: Check CORS_ORIGIN in backend
2. **Database connection**: Verify MongoDB Atlas connection string
3. **JWT errors**: Check JWT_SECRET is set
4. **Frontend not loading**: Verify API_BASE_URL is correct

### **Debug Commands**
```bash
# Check backend status
curl https://your-backend.onrender.com/health

# Check frontend
curl https://citisci.netlify.app/

# Test database connection
curl https://your-backend.onrender.com/api/admin/database/status
```

## 🎉 **Success Metrics**
- Users can access app via Telegram
- All features work in production
- Data persists across sessions
- Admin dashboard fully functional
- Real-time updates working

---

## 📞 **Need Help?**
1. Check console logs in browser
2. Verify environment variables
3. Test endpoints individually
4. Check Render.com deployment logs
5. Verify MongoDB Atlas connection

**Your app is almost ready for production! 🚀** 