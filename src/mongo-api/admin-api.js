// admin-api.js - Admin Backend API
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://citisci.netlify.app',
    'https://*.netlify.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escom';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemas
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ['admin', 'citizen'], default: 'citizen' },
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
    lastReading: Date
  },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
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

const User = mongoose.model('User', UserSchema);
const Reading = mongoose.model('Reading', ReadingSchema);
const FAQ = mongoose.model('FAQ', FAQSchema);
const Report = mongoose.model('Report', ReportSchema);
const SystemSetting = mongoose.model('SystemSetting', SystemSettingSchema);

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
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// User Registration
app.post('/api/auth/register', async (req, res) => {
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
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
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
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Admin Authentication
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find admin user
    const user = await User.findOne({ email, isAdmin: true });
    if (!user) {
      return res.status(401).json({ error: 'Admin not found' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
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
app.get('/api/admin/dashboard', adminAuth, async (req, res) => {
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
app.get('/api/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'citizen' }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.put('/api/admin/users/:id', adminAuth, async (req, res) => {
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

app.delete('/api/admin/users/:id', adminAuth, async (req, res) => {
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
app.get('/api/admin/analytics', adminAuth, async (req, res) => {
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
app.get('/api/admin/faqs', adminAuth, async (req, res) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ category: 1, order: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

app.post('/api/admin/faqs', adminAuth, async (req, res) => {
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

app.put('/api/admin/faqs/:id', adminAuth, async (req, res) => {
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

app.delete('/api/admin/faqs/:id', adminAuth, async (req, res) => {
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
app.get('/api/admin/reports', adminAuth, async (req, res) => {
  try {
    const reports = await Report.find().sort({ generatedAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

app.post('/api/admin/reports', adminAuth, async (req, res) => {
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
app.get('/api/admin/settings', adminAuth, async (req, res) => {
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

app.put('/api/admin/settings', adminAuth, async (req, res) => {
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

// Initialize data on startup
mongoose.connection.once('open', async () => {
  console.log('✅ Connected to MongoDB');
  await initializeSettings();
  console.log('✅ Default settings initialized');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Admin API server running on port ${PORT}`);
});

module.exports = app; 