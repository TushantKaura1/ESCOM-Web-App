// create-admin.js - Create a simple admin user
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escom';

// User Schema (matching admin-api.js)
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  telegramId: { type: Number, unique: true, sparse: true },
  username: String,
  firstName: String,
  lastName: String,
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

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@admin.com' });
    if (existingAdmin) {
      console.log('👑 Admin already exists, updating password...');
      existingAdmin.passwordHash = await bcrypt.hash('admin123', 12);
      await existingAdmin.save();
      console.log('✅ Admin password updated');
    } else {
      // Create new admin user
      const adminPassword = 'admin123';
      const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
      
      const adminUser = new User({
        email: 'admin@admin.com',
        passwordHash: adminPasswordHash,
        username: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isAdmin: true,
        profile: {
          name: 'Administrator',
          village: 'Headquarters',
          team: 'admin',
          parameters: 'all',
          since: '2024-01-01',
          experience: 'advanced'
        },
        stats: {
          totalReadings: 0,
          streak: 0,
          accuracy: 100,
          lastReading: null,
          totalTrainingHours: 0,
          certifications: []
        }
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully');
    }

    console.log('\n🔑 **ADMIN LOGIN CREDENTIALS**');
    console.log('📧 Email: admin@admin.com');
    console.log('🔐 Password: admin123');
    console.log('\n🌐 Use these credentials to login to the admin dashboard');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  createAdmin();
}

module.exports = { createAdmin }; 