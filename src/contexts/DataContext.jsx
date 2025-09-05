import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Centralized state for all application data
  const [faqs, setFaqs] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  
  // Data synchronization status
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced data persistence with error handling
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`✅ Data saved to localStorage: ${key}`, data);
    } catch (error) {
      console.error(`❌ Failed to save data to localStorage: ${key}`, error);
    }
  };

  const loadFromStorage = (key, defaultValue = []) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log(`✅ Data loaded from localStorage: ${key}`, parsed);
        return parsed;
      }
    } catch (error) {
      console.error(`❌ Failed to load data from localStorage: ${key}`, error);
    }
    return defaultValue;
  };

  // Load initial data from localStorage or demo data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    setIsLoading(true);
    console.log('🔄 Loading initial data...');
    console.log('🔍 DataContext: Starting data load...');

    try {
      // Load FAQs
      const savedFaqs = loadFromStorage('faqs');
      if (savedFaqs && savedFaqs.length > 0) {
        setFaqs(savedFaqs);
      } else {
        // Enhanced FAQ data with more realistic content
        const demoFaqs = [
          {
            id: 1,
            category: 'ESCOM Organization',
            subcategory: 'Getting Involved',
            question: 'How can I get involved with ESCOM?',
            answer: 'You can get involved by joining our coastal monitoring program, participating in training sessions, and contributing to data collection. We offer both online and in-person training opportunities.',
            priority: 'high',
            tags: ['getting-started', 'volunteer', 'training'],
            media: [],
            importance: 'critical',
            viewCount: 156,
            createdAt: '2024-01-15',
            updatedAt: '2024-01-15',
            status: 'active'
          },
          {
            id: 2,
            category: 'Monitoring',
            subcategory: 'Equipment',
            question: 'What parameters do we monitor?',
            answer: 'We monitor water temperature, salinity, pH levels, turbidity, dissolved oxygen, and overall water quality using specialized equipment. Each parameter provides crucial insights into coastal ecosystem health.',
            priority: 'medium',
            tags: ['monitoring', 'equipment', 'parameters'],
            media: [],
            importance: 'normal',
            viewCount: 89,
            createdAt: '2024-01-10',
            updatedAt: '2024-01-10',
            status: 'active'
          },
          {
            id: 3,
            category: 'Data Collection',
            subcategory: 'Best Practices',
            question: 'How often should I collect data?',
            answer: 'We recommend collecting data weekly during normal conditions and daily during extreme weather events. Consistent data collection helps identify patterns and trends in coastal health.',
            priority: 'high',
            tags: ['data-collection', 'frequency', 'best-practices'],
            media: [],
            importance: 'critical',
            viewCount: 234,
            createdAt: '2024-01-20',
            updatedAt: '2024-01-20',
            status: 'active'
          },
          {
            id: 4,
            category: 'Safety',
            subcategory: 'Field Work',
            question: 'What safety precautions should I take?',
            answer: 'Always check weather conditions before monitoring, wear appropriate safety gear, work in pairs when possible, and avoid monitoring during severe weather. Your safety is our priority.',
            priority: 'high',
            tags: ['safety', 'field-work', 'weather'],
            media: [],
            importance: 'critical',
            viewCount: 178,
            createdAt: '2024-01-18',
            updatedAt: '2024-01-18',
            status: 'active'
          },
          {
            id: 5,
            category: 'Training',
            subcategory: 'Certification',
            question: 'How do I get certified for monitoring?',
            answer: 'Complete our online training modules, attend a hands-on workshop, and pass the certification test. Certification is valid for 2 years and includes ongoing support.',
            priority: 'medium',
            tags: ['training', 'certification', 'workshop'],
            media: [],
            importance: 'normal',
            viewCount: 145,
            createdAt: '2024-01-22',
            updatedAt: '2024-01-22',
            status: 'active'
          }
        ];
        setFaqs(demoFaqs);
        saveToStorage('faqs', demoFaqs);
      }

      // Load Updates
      const savedUpdates = loadFromStorage('updates');
      if (savedUpdates && savedUpdates.length > 0) {
        setUpdates(savedUpdates);
      } else {
        // Enhanced updates with more realistic content
        const demoUpdates = [
          {
            id: 1,
            title: 'New Monitoring Equipment Available',
            content: 'We have received new water quality monitoring equipment including advanced pH meters and turbidity sensors. Training sessions will be scheduled next week. Please contact your team leader to reserve your spot.',
            type: 'announcement',
            priority: 'high',
            tags: ['equipment', 'training', 'monitoring'],
            media: [],
            status: 'published',
            createdAt: '2024-01-18',
            viewCount: 234
          },
          {
            id: 2,
            title: 'Monthly Data Review Meeting',
            content: 'Join us for our monthly data review meeting where we analyze trends and discuss findings. All citizen scientists welcome! We\'ll be reviewing January data and planning February monitoring activities.',
            type: 'meeting',
            priority: 'medium',
            tags: ['meeting', 'data-review', 'collaboration'],
            media: [],
            status: 'published',
            createdAt: '2024-01-20',
            viewCount: 156
          },
          {
            id: 3,
            title: 'Weather Alert: Storm Approaching',
            content: 'Heavy rainfall expected this weekend. Please avoid monitoring during severe weather conditions for safety. Data collection can resume once conditions improve.',
            type: 'alert',
            priority: 'high',
            tags: ['weather', 'safety', 'alert'],
            media: [],
            status: 'published',
            createdAt: '2024-01-21',
            viewCount: 89
          },
          {
            id: 4,
            title: 'Coastal Cleanup Event',
            content: 'Join our monthly coastal cleanup event this Saturday. We\'ll be cleaning up Beach Point A and collecting data on marine debris. Bring your monitoring equipment!',
            type: 'event',
            priority: 'medium',
            tags: ['cleanup', 'event', 'volunteer'],
            media: [],
            status: 'published',
            createdAt: '2024-01-23',
            viewCount: 67
          }
        ];
        setUpdates(demoUpdates);
        saveToStorage('updates', demoUpdates);
      }

      // Load Users with enhanced data
      const savedUsers = loadFromStorage('users');
      if (savedUsers && savedUsers.length > 0) {
        setUsers(savedUsers);
      } else {
        // Enhanced user data with realistic information
        const demoUsers = [
          {
            id: 1,
            name: 'Dr. Maria Santos',
            email: 'maria.santos@escom.org',
            username: 'maria.santos',
            role: 'admin',
            team: 'Research Team',
            status: 'active',
            joinDate: '2023-06-15',
            lastActivity: '2 hours ago',
            totalReadings: 156,
            accuracy: 98,
            specializations: ['Marine Biology', 'Data Analysis'],
            certifications: ['Advanced Monitoring', 'Safety Training'],
            contributions: 234
          },
          {
            id: 2,
            name: 'Carlos Silva',
            email: 'carlos.silva@email.com',
            username: 'carlos.silva',
            role: 'citizen',
            team: 'Team Alpha',
            status: 'active',
            joinDate: '2024-01-10',
            lastActivity: '1 day ago',
            totalReadings: 67,
            accuracy: 91,
            specializations: ['Water Quality'],
            certifications: ['Basic Monitoring'],
            contributions: 98
          },
          {
            id: 3,
            name: 'Ana Oliveira',
            email: 'ana.oliveira@email.com',
            username: 'ana.oliveira',
            role: 'citizen',
            team: 'Team Beta',
            status: 'active',
            joinDate: '2024-01-20',
            lastActivity: '3 hours ago',
            totalReadings: 78,
            accuracy: 89,
            specializations: ['Environmental Science'],
            certifications: ['Basic Monitoring'],
            contributions: 134
          },
          {
            id: 4,
            name: 'Lúcia Fernandes',
            email: 'lucia.fernandes@email.com',
            username: 'lucia.fernandes',
            role: 'moderator',
            team: 'Team Gamma',
            status: 'active',
            joinDate: '2024-01-15',
            lastActivity: '2 hours ago',
            totalReadings: 89,
            accuracy: 94,
            specializations: ['Oceanography'],
            certifications: ['Advanced Monitoring', 'Safety Training'],
            contributions: 156
          }
        ];
        setUsers(demoUsers);
        saveToStorage('users', demoUsers);
      }

      // Load System Stats
      const savedStats = loadFromStorage('systemStats');
      if (savedStats && Object.keys(savedStats).length > 0) {
        setSystemStats(savedStats);
      } else {
        // Enhanced system statistics
        const demoStats = {
          totalUsers: 24,
          activeUsers: 21,
          totalReadings: 1247,
          averageAccuracy: 94.2,
          newThisMonth: 7,
          systemHealth: 'Excellent',
          totalFAQs: 5,
          totalUpdates: 4,
          pendingApprovals: 0,
          monthlyGrowth: 12.5,
          dataQuality: 'High',
          systemUptime: 99.8,
          lastBackup: '2024-01-25T10:00:00Z',
          databaseSize: '2.3 GB',
          activeTeams: 4,
          totalContributions: 3456
        };
        setSystemStats(demoStats);
        saveToStorage('systemStats', demoStats);
      }

      // Load Notifications
      const savedNotifications = loadFromStorage('notifications');
      if (savedNotifications && savedNotifications.length > 0) {
        setNotifications(savedNotifications);
      } else {
        // Enhanced notifications
        const demoNotifications = [
          {
            id: 1,
            type: 'info',
            title: 'Welcome to ESCOM!',
            message: 'Thank you for joining our coastal monitoring community. Complete your profile to get started.',
            timestamp: '2024-01-25T09:00:00Z',
            read: false
          },
          {
            id: 2,
            type: 'success',
            title: 'Data Submission Successful',
            message: 'Your water quality readings have been recorded. Great work!',
            timestamp: '2024-01-24T15:30:00Z',
            read: true
          },
          {
            id: 3,
            type: 'warning',
            title: 'Equipment Maintenance Due',
            message: 'Your pH meter is due for calibration. Schedule maintenance within the next week.',
            timestamp: '2024-01-23T11:00:00Z',
            read: false
          }
        ];
        setNotifications(demoNotifications);
        saveToStorage('notifications', demoNotifications);
      }

      setIsLoading(false);
      console.log('✅ Initial data loaded successfully');
      console.log('🔍 DataContext: Data load completed, isLoading set to false');
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
      setIsLoading(false);
    }
  };

  // Centralized data update functions that sync everywhere
  const updateFaq = (faqId, updates) => {
    try {
      const updatedFaqs = faqs.map(faq => 
        faq.id === faqId ? { ...faq, ...updates, updatedAt: new Date().toISOString() } : faq
      );
      setFaqs(updatedFaqs);
      saveToStorage('faqs', updatedFaqs);
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'faq-update',
        message: `FAQ "${updates.question || 'updated'}" has been modified`,
        timestamp: new Date().toISOString(),
        read: false
      });

      console.log('✅ FAQ updated successfully:', faqId);
    } catch (error) {
      console.error('❌ Error updating FAQ:', error);
    }
  };

  const addFaq = (newFaq) => {
    try {
      const faqWithId = {
        ...newFaq,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 0,
        status: 'active'
      };
      const updatedFaqs = [...faqs, faqWithId];
      setFaqs(updatedFaqs);
      saveToStorage('faqs', updatedFaqs);
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'faq-create',
        message: `New FAQ "${newFaq.question}" has been added`,
        timestamp: new Date().toISOString(),
        read: false
      });

      console.log('✅ FAQ added successfully:', faqWithId);
    } catch (error) {
      console.error('❌ Error adding FAQ:', error);
    }
  };

  const deleteFaq = (faqId) => {
    try {
      const updatedFaqs = faqs.filter(faq => faq.id !== faqId);
      setFaqs(updatedFaqs);
      saveToStorage('faqs', updatedFaqs);
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'faq-delete',
        message: 'A FAQ has been deleted',
        timestamp: new Date().toISOString(),
        read: false
      });

      console.log('✅ FAQ deleted successfully:', faqId);
    } catch (error) {
      console.error('❌ Error deleting FAQ:', error);
    }
  };



  const updateDailyUpdate = (updateId, updates) => {
    try {
      const updatedUpdates = updates.map(update => 
        update.id === updateId ? { ...update, ...updates, updatedAt: new Date().toISOString() } : update
      );
      setUpdates(updatedUpdates);
      saveToStorage('updates', updatedUpdates);
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'update-modify',
        message: `Update "${updates.title || 'modified'}" has been updated`,
        timestamp: new Date().toISOString(),
        read: false
      });

      console.log('✅ Daily update updated successfully:', updateId);
    } catch (error) {
      console.error('❌ Error updating daily update:', error);
    }
  };

  const addDailyUpdate = (newUpdate) => {
    try {
      const updateWithId = {
        ...newUpdate,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 0,
        status: newUpdate.scheduledDate ? 'scheduled' : 'published'
      };
      const updatedUpdates = [...updates, updateWithId];
      setUpdates(updatedUpdates);
      saveToStorage('updates', updatedUpdates);
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'update-create',
        message: `New update "${newUpdate.title}" has been published`,
        timestamp: new Date().toISOString(),
        read: false
      });

      console.log('✅ Daily update added successfully:', updateWithId);
    } catch (error) {
      console.error('❌ Error adding daily update:', error);
    }
  };

  const deleteDailyUpdate = (updateId) => {
    try {
      const updatedUpdates = updates.filter(update => update.id !== updateId);
      setUpdates(updatedUpdates);
      saveToStorage('updates', updatedUpdates);
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'update-delete',
        message: 'An update has been deleted',
        timestamp: new Date().toISOString(),
        read: false
      });

      console.log('✅ Daily update deleted successfully:', updateId);
    } catch (error) {
      console.error('❌ Error deleting daily update:', error);
    }
  };

  const updateUser = (userId, updates) => {
    try {
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, ...updates, lastUpdated: new Date().toISOString() } : user
      );
      setUsers(updatedUsers);
      saveToStorage('users', updatedUsers);
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'user-update',
        message: `User "${updates.name || 'profile'}" has been updated`,
        timestamp: new Date().toISOString(),
        read: false
      });

      console.log('✅ User updated successfully:', userId);
    } catch (error) {
      console.error('❌ Error updating user:', error);
    }
  };

  const addUser = (newUser) => {
    try {
      const userWithId = {
        ...newUser,
        id: Date.now(),
        joinDate: new Date().toISOString(),
        lastActivity: 'Never',
        readings: 0,
        accuracy: 0,
        totalContributions: 0,
        lastUpdated: new Date().toISOString()
      };
      const updatedUsers = [...users, userWithId];
      setUsers(updatedUsers);
      saveToStorage('users', updatedUsers);
      
      // Update system stats
      const newStats = { ...systemStats, totalUsers: systemStats.totalUsers + 1 };
      setSystemStats(newStats);
      saveToStorage('systemStats', newStats);
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'user-create',
        message: `New user "${newUser.name}" has been added`,
        timestamp: new Date().toISOString(),
        read: false
      });

      console.log('✅ User added successfully:', userWithId);
    } catch (error) {
      console.error('❌ Error adding user:', error);
    }
  };

  const deleteUser = (userId) => {
    try {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      saveToStorage('users', updatedUsers);
      
      // Update system stats
      const newStats = { ...systemStats, totalUsers: systemStats.totalUsers - 1 };
      setSystemStats(newStats);
      saveToStorage('systemStats', newStats);
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'user-delete',
        message: 'A user has been removed',
        timestamp: new Date().toISOString(),
        read: false
      });

      console.log('✅ User deleted successfully:', userId);
    } catch (error) {
      console.error('❌ Error deleting user:', error);
    }
  };

  const addNotification = (notification) => {
    try {
      const updatedNotifications = [notification, ...notifications];
      setNotifications(updatedNotifications);
      saveToStorage('notifications', updatedNotifications);
    } catch (error) {
      console.error('❌ Error adding notification:', error);
    }
  };

  const markNotificationAsRead = (notificationId) => {
    try {
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );
      setNotifications(updatedNotifications);
      saveToStorage('notifications', updatedNotifications);
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  const clearAllNotifications = () => {
    try {
      setNotifications([]);
      localStorage.removeItem('notifications');
    } catch (error) {
      console.error('❌ Error clearing notifications:', error);
    }
  };

  // Force sync all data
  const forceSync = () => {
    setIsSyncing(true);
    console.log('🔄 Starting data synchronization...');
    
    try {
      // Re-save all data to ensure consistency
      saveToStorage('faqs', faqs);
      saveToStorage('updates', updates);
      saveToStorage('users', users);
      saveToStorage('systemStats', systemStats);
      saveToStorage('notifications', notifications);
      
      // Simulate sync process
      setTimeout(() => {
        setIsSyncing(false);
        setLastSync(new Date().toISOString());
        console.log('🔄 All data synchronized successfully');
      }, 1000);
    } catch (error) {
      console.error('❌ Error during synchronization:', error);
      setIsSyncing(false);
    }
  };

  // Export data for backup
  const exportData = () => {
    try {
      const data = {
        faqs,
        updates,
        users,
        systemStats,
        notifications,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `escom-data-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      console.log('✅ Data exported successfully');
    } catch (error) {
      console.error('❌ Error exporting data:', error);
    }
  };

  // Import data from backup
  const importData = (data) => {
    try {
      if (data.faqs) setFaqs(data.faqs);
      if (data.updates) setUpdates(data.updates);
      if (data.users) setUsers(data.users);
      if (data.systemStats) setSystemStats(data.systemStats);
      if (data.notifications) setNotifications(data.notifications);
      
      // Save imported data
      saveToStorage('faqs', data.faqs || []);
      saveToStorage('updates', data.updates || []);
      saveToStorage('users', data.users || []);
      saveToStorage('systemStats', data.systemStats || {});
      saveToStorage('notifications', data.notifications || []);
      
      console.log('✅ Data imported successfully');
    } catch (error) {
      console.error('❌ Error importing data:', error);
    }
  };

  const value = {
    // Data
    faqs,
    updates,
    users,
    systemStats,
    notifications,
    
    // Sync status
    isSyncing,
    lastSync,
    isLoading,
    
    // FAQ operations
    updateFaq,
    addFaq,
    deleteFaq,
    
    // Update operations
    updateDailyUpdate,
    addDailyUpdate,
    deleteDailyUpdate,
    
    // User operations
    updateUser,
    addUser,
    deleteUser,
    
    // Notification operations
    addNotification,
    markNotificationAsRead,
    clearAllNotifications,
    
    // Sync operations
    forceSync,
    exportData,
    importData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
