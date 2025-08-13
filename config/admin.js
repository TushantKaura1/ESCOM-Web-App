// Admin Configuration
module.exports = {
  // Admin Telegram IDs (replace with actual admin IDs)
  ADMIN_IDS: process.env.ADMIN_IDS ? 
    process.env.ADMIN_IDS.split(',').map(id => parseInt(id.trim())) : 
    [123456789], // Demo admin ID from demo-accounts.json
  
  // Admin permissions
  PERMISSIONS: {
    USER_MANAGEMENT: true,
    DATA_ANALYTICS: true,
    SYSTEM_SETTINGS: true,
    REPORTS: true,
    ADMIN_DASHBOARD: true
  },
  
  // Admin features
  FEATURES: {
    VIEW_ALL_USERS: true,
    EDIT_USER_PROFILES: true,
    DELETE_USERS: true,
    VIEW_SYSTEM_STATS: true,
    MANAGE_TEAMS: true,
    EXPORT_DATA: true,
    SEND_BROADCAST_MESSAGES: true
  },
  
  // Admin dashboard settings
  DASHBOARD: {
    REFRESH_INTERVAL: 30000, // 30 seconds
    MAX_USERS_DISPLAY: 50,
    SHOW_SENSITIVE_DATA: true
  }
}; 