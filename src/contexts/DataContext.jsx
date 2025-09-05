import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  initializeDatabase, 
  userOperations, 
  faqOperations, 
  updateOperations, 
  notificationOperations 
} from '../services/database';

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

  // Load initial data from live database
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    console.log('🔄 Loading initial data from live database...');
    console.log('🔍 DataContext: Starting live data load...');

    try {
      // Initialize database schema
      await initializeDatabase();
      console.log('✅ Database initialized successfully');

      // Load FAQs from live database
      console.log('🔍 DataContext: Loading FAQs from live database...');
      const liveFaqs = await faqOperations.getAll();
      console.log('🔍 DataContext: Live FAQs loaded:', liveFaqs);
      setFaqs(liveFaqs);

      // Load Updates from live database
      console.log('🔍 DataContext: Loading updates from live database...');
      const liveUpdates = await updateOperations.getAll();
      console.log('🔍 DataContext: Live updates loaded:', liveUpdates);
      setUpdates(liveUpdates);

      // Load Users from live database
      console.log('🔍 DataContext: Loading users from live database...');
      const liveUsers = await userOperations.getAll();
      console.log('🔍 DataContext: Live users loaded:', liveUsers);
      setUsers(liveUsers);

      // Load Notifications from live database
      console.log('🔍 DataContext: Loading notifications from live database...');
      const liveNotifications = await notificationOperations.getByUserId(null); // Get all notifications
      console.log('🔍 DataContext: Live notifications loaded:', liveNotifications);
      setNotifications(liveNotifications);

      // Set system stats
      setSystemStats({
        totalUsers: liveUsers.length,
        activeUsers: liveUsers.filter(u => u.status === 'active').length,
        totalFaqs: liveFaqs.length,
        totalUpdates: liveUpdates.length,
        pendingApprovals: 0,
        dataQuality: 'excellent',
        systemHealth: 'operational'
      });

      setLastSync(new Date().toISOString());
      console.log('✅ All live data loaded successfully');
    } catch (error) {
      console.error('❌ Error loading live data:', error);
      // Fallback to demo data if database fails
      console.log('🔄 Falling back to demo data...');
      loadDemoData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoData = () => {
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
  };

  // Centralized data update functions that sync everywhere
  const updateFaq = async (faqId, updates) => {
    try {
      console.log('🔄 Updating FAQ:', faqId, 'with data:', updates);
      console.log('🔄 Current FAQs before update:', faqs);
      
      const updatedFaq = await faqOperations.update(faqId, updates);
      console.log('🔄 Updated FAQ from database:', updatedFaq);
      
      // Update local state
      const updatedFaqs = faqs.map(faq => 
        faq.id === faqId ? { ...faq, ...updates, updatedAt: new Date().toISOString() } : faq
      );
      setFaqs(updatedFaqs);
      
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

  const addFaq = async (newFaq) => {
    try {
      console.log('🔄 Adding new FAQ:', newFaq);
      const faqWithId = await faqOperations.create(newFaq);
      console.log('🔄 FAQ created in database:', faqWithId);
      
      setFaqs(prev => [faqWithId, ...prev]);
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'faq-add',
        message: `New FAQ "${newFaq.question}" has been added`,
        timestamp: new Date().toISOString(),
        read: false
      });
      
      console.log('✅ FAQ added successfully');
    } catch (error) {
      console.error('❌ Error adding FAQ:', error);
    }
  };

  const deleteFaq = async (faqId) => {
    try {
      console.log('🔄 Deleting FAQ:', faqId);
      await faqOperations.delete(faqId);
      
      setFaqs(prev => prev.filter(faq => faq.id !== faqId));
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'faq-delete',
        message: 'FAQ has been deleted',
        timestamp: new Date().toISOString(),
        read: false
      });
      
      console.log('✅ FAQ deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting FAQ:', error);
    }
  };

  const updateDailyUpdate = async (updateId, updateData) => {
    try {
      console.log('🔄 Updating daily update:', updateId, 'with data:', updateData);
      console.log('🔄 Current updates before update:', updates);
      
      const updatedUpdate = await updateOperations.update(updateId, updateData);
      console.log('🔄 Updated update from database:', updatedUpdate);
      
      // Update local state
      const updatedUpdates = updates.map(update => 
        update.id === updateId ? { ...update, ...updateData, updatedAt: new Date().toISOString() } : update
      );
      setUpdates(updatedUpdates);
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'update-modify',
        message: `Update "${updateData.title || 'modified'}" has been updated`,
        timestamp: new Date().toISOString(),
        read: false
      });

      console.log('✅ Daily update updated successfully:', updateId);
    } catch (error) {
      console.error('❌ Error updating daily update:', error);
    }
  };

  const addDailyUpdate = async (newUpdate) => {
    try {
      console.log('🔄 Adding new daily update:', newUpdate);
      const updateWithId = await updateOperations.create(newUpdate);
      console.log('🔄 Update created in database:', updateWithId);
      
      setUpdates(prev => [updateWithId, ...prev]);
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'update-add',
        message: `New update "${newUpdate.title}" has been published`,
        timestamp: new Date().toISOString(),
        read: false
      });
      
      console.log('✅ Daily update added successfully');
    } catch (error) {
      console.error('❌ Error adding daily update:', error);
    }
  };

  const deleteDailyUpdate = async (updateId) => {
    try {
      console.log('🔄 Deleting daily update:', updateId);
      await updateOperations.delete(updateId);
      
      setUpdates(prev => prev.filter(update => update.id !== updateId));
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'update-delete',
        message: 'Daily update has been deleted',
        timestamp: new Date().toISOString(),
        read: false
      });
      
      console.log('✅ Daily update deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting daily update:', error);
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      console.log('🔄 Updating user:', userId, 'with data:', updates);
      console.log('🔄 Current users before update:', users);
      
      const updatedUser = await userOperations.update(userId, updates);
      console.log('🔄 Updated user from database:', updatedUser);
      
      // Update local state
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, ...updates, lastUpdated: new Date().toISOString() } : user
      );
      setUsers(updatedUsers);
      
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

  const addUser = async (newUser) => {
    try {
      console.log('🔄 Adding new user:', newUser);
      const userWithId = await userOperations.create(newUser);
      console.log('🔄 User created in database:', userWithId);
      
      setUsers(prev => [userWithId, ...prev]);
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'user-add',
        message: `New user "${newUser.name}" has been added`,
        timestamp: new Date().toISOString(),
        read: false
      });
      
      console.log('✅ User added successfully');
    } catch (error) {
      console.error('❌ Error adding user:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      console.log('🔄 Deleting user:', userId);
      await userOperations.delete(userId);
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      // Trigger sync notification
      addNotification({
        id: Date.now(),
        type: 'user-delete',
        message: 'User has been deleted',
        timestamp: new Date().toISOString(),
        read: false
      });
      
      console.log('✅ User deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting user:', error);
    }
  };

  const addNotification = async (notification) => {
    try {
      console.log('🔄 Adding notification:', notification);
      const notificationWithId = await notificationOperations.create(notification);
      console.log('🔄 Notification created in database:', notificationWithId);
      
      setNotifications(prev => [notificationWithId, ...prev]);
      
      console.log('✅ Notification added successfully');
    } catch (error) {
      console.error('❌ Error adding notification:', error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      console.log('🔄 Marking notification as read:', notificationId);
      await notificationOperations.markAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      
      console.log('✅ Notification marked as read');
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      console.log('🔄 Clearing all notifications');
      setNotifications([]);
      
      console.log('✅ All notifications cleared');
    } catch (error) {
      console.error('❌ Error clearing notifications:', error);
    }
  };

  const forceSync = async () => {
    try {
      setIsSyncing(true);
      console.log('🔄 Force syncing all data...');
      
      // Reload all data from database
      await loadInitialData();
      
      setLastSync(new Date().toISOString());
      console.log('✅ Force sync completed');
    } catch (error) {
      console.error('❌ Error during force sync:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const exportData = () => {
    const data = {
      faqs,
      updates,
      users,
      notifications,
      systemStats,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `escom-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (data) => {
    console.log('🔄 Importing data:', data);
    // This would need to be implemented to import data back to the database
    console.log('⚠️ Import functionality not yet implemented for live database');
  };

  const value = {
    // Data
    faqs,
    updates,
    users,
    systemStats,
    notifications,
    
    // Loading states
    isLoading,
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
    forceSync,
    
    // Data management
    exportData,
    importData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
