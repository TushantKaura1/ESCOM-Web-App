# 🔐 Dual-Mode Authentication System

## 📋 Overview

The ESCOM Citizen Scientist Assistant now supports two distinct user modes:

- **👑 Admin Mode**: Administrative access with full system control
- **👥 Citizen Scientist Mode**: Community participation and monitoring

## 🚀 How It Works

### **1. Mode Selection Screen**
Users are first presented with a mode selection screen where they choose between:
- **Admin Mode**: Red button with crown icon
- **Citizen Scientist Mode**: Green button with people icon

### **2. Telegram Authentication**
Both modes require Telegram authentication:
- Users must be logged into Telegram
- The app verifies user identity through Telegram Web App API
- Admin mode requires additional privilege verification

### **3. Role-Based Access**
- **Admins**: Access to administrative controls, user management, analytics
- **Citizens**: Access to community features, monitoring tools, FAQs

## 🔧 Configuration

### **Admin Setup**

#### **1. Configure Admin IDs**
Edit `config/admin.js` or set environment variable:

```bash
# Environment variable (comma-separated)
ADMIN_IDS=123456789,987654321,555666777

# Or edit config/admin.js directly
ADMIN_IDS: [123456789, 987654321, 555666777]
```

#### **2. Admin Permissions**
Configure admin features in `config/admin.js`:

```javascript
PERMISSIONS: {
  USER_MANAGEMENT: true,
  DATA_ANALYTICS: true,
  SYSTEM_SETTINGS: true,
  REPORTS: true,
  ADMIN_DASHBOARD: true
}
```

### **Environment Variables**
```bash
# Required
BOT_TOKEN=your_telegram_bot_token
WEBAPP_URL=https://your-domain.com
MONGODB_URI=mongodb://localhost:27017/escom

# Optional (for admin configuration)
ADMIN_IDS=123456789,987654321
```

## 📱 User Interface

### **Mode Selection**
```
🌊 ESCOM
Choose Your Mode
Select how you want to access the system

[👑 Admin Mode]
Administrative access and controls

[👥 Citizen Scientist Mode]
Community monitoring and participation
```

### **Admin Mode Features**
- **📊 Admin Dashboard**: System overview and analytics
- **👥 User Management**: Manage citizen scientists
- **📈 Data Analytics**: View monitoring data and trends
- **⚙️ System Settings**: Configure system parameters
- **📋 Reports**: Generate and view reports

### **Citizen Mode Features**
- **❓ FAQs**: Access to help and information
- **👥 Community**: Connect with other scientists
- **📊 Dashboard**: Personal monitoring dashboard
- **👤 Profile**: Manage personal information

## 🔐 Security Features

### **Admin Verification**
1. **Telegram ID Check**: Verifies user's Telegram ID against admin list
2. **Role Assignment**: Automatically assigns admin role in database
3. **Access Control**: Restricts admin features to verified users
4. **Session Management**: Tracks admin sessions and activity

### **Citizen Verification**
1. **Telegram Authentication**: Uses Telegram's built-in authentication
2. **Profile Creation**: Creates citizen profile on first login
3. **Community Access**: Grants access to citizen features
4. **Data Privacy**: Protects citizen data from unauthorized access

## 📊 Database Schema

### **User Model with Roles**
```javascript
{
  telegramId: Number,        // Unique Telegram ID
  username: String,          // Telegram username
  firstName: String,         // First name
  lastName: String,          // Last name
  role: String,              // 'admin' or 'citizen'
  isAdmin: Boolean,          // Admin flag
  profile: {
    name: String,
    village: String,
    team: String,
    parameters: String,
    since: String,
    experience: String
  },
  stats: {
    totalReadings: Number,
    streak: Number,
    accuracy: Number,
    lastReading: Date
  },
  createdAt: Date,
  lastActive: Date
}
```

## 🛠️ Implementation Details

### **Frontend (React)**
- **Mode Selection**: `AuthScreen` component with dual-mode buttons
- **Role-Based UI**: Different menus for admin and citizen users
- **Telegram Integration**: Uses `window.Telegram.WebApp` for authentication
- **State Management**: Tracks user mode and role in component state

### **Backend (Node.js/Telegraf)**
- **Admin Verification**: Checks Telegram ID against admin list
- **Role Assignment**: Automatically assigns roles based on verification
- **Data Handlers**: Separate handlers for admin and citizen logins
- **Database Updates**: Updates user records with role information

### **Bot Commands**
- **Admin Login**: `/admin` - Direct admin access (if authorized)
- **Citizen Login**: `/start` - Standard citizen access
- **Role Check**: `/role` - Check current user role

## 🔄 Authentication Flow

### **Admin Flow**
1. User selects "Admin Mode"
2. Clicks "Admin Login via Telegram"
3. System checks Telegram ID against admin list
4. If authorized: Creates/updates admin user record
5. Grants access to admin dashboard
6. Sends confirmation message via bot

### **Citizen Flow**
1. User selects "Citizen Scientist Mode"
2. Clicks "Login with Telegram" or "New Citizen Setup"
3. System verifies Telegram authentication
4. Creates/updates citizen user record
5. Grants access to citizen features
6. Sends welcome message via bot

## 🚨 Error Handling

### **Access Denied**
- **Admin Mode**: Shows "Access Denied" message for unauthorized users
- **Telegram Required**: Prompts users to login through Telegram
- **Network Errors**: Graceful fallback with retry options

### **Data Validation**
- **Profile Data**: Validates required fields
- **Role Assignment**: Ensures proper role assignment
- **Database Errors**: Handles connection and save errors

## 📈 Monitoring and Analytics

### **Admin Analytics**
- **User Statistics**: Total users, active users, new registrations
- **System Usage**: Feature usage, error rates, performance metrics
- **Community Growth**: Citizen scientist participation trends
- **Data Quality**: Monitoring data accuracy and completeness

### **Citizen Analytics**
- **Personal Stats**: Individual monitoring contributions
- **Community Rank**: Position among other citizen scientists
- **Achievement Tracking**: Streaks, accuracy, participation milestones
- **Progress Reports**: Personal growth and contribution history

## 🔧 Troubleshooting

### **Common Issues**

#### **Admin Access Denied**
```bash
# Check admin IDs configuration
echo $ADMIN_IDS
# Should contain your Telegram ID

# Verify in config file
cat config/admin.js
# Check ADMIN_IDS array
```

#### **Telegram Authentication Fails**
```bash
# Check bot token
echo $BOT_TOKEN
# Should be valid bot token

# Verify web app URL
echo $WEBAPP_URL
# Should be accessible HTTPS URL
```

#### **Database Connection Issues**
```bash
# Test MongoDB connection
node test-db.js
# Should show successful connection
```

### **Debug Mode**
Enable debug logging by setting:
```bash
NODE_ENV=development
DEBUG=true
```

## 🚀 Deployment

### **Production Setup**
1. **Set Environment Variables**:
   ```bash
   BOT_TOKEN=your_production_bot_token
   WEBAPP_URL=https://your-production-domain.com
   MONGODB_URI=mongodb://your-production-db
   ADMIN_IDS=your_admin_telegram_ids
   ```

2. **Configure Admin IDs**:
   - Replace placeholder IDs with actual admin Telegram IDs
   - Use comma-separated format for multiple admins

3. **Security Considerations**:
   - Use HTTPS for web app URL
   - Secure MongoDB connection
   - Regularly rotate admin IDs
   - Monitor access logs

### **Testing**
1. **Admin Mode Test**:
   - Login with admin Telegram account
   - Verify admin dashboard access
   - Test admin features

2. **Citizen Mode Test**:
   - Login with regular Telegram account
   - Verify citizen features access
   - Test community features

## 📚 Additional Resources

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [Telegram Web App Documentation](https://core.telegram.org/bots/webapps)
- [MongoDB User Management](https://docs.mongodb.com/manual/reference/method/db.createUser/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practices-security.html) 