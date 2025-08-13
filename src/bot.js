// bot.js - Enhanced ESCOM Citizen Scientist Assistant Bot with Dual Mode
const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const adminConfig = require('../config/admin');
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://YOUR_DOMAIN_OR_NGROK';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escom';

// Import enhanced database connection
const { connectDB, checkConnection } = require('./mongo-api/db');

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

// Enhanced User Schema with Role Support
const UserSchema = new mongoose.Schema({
  telegramId: { type: Number, unique: true, required: true },
  username: String,
  firstName: String,
  lastName: String,
  role: { type: String, enum: ['admin', 'citizen'], default: 'citizen' },
  isAdmin: { type: Boolean, default: false },
  profile: {
    name: String,
    village: String,
    team: { type: String, enum: ['team1', 'team2', 'team3', ''] },
    parameters: { type: String, enum: ['water-quality', 'temperature', 'salinity', 'ph', ''] },
    since: String,
    experience: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' }
  },
  stats: {
    totalReadings: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    lastReading: Date
  },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Express server for serving the Mini App
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the Mini App
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🌐 Mini App serving at http://localhost:${PORT}`);
});

// Enhanced Telegram Bot
const bot = new Telegraf(BOT_TOKEN);

// Error handling middleware
bot.catch((err, ctx) => {
  console.error(`❌ Bot error for ${ctx.updateType}:`, err);
  ctx.reply('Sorry, something went wrong. Please try again later.').catch(console.error);
});

// Enhanced /start command
bot.start(async (ctx) => {
  try {
    const telegramId = ctx.from.id;
    const username = ctx.from.username;
    const firstName = ctx.from.first_name;
    const lastName = ctx.from.last_name;

    // Check if user exists
    let user = await User.findOne({ telegramId });
    
    if (!user) {
      // Create new user
      user = new User({
        telegramId,
        username,
        firstName,
        lastName,
        lastActive: new Date()
      });
      await user.save();
      console.log(`👤 New user created: ${firstName} (${telegramId})`);
    } else {
      // Update last active
      user.lastActive = new Date();
      await user.save();
    }

    const welcomeMessage = user.profile?.name 
      ? `Welcome back, ${user.profile.name}! 🌊`
      : 'Welcome to ESCOM Citizen Scientist Assistant! 🌊';

    await ctx.reply(
      `${welcomeMessage}\n\nJoin our coastal monitoring community and contribute to environmental research.`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌊 Open Assistant', web_app: { url: WEBAPP_URL } }],
            [{ text: '📊 View Stats', callback_data: 'stats' }],
            [{ text: '❓ Help', callback_data: 'help' }]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Start command error:', error);
    ctx.reply('Welcome to ESCOM! Please try opening the assistant again.');
  }
});

// Handle callback queries
bot.action('stats', async (ctx) => {
  try {
    const user = await User.findOne({ telegramId: ctx.from.id });
    if (user && user.stats) {
      const stats = user.stats;
      await ctx.reply(
        `📊 Your Statistics:\n\n` +
        `📈 Total Readings: ${stats.totalReadings}\n` +
        `🔥 Current Streak: ${stats.streak} days\n` +
        `🎯 Accuracy: ${stats.accuracy}%\n` +
        `📅 Last Reading: ${stats.lastReading ? new Date(stats.lastReading).toLocaleDateString() : 'Never'}`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🌊 Open Assistant', web_app: { url: WEBAPP_URL } }]
            ]
          }
        }
      );
    } else {
      await ctx.reply('No statistics available yet. Start monitoring to see your progress!');
    }
  } catch (error) {
    console.error('Stats action error:', error);
    ctx.reply('Unable to load statistics. Please try again.');
  }
});

bot.action('help', async (ctx) => {
  await ctx.reply(
    `❓ ESCOM Assistant Help\n\n` +
    `🌊 **What is ESCOM?**\n` +
    `ESCOM is a citizen science program for coastal monitoring.\n\n` +
    `📊 **What can you do?**\n` +
    `• Monitor water quality, temperature, salinity, and pH\n` +
    `• Connect with other citizen scientists\n` +
    `• Access training materials and FAQs\n` +
    `• Track your progress and achievements\n\n` +
    `🔧 **Need help?**\n` +
    `Contact your team leader or use the FAQ section in the app.`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🌊 Open Assistant', web_app: { url: WEBAPP_URL } }]
        ]
      }
    }
  );
});

// Enhanced web app data handler with dual mode support
bot.on('web_app_data', async (ctx) => {
  try {
    const data = JSON.parse(ctx.message.web_app_data.data);
    const telegramId = ctx.from.id;
    
    console.log('📱 Received web app data:', data);

    switch (data.type) {
      case 'admin_login':
        await handleAdminLogin(telegramId, data.data, ctx);
        break;
      
      case 'citizen_login':
        await handleCitizenLogin(telegramId, data.data, ctx);
        break;
      
      case 'profile':
        await handleProfileUpdate(telegramId, data.data, ctx);
        break;
      
      case 'reading':
        await handleReadingSubmission(telegramId, data.data, ctx);
        break;
      
      case 'training_completed':
        await handleTrainingCompletion(telegramId, data.data, ctx);
        break;
      
      default:
        console.log('Unknown data type:', data.type);
        ctx.reply('🆗 Data received successfully!');
    }
  } catch (error) {
    console.error('Web app data handler error:', error);
    ctx.reply('❌ Error processing data. Please try again.');
  }
});

// Admin login handler
async function handleAdminLogin(telegramId, loginData, ctx) {
  try {
    // Check if user is in admin list using admin config
    if (!adminConfig.ADMIN_IDS.includes(telegramId)) {
      await ctx.reply('❌ Access Denied: You do not have admin privileges.');
      return;
    }

    // Find or create admin user
    let user = await User.findOne({ telegramId });
    if (!user) {
      user = new User({
        telegramId,
        username: loginData.username,
        firstName: loginData.username,
        role: 'admin',
        isAdmin: true,
        profile: {
          name: loginData.username,
          role: 'admin'
        },
        stats: {
          totalReadings: 0,
          streak: 0,
          accuracy: 100,
          lastReading: null
        }
      });
    } else {
      user.role = 'admin';
      user.isAdmin = true;
      user.lastActive = new Date();
    }

    await user.save();
    console.log(`👑 Admin login: ${telegramId} (${loginData.username})`);
    
    await ctx.reply(
      `👑 Welcome, Admin ${loginData.username}!\n\n` +
      `You now have access to administrative controls.\n` +
      `Use the web app to manage the system.`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔐 Admin Panel', web_app: { url: WEBAPP_URL } }]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    ctx.reply('❌ Error during admin login. Please try again.');
  }
}

// Citizen login handler
async function handleCitizenLogin(telegramId, loginData, ctx) {
  try {
    // Find or create citizen user
    let user = await User.findOne({ telegramId });
    if (!user) {
      user = new User({
        telegramId,
        username: loginData.username,
        firstName: loginData.username,
        role: 'citizen',
        isAdmin: false,
        profile: {
          name: loginData.username,
          role: 'citizen'
        },
        stats: {
          totalReadings: 0,
          streak: 0,
          accuracy: 0,
          lastReading: null
        }
      });
    } else {
      user.role = 'citizen';
      user.isAdmin = false;
      user.lastActive = new Date();
    }

    await user.save();
    console.log(`👥 Citizen login: ${telegramId} (${loginData.username})`);
    
    await ctx.reply(
      `👥 Welcome back, ${loginData.username}!\n\n` +
      `You're logged in as a Citizen Scientist.\n` +
      `Continue contributing to coastal monitoring!`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌊 Continue in App', web_app: { url: WEBAPP_URL } }]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Citizen login error:', error);
    ctx.reply('❌ Error during citizen login. Please try again.');
  }
}

// Profile update handler
async function handleProfileUpdate(telegramId, profileData, ctx) {
  try {
    const user = await User.findOne({ telegramId });
    if (!user) {
      throw new Error('User not found');
    }

    user.profile = profileData;
    user.lastActive = new Date();
    await user.save();

    console.log(`✅ Profile updated for user ${telegramId}`);
    
    await ctx.reply(
      `✅ Profile updated successfully!\n\n` +
      `Name: ${profileData.name}\n` +
      `Location: ${profileData.village}\n` +
      `Team: ${profileData.team || 'Not assigned'}\n` +
      `Experience: ${profileData.experience}`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌊 Continue in App', web_app: { url: WEBAPP_URL } }]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    ctx.reply('❌ Error updating profile. Please try again.');
  }
}

// Reading submission handler
async function handleReadingSubmission(telegramId, readingData, ctx) {
  try {
    const user = await User.findOne({ telegramId });
    if (!user) {
      throw new Error('User not found');
    }

    // Update user stats
    user.stats.totalReadings += 1;
    user.stats.lastReading = new Date();
    
    // Simple streak calculation (in a real app, you'd have more complex logic)
    const lastReading = user.stats.lastReading;
    const now = new Date();
    const daysDiff = Math.floor((now - lastReading) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 1) {
      user.stats.streak += 1;
    } else {
      user.stats.streak = 1;
    }

    user.lastActive = new Date();
    await user.save();

    console.log(`📊 Reading submitted by user ${telegramId}`);
    
    await ctx.reply(
      `📊 Reading submitted successfully!\n\n` +
      `Location: ${readingData.location}\n` +
      `Parameters: ${readingData.parameters}\n` +
      `Total Readings: ${user.stats.totalReadings}\n` +
      `Current Streak: ${user.stats.streak} days`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌊 Continue Monitoring', web_app: { url: WEBAPP_URL } }]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Reading submission error:', error);
    ctx.reply('❌ Error submitting reading. Please try again.');
  }
}

// Training completion handler
async function handleTrainingCompletion(telegramId, trainingData, ctx) {
  try {
    console.log(`📚 Training completed by user ${telegramId}:`, trainingData.title);
    
    await ctx.reply(
      `🎓 Training completed!\n\n` +
      `Course: ${trainingData.title}\n` +
      `Great job! Keep learning and contributing to coastal science.`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🌊 Continue Learning', web_app: { url: WEBAPP_URL } }]
          ]
        }
      }
    );
  } catch (error) {
    console.error('Training completion error:', error);
    ctx.reply('❌ Error recording training completion. Please try again.');
  }
}

// Admin commands
bot.command('admin', async (ctx) => {
  const telegramId = ctx.from.id;
  // Add admin check logic here
  if (telegramId === 123456789) { // Replace with actual admin ID
    const userCount = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    await ctx.reply(
      `👨‍💼 Admin Statistics:\n\n` +
      `👥 Total Users: ${userCount}\n` +
      `🟢 Active (7 days): ${activeUsers}\n` +
      `📊 Total Readings: ${await User.aggregate([
        { $group: { _id: null, total: { $sum: '$stats.totalReadings' } } }
      ]).then(result => result[0]?.total || 0)}`
    );
  }
});

// Launch bot with enhanced error handling
bot.launch()
  .then(() => {
    console.log('🤖 ESCOM Bot started successfully');
    console.log(`🌐 Mini App URL: ${WEBAPP_URL}`);
  })
  .catch((error) => {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  });

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('🛑 Shutting down bot...');
  bot.stop('SIGINT');
  mongoose.connection.close();
  process.exit(0);
});

process.once('SIGTERM', () => {
  console.log('🛑 Shutting down bot...');
  bot.stop('SIGTERM');
  mongoose.connection.close();
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
