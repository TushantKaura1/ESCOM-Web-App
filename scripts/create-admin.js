// create-admin.js - Create admin user for testing
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escom';

// User Schema
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

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@escom.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      console.log('📧 Email: admin@escom.com');
      console.log('🔑 Password: admin123');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = new User({
      email: 'admin@escom.com',
      password: hashedPassword,
      username: 'esco_admin',
      firstName: 'ESCOM',
      lastName: 'Administrator',
      role: 'admin',
      isAdmin: true,
      profile: {
        name: 'ESCOM Administrator',
        village: 'Headquarters',
        team: 'admin',
        parameters: 'all',
        since: '2024-01-01',
        experience: 'advanced'
      }
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@escom.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Username: esco_admin');
    console.log('🔐 Role: admin');

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