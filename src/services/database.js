import { neon } from '@netlify/neon';

// Initialize Neon database connection
const sql = neon();

// Database schema creation
export const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database schema...');
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'citizen',
        team VARCHAR(100) DEFAULT 'Team Alpha',
        status VARCHAR(50) DEFAULT 'active',
        telegram_id VARCHAR(100),
        location VARCHAR(255),
        phone VARCHAR(20),
        organization VARCHAR(255),
        expertise TEXT[],
        preferences JSONB DEFAULT '{"notifications": true, "emailUpdates": true, "dataSharing": true}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create FAQs table
    await sql`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        subcategory VARCHAR(100) DEFAULT 'General',
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        priority VARCHAR(20) DEFAULT 'medium',
        tags TEXT[],
        media TEXT[],
        importance VARCHAR(20) DEFAULT 'normal',
        view_count INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create daily updates table
    await sql`
      CREATE TABLE IF NOT EXISTS daily_updates (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'announcement',
        priority VARCHAR(20) DEFAULT 'normal',
        tags TEXT[],
        media TEXT[],
        scheduled_date TIMESTAMP,
        published_date TIMESTAMP,
        status VARCHAR(20) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create notifications table
    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('✅ Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return false;
  }
};

// User operations
export const userOperations = {
  // Get all users
  getAll: async () => {
    try {
      const users = await sql`SELECT * FROM users ORDER BY created_at DESC`;
      return users.map(user => ({
        ...user,
        expertise: user.expertise || [],
        preferences: user.preferences || { notifications: true, emailUpdates: true, dataSharing: true }
      }));
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      return [];
    }
  },

  // Get user by ID
  getById: async (id) => {
    try {
      const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;
      return user ? {
        ...user,
        expertise: user.expertise || [],
        preferences: user.preferences || { notifications: true, emailUpdates: true, dataSharing: true }
      } : null;
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      return null;
    }
  },

  // Create user
  create: async (userData) => {
    try {
      const [user] = await sql`
        INSERT INTO users (name, email, username, password, role, team, status, telegram_id, location, phone, organization, expertise, preferences)
        VALUES (${userData.name}, ${userData.email}, ${userData.username}, ${userData.password}, ${userData.role}, ${userData.team}, ${userData.status}, ${userData.telegramId || null}, ${userData.location || null}, ${userData.phone || null}, ${userData.organization || null}, ${userData.expertise || []}, ${JSON.stringify(userData.preferences || {})})
        RETURNING *
      `;
      return {
        ...user,
        expertise: user.expertise || [],
        preferences: user.preferences || { notifications: true, emailUpdates: true, dataSharing: true }
      };
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  },

  // Update user
  update: async (id, userData) => {
    try {
      const [user] = await sql`
        UPDATE users 
        SET name = ${userData.name}, email = ${userData.email}, username = ${userData.username}, 
            password = ${userData.password}, role = ${userData.role}, team = ${userData.team}, 
            status = ${userData.status}, telegram_id = ${userData.telegramId || null}, 
            location = ${userData.location || null}, phone = ${userData.phone || null}, 
            organization = ${userData.organization || null}, expertise = ${userData.expertise || []}, 
            preferences = ${JSON.stringify(userData.preferences || {})}, 
            updated_at = CURRENT_TIMESTAMP, last_activity = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
      return {
        ...user,
        expertise: user.expertise || [],
        preferences: user.preferences || { notifications: true, emailUpdates: true, dataSharing: true }
      };
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      await sql`DELETE FROM users WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('❌ Error deleting user:', error);
      throw error;
    }
  }
};

// FAQ operations
export const faqOperations = {
  // Get all FAQs
  getAll: async () => {
    try {
      const faqs = await sql`SELECT * FROM faqs ORDER BY created_at DESC`;
      return faqs.map(faq => ({
        ...faq,
        tags: faq.tags || [],
        media: faq.media || []
      }));
    } catch (error) {
      console.error('❌ Error fetching FAQs:', error);
      return [];
    }
  },

  // Get FAQ by ID
  getById: async (id) => {
    try {
      const [faq] = await sql`SELECT * FROM faqs WHERE id = ${id}`;
      return faq ? {
        ...faq,
        tags: faq.tags || [],
        media: faq.media || []
      } : null;
    } catch (error) {
      console.error('❌ Error fetching FAQ:', error);
      return null;
    }
  },

  // Create FAQ
  create: async (faqData) => {
    try {
      const [faq] = await sql`
        INSERT INTO faqs (category, subcategory, question, answer, priority, tags, media, importance, view_count, status)
        VALUES (${faqData.category}, ${faqData.subcategory}, ${faqData.question}, ${faqData.answer}, ${faqData.priority}, ${faqData.tags || []}, ${faqData.media || []}, ${faqData.importance}, ${faqData.viewCount || 0}, ${faqData.status || 'active'})
        RETURNING *
      `;
      return {
        ...faq,
        tags: faq.tags || [],
        media: faq.media || []
      };
    } catch (error) {
      console.error('❌ Error creating FAQ:', error);
      throw error;
    }
  },

  // Update FAQ
  update: async (id, faqData) => {
    try {
      const [faq] = await sql`
        UPDATE faqs 
        SET category = ${faqData.category}, subcategory = ${faqData.subcategory}, 
            question = ${faqData.question}, answer = ${faqData.answer}, 
            priority = ${faqData.priority}, tags = ${faqData.tags || []}, 
            media = ${faqData.media || []}, importance = ${faqData.importance}, 
            view_count = ${faqData.viewCount || 0}, status = ${faqData.status || 'active'}, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
      return {
        ...faq,
        tags: faq.tags || [],
        media: faq.media || []
      };
    } catch (error) {
      console.error('❌ Error updating FAQ:', error);
      throw error;
    }
  },

  // Delete FAQ
  delete: async (id) => {
    try {
      await sql`DELETE FROM faqs WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('❌ Error deleting FAQ:', error);
      throw error;
    }
  }
};

// Daily updates operations
export const updateOperations = {
  // Get all updates
  getAll: async () => {
    try {
      const updates = await sql`SELECT * FROM daily_updates ORDER BY created_at DESC`;
      return updates.map(update => ({
        ...update,
        tags: update.tags || [],
        media: update.media || []
      }));
    } catch (error) {
      console.error('❌ Error fetching updates:', error);
      return [];
    }
  },

  // Get update by ID
  getById: async (id) => {
    try {
      const [update] = await sql`SELECT * FROM daily_updates WHERE id = ${id}`;
      return update ? {
        ...update,
        tags: update.tags || [],
        media: update.media || []
      } : null;
    } catch (error) {
      console.error('❌ Error fetching update:', error);
      return null;
    }
  },

  // Create update
  create: async (updateData) => {
    try {
      const [update] = await sql`
        INSERT INTO daily_updates (title, content, type, priority, tags, media, scheduled_date, published_date, status)
        VALUES (${updateData.title}, ${updateData.content}, ${updateData.type}, ${updateData.priority}, ${updateData.tags || []}, ${updateData.media || []}, ${updateData.scheduledDate || null}, ${updateData.publishedDate || null}, ${updateData.status || 'draft'})
        RETURNING *
      `;
      return {
        ...update,
        tags: update.tags || [],
        media: update.media || []
      };
    } catch (error) {
      console.error('❌ Error creating update:', error);
      throw error;
    }
  },

  // Update update
  update: async (id, updateData) => {
    try {
      const [update] = await sql`
        UPDATE daily_updates 
        SET title = ${updateData.title}, content = ${updateData.content}, 
            type = ${updateData.type}, priority = ${updateData.priority}, 
            tags = ${updateData.tags || []}, media = ${updateData.media || []}, 
            scheduled_date = ${updateData.scheduledDate || null}, 
            published_date = ${updateData.publishedDate || null}, 
            status = ${updateData.status || 'draft'}, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `;
      return {
        ...update,
        tags: update.tags || [],
        media: update.media || []
      };
    } catch (error) {
      console.error('❌ Error updating update:', error);
      throw error;
    }
  },

  // Delete update
  delete: async (id) => {
    try {
      await sql`DELETE FROM daily_updates WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('❌ Error deleting update:', error);
      throw error;
    }
  }
};

// Notification operations
export const notificationOperations = {
  // Get notifications for user
  getByUserId: async (userId) => {
    try {
      const notifications = await sql`SELECT * FROM notifications WHERE user_id = ${userId} ORDER BY created_at DESC`;
      return notifications;
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      return [];
    }
  },

  // Create notification
  create: async (notificationData) => {
    try {
      const [notification] = await sql`
        INSERT INTO notifications (user_id, type, title, message, read)
        VALUES (${notificationData.userId || null}, ${notificationData.type}, ${notificationData.title}, ${notificationData.message}, ${notificationData.read || false})
        RETURNING *
      `;
      return notification;
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      await sql`UPDATE notifications SET read = true WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      throw error;
    }
  },

  // Delete notification
  delete: async (id) => {
    try {
      await sql`DELETE FROM notifications WHERE id = ${id}`;
      return true;
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
      throw error;
    }
  }
};

export default {
  initializeDatabase,
  userOperations,
  faqOperations,
  updateOperations,
  notificationOperations
};
