// API service for database operations through Netlify Functions
const API_BASE_URL = '/.netlify/functions';

// Helper function to make API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`❌ API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Database schema creation
export const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database schema...');
    
    // Call the database function to initialize schema
    await apiCall('database', 'POST', {
      operation: 'initialize',
      table: 'schema'
    });

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
      return await apiCall('database', 'POST', {
        operation: 'getAll',
        table: 'users'
      });
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      return [];
    }
  },

  // Get user by ID
  getById: async (id) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'getById',
        table: 'users',
        id: id
      });
    } catch (error) {
      console.error('❌ Error fetching user:', error);
      return null;
    }
  },

  // Create user
  create: async (userData) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'create',
        table: 'users',
        data: userData
      });
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  },

  // Update user
  update: async (id, userData) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'update',
        table: 'users',
        id: id,
        data: userData
      });
    } catch (error) {
      console.error('❌ Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  delete: async (id) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'delete',
        table: 'users',
        id: id
      });
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
      return await apiCall('database', 'POST', {
        operation: 'getAll',
        table: 'faqs'
      });
    } catch (error) {
      console.error('❌ Error fetching FAQs:', error);
      return [];
    }
  },

  // Get FAQ by ID
  getById: async (id) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'getById',
        table: 'faqs',
        id: id
      });
    } catch (error) {
      console.error('❌ Error fetching FAQ:', error);
      return null;
    }
  },

  // Create FAQ
  create: async (faqData) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'create',
        table: 'faqs',
        data: faqData
      });
    } catch (error) {
      console.error('❌ Error creating FAQ:', error);
      throw error;
    }
  },

  // Update FAQ
  update: async (id, faqData) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'update',
        table: 'faqs',
        id: id,
        data: faqData
      });
    } catch (error) {
      console.error('❌ Error updating FAQ:', error);
      throw error;
    }
  },

  // Delete FAQ
  delete: async (id) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'delete',
        table: 'faqs',
        id: id
      });
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
      return await apiCall('database', 'POST', {
        operation: 'getAll',
        table: 'daily_updates'
      });
    } catch (error) {
      console.error('❌ Error fetching updates:', error);
      return [];
    }
  },

  // Get update by ID
  getById: async (id) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'getById',
        table: 'daily_updates',
        id: id
      });
    } catch (error) {
      console.error('❌ Error fetching update:', error);
      return null;
    }
  },

  // Create update
  create: async (updateData) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'create',
        table: 'daily_updates',
        data: updateData
      });
    } catch (error) {
      console.error('❌ Error creating update:', error);
      throw error;
    }
  },

  // Update update
  update: async (id, updateData) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'update',
        table: 'daily_updates',
        id: id,
        data: updateData
      });
    } catch (error) {
      console.error('❌ Error updating update:', error);
      throw error;
    }
  },

  // Delete update
  delete: async (id) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'delete',
        table: 'daily_updates',
        id: id
      });
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
      return await apiCall('database', 'POST', {
        operation: 'getByUserId',
        table: 'notifications',
        userId: userId
      });
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      return [];
    }
  },

  // Create notification
  create: async (notificationData) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'create',
        table: 'notifications',
        data: notificationData
      });
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (id) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'markAsRead',
        table: 'notifications',
        id: id
      });
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      throw error;
    }
  },

  // Delete notification
  delete: async (id) => {
    try {
      return await apiCall('database', 'POST', {
        operation: 'delete',
        table: 'notifications',
        id: id
      });
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