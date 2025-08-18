// Configuration file for API endpoints
const config = {
  // API Base URL - Always use Render backend for production
  API_BASE_URL: 'https://citiscience-backend-95pp.onrender.com',
  
  // App Configuration
  APP_NAME: 'ESCOM Citizen Scientist',
  APP_VERSION: '2.0.0',
  
  // Feature Flags
  ENABLE_TELEGRAM: false,
  ENABLE_BOT: false,
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',  // User login endpoint
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile'
    },
    ADMIN: {
      LOGIN: '/api/admin/login',  // Admin-specific login endpoint
      DASHBOARD: '/api/admin/dashboard',
      USERS: '/api/admin/users',
      FAQS: '/api/admin/faqs',
      UPDATES: '/api/admin/updates',
      SEARCH: '/api/admin/search',
      // Database Monitoring
      DATABASE_STATUS: '/api/admin/database/status',
      DATABASE_CHANGES: '/api/admin/database/changes',
      DATABASE_COLLECTIONS: '/api/admin/database/collections',
      // Advanced Features
      CREATE_FAQ: '/api/admin/faqs',
      UPDATE_FAQ: '/api/admin/faqs',
      DELETE_FAQ: '/api/admin/faqs',
      REORDER_FAQS: '/api/admin/faqs/reorder',
      CREATE_USER: '/api/admin/users',
      UPDATE_USER_PASSWORD: '/api/admin/users',
      DELETE_USER: '/api/admin/users',
      USER_ACTIVITY: '/api/admin/users'
    },
    USER: {
      DASHBOARD: '/api/user/dashboard',
      FAQS: '/api/user/faqs',
      UPDATES: '/api/user/updates',
      PROFILE: '/api/user/profile',
      ACTIVITY: '/api/user/activity',
      SEARCH: '/api/user/search'
    }
  }
};

export default config; 