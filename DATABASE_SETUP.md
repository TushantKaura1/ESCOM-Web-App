# 🗄️ MongoDB Database Setup Guide

## 📋 Prerequisites

1. **MongoDB installed** on your system
2. **Node.js** and **npm** installed
3. **Project dependencies** installed (`npm install`)

## 🚀 Quick Start

### 1. Start MongoDB

**On macOS (using Homebrew):**
```bash
# Install MongoDB if not already installed
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Check if MongoDB is running
brew services list | grep mongodb
```

**On Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or start manually
"C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"
```

**On Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Check status
sudo systemctl status mongod
```

### 2. Test Connection

Run the test script to verify MongoDB is working:

```bash
node test-db.js
```

Expected output:
```
🧪 Testing MongoDB connection...
🔄 Connecting to MongoDB at: mongodb://localhost:27017
✅ Successfully connected to MongoDB
📊 Database: escom
🌐 Connection URL: mongodb://localhost:27017
✅ Connection successful!
🏥 Health check: PASSED
📚 Collections found: 0
✍️ Write test: PASSED
📖 Read test: PASSED
🧹 Cleanup: PASSED
🎉 All tests passed! MongoDB is working correctly.
✅ MongoDB connection closed
```

### 3. Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017
DB_NAME=escom

# Telegram Bot Configuration
BOT_TOKEN=your_telegram_bot_token_here
WEBAPP_URL=https://your-domain.com

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Secret (change this in production!)
JWT_SECRET=your_super_secret_jwt_key_here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 🔧 Configuration Options

### MongoDB Connection String

**Default (Local):**
```
mongodb://localhost:27017
```

**With Authentication:**
```
mongodb://username:password@localhost:27017
```

**With Database Name:**
```
mongodb://localhost:27017/escom
```

**MongoDB Atlas (Cloud):**
```
mongodb+srv://username:password@cluster.mongodb.net/escom
```

### Database Name

The default database name is `escom`. You can change it by setting the `DB_NAME` environment variable.

## 📊 Database Collections

The application will automatically create these collections:

- **users** - User profiles and authentication data
- **readings** - Environmental monitoring data
- **training** - Training completion records
- **sessions** - User session data

## 🛠️ Troubleshooting

### Connection Refused
```
❌ MongoDB connection failed: MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
1. Make sure MongoDB is running
2. Check if port 27017 is available
3. Verify MongoDB installation

### Authentication Failed
```
❌ MongoDB connection failed: MongoServerError: Authentication failed
```

**Solution:**
1. Check username/password in connection string
2. Verify user has proper permissions
3. Ensure authentication database is correct

### Database Not Found
```
❌ MongoDB connection failed: MongoServerError: Database not found
```

**Solution:**
1. Database will be created automatically on first use
2. Check database name in connection string
3. Verify user has create database permissions

## 🔍 Monitoring

### Check MongoDB Status
```bash
# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod

# Windows
sc query MongoDB
```

### View MongoDB Logs
```bash
# macOS
tail -f /usr/local/var/log/mongodb/mongo.log

# Linux
sudo journalctl -u mongod -f

# Windows
# Check MongoDB installation directory logs
```

### Connect via MongoDB Shell
```bash
# Connect to local MongoDB
mongosh

# Connect to specific database
mongosh escom

# Connect with authentication
mongosh --username your_username --password your_password
```

## 🚀 Production Deployment

### Environment Variables
- Use strong, unique JWT secrets
- Set `NODE_ENV=production`
- Use MongoDB Atlas or managed MongoDB service
- Enable authentication and SSL

### Security
- Enable MongoDB authentication
- Use SSL/TLS connections
- Restrict network access
- Regular backups
- Monitor database performance

## 📚 Additional Resources

- [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)
- [MongoDB Connection String](https://docs.mongodb.com/manual/reference/connection-string/)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 