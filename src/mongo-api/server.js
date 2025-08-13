// src/mongo-api/server.js - Enhanced ESCOM API Server

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

// Enhanced middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escom';
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_strong_secret_in_production';
const PORT = process.env.PORT || 3001;

// Import enhanced database connection
const { connectDB, checkConnection } = require('./db');

// Initialize database connection
let db = null;

async function initializeDatabase() {
  try {
    db = await connectDB();
    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
  }
}

// Initialize database on startup
initializeDatabase();

// Enhanced User Schema
const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true
  },
  passwordHash: { type: String, required: true },
  telegramId: { type: Number, unique: true, sparse: true },
  username: String,
  firstName: String,
  lastName: String,
  profile: {
    name: { type: String, required: true },
    village: { type: String, required: true },
    team: { 
      type: String, 
      enum: ['team1', 'team2', 'team3', ''],
      default: ''
    },
    parameters: { 
      type: String, 
      enum: ['water-quality', 'temperature', 'salinity', 'ph', ''],
      default: ''
    },
    since: String,
    experience: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'], 
      default: 'beginner' 
    }
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
  emailVerified: { type: Boolean, default: false }
});

// Reading Schema for monitoring data
const ReadingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  parameters: {
    waterQuality: Number,
    temperature: Number,
    salinity: Number,
    ph: Number
  },
  notes: String,
  weatherConditions: {
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    precipitation: String
  },
  timestamp: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Training Schema
const TrainingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['video', 'document', 'quiz', 'practical'],
    required: true 
  },
  duration: Number, // in minutes
  completed: { type: Boolean, default: false },
  completedAt: Date,
  score: Number, // for quizzes
  certificate: String // certificate URL
});

const User = mongoose.model('User', UserSchema);
const Reading = mongoose.model('Reading', ReadingSchema);
const Training = mongoose.model('Training', TrainingSchema);

// Enhanced JWT middleware
const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Enhanced SIGNUP endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, profile } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create user
    const user = new User({ 
      email, 
      passwordHash,
      profile: profile || {}
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
    
    console.log(`✅ New user registered: ${email}`);
    
    res.status(201).json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Enhanced LOGIN endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last active
    user.lastActive = new Date();
    await user.save();
    
    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });
    
    console.log(`✅ User logged in: ${email}`);
    
    res.json({ 
      token,
      user: {
        id: user._id,
        email: user.email,
        profile: user.profile,
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// GET PROFILE endpoint
app.get('/api/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId, 'profile stats email createdAt lastActive');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      profile: user.profile,
      stats: user.stats,
      email: user.email,
      createdAt: user.createdAt,
      lastActive: user.lastActive
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE PROFILE endpoint
app.put('/api/profile', auth, async (req, res) => {
  try {
    const profile = req.body;
    
    // Validation
    if (!profile.name || !profile.village) {
      return res.status(400).json({ error: 'Name and village are required' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId, 
      { 
        profile,
        lastActive: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log(`✅ Profile updated for user: ${user.email}`);
    
    res.json({ 
      success: true,
      profile: user.profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// SUBMIT READING endpoint
app.post('/api/readings', auth, async (req, res) => {
  try {
    const readingData = req.body;
    
    // Validation
    if (!readingData.location) {
      return res.status(400).json({ error: 'Location is required' });
    }
    
    // Create reading
    const reading = new Reading({
      userId: req.userId,
      ...readingData
    });
    
    await reading.save();
    
    // Update user stats
    const user = await User.findById(req.userId);
    user.stats.totalReadings += 1;
    user.stats.lastReading = new Date();
    user.lastActive = new Date();
    
    // Calculate streak
    const now = new Date();
    const lastReading = user.stats.lastReading;
    const daysDiff = Math.floor((now - lastReading) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) {
      user.stats.streak += 1;
    } else {
      user.stats.streak = 1;
    }
    
    await user.save();
    
    console.log(`📊 Reading submitted by user: ${user.email}`);
    
    res.status(201).json({ 
      success: true,
      reading: reading._id,
      stats: user.stats
    });
  } catch (error) {
    console.error('Submit reading error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET READINGS endpoint
app.get('/api/readings', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, location } = req.query;
    
    const query = { userId: req.userId };
    if (location) {
      query.location = new RegExp(location, 'i');
    }
    
    const readings = await Reading.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Reading.countDocuments(query);
    
    res.json({
      readings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get readings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// TRAINING endpoints
app.post('/api/training', auth, async (req, res) => {
  try {
    const trainingData = req.body;
    
    const training = new Training({
      userId: req.userId,
      ...trainingData
    });
    
    await training.save();
    
    res.status(201).json({ 
      success: true,
      training: training._id
    });
  } catch (error) {
    console.error('Create training error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/training/:id/complete', auth, async (req, res) => {
  try {
    const training = await Training.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { 
        completed: true,
        completedAt: new Date(),
        score: req.body.score
      },
      { new: true }
    );
    
    if (!training) {
      return res.status(404).json({ error: 'Training not found' });
    }
    
    // Update user stats
    const user = await User.findById(req.userId);
    user.stats.totalTrainingHours += training.duration || 0;
    if (req.body.certificate) {
      user.stats.certifications.push(req.body.certificate);
    }
    await user.save();
    
    res.json({ success: true, training });
  } catch (error) {
    console.error('Complete training error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// COMMUNITY endpoints
app.get('/api/community', auth, async (req, res) => {
  try {
    const users = await User.find(
      { isActive: true },
      'profile stats lastActive'
    )
    .sort({ lastActive: -1 })
    .limit(50);
    
    res.json({ users });
  } catch (error) {
    console.error('Get community error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// STATISTICS endpoint
app.get('/api/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const totalReadings = await Reading.countDocuments({ userId: req.userId });
    const totalTraining = await Training.countDocuments({ 
      userId: req.userId, 
      completed: true 
    });
    
    res.json({
      userStats: user.stats,
      totalReadings,
      totalTraining,
      lastActive: user.lastActive
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
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

// Start server with enhanced error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 ESCOM API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    mongoose.connection.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    mongoose.connection.close();
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
