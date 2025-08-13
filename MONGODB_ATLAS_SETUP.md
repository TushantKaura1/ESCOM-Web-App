# 🗄️ MongoDB Atlas Setup with Gmail Account

## 📧 **Step 1: Create MongoDB Atlas Account with Your Gmail**

### 1.1 Go to MongoDB Atlas
- **Visit**: [mongodb.com/atlas](https://mongodb.com/atlas)
- **Click**: "Try Free" or "Get Started Free"

### 1.2 Sign Up with Gmail
- **Email**: `tushantkaura@gmail.com`
- **Password**: Create a strong password
- **Account Name**: `ESCOM-Citizen-Scientist` (or your preference)

### 1.3 Verify Your Email
- Check your Gmail inbox
- Click the verification link from MongoDB

## 🌐 **Step 2: Create Free Database Cluster**

### 2.1 Choose Plan
- **Select**: "FREE" tier (M0 - Shared Clusters)
- **Click**: "Create"

### 2.2 Choose Cloud Provider
- **Provider**: Google Cloud (recommended for Gmail users)
- **Region**: Choose closest to you (e.g., `us-central1` for US)
- **Click**: "Next"

### 2.3 Cluster Details
- **Cluster Name**: `escom-cluster` (or leave default)
- **Click**: "Create Cluster"

## 🔐 **Step 3: Set Up Database Access**

### 3.1 Create Database User
- **Username**: `escom_admin`
- **Password**: `Escom2024!` (or your preferred strong password)
- **Database User Privileges**: "Read and write to any database"
- **Click**: "Add User"

### 3.2 Network Access
- **IP Address**: `0.0.0.0/0` (Allow access from anywhere)
- **Description**: "Allow all IPs for development"
- **Click**: "Confirm"

## 🔗 **Step 4: Get Connection String**

### 4.1 Connect to Cluster
- **Click**: "Connect" button on your cluster
- **Choose**: "Connect your application"

### 4.2 Copy Connection String
You'll get a string like this:
```
mongodb+srv://escom_admin:Escom2024!@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 4.3 Modify for Your Database
Replace the end with your database name:
```
mongodb+srv://escom_admin:Escom2024!@cluster0.xxxxx.mongodb.net/escom?retryWrites=true&w=majority
```

## 📱 **Step 5: Test Connection**

### 5.1 Test from Your Local Machine
```bash
# Test the connection (replace with your actual connection string)
mongosh "mongodb+srv://escom_admin:Escom2024!@cluster0.xxxxx.mongodb.net/escom"
```

### 5.2 Create Test Collection
```javascript
// In MongoDB shell
use escom
db.test.insertOne({message: "Connection successful!", timestamp: new Date()})
db.test.find()
```

## 🎯 **Your MongoDB Atlas Credentials**

| Field | Value |
|-------|-------|
| **Email** | `tushantkaura@gmail.com` |
| **Username** | `escom_admin` |
| **Password** | `Escom2024!` (or your chosen password) |
| **Database** | `escom` |
| **Cluster** | `escom-cluster` |

## 🔒 **Security Notes**
- **Password**: Keep your database password secure
- **Network Access**: `0.0.0.0/0` allows access from anywhere (good for development)
- **Production**: Consider restricting IP addresses for production use

## ✅ **Next Steps**
After completing this setup:
1. **Copy your connection string**
2. **Deploy backend to Render** (next guide)
3. **Connect everything together**

---
**Need Help?** The MongoDB Atlas interface is very user-friendly. Take your time with each step! 