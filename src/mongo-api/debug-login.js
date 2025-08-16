// debug-login.js - Debug login functionality
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escom';

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  username: String,
  firstName: String,
  lastName: String,
  role: { type: String, enum: ['admin', 'citizen', 'moderator'], default: 'citizen' },
  isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', UserSchema);

async function debugLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test user lookup
    const user = await User.findOne({ email: 'admin@admin.com' });
    console.log('🔍 User lookup result:', user ? 'User found' : 'User not found');
    
    if (user) {
      console.log('📧 Email:', user.email);
      console.log('🔐 Password hash exists:', !!user.passwordHash);
      console.log('👑 Is admin:', user.isAdmin);
      console.log('🎭 Role:', user.role);
      
      // Test password comparison
      const testPassword = 'admin123';
      const isValidPassword = await bcrypt.compare(testPassword, user.passwordHash);
      console.log('🔑 Password validation:', isValidPassword ? 'SUCCESS' : 'FAILED');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
debugLogin(); 