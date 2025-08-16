// simple-server.js - Enhanced working server with full admin functionality
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://citisci.netlify.app'],
  credentials: true
}));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escom';

// Enhanced Schemas
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'citizen', 'moderator'], default: 'citizen' },
  isAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: true },
  totalTrainingHours: { type: Number, default: 0 },
  certifications: [String],
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

const FAQSchema = new mongoose.Schema({
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  tags: [String],
  media: {
    images: [String],
    videos: [String],
    links: [String]
  },
  importance: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UpdateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['announcement', 'news', 'update'], default: 'update' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isActive: { type: Boolean, default: true },
  scheduledFor: Date,
  expiresAt: Date,
  tags: [String],
  media: {
    images: [String],
    videos: [String],
    links: [String]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ReadingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parameter: { type: String, required: true },
  value: { type: Number, required: true },
  unit: String,
  location: {
    latitude: Number,
    longitude: Number,
    village: String
  },
  timestamp: { type: Date, default: Date.now },
  accuracy: { type: Number, default: 0 },
  notes: String
});

// Compile models
const User = mongoose.model('User', UserSchema);
const FAQ = mongoose.model('FAQ', FAQSchema);
const Update = mongoose.model('Update', UpdateSchema);
const Reading = mongoose.model('Reading', ReadingSchema);

// Middleware for authentication
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin-secret');
    if (!decoded.isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: 'development'
  });
});

// User authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 User login attempt for:', email);
    
    // Find user (admin or citizen)
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ error: 'User not found' });
    }
    
    console.log('✅ User found:', user.email, 'Role:', user.role);
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('✅ Password valid for:', email);
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin, role: user.role },
      process.env.JWT_SECRET || 'admin-secret',
      { expiresIn: '24h' }
    );
    
    console.log('✅ Login successful for:', email);
    
    res.json({
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
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username, firstName, lastName, role = 'citizen' } = req.body;
    console.log('📝 Registration attempt for:', email);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Check if username is taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      console.log('❌ Username already taken:', username);
      return res.status(400).json({ error: 'Username already taken' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({
      email,
      passwordHash,
      username,
      firstName,
      lastName,
      role,
      isAdmin: role === 'admin'
    });
    
    await newUser.save();
    console.log('✅ User registered successfully:', email);
    
    // Generate token for immediate login
    const token = jwt.sign(
      { userId: newUser._id, isAdmin: newUser.isAdmin, role: newUser.role },
      process.env.JWT_SECRET || 'admin-secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        isAdmin: newUser.isAdmin
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Enhanced Admin login endpoint with real-time tracking
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Admin login attempt for:', email);
    
    // Find admin user
    const user = await User.findOne({ email, isAdmin: true });
    if (!user) {
      console.log('❌ Admin not found:', email);
      return res.status(401).json({ error: 'Admin not found' });
    }
    
    console.log('✅ Admin found:', user.email);
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('✅ Password valid for:', email);
    
    // Update admin's last activity
    await User.findByIdAndUpdate(user._id, { 
      lastActive: new Date(),
      $push: { 
        activityLog: {
          action: 'admin_login',
          details: 'Admin dashboard access',
          section: 'authentication',
          timestamp: new Date()
        }
      }
    });
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'admin-secret',
      { expiresIn: '24h' }
    );
    
    console.log('✅ Login successful for:', email);
    
    res.json({
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
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Enhanced Admin Dashboard Statistics with Real-time Data
app.get('/api/admin/dashboard', adminAuth, async (req, res) => {
  try {
    // Get comprehensive real-time statistics
    const [totalUsers, activeUsers, totalFaqs, totalUpdates, totalReadings] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: { $ne: false } }),
      FAQ.countDocuments({ isActive: { $ne: false } }),
      Update.countDocuments({ isActive: { $ne: false } }),
      Reading.countDocuments()
    ]);
    
    const users = await User.find({ role: 'citizen' });
    const averageAccuracy = users.length > 0 
      ? users.reduce((sum, user) => sum + (user.accuracy || 0), 0) / users.length 
      : 0;

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // Get real-time activity from multiple sources
    const [recentReadings, recentUsers, recentFaqs, recentUpdates] = await Promise.all([
      Reading.find().sort({ timestamp: -1 }).limit(5).populate('userId', 'firstName lastName'),
      User.find().sort({ lastActive: -1, createdAt: -1 }).limit(5).select('-passwordHash'),
      FAQ.find().sort({ updatedAt: -1, createdAt: -1 }).limit(5),
      Update.find().sort({ updatedAt: -1, createdAt: -1 }).limit(5)
    ]);

    // Get system health and performance metrics
    const systemHealth = {
      database: 'Connected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date()
    };

    // Get 24-hour activity summary
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [newUsers24h, newFaqs24h, newUpdates24h, activeUsers24h] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: last24Hours } }),
      FAQ.countDocuments({ createdAt: { $gte: last24Hours } }),
      Update.countDocuments({ createdAt: { $gte: last24Hours } }),
      User.countDocuments({ lastActive: { $gte: last24Hours } })
    ]);

    // Enhanced recent activity combining all sources
    const combinedActivity = [
      ...recentReadings.map(reading => ({
        type: 'reading',
        action: `Data submission: ${reading.parameter}`,
        user: reading.userId ? `${reading.userId.firstName} ${reading.userId.lastName}` : 'Unknown',
        time: reading.timestamp,
        priority: 'medium'
      })),
      ...recentUsers.map(user => ({
        type: 'user',
        action: `User activity: ${user.firstName} ${user.lastName}`,
        user: `${user.firstName} ${user.lastName}`,
        time: user.lastActive || user.createdAt,
        priority: 'low'
      })),
      ...recentFaqs.map(faq => ({
        type: 'faq',
        action: `FAQ ${faq.updatedAt ? 'updated' : 'created'}: ${faq.question.substring(0, 50)}...`,
        user: 'Admin',
        time: faq.updatedAt || faq.createdAt,
        priority: 'high'
      })),
      ...recentUpdates.map(update => ({
        type: 'update',
        action: `Update ${update.updatedAt ? 'updated' : 'created'}: ${update.title.substring(0, 50)}...`,
        user: 'Admin',
        time: update.updatedAt || update.createdAt,
        priority: 'high'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalFaqs,
        totalUpdates,
        totalReadings,
        averageAccuracy: Math.round(averageAccuracy * 100) / 100,
        newUsersThisMonth,
        systemHealth: 'Excellent'
      },
      recentActivity: combinedActivity,
      systemHealth,
      activity24h: {
        newUsers: newUsers24h,
        newFaqs: newFaqs24h,
        newUpdates: newUpdates24h,
        activeUsers: activeUsers24h
      },
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// FAQ Management Endpoints
app.get('/api/admin/faqs', adminAuth, async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    console.error('Fetch FAQs error:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

app.post('/api/admin/faqs', adminAuth, async (req, res) => {
  try {
    const { category, subcategory, question, answer, tags, importance, media } = req.body;
    
    const newFAQ = new FAQ({
      category,
      subcategory,
      question,
      answer,
      tags: tags || [],
      importance,
      media: media || { images: [], videos: [], links: [] },
      order: await FAQ.countDocuments(),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newFAQ.save();
    console.log('✅ FAQ created:', newFAQ.question);
    
    // Log admin activity for real-time tracking
    await User.findByIdAndUpdate(req.user.userId, {
      $push: {
        activityLog: {
          action: 'create_faq',
          details: `Created FAQ: ${question.substring(0, 50)}...`,
          section: 'faq_management',
          timestamp: new Date()
        }
      }
    });
    
    res.status(201).json(newFAQ);
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

app.put('/api/admin/faqs/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();
    
    const updatedFAQ = await FAQ.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    console.log('✅ FAQ updated:', updatedFAQ.question);
    res.json(updatedFAQ);
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

app.delete('/api/admin/faqs/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFAQ = await FAQ.findByIdAndDelete(id);
    
    if (!deletedFAQ) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    console.log('✅ FAQ deleted:', deletedFAQ.question);
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

app.put('/api/admin/faqs/reorder', adminAuth, async (req, res) => {
  try {
    const { faqOrders } = req.body;
    
    for (const { id, order } of faqOrders) {
      await FAQ.findByIdAndUpdate(id, { order });
    }
    
    console.log('✅ FAQs reordered');
    res.json({ message: 'FAQs reordered successfully' });
  } catch (error) {
    console.error('Reorder FAQs error:', error);
    res.status(500).json({ error: 'Failed to reorder FAQs' });
  }
});

// User Management Endpoints
app.get('/api/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Fetch users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/admin/users', adminAuth, async (req, res) => {
  try {
    const { email, password, username, firstName, lastName, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      email,
      passwordHash,
      username,
      firstName,
      lastName,
      role: role || 'citizen',
      isAdmin: role === 'admin',
      isActive: true,
      createdAt: new Date(),
      lastActive: new Date(),
      activityLog: []
    });
    
    await newUser.save();
    console.log('✅ User created:', newUser.email);
    
    // Log admin activity for real-time tracking
    await User.findByIdAndUpdate(req.user.userId, {
      $push: {
        activityLog: {
          action: 'create_user',
          details: `Created User: ${firstName} ${lastName} (${email})`,
          section: 'user_management',
          timestamp: new Date()
        }
      }
    });
    
    // Return user without password
    const { passwordHash: _, ...userResponse } = newUser.toObject();
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Don't allow changing admin status through this endpoint
    delete updates.isAdmin;
    
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('✅ User updated:', updatedUser.email);
    const { passwordHash: _, ...userResponse } = updatedUser.toObject();
    res.json(userResponse);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.put('/api/admin/users/:id/password', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    const passwordHash = await bcrypt.hash(password, 10);
    const updatedUser = await User.findByIdAndUpdate(id, { passwordHash }, { new: true });
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('✅ User password updated:', updatedUser.email);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

app.delete('/api/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('✅ User deleted:', deletedUser.email);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Updates Management Endpoints
app.get('/api/admin/updates', adminAuth, async (req, res) => {
  try {
    const updates = await Update.find().sort({ createdAt: -1 });
    res.json(updates);
  } catch (error) {
    console.error('Fetch updates error:', error);
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

app.post('/api/admin/updates', adminAuth, async (req, res) => {
  try {
    const { title, content, type, priority, scheduledFor, expiresAt, tags, media } = req.body;
    
    const newUpdate = new Update({
      title,
      content,
      type,
      priority,
      scheduledFor,
      expiresAt,
      tags: tags || [],
      media: media || { images: [], videos: [], links: [] },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newUpdate.save();
    console.log('✅ Update created:', newUpdate.title);
    
    // Log admin activity for real-time tracking
    await User.findByIdAndUpdate(req.user.userId, {
      $push: {
        activityLog: {
          action: 'create_update',
          details: `Created Update: ${title.substring(0, 50)}...`,
          section: 'update_management',
          timestamp: new Date()
        }
      }
    });
    
    res.status(201).json(newUpdate);
  } catch (error) {
    console.error('Create update error:', error);
    res.status(500).json({ error: 'Failed to create update' });
  }
});

app.put('/api/admin/updates/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();
    
    const updatedUpdate = await Update.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedUpdate) {
      return res.status(404).json({ error: 'Update not found' });
    }
    
    console.log('✅ Update updated:', updatedUpdate.title);
    res.json(updatedUpdate);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update' });
  }
});

app.delete('/api/admin/updates/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUpdate = await Update.findByIdAndDelete(id);
    
    if (!deletedUpdate) {
      return res.status(404).json({ error: 'Update not found' });
    }
    
    console.log('✅ Update deleted:', deletedUpdate.title);
    res.json({ message: 'Update deleted successfully' });
  } catch (error) {
    console.error('Delete update error:', error);
    res.status(500).json({ error: 'Failed to delete update' });
  }
});

// Search and Filter Endpoints
app.get('/api/admin/search', adminAuth, async (req, res) => {
  try {
    const { query, type, limit = 20 } = req.query;
    
    let results = {};
    
    if (type === 'faqs' || !type) {
      const faqs = await FAQ.find({
        $or: [
          { question: { $regex: query, $options: 'i' } },
          { answer: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }).limit(parseInt(limit));
      results.faqs = faqs;
    }
    
    if (type === 'users' || !type) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { username: { $regex: query, $options: 'i' } }
        ]
      }).limit(parseInt(limit));
      results.users = users;
    }
    
    if (type === 'updates' || !type) {
      const updates = await Update.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }).limit(parseInt(limit));
      results.updates = updates;
    }
    
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Database Monitoring and Real-time Data Endpoints
app.get('/api/admin/database/status', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const adminDb = db.admin();
    
    // Get database stats
    const dbStats = await db.stats();
    const serverStatus = await adminDb.serverStatus();
    
    // Get collection counts
    const userCount = await User.countDocuments();
    const faqCount = await FAQ.countDocuments();
    const updateCount = await Update.countDocuments();
    const readingCount = await Reading.countDocuments();
    
    // Get recent activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentFAQs = await FAQ.find().sort({ createdAt: -1 }).limit(5);
    const recentUpdates = await Update.find().sort({ createdAt: -1 }).limit(5);
    const recentReadings = await Reading.find().sort({ timestamp: -1 }).limit(5);
    
    res.json({
      database: {
        name: dbStats.db,
        collections: dbStats.collections,
        dataSize: dbStats.dataSize,
        storageSize: dbStats.storageSize,
        indexes: dbStats.indexes,
        indexSize: dbStats.indexSize
      },
      server: {
        version: serverStatus.version,
        uptime: serverStatus.uptime,
        connections: serverStatus.connections,
        opcounters: serverStatus.opcounters
      },
      collections: {
        users: userCount,
        faqs: faqCount,
        updates: updateCount,
        readings: readingCount
      },
      recentActivity: {
        users: recentUsers.map(u => ({ id: u._id, email: u.email, createdAt: u.createdAt })),
        faqs: recentFAQs.map(f => ({ id: f._id, question: f.question, category: f.category, createdAt: f.createdAt })),
        updates: recentUpdates.map(u => ({ id: u._id, title: u.title, type: u.type, createdAt: u.createdAt })),
        readings: recentReadings.map(r => ({ id: r._id, parameter: r.parameter, value: r.value, timestamp: r.timestamp }))
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database status error:', error);
    res.status(500).json({ error: 'Failed to get database status' });
  }
});

app.get('/api/admin/database/collections/:collection', adminAuth, async (req, res) => {
  try {
    const { collection } = req.params;
    const { page = 1, limit = 20, sort = 'createdAt', order = 'desc' } = req.query;
    
    let Model;
    let sortField = sort;
    
    switch (collection) {
      case 'users':
        Model = User;
        break;
      case 'faqs':
        Model = FAQ;
        break;
      case 'updates':
        Model = Update;
        break;
      case 'readings':
        Model = Reading;
        sortField = 'timestamp';
        break;
      default:
        return res.status(400).json({ error: 'Invalid collection' });
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;
    
    const [data, total] = await Promise.all([
      Model.find().sort({ [sortField]: sortOrder }).skip(skip).limit(parseInt(limit)),
      Model.countDocuments()
    ]);
    
    res.json({
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Collection query error:', error);
    res.status(500).json({ error: 'Failed to query collection' });
  }
});

// Real-time data change tracking
app.get('/api/admin/database/changes', adminAuth, async (req, res) => {
  try {
    const { since } = req.query;
    const sinceDate = since ? new Date(since) : new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to last 24 hours
    
    const changes = {
      users: await User.find({ createdAt: { $gte: sinceDate } }).sort({ createdAt: -1 }),
      faqs: await FAQ.find({ $or: [{ createdAt: { $gte: sinceDate } }, { updatedAt: { $gte: sinceDate } }] }).sort({ updatedAt: -1 }),
      updates: await Update.find({ $or: [{ createdAt: { $gte: sinceDate } }, { updatedAt: { $gte: sinceDate } }] }).sort({ updatedAt: -1 }),
      readings: await Reading.find({ timestamp: { $gte: sinceDate } }).sort({ timestamp: -1 })
    };
    
    res.json({
      since: sinceDate,
      changes,
      summary: {
        newUsers: changes.users.length,
        newFAQs: changes.faqs.filter(f => f.createdAt >= sinceDate).length,
        updatedFAQs: changes.faqs.filter(f => f.updatedAt >= sinceDate && f.updatedAt > f.createdAt).length,
        newUpdates: changes.updates.filter(u => u.createdAt >= sinceDate).length,
        updatedUpdates: changes.updates.filter(u => u.updatedAt >= sinceDate && u.updatedAt > u.createdAt).length,
        newReadings: changes.readings.length
      }
    });
  } catch (error) {
    console.error('Changes query error:', error);
    res.status(500).json({ error: 'Failed to query changes' });
  }
});

// User profile and activity endpoints
app.get('/api/auth/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Enhanced User-facing endpoints with real-time data
app.get('/api/user/faqs', async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ importance: -1, createdAt: -1 });
    
    // Add real-time metadata
    const enhancedFaqs = faqs.map(faq => ({
      ...faq.toObject(),
      lastUpdated: faq.updatedAt || faq.createdAt,
      isNew: new Date(faq.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    }));
    
    res.json(enhancedFaqs);
  } catch (error) {
    console.error('FAQ fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

app.get('/api/user/updates', async (req, res) => {
  try {
    const updates = await Update.find({ 
      isActive: true,
      $or: [
        { expirationDate: { $exists: false } },
        { expirationDate: { $gt: new Date() } }
      ]
    }).sort({ priority: -1, createdAt: -1 });
    
    // Add real-time metadata
    const enhancedUpdates = updates.map(update => ({
      ...update.toObject(),
      lastUpdated: update.updatedAt || update.createdAt,
      isNew: new Date(update.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      timeUntilExpiry: update.expirationDate ? new Date(update.expirationDate) - new Date() : null
    }));
    
    res.json(enhancedUpdates);
  } catch (error) {
    console.error('Updates fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

app.get('/api/user/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Add activity tracking
    await User.findByIdAndUpdate(req.user.userId, { lastActive: new Date() });
    
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Real-time activity tracking
app.post('/api/user/activity', auth, async (req, res) => {
  try {
    const { action, details, section } = req.body;
    
    // Update user's last activity and track actions
    await User.findByIdAndUpdate(req.user.userId, { 
      lastActive: new Date(),
      $push: { 
        activityLog: {
          action,
          details,
          section,
          timestamp: new Date()
        }
      }
    });
    
    res.json({ message: 'Activity logged successfully' });
  } catch (error) {
    console.error('Activity logging error:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

// Public user dashboard statistics (no auth required)
app.get('/api/user/dashboard', async (req, res) => {
  try {
    // Get real-time counts
    const [faqCount, updateCount, userCount] = await Promise.all([
      FAQ.countDocuments({ isActive: true }),
      Update.countDocuments({ 
        isActive: true,
        $or: [
          { expirationDate: { $exists: false } },
          { expirationDate: { $gt: new Date() } }
        ]
      }),
      User.countDocuments({ isActive: true })
    ]);
    
    res.json({
      stats: {
        totalFaqs: faqCount,
        totalUpdates: updateCount,
        totalUsers: userCount,
        userRank: 'Active Member'
      },
      recentActivity: [
        {
          time: new Date(),
          type: 'system',
          section: 'Dashboard',
          action: 'Dashboard accessed'
        }
      ],
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard' });
  }
});

// Authenticated user dashboard statistics (with user data)
app.get('/api/user/dashboard/auth', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    // Get real-time counts
    const [faqCount, updateCount, userCount] = await Promise.all([
      FAQ.countDocuments({ isActive: true }),
      Update.countDocuments({ 
        isActive: true,
        $or: [
          { expirationDate: { $exists: false } },
          { expirationDate: { $gt: new Date() } }
        ]
      }),
      User.countDocuments({ isActive: true })
    ]);
    
    // Get user's recent activity
    const recentActivity = user.activityLog ? user.activityLog.slice(-5).reverse() : [];
    
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
        joinedAt: user.createdAt,
        lastActive: user.lastActive
      },
      stats: {
        totalFaqs: faqCount,
        totalUpdates: updateCount,
        totalUsers: userCount,
        userRank: 'Active Member'
      },
      recentActivity,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard' });
  }
});

// Real-time search for users
app.get('/api/user/search', auth, async (req, res) => {
  try {
    const { query, type } = req.body;
    
    let results = [];
    
    if (type === 'faqs' || !type) {
      const faqResults = await FAQ.find({
        $and: [
          { isActive: true },
          {
            $or: [
              { question: { $regex: query, $options: 'i' } },
              { answer: { $regex: query, $options: 'i' } },
              { category: { $regex: query, $options: 'i' } },
              { tags: { $in: [new RegExp(query, 'i')] } }
            ]
          }
        ]
      }).limit(10);
      
      results.push(...faqResults.map(faq => ({ ...faq.toObject(), type: 'faq' })));
    }
    
    if (type === 'updates' || !type) {
      const updateResults = await Update.find({
        $and: [
          { isActive: true },
          {
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { content: { $regex: query, $options: 'i' } },
              { tags: { $in: [new RegExp(query, 'i')] } }
            ]
          }
        ]
      }).limit(10);
      
      results.push(...updateResults.map(update => ({ ...update.toObject(), type: 'update' })));
    }
    
    // Sort by relevance and recency
    results.sort((a, b) => {
      const aScore = (a.type === 'faq' ? a.importance : a.priority) || 0;
      const bScore = (b.type === 'faq' ? b.importance : b.priority) || 0;
      return bScore - aScore;
    });
    
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search' });
  }
});

app.put('/api/auth/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, username } = req.body;
    const updates = {};
    
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (username) {
      // Check if username is taken by another user
      const existingUser = await User.findOne({ username, _id: { $ne: req.user.userId } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      updates.username = username;
    }
    
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select('-passwordHash');
    res.json(updatedUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// User activity tracking
app.post('/api/user/activity', auth, async (req, res) => {
  try {
    const { action, details } = req.body;
    
    // Update user's last activity
    await User.findByIdAndUpdate(req.user.userId, { lastActive: new Date() });
    
    res.json({ message: 'Activity logged successfully' });
  } catch (error) {
    console.error('Activity logging error:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

const PORT = process.env.PORT || 3001;

// Connect to MongoDB and start server
async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`🚀 Enhanced server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Admin login: POST http://localhost:${PORT}/api/admin/login`);
      console.log(`❓ FAQ management: GET/POST/PUT/DELETE http://localhost:${PORT}/api/admin/faqs`);
      console.log(`👥 User management: GET/POST/PUT/DELETE http://localhost:${PORT}/api/admin/users`);
      console.log(`📢 Updates management: GET/POST/PUT/DELETE http://localhost:${PORT}/api/admin/updates`);
      console.log(`🔍 Search: GET http://localhost:${PORT}/api/admin/search`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 