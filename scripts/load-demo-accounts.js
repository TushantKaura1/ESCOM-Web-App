// load-demo-accounts.js - Load demo accounts into MongoDB
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escom';

// User Schema
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

async function loadDemoAccounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Read demo accounts JSON file
    const demoAccountsPath = path.join(__dirname, '../data/demo-accounts.json');
    const demoAccountsData = JSON.parse(fs.readFileSync(demoAccountsPath, 'utf8'));

    console.log('📊 Loading demo accounts...');

    // Load admin account
    const adminData = demoAccountsData.accounts.admin;
    const adminEmail = `admin@${adminData.username}.com`;
    const adminPassword = 'admin123';
    const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
    
    const adminUser = new User({
      ...adminData,
      email: adminEmail,
      passwordHash: adminPasswordHash
    });
    await adminUser.save();
    console.log(`👑 Admin account loaded: ${adminData.profile.name} (${adminEmail} / ${adminPassword})`);

    // Load citizen accounts
    for (const citizenData of demoAccountsData.accounts.citizens) {
      const citizenEmail = `${citizenData.username}@demo.com`;
      const citizenPassword = 'demo123';
      const citizenPasswordHash = await bcrypt.hash(citizenPassword, 12);
      
      const citizenUser = new User({
        ...citizenData,
        email: citizenEmail,
        passwordHash: citizenPasswordHash
      });
      await citizenUser.save();
      console.log(`👥 Citizen account loaded: ${citizenData.profile.name} (${citizenEmail} / ${citizenPassword})`);
    }

    console.log(`✅ Successfully loaded ${demoAccountsData.metadata.totalAccounts} demo accounts`);
    console.log(`📈 Admin accounts: ${demoAccountsData.metadata.adminCount}`);
    console.log(`👥 Citizen accounts: ${demoAccountsData.metadata.citizenCount}`);

    // Verify loaded accounts
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const citizenUsers = await User.countDocuments({ role: 'citizen' });

    console.log('\n📊 Database Summary:');
    console.log(`Total users: ${totalUsers}`);
    console.log(`Admin users: ${adminUsers}`);
    console.log(`Citizen users: ${citizenUsers}`);

  } catch (error) {
    console.error('❌ Error loading demo accounts:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  loadDemoAccounts();
}

module.exports = { loadDemoAccounts }; 