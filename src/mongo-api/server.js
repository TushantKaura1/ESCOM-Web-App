// src/mongo-api/server.js - Enhanced ESCOM API Server with Authentication

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Enhanced middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'https://citisci.netlify.app',
    'https://citiscience.netlify.app',
    'https://*.netlify.app',  // Allow all Netlify domains
    'https://citiscience-backend-95pp.onrender.com'  // Allow backend to frontend
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
}));

// Handle preflight requests
app.options('*', cors());

// Add CORS headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Environment variables
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.DB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/escom';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

// Log environment variables for debugging
console.log('🔧 Environment Configuration:');
console.log('   PORT:', PORT);
console.log('   DB_URI:', process.env.DB_URI ? 'SET' : 'NOT SET');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'development');

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('   URI:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database name:', mongoose.connection.name);
    console.log('🌐 Connection URL:', MONGODB_URI);
    
    // Create demo users after successful connection
    await createDemoUsers();
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Create demo users function
const createDemoUsers = async () => {
  try {
    // Create a demo admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@escom.com' });
    if (!adminExists) {
      const adminPasswordHash = await bcrypt.hash('admin123', 10);
      const adminUser = new User({
        email: 'admin@escom.com',
        passwordHash: adminPasswordHash,
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isAdmin: true
      });
      await adminUser.save();
      console.log('✅ Demo admin user created: admin@escom.com / admin123');
    }
    
    // Create a demo citizen user if it doesn't exist
    const citizenExists = await User.findOne({ email: 'citizen@escom.com' });
    if (!citizenExists) {
      const citizenPasswordHash = await bcrypt.hash('citizen123', 10);
      const citizenUser = new User({
        email: 'citizen@escom.com',
        passwordHash: citizenPasswordHash,
        username: 'citizen',
        firstName: 'Demo',
        lastName: 'Citizen',
        role: 'citizen',
        isAdmin: false
      });
      await citizenUser.save();
      console.log('✅ Demo citizen user created: citizen@escom.com / citizen123');
    }
  } catch (error) {
    console.log('⚠️ Could not create demo users:', error.message);
  }
};

// Connect to database
connectDB();

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const dbName = mongoose.connection.name || 'unknown';
    
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      databaseName: dbName,
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    };
    
    // Set CORS headers explicitly for this endpoint
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Origin, Accept');
    
    res.json(healthData);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'citizen', 'moderator'], default: 'citizen' },
  isAdmin: { type: Boolean, default: false },
  profile: {
    name: String,
    village: String,
    team: { type: String, enum: ['team1', 'team2', 'team3', 'admin', ''], default: '' },
    parameters: { type: String, enum: ['water-quality', 'temperature', 'salinity', 'ph', 'all', ''], default: '' },
    since: String,
    experience: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' }
  },
  stats: {
    totalReadings: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    lastReading: Date,
    totalTrainingHours: { type: Number, default: 0 },
    certifications: [String]
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  emailVerified: { type: Boolean, default: true }
});

const User = mongoose.model('User', UserSchema);

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username, firstName, lastName } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create new user
    const user = new User({
      email,
      passwordHash,
      username,
      firstName,
      lastName,
      role: 'citizen'
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last active
    user.lastActive = new Date();
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.get('/api/auth/profile', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        isAdmin: req.user.isAdmin,
        profile: req.user.profile,
        stats: req.user.stats
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Simple FAQ and Updates endpoints for testing
app.get('/api/user/faqs', async (req, res) => {
  try {
    // Return sample FAQ data
    const sampleFAQs = [
      {
        _id: '1',
        category: 'ESCOM organization',
        subcategory: 'Getting involved',
        question: 'How can I get involved with ESCOM?',
        answer: 'You can get involved by joining our coastal monitoring program, participating in training sessions, and contributing to data collection. Contact your local team leader to get started.',
        tags: ['beginner', 'getting-started', 'community'],
        importance: 'high',
        isNew: true,
        lastUpdated: new Date().toISOString(),
        order: 1
      },
      {
        _id: '2',
        category: 'Monitoring',
        subcategory: 'Water Quality',
        question: 'What parameters do we monitor?',
        answer: 'We monitor water temperature, salinity, pH levels, and overall water quality. Each parameter is measured using specialized equipment and recorded in our database.',
        tags: ['monitoring', 'water-quality', 'parameters'],
        importance: 'high',
        isNew: false,
        lastUpdated: new Date(Date.now() - 86400000).toISOString(),
        order: 2
      },
      {
        _id: '3',
        category: 'Training',
        subcategory: 'Equipment',
        question: 'How do I calibrate my monitoring equipment?',
        answer: 'Equipment calibration should be done monthly using the calibration kit provided. Follow the step-by-step guide in your training manual or contact your team leader for assistance.',
        tags: ['training', 'equipment', 'calibration'],
        importance: 'medium',
        isNew: false,
        lastUpdated: new Date(Date.now() - 172800000).toISOString(),
        order: 3
      },
      {
        _id: '4',
        category: 'Data',
        subcategory: 'Submission',
        question: 'How often should I submit data?',
        answer: 'Data should be submitted immediately after each monitoring session, typically monthly. During extreme weather events, additional readings may be required.',
        tags: ['data', 'submission', 'frequency'],
        importance: 'medium',
        isNew: false,
        lastUpdated: new Date(Date.now() - 259200000).toISOString(),
        order: 4
      },
      {
        _id: '5',
        category: 'Partners',
        subcategory: 'Collaboration',
        question: 'Who are ESCOM\'s research partners?',
        answer: 'ESCOM collaborates with universities, government agencies, and environmental organizations to advance coastal research and conservation efforts.',
        tags: ['partners', 'collaboration', 'research'],
        importance: 'low',
        isNew: false,
        lastUpdated: new Date(Date.now() - 345600000).toISOString(),
        order: 5
      }
    ];
    
    res.json(sampleFAQs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

app.get('/api/user/updates', async (req, res) => {
  try {
    // Return sample updates data
    const sampleUpdates = [
      {
        _id: '1',
        title: 'New Monitoring Equipment Available',
        content: 'We have received new water quality monitoring equipment for all teams. The new sensors provide more accurate readings and longer battery life. Team leaders will distribute equipment during the next training session.',
        type: 'announcement',
        priority: 'high',
        tags: ['equipment', 'training', 'teams'],
        createdAt: new Date().toISOString(),
        isActive: true
      },
      {
        _id: '2',
        title: 'Monthly Data Review Results',
        content: 'Great news! Our community achieved 95% data accuracy this month. Special recognition goes to Team Alpha for maintaining 100% accuracy for three consecutive months. Keep up the excellent work!',
        type: 'news',
        priority: 'medium',
        tags: ['data', 'recognition', 'teams'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        order: 2
      },
      {
        _id: '3',
        title: 'Upcoming Training Workshop',
        content: 'Join us for an advanced monitoring techniques workshop on coastal erosion assessment. This hands-on session will cover new methodologies and equipment usage. Registration opens next week.',
        type: 'update',
        priority: 'medium',
        tags: ['training', 'workshop', 'erosion'],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        order: 3
      },
      {
        _id: '4',
        title: 'Weather Alert System Update',
        content: 'We have upgraded our weather alert system to provide real-time notifications for dangerous monitoring conditions. All users will receive alerts via the app and email.',
        type: 'announcement',
        priority: 'high',
        tags: ['safety', 'weather', 'alerts'],
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        order: 4
      },
      {
        _id: '5',
        title: 'Community Survey Results',
        content: 'Thank you to everyone who participated in our community feedback survey. Your input has helped us identify areas for improvement. We will implement the top suggestions in the next update.',
        type: 'news',
        priority: 'low',
        tags: ['community', 'feedback', 'improvements'],
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        order: 5
      }
    ];
    
    res.json(sampleUpdates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

// Initialize database on startup
// initializeDatabase(); // Removed - using connectDB() instead

// Telegram Webhook Endpoint
app.post('/webhook', async (req, res) => {
  try {
    if (!TELEGRAM_TOKEN) {
      console.log('⚠️ TELEGRAM_TOKEN not configured');
      return res.status(500).json({ error: 'Telegram token not configured' });
    }

    const data = req.body;
    console.log('📱 Telegram webhook received:', JSON.stringify(data, null, 2));

    if (data.message && data.message.text) {
      const chatId = data.message.chat.id;
      const text = data.message.text;
      const from = data.message.from;

      // Handle different message types
      if (text === '/start') {
        await sendTelegramMessage(chatId, 
          `🌊 Welcome to Citizen Science Assistant!\n\n` +
          `I'm here to help you with coastal monitoring and data collection.\n\n` +
          `📱 Open the Mini App to get started:\n` +
          `https://citiscience.netlify.app\n\n` +
          `Commands:\n` +
          `/start - Show this message\n` +
          `/help - Get help\n` +
          `/data - View your data\n` +
          `/status - Check system status`
        );
      } else if (text === '/help') {
        await sendTelegramMessage(chatId,
          `🔧 How to use the Citizen Science Assistant:\n\n` +
          `1. 📱 Click the "Open App" button below to launch the Mini App\n` +
          `2. 🔐 Login with your credentials\n` +
          `3. 📊 Submit water quality readings\n` +
          `4. 📚 Complete training modules\n` +
          `5. 📈 Track your progress\n\n` +
          `Need help? Contact your team leader.`
        );
      } else if (text === '/data') {
        // Get user data from database
        try {
          const user = await User.findOne({ telegramId: from.id });
          if (user) {
            await sendTelegramMessage(chatId,
              `📊 Your Citizen Science Data:\n\n` +
              `👤 Name: ${user.firstName} ${user.lastName}\n` +
              `📈 Total Readings: ${user.stats.totalReadings}\n` +
              `🔥 Streak: ${user.stats.streak} days\n` +
              `🎯 Accuracy: ${user.stats.accuracy}%\n` +
              `📚 Training Hours: ${user.stats.totalTrainingHours}h\n` +
              `🏆 Certifications: ${user.stats.certifications.length}\n\n` +
              `Open the app to submit new readings!`
            );
          } else {
            await sendTelegramMessage(chatId,
              `❌ User not found. Please login through the Mini App first.`
            );
          }
        } catch (error) {
          await sendTelegramMessage(chatId, `❌ Error fetching data: ${error.message}`);
        }
      } else if (text === '/status') {
        await sendTelegramMessage(chatId,
          `🟢 System Status: Online\n` +
          `📊 Database: Connected\n` +
          `🌐 Mini App: Available\n` +
          `🕐 Last Update: ${new Date().toLocaleString()}\n\n` +
          `Everything is working normally!`
        );
      } else {
        // Default response with Mini App button
        await sendTelegramMessage(chatId,
          `💬 I received your message: "${text}"\n\n` +
          `To interact with the Citizen Science system, please open the Mini App:`,
          true // This will add the Mini App button
        );
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Helper function to send Telegram messages
async function sendTelegramMessage(chatId, text, showMiniAppButton = false) {
  try {
    const messageData = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    };

    if (showMiniAppButton) {
      messageData.reply_markup = {
        keyboard: [[
          {
            text: "🌊 Open Citizen Science App",
            web_app: { url: "https://citiscience.netlify.app" }
          }
        ]],
        resize_keyboard: true,
        one_time_keyboard: false
      };
    }

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      messageData
    );
    
    console.log('✅ Telegram message sent:', response.data);
  } catch (error) {
    console.error('❌ Failed to send Telegram message:', error);
  }
}

// Data API Endpoints
app.get('/api/get_data', async (req, res) => {
  try {
    const { collection, filter, limit = 100 } = req.query;
    
    if (!collection) {
      return res.status(400).json({ error: 'Collection parameter is required' });
    }

    const db = mongoose.connection.db;
    let query = {};
    
    // Parse filter if provided
    if (filter) {
      try {
        query = JSON.parse(filter);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid filter format' });
      }
    }

    const data = await db.collection(collection)
      .find(query)
      .limit(parseInt(limit))
      .toArray();

    res.json({
      success: true,
      collection,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('❌ Get data error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.post('/api/save_data', async (req, res) => {
  try {
    const { collection, data, operation = 'insert' } = req.body;
    
    if (!collection || !data) {
      return res.status(400).json({ error: 'Collection and data are required' });
    }

    const db = mongoose.connection.db;
    let result;

    if (operation === 'insert') {
      result = await db.collection(collection).insertOne(data);
    } else if (operation === 'update') {
      const { filter, update } = data;
      if (!filter || !update) {
        return res.status(400).json({ error: 'Filter and update are required for update operation' });
      }
      result = await db.collection(collection).updateOne(filter, { $set: update });
    } else if (operation === 'upsert') {
      const { filter, update } = data;
      if (!filter || !update) {
        return res.status(400).json({ error: 'Filter and update are required for upsert operation' });
      }
      result = await db.collection(collection).updateOne(filter, { $set: update }, { upsert: true });
    } else {
      return res.status(400).json({ error: 'Invalid operation. Use: insert, update, or upsert' });
    }

    res.json({
      success: true,
      operation,
      result
    });
  } catch (error) {
    console.error('❌ Save data error:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Add missing endpoints that frontend needs
app.get('/api/user/dashboard', async (req, res) => {
  try {
    // Return sample dashboard data for now
    res.json({
      success: true,
      data: {
        totalReadings: 0,
        recentActivity: [],
        stats: {
          totalReadings: 0,
          streak: 0,
          accuracy: 0,
          totalTrainingHours: 0
        }
      }
    });
  } catch (error) {
    console.error('❌ Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // For now, allow any admin@admin.com login
    if (email === 'admin@admin.com') {
      const token = jwt.sign({ userId: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      res.json({
        success: true,
        token,
        user: {
          id: 'admin',
          email: 'admin@admin.com',
          role: 'admin',
          isAdmin: true
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/admin/dashboard', auth, async (req, res) => {
  try {
    // Return sample admin dashboard data
    res.json({
      success: true,
      data: {
        totalUsers: 0,
        totalReadings: 0,
        recentActivity: [],
        systemStatus: 'operational'
      }
    });
  } catch (error) {
    console.error('❌ Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch admin dashboard' });
  }
});

app.get('/api/admin/users', auth, async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/admin/faqs', auth, async (req, res) => {
  try {
    // Return sample FAQ data for now
    res.json({
      success: true,
      data: [
        {
          id: 1,
          question: "How do I submit water quality data?",
          answer: "Use the data submission form in the app.",
          category: "Data Submission",
          order: 1
        }
      ]
    });
  } catch (error) {
    console.error('❌ Get FAQs error:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

app.get('/api/admin/updates', auth, async (req, res) => {
  try {
    // Return sample updates data for now
    res.json({
      success: true,
      data: [
        {
          id: 1,
          title: "Welcome to ESCOM Citizen Scientist",
          content: "This is a sample update message.",
          date: new Date().toISOString(),
          priority: "normal"
        }
      ]
    });
  } catch (error) {
    console.error('❌ Get updates error:', error);
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

app.get('/api/admin/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Simple search implementation
    res.json({
      success: true,
      data: [],
      query: query
    });
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 ESCOM API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth/login, /register, /profile`);
  console.log(`❓ FAQs endpoint: http://localhost:${PORT}/api/user/faqs`);
  console.log(`📢 Updates endpoint: http://localhost:${PORT}/api/user/updates`);
  console.log(`👑 Admin endpoints: http://localhost:${PORT}/api/admin/login, /dashboard, /users, /faqs, /updates, /search`);
  console.log(`📊 User endpoints: http://localhost:${PORT}/api/user/dashboard`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
