// Configuration file for API endpoints
const config = {
  // API Base URL - Change this for different environments
  API_BASE_URL: (() => {
    // Check if we're in development (localhost) or production (Netlify)
    let baseUrl;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      baseUrl = 'http://localhost:3002';  // Local development
    } else {
      baseUrl = 'https://your-backend-url.onrender.com';  // Production - change this!
    }
    
    // Debug logging
    console.log('🌐 Environment detected:', window.location.hostname);
    console.log('🔗 API Base URL:', baseUrl);
    
    return baseUrl;
  })(),
  
  // App Configuration
  APP_NAME: 'ESCOM Citizen Scientist',
  APP_VERSION: '1.0.0',
  
  // Feature Flags
  ENABLE_TELEGRAM: false,
  ENABLE_BOT: false,
  
  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      PROFILE: '/api/auth/profile'
    },
    ADMIN: {
      DASHBOARD: '/api/admin/dashboard',
      USERS: '/api/admin/users',
      ANALYTICS: '/api/admin/analytics',
      FAQS: '/api/admin/faqs',
      REPORTS: '/api/admin/reports',
      SETTINGS: '/api/admin/settings'
    }
  }
};

export default config; 