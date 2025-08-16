// admin-api.js - Admin Backend API
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escom';

// Health check endpoint removed - handled by server.js

// Database connection handled by server.js

// Schemas
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
    team: { type: String, enum: ['team1', 'team2', 'team3', 'admin', ''] },
    parameters: { type: String, enum: ['water-quality', 'temperature', 'salinity', 'ph', 'all', ''] },
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

const ReadingSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
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

const ReportSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['completed', 'in-progress', 'scheduled'], default: 'scheduled' },
  data: mongoose.Schema.Types.Mixed,
  generatedAt: { type: Date, default: Date.now },
  scheduledFor: Date
});

const SystemSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
  description: String,
  updatedAt: { type: Date, default: Date.now }
});

// New schemas for advanced features
const UpdateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['announcement', 'news', 'update'], default: 'update' },
  media: {
    images: [String],
    videos: [String],
    links: [String]
  },
  scheduledFor: Date,
  expiresAt: Date,
  isActive: { type: Boolean, default: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const UserActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
});

const AuditLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  resource: { type: String, required: true },
  resourceId: mongoose.Schema.Types.ObjectId,
  details: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Reading = mongoose.model('Reading', ReadingSchema);
const FAQ = mongoose.model('FAQ', FAQSchema);
const Report = mongoose.model('Report', ReportSchema);
const SystemSetting = mongoose.model('SystemSetting', SystemSettingSchema);
const Update = mongoose.model('Update', UpdateSchema);
const UserActivity = mongoose.model('UserActivity', UserActivitySchema);
const AuditLog = mongoose.model('AuditLog', AuditLogSchema);

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin-secret');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin Authentication Middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin-secret');
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.admin = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Health Check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// User Registration
router.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, username, firstName, lastName, role = 'citizen' } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      username,
      firstName,
      lastName,
      role,
      isAdmin: role === 'admin',
      profile: {
        name: `${firstName} ${lastName}`,
        team: role === 'admin' ? 'admin' : '',
        parameters: role === 'admin' ? 'all' : ''
      }
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'admin-secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
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
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
router.post('/api/auth/login', async (req, res) => {
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
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'admin-secret',
      { expiresIn: '24h' }
    );
    
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
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user profile
router.get('/api/auth/profile', auth, async (req, res) => {
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
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Admin Authentication
router.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin user
    const user = await User.findOne({ email, isAdmin: true });
    if (!user) {
      return res.status(401).json({ error: 'Admin not found' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'admin-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin Dashboard Statistics
router.get('/api/admin/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const totalReadings = await Reading.countDocuments();
    
    const users = await User.find({ role: 'citizen' });
    const averageAccuracy = users.length > 0 
      ? users.reduce((sum, user) => sum + user.stats.accuracy, 0) / users.length 
      : 0;

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    const recentActivity = await Reading.find()
      .sort({ timestamp: -1 })
      .limit(5)
      .populate('userId', 'profile.name');

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalReadings,
        averageAccuracy: Math.round(averageAccuracy * 100) / 100,
        newUsersThisMonth,
        systemHealth: 'Excellent'
      },
      recentActivity: recentActivity.map(reading => ({
        type: 'reading',
        action: `Data submission: ${reading.parameter}`,
        user: reading.userId?.profile?.name || 'Unknown',
        time: reading.timestamp
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// User Management
router.get('/api/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'citizen' }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.put('/api/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const user = await User.findByIdAndUpdate(
      id,
      { 
        ...updates,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/api/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Data Analytics
router.get('/api/admin/analytics', adminAuth, async (req, res) => {
  try {
    const totalReadings = await Reading.countDocuments();
    const users = await User.find({ role: 'citizen' });
    const averageAccuracy = users.length > 0 
      ? users.reduce((sum, user) => sum + user.stats.accuracy, 0) / users.length 
      : 0;

    // Get top performer
    const topPerformer = users.reduce((top, user) => 
      user.stats.totalReadings > top.stats.totalReadings ? user : top
    );

    // Get most active team
    const teamStats = {};
    users.forEach(user => {
      const team = user.profile.team;
      if (team) {
        teamStats[team] = (teamStats[team] || 0) + user.stats.totalReadings;
      }
    });
    const mostActiveTeam = Object.keys(teamStats).reduce((a, b) => 
      teamStats[a] > teamStats[b] ? a : b
    );

    // Monthly trends (last 4 months)
    const trends = [];
    for (let i = 3; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthReadings = await Reading.countDocuments({
        timestamp: { $gte: startOfMonth, $lte: endOfMonth }
      });

      trends.push({
        month: startOfMonth.toLocaleDateString('en-US', { month: 'short' }),
        readings: monthReadings,
        accuracy: Math.round((Math.random() * 15 + 85) * 100) / 100 // Mock accuracy
      });
    }

    res.json({
      totalReadings,
      averageAccuracy: Math.round(averageAccuracy * 100) / 100,
      topPerformer: topPerformer.profile.name,
      mostActiveTeam: `Team ${mostActiveTeam.charAt(mostActiveTeam.length - 1).toUpperCase()}`,
      dataQuality: 'Excellent',
      trends
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// FAQ Management
router.get('/api/admin/faqs', adminAuth, async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ category: 1, order: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

router.post('/api/admin/faqs', adminAuth, async (req, res) => {
  try {
    const { category, subcategory, question, answer } = req.body;
    const faq = new FAQ({
      category,
      subcategory,
      question,
      answer,
      order: await FAQ.countDocuments({ category, subcategory })
    });
    await faq.save();
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

router.put('/api/admin/faqs/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();
    
    const faq = await FAQ.findByIdAndUpdate(id, updates, { new: true });
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

router.delete('/api/admin/faqs/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndDelete(id);
    
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

// Reports
router.get('/api/admin/reports', adminAuth, async (req, res) => {
  try {
    const reports = await Report.find().sort({ generatedAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

router.post('/api/admin/reports', adminAuth, async (req, res) => {
  try {
    const { type, name } = req.body;
    const report = new Report({
      type,
      name,
      status: 'in-progress',
      data: {} // Will be populated during generation
    });
    await report.save();
    
    // Simulate report generation
    setTimeout(async () => {
      report.status = 'completed';
      report.data = { generated: true, timestamp: new Date() };
      await report.save();
    }, 2000);
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// System Settings
router.get('/api/admin/settings', adminAuth, async (req, res) => {
  try {
    const settings = await SystemSetting.find();
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/api/admin/settings', adminAuth, async (req, res) => {
  try {
    const updates = req.body;
    
    for (const [key, value] of Object.entries(updates)) {
      await SystemSetting.findOneAndUpdate(
        { key },
        { value, updatedAt: new Date() },
        { upsert: true }
      );
    }
    
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ===== ADVANCED ADMIN FEATURES =====

// Enhanced FAQ Management
router.post('/api/admin/faqs', adminAuth, async (req, res) => {
  try {
    const { category, subcategory, question, answer, tags, media, importance } = req.body;
    
    // Get the highest order number
    const lastFAQ = await FAQ.findOne().sort({ order: -1 });
    const newOrder = lastFAQ ? lastFAQ.order + 1 : 1;
    
    const faq = new FAQ({
      category,
      subcategory,
      question,
      answer,
      tags: tags || [],
      media: media || { images: [], videos: [], links: [] },
      importance: importance || 'medium',
      order: newOrder
    });
    
    await faq.save();
    
    // Log admin action
    await new AuditLog({
      adminId: req.user._id,
      action: 'CREATE_FAQ',
      resource: 'FAQ',
      resourceId: faq._id,
      details: { category, subcategory, question }
    }).save();
    
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

router.put('/api/admin/faqs/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();
    
    const faq = await FAQ.findByIdAndUpdate(id, updates, { new: true });
    
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    // Log admin action
    await new AuditLog({
      adminId: req.user._id,
      action: 'UPDATE_FAQ',
      resource: 'FAQ',
      resourceId: faq._id,
      details: updates
    }).save();
    
    res.json(faq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

router.delete('/api/admin/faqs/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await FAQ.findByIdAndDelete(id);
    
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    // Log admin action
    await new AuditLog({
      adminId: req.user._id,
      action: 'DELETE_FAQ',
      resource: 'FAQ',
      resourceId: faq._id,
      details: { question: faq.question }
    }).save();
    
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

router.put('/api/admin/faqs/reorder', adminAuth, async (req, res) => {
  try {
    const { faqOrders } = req.body; // Array of {id, order}
    
    for (const { id, order } of faqOrders) {
      await FAQ.findByIdAndUpdate(id, { order });
    }
    
    // Log admin action
    await new AuditLog({
      adminId: req.user._id,
      action: 'REORDER_FAQS',
      resource: 'FAQ',
      details: { faqOrders }
    }).save();
    
    res.json({ message: 'FAQ order updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder FAQs' });
  }
});

// Enhanced User Management
router.post('/api/admin/users', adminAuth, async (req, res) => {
  try {
    const { email, password, username, firstName, lastName, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      email,
      password: hashedPassword,
      username,
      firstName,
      lastName,
      role: role || 'citizen',
      isAdmin: role === 'admin'
    });
    
    await user.save();
    
    // Log admin action
    await new AuditLog({
      adminId: req.user._id,
      action: 'CREATE_USER',
      resource: 'User',
      resourceId: user._id,
      details: { email, username, role }
    }).save();
    
    res.json({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/api/admin/users/:id/password', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword, forceChange } = req.body;
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updates = { password: hashedPassword };
    
    if (forceChange) {
      updates.forcePasswordChange = true;
    }
    
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Log admin action
    await new AuditLog({
      adminId: req.user._id,
      action: 'RESET_PASSWORD',
      resource: 'User',
      resourceId: user._id,
      details: { forceChange }
    }).save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

router.delete('/api/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Log admin action
    await new AuditLog({
      adminId: req.user._id,
      action: 'DELETE_USER',
      resource: 'User',
      resourceId: user._id,
      details: { reason, deletedUser: user.email }
    }).save();
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.get('/api/admin/users/:id/activity', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, actionType } = req.query;
    
    let query = { userId: id };
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (actionType) {
      query.action = actionType;
    }
    
    const activities = await UserActivity.find(query)
      .sort({ timestamp: -1 })
      .limit(100);
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
});

// Recent Updates Management
router.post('/api/admin/updates', adminAuth, async (req, res) => {
  try {
    const { title, content, type, media, scheduledFor, expiresAt, priority, tags } = req.body;
    
    const update = new Update({
      title,
      content,
      type,
      media: media || { images: [], videos: [], links: [] },
      scheduledFor,
      expiresAt,
      priority,
      tags: tags || [],
      createdBy: req.user._id
    });
    
    await update.save();
    
    // Log admin action
    await new AuditLog({
      adminId: req.user._id,
      action: 'CREATE_UPDATE',
      resource: 'Update',
      resourceId: update._id,
      details: { title, type, scheduledFor }
    }).save();
    
    res.json(update);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create update' });
  }
});

router.get('/api/admin/updates', adminAuth, async (req, res) => {
  try {
    const { status, type, priority } = req.query;
    
    let query = {};
    if (status) query.isActive = status === 'active';
    if (type) query.type = type;
    if (priority) query.priority = priority;
    
    const updates = await Update.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'username firstName lastName');
    
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

router.put('/api/admin/updates/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();
    
    const update = await Update.findByIdAndUpdate(id, updates, { new: true });
    
    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }
    
    // Log admin action
    await new AuditLog({
      adminId: req.user._id,
      action: 'UPDATE_UPDATE',
      resource: 'Update',
      resourceId: update._id,
      details: updates
    }).save();
    
    res.json(update);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update update' });
  }
});

router.delete('/api/admin/updates/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const update = await Update.findByIdAndDelete(id);
    
    if (!update) {
      return res.status(404).json({ error: 'Update not found' });
    }
    
    // Log admin action
    await new AuditLog({
      adminId: req.user._id,
      action: 'DELETE_UPDATE',
      resource: 'Update',
      resourceId: update._id,
      details: { title: update.title }
    }).save();
    
    res.json({ message: 'Update deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete update' });
  }
});

// Search and Analytics
router.get('/api/admin/search', adminAuth, async (req, res) => {
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
          { username: { $regex: query, $options: 'i' } },
          { firstName: { $regex: query, $options: 'i' } },
          { lastName: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
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
    res.status(500).json({ error: 'Failed to search' });
  }
});

router.get('/api/admin/analytics/advanced', adminAuth, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    // Get analytics data
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const newUsers = await User.countDocuments({ createdAt: { $gte: startDate } });
    
    const totalFAQs = await FAQ.countDocuments();
    const activeFAQs = await FAQ.countDocuments({ isActive: true });
    const popularFAQs = await FAQ.find().sort({ viewCount: -1 }).limit(5);
    
    const totalUpdates = await Update.countDocuments();
    const activeUpdates = await Update.countDocuments({ isActive: true });
    const scheduledUpdates = await Update.countDocuments({ 
      scheduledFor: { $gte: now },
      isActive: true 
    });
    
    // User activity
    const recentActivity = await UserActivity.find({ timestamp: { $gte: startDate } })
      .sort({ timestamp: -1 })
      .limit(10)
      .populate('userId', 'username firstName lastName');
    
    res.json({
      period,
      users: { total: totalUsers, active: activeUsers, new: newUsers },
      faqs: { total: totalFAQs, active: activeFAQs, popular: popularFAQs },
      updates: { total: totalUpdates, active: activeUpdates, scheduled: scheduledUpdates },
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch advanced analytics' });
  }
});

router.get('/api/admin/audit-logs', adminAuth, async (req, res) => {
  try {
    const { action, resource, startDate, endDate, limit = 50 } = req.query;
    
    let query = {};
    if (action) query.action = action;
    if (resource) query.resource = resource;
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('adminId', 'username firstName lastName');
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// ===== USER-FACING API ENDPOINTS =====

// User FAQ Access (filtered and organized)
router.get('/api/user/faqs', async (req, res) => {
  try {
    const { category, subcategory, search, sort = 'order' } = req.query;
    
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    let sortQuery = {};
    switch (sort) {
      case 'importance':
        sortQuery = { importance: -1, order: 1 };
        break;
      case 'recent':
        sortQuery = { createdAt: -1 };
        break;
      case 'popular':
        sortQuery = { viewCount: -1 };
        break;
      default:
        sortQuery = { order: 1 };
    }
    
    const faqs = await FAQ.find(query).sort(sortQuery);
    
    // Increment view count for searched FAQs
    if (search && faqs.length > 0) {
      await FAQ.updateMany(
        { _id: { $in: faqs.map(f => f._id) } },
        { $inc: { viewCount: 1 } }
      );
    }
    
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

// User Updates Access (filtered by active and scheduled)
router.get('/api/user/updates', async (req, res) => {
  try {
    const { type, priority, limit = 20 } = req.query;
    
    const now = new Date();
    let query = { 
      isActive: true,
      $or: [
        { scheduledFor: { $lte: now } },
        { scheduledFor: { $exists: false } }
      ],
      $or: [
        { expiresAt: { $gt: now } },
        { expiresAt: { $exists: false } }
      ]
    };
    
    if (type) query.type = type;
    if (priority) query.priority = priority;
    
    const updates = await Update.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .populate('createdBy', 'username firstName lastName');
    
    res.json(updates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

// User Profile Management
router.get('/api/user/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/api/user/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, profile } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, profile, updatedAt: new Date() },
      { new: true }
    ).select('-password');
    
    // Log user activity
    await new UserActivity({
      userId: req.user._id,
      action: 'UPDATE_PROFILE',
      details: { firstName, lastName, profile }
    }).save();
    
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// User Activity Tracking
router.get('/api/user/activity', auth, async (req, res) => {
  try {
    const { startDate, endDate, actionType } = req.query;
    
    let query = { userId: req.user._id };
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (actionType) {
      query.action = actionType;
    }
    
    const activities = await UserActivity.find(query)
      .sort({ timestamp: -1 })
      .limit(50);
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
});

// User Search (limited to their own data and public content)
router.get('/api/user/search', auth, async (req, res) => {
  try {
    const { query, type, limit = 20 } = req.query;
    
    let results = {};
    
    if (type === 'faqs' || !type) {
      const faqs = await FAQ.find({
        isActive: true,
        $or: [
          { question: { $regex: query, $options: 'i' } },
          { answer: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }).limit(parseInt(limit));
      results.faqs = faqs;
    }
    
    if (type === 'updates' || !type) {
      const now = new Date();
      const updates = await Update.find({
        isActive: true,
        $or: [
          { scheduledFor: { $lte: now } },
          { scheduledFor: { $exists: false } }
        ],
        $or: [
          { expiresAt: { $gt: now } },
          { expiresAt: { $exists: false } }
        ],
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
    res.status(500).json({ error: 'Failed to search' });
  }
});

// Track user interactions for analytics
router.post('/api/user/interaction', auth, async (req, res) => {
  try {
    const { action, resource, resourceId, details } = req.body;
    
    await new UserActivity({
      userId: req.user._id,
      action,
      resource,
      resourceId,
      details
    }).save();
    
    res.json({ message: 'Interaction logged successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log interaction' });
  }
});

// Initialize default settings
async function initializeSettings() {
  const defaultSettings = [
    { key: 'notifications', value: true, description: 'Enable system notifications' },
    { key: 'autoBackup', value: true, description: 'Automatically backup data daily' },
    { key: 'dataRetention', value: '2 years', description: 'How long to keep user data' },
    { key: 'privacyMode', value: false, description: 'Enhanced privacy protection' },
    { key: 'maintenanceMode', value: false, description: 'Put system in maintenance mode' },
    { key: 'debugMode', value: false, description: 'Enable debug logging' }
  ];

  for (const setting of defaultSettings) {
    await SystemSetting.findOneAndUpdate(
      { key: setting.key },
      setting,
      { upsert: true }
    );
  }
}

// Initialize data on startup - moved to server.js
// mongoose.connection.once('open', async () => {
//   console.log('✅ Connected to MongoDB');
//   await initializeSettings();
//   console.log('✅ Default settings initialized');
// });

module.exports = router; 