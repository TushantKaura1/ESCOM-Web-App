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

    try {
      // Load FAQs
      const savedFaqs = loadFromStorage('faqs');
      if (savedFaqs && savedFaqs.length > 0) {
        setFaqs(savedFaqs);
      } else {
        // Demo FAQ data
        const demoFaqs = [
          {
            id: 1,
            category: 'ESCOM Organization',
            subcategory: 'Getting Involved',
            question: 'How can I get involved with ESCOM?',
            answer: 'You can get involved by joining our coastal monitoring program, participating in training sessions, and contributing to data collection.',
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
            answer: 'We monitor water temperature, salinity, pH levels, and overall water quality using specialized equipment.',
            priority: 'medium',
            tags: ['monitoring', 'equipment', 'parameters'],
            media: [],
            importance: 'normal',
            viewCount: 89,
            createdAt: '2024-01-10',
            updatedAt: '2024-01-10',
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
        // Demo updates data
        const demoUpdates = [
          {
            id: 1,
            title: 'New Water Quality Monitoring Protocol',
            content: 'We have updated our water quality monitoring protocols to include additional parameters for better environmental assessment.',
            type: 'protocol',
            priority: 'high',
            tags: ['protocol', 'monitoring', 'water-quality'],
            media: [],
            scheduledDate: '2024-01-20',
            expirationDate: '2024-12-31',
            autoExpire: true,
            createdAt: '2024-01-20T10:00:00Z',
            updatedAt: '2024-01-20T10:00:00Z',
            author: 'Admin Team',
            viewCount: 45,
            status: 'active'
          }
        ];
        setUpdates(demoUpdates);
        saveToStorage('updates', demoUpdates);
      }

      // Load Users
      const savedUsers = loadFromStorage('users');
      if (savedUsers && savedUsers.length > 0) {
        setUsers(savedUsers);
      } else {
        // Demo users data
        const demoUsers = [
          {
            id: 1,
            name: 'Lúcia Fernandes',
            email: 'lucia@example.com',
            username: 'lucia.fernandes',
            team: 'Team Beta',
            status: 'active',
            role: 'citizen',
            readings: 89,
            accuracy: 94,
            lastActivity: '2 hours ago',
            joinDate: '2024-01-15',
            totalContributions: 156
          },
          {
            id: 2,
            name: 'Carlos Silva',
            email: 'carlos@example.com',
            username: 'carlos.silva',
            team: 'Team Alpha',
            status: 'active',
            role: 'moderator',
            readings: 67,
            accuracy: 91,
            lastActivity: '1 day ago',
            joinDate: '2024-01-10',
            totalContributions: 98
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
        const demoStats = {
          totalUsers: 12,
          activeUsers: 8,
          totalReadings: 567,
          averageAccuracy: 91.3,
          newThisMonth: 3,
          systemHealth: 'Excellent'
        };
        setSystemStats(demoStats);
        saveToStorage('systemStats', demoStats);
      }

      // Load Notifications
      const savedNotifications = loadFromStorage('notifications');
      if (savedNotifications && savedNotifications.length > 0) {
        setNotifications(savedNotifications);
      }

      console.log('✅ All initial data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
    } finally {
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
