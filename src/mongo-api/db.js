// db.js - Enhanced MongoDB Connection
const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection configuration
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escom';
const DB_NAME = process.env.DB_NAME || 'escom';

// Create MongoDB client with enhanced options
const client = new MongoClient(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 30000,
  retryWrites: true,
  w: 'majority'
});

// Database connection state
let db = null;
let isConnected = false;

async function connectDB() {
  try {
    if (isConnected && db) {
      console.log("✅ Already connected to MongoDB");
      return db;
    }

    console.log("🔄 Connecting to MongoDB at:", MONGO_URI);
    await client.connect();
    
    // Test the connection
    await client.db('admin').command({ ping: 1 });
    
    db = client.db(DB_NAME);
    isConnected = true;
    
    console.log("✅ Successfully connected to MongoDB");
    console.log("📊 Database:", DB_NAME);
    console.log("🌐 Connection URL:", MONGO_URI);
    
    return db;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    console.error("🔧 Please ensure MongoDB is running on localhost:27017");
    console.error("💡 You can start MongoDB with: brew services start mongodb-community");
    process.exit(1);
  }
}

async function disconnectDB() {
  try {
    if (client) {
      await client.close();
      isConnected = false;
      db = null;
      console.log("✅ MongoDB connection closed");
    }
  } catch (err) {
    console.error("❌ Error closing MongoDB connection:", err);
  }
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log("🛑 Shutting down MongoDB connection...");
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log("🛑 Shutting down MongoDB connection...");
  await disconnectDB();
  process.exit(0);
});

// Health check function
async function checkConnection() {
  try {
    if (!isConnected || !db) {
      return false;
    }
    await db.command({ ping: 1 });
    return true;
  } catch (err) {
    console.error("❌ Database health check failed:", err);
    return false;
  }
}

// Get database instance
function getDB() {
  if (!isConnected || !db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
}

module.exports = {
  connectDB,
  disconnectDB,
  getDB,
  checkConnection,
  isConnected: () => isConnected
};
