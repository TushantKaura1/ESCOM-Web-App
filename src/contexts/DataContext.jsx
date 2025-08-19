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

  // Load initial data from localStorage or demo data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    // Load FAQs
    const savedFaqs = localStorage.getItem('faqs');
    if (savedFaqs) {
      setFaqs(JSON.parse(savedFaqs));
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
      localStorage.setItem('faqs', JSON.stringify(demoFaqs));
    }

    // Load Updates
    const savedUpdates = localStorage.getItem('updates');
    if (savedUpdates) {
      setUpdates(JSON.parse(savedUpdates));
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
      localStorage.setItem('updates', JSON.stringify(demoUpdates));
    }

    // Load Users
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
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
      localStorage.setItem('users', JSON.stringify(demoUsers));
    }

    // Load System Stats
    const savedStats = localStorage.getItem('systemStats');
    if (savedStats) {
      setSystemStats(JSON.parse(savedStats));
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
      localStorage.setItem('systemStats', JSON.stringify(demoStats));
    }
  };

  // Centralized data update functions that sync everywhere
  const updateFaq = (faqId, updates) => {
    const updatedFaqs = faqs.map(faq => 
      faq.id === faqId ? { ...faq, ...updates, updatedAt: new Date().toISOString() } : faq
    );
    setFaqs(updatedFaqs);
    localStorage.setItem('faqs', JSON.stringify(updatedFaqs));
    
    // Trigger sync notification
    addNotification({
      id: Date.now(),
      type: 'faq-update',
      message: `FAQ "${updates.question || 'updated'}" has been modified`,
      timestamp: new Date().toISOString(),
      read: false
    });
  };

  const addFaq = (newFaq) => {
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
    localStorage.setItem('faqs', JSON.stringify(updatedFaqs));
    
    // Trigger sync notification
    addNotification({
      id: Date.now(),
      type: 'faq-create',
      message: `New FAQ "${newFaq.question}" has been added`,
      timestamp: new Date().toISOString(),
      read: false
    });
  };

  const deleteFaq = (faqId) => {
    const updatedFaqs = faqs.filter(faq => faq.id !== faqId);
    setFaqs(updatedFaqs);
    localStorage.setItem('faqs', JSON.stringify(updatedFaqs));
    
    // Trigger sync notification
    addNotification({
      id: Date.now(),
      type: 'faq-delete',
      message: 'A FAQ has been deleted',
      timestamp: new Date().toISOString(),
      read: false
    });
  };

  const updateDailyUpdate = (updateId, updates) => {
    const updatedUpdates = updates.map(update => 
      update.id === updateId ? { ...update, ...updates, updatedAt: new Date().toISOString() } : update
    );
    setUpdates(updatedUpdates);
    localStorage.setItem('updates', JSON.stringify(updatedUpdates));
    
    // Trigger sync notification
    addNotification({
      id: Date.now(),
      type: 'update-modify',
      message: `Update "${updates.title || 'modified'}" has been updated`,
      timestamp: new Date().toISOString(),
      read: false
    });
  };

  const addDailyUpdate = (newUpdate) => {
    const updateWithId = {
      ...newUpdate,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      status: 'active'
    };
    const updatedUpdates = [...updates, updateWithId];
    setUpdates(updatedUpdates);
    localStorage.setItem('updates', JSON.stringify(updatedUpdates));
    
    // Trigger sync notification
    addNotification({
      id: Date.now(),
      type: 'update-create',
      message: `New update "${newUpdate.title}" has been published`,
      timestamp: new Date().toISOString(),
      read: false
    });
  };

  const deleteDailyUpdate = (updateId) => {
    const updatedUpdates = updates.filter(update => update.id !== updateId);
    setUpdates(updatedUpdates);
    localStorage.setItem('updates', JSON.stringify(updatedUpdates));
    
    // Trigger sync notification
    addNotification({
      id: Date.now(),
      type: 'update-delete',
      message: 'An update has been deleted',
      timestamp: new Date().toISOString(),
      read: false
    });
  };

  const updateUser = (userId, updates) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...updates, lastUpdated: new Date().toISOString() } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Trigger sync notification
    addNotification({
      id: Date.now(),
      type: 'user-update',
      message: `User "${updates.name || 'profile'}" has been updated`,
      timestamp: new Date().toISOString(),
      read: false
    });
  };

  const addUser = (newUser) => {
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
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Update system stats
    const newStats = { ...systemStats, totalUsers: systemStats.totalUsers + 1 };
    setSystemStats(newStats);
    localStorage.setItem('systemStats', JSON.stringify(newStats));
    
    // Trigger sync notification
    addNotification({
      id: Date.now(),
      type: 'user-create',
      message: `New user "${newUser.name}" has been added`,
      timestamp: new Date().toISOString(),
      read: false
    });
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Update system stats
    const newStats = { ...systemStats, totalUsers: systemStats.totalUsers - 1 };
    setSystemStats(newStats);
    localStorage.setItem('systemStats', JSON.stringify(newStats));
    
    // Trigger sync notification
    addNotification({
      id: Date.now(),
      type: 'user-delete',
      message: 'A user has been removed',
      timestamp: new Date().toISOString(),
      read: false
    });
  };

  const addNotification = (notification) => {
    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  // Force sync all data
  const forceSync = () => {
    setIsSyncing(true);
    // Simulate sync process
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toISOString());
      console.log('🔄 All data synchronized successfully');
    }, 1000);
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
    forceSync
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
