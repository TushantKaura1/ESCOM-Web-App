import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import './AdminDashboard.css';

function AdminDashboard({ user, onLogout, onSectionChange }) {
  
  const { 
    faqs, 
    updates, 
    users, 
    systemStats,
    addFaq, 
    updateFaq, 
    deleteFaq,
    addDailyUpdate, 
    updateDailyUpdate, 
    deleteDailyUpdate,
    addUser, 
    updateUser, 
    deleteUser,
    forceSync,
    isSyncing,
    lastSync,
    exportData,
    importData
  } = useData();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingFaq, setEditingFaq] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddUpdate, setShowAddUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newFaq, setNewFaq] = useState({ 
    category: 'ESCOM Organization', 
    subcategory: 'General',
    question: '', 
    answer: '',
    priority: 'medium',
    tags: [],
    media: [],
    importance: 'normal'
  });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'citizen',
    team: 'Team Alpha',
    status: 'active'
  });
  const [newUpdate, setNewUpdate] = useState({
    title: '',
    content: '',
    type: 'announcement',
    priority: 'normal',
    tags: [],
    media: [],
    scheduledDate: '',
    expirationDate: '',
    autoExpire: false
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  // const [viewMode, setViewMode] = useState('grid'); // grid or list - commented out for now

  const [settings, setSettings] = useState({
    notifications: true,
    autoBackup: true,
    dataRetention: '2 years',
    privacyMode: false,
    maintenanceMode: false,
    debugMode: false
  });

  const [reports, setReports] = useState([
    { id: 1, name: 'Monthly Activity Report', status: 'Completed', date: '2024-01-20', type: 'Monthly Activity' },
    { id: 2, name: 'User Performance Report', status: 'Completed', date: '2024-01-19', type: 'User Performance' },
    { id: 3, name: 'Data Quality Report', status: 'In Progress', date: '2024-01-20', type: 'Data Quality' },
    { id: 4, name: 'System Health Report', status: 'Scheduled', date: '2024-01-21', type: 'System Health' }
  ]);

  const [dataAnalytics] = useState({
    totalReadings: 1247,
    averageAccuracy: 94.2,
    topPerformer: 'Dr. Maria Santos',
    topPerformerReadings: 156,
    mostActiveTeam: 'Team Alpha',
    monthlyTrends: [
      { month: 'January', readings: 89, accuracy: 92 },
      { month: 'February', readings: 124, accuracy: 94 },
      { month: 'March', readings: 156, accuracy: 95 },
      { month: 'April', readings: 178, accuracy: 96 },
      { month: 'May', readings: 203, accuracy: 97 },
      { month: 'June', readings: 234, accuracy: 98 }
    ],
    dataQuality: {
      completeness: 95,
      accuracy: 91,
      timeliness: 88,
      overall: 'Excellent'
    }
  });

  useEffect(() => {
    console.log('👑 AdminDashboard component mounted');
    console.log('📊 Loading dashboard data...');
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading demo data...');
      
      // Enhanced demo data
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
        },
        { 
          id: 3, 
          name: 'Maria Santos', 
          email: 'maria@example.com', 
          username: 'maria.santos',
          team: 'Team Gamma', 
          status: 'active', 
          role: 'citizen',
          readings: 78, 
          accuracy: 89, 
          lastActivity: '3 hours ago',
          joinDate: '2024-01-20',
          totalContributions: 134
        }
      ];

      const demoFaqs = [
        { 
          id: 1, 
          category: 'ESCOM Organization', 
          subcategory: 'Getting Involved',
          question: 'How can I get involved with ESCOM?', 
          answer: 'You can get involved by joining our coastal monitoring program, participating in training sessions, and contributing to data collection.',
          priority: 'high',
          tags: ['getting-started', 'volunteer', 'training'],
          media: ['https://example.com/image1.jpg'],
          importance: 'critical',
          viewCount: 156,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-18'
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
          updatedAt: '2024-01-10'
        }
      ];

      const demoUpdates = [
        {
          id: 1,
          title: 'New Monitoring Equipment Available',
          content: 'We have received new water quality monitoring equipment. Training sessions will be scheduled next week.',
          type: 'announcement',
          priority: 'high',
          tags: ['equipment', 'training', 'monitoring'],
          media: ['https://example.com/equipment.jpg'],
          scheduledDate: '2024-01-20',
          expirationDate: '2024-02-20',
          autoExpire: true,
          status: 'published',
          createdAt: '2024-01-18',
          viewCount: 234
        },
        {
          id: 2,
          title: 'Monthly Data Review Meeting',
          content: 'Join us for our monthly data review meeting to discuss findings and plan future monitoring activities.',
          type: 'news',
          priority: 'normal',
          tags: ['meeting', 'data-review', 'planning'],
          media: [],
          scheduledDate: '2024-01-25',
          expirationDate: '',
          autoExpire: false,
          status: 'scheduled',
          createdAt: '2024-01-19',
          viewCount: 67
        }
      ];

      const demoStats = {
          totalUsers: 24,
    activeUsers: 21,
    totalReadings: 1247,
    averageAccuracy: 94.2,
    newThisMonth: 7,
    systemHealth: 'Excellent',
        totalFAQs: 5,
        totalUpdates: 2,
        pendingApprovals: 0
      };

      console.log('📊 Setting users...');
      setUsers(demoUsers);
      
      console.log('❓ Setting FAQs...');
      setFaqs(demoFaqs);
      
      console.log('📢 Setting updates...');
      setUpdates(demoUpdates);
      
      console.log('📈 Setting stats...');
      setSystemStats(demoStats);
      
      console.log('✅ Dashboard data loaded successfully');
      console.log('👥 Users loaded:', demoUsers.length);
      console.log('❓ FAQs loaded:', demoFaqs.length);
      console.log('📢 Updates loaded:', demoUpdates.length);
      console.log('📊 Stats loaded:', demoStats);
      
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      setError('Error loading dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleFaqEdit = (faq) => {
    console.log('✏️ Editing FAQ:', faq);
    setEditingFaq({ ...faq });
  };

  const handleFaqSave = () => {
    console.log('💾 Saving FAQ changes...');
    if (editingFaq) {
      const { id, ...updates } = editingFaq;
      updateFaq(id, updates);
      setEditingFaq(null);
      console.log('✅ FAQ saved successfully');
    }
  };

  const handleFaqDelete = (faqId) => {
    console.log('🗑️ Deleting FAQ:', faqId);
    if (window.confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) {
      setFaqs(faqs.filter(faq => faq.id !== faqId));
      console.log('✅ FAQ deleted successfully');
    }
  };

  // const handleFaqArchive = (faqId) => {
  //   console.log('📦 Archiving FAQ:', faqId);
  //   setFaqs(faqs.map(faq => 
  //     faq.id === faqId ? { ...faq, status: 'archived' } : faq
  //   ));
  //   console.log('✅ FAQ archived successfully');
  // };

  const handleAddFaq = () => {
    console.log('➕ Adding new FAQ:', newFaq);
    if (newFaq.question && newFaq.answer) {
      addFaq(newFaq);
      setNewFaq({ 
        category: 'ESCOM Organization', 
        subcategory: 'General',
        question: '', 
        answer: '',
        priority: 'medium',
        tags: [],
        media: [],
        importance: 'normal'
      });
      setShowAddFaq(false);
      console.log('✅ New FAQ added successfully');
    } else {
      console.log('❌ FAQ validation failed - missing question or answer');
    }
  };

  // const handleAddTag = (faqId, tag) => {
  //   if (tag.trim()) {
  //     setFaqs(faqs.map(faq => 
  //       faq.id === faqId 
  //         ? { ...faq, tags: [...faq.tags, tag.trim()] }
  //         : faq
  //     ));
  //   }
  // };

  // const handleRemoveTag = (faqId, tagToRemove) => {
  //   setFaqs(faqs.map(faq => 
  //       faq.id === faqId 
  //         ? { ...faq, tags: faq.tags.filter(tag => tag !== tagToRemove) }
  //         : faq
  //     ));
  // };

  // const handleAddMedia = (faqId, mediaUrl) => {
  //   if (tag.trim()) {
  //     setFaqs(faqs.map(faq => 
  //       faq.id === faqId 
  //         ? { ...faq, media: [...faq.media, mediaUrl.trim()] }
  //         : faq
  //     ));
  //   }
  // };

  // const handleRemoveMedia = (faqId, mediaToRemove) => {
  //   setFaqs(faqs.map(faq => 
  //       faq.id === faqId 
  //         ? { ...faq, media: faq.media.filter(media => media !== mediaToRemove) }
  //         : faq
  //     ));
  // };

  const handleUpdateEdit = (update) => {
    console.log('✏️ Editing update:', update);
    setEditingUpdate({ ...update });
  };

  const handleUpdateSave = () => {
    console.log('💾 Saving update changes...');
    if (editingUpdate) {
      updateDailyUpdate(editingUpdate.id, editingUpdate);
      setEditingUpdate(null);
      console.log('✅ Update saved successfully');
    }
  };

  const handleUpdateDelete = (updateId) => {
    console.log('🗑️ Deleting update:', updateId);
    if (window.confirm('Are you sure you want to delete this update? This action cannot be undone.')) {
      deleteDailyUpdate(updateId);
      console.log('✅ Update deleted successfully');
    }
  };

  const handleAddUpdate = () => {
    console.log('➕ Adding new update:', newUpdate);
    if (newUpdate.title && newUpdate.content) {
      addDailyUpdate(newUpdate);
      setNewUpdate({
        title: '',
        content: '',
        type: 'announcement',
        priority: 'normal',
        tags: [],
        media: [],
        scheduledDate: '',
        expirationDate: '',
        autoExpire: false
      });
      setShowAddUpdate(false);
      console.log('✅ New update added successfully');
    } else {
      console.log('❌ Update validation failed - missing title or content');
    }
  };

  const handleScheduleUpdate = (updateId) => {
    console.log('📅 Rescheduling update:', updateId);
    const newDate = prompt('Enter new scheduled date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    if (newDate) {
      const update = updates.find(u => u.id === updateId);
      if (update) {
        const updateData = {
          scheduledDate: newDate,
          status: 'scheduled'
        };
        updateDailyUpdate(updateId, updateData);
        console.log('✅ Update rescheduled successfully for:', newDate);
      }
    }
  };

  const handlePublishUpdate = (updateId) => {
    console.log('📢 Publishing update:', updateId);
    const update = updates.find(u => u.id === updateId);
    if (update) {
      const updates = {
        status: 'published',
        scheduledDate: ''
      };
      updateDailyUpdate(updateId, updates);
      console.log('✅ Update published successfully');
    }
  };

  // const handleAddUpdateTag = (updateId, tag) => {
  //   if (tag.trim()) {
  //     setUpdates(updates.map(update => 
  //       update.id === updateId 
  //         ? { ...update, tags: [...update.tags, tag.trim()] }
  //         : update
  //     ));
  //   }
  // };

  // const handleRemoveUpdateTag = (updateId, tagToRemove) => {
  //   setUpdates(updates.map(update => 
  //       update.id === updateId 
  //         : update
  //     ));
  // };

  // const handleAddUpdateTag = (updateId, tag) => {
  //   if (tag.trim()) {
  //     setUpdates(updates.map(update => 
  //       updateId 
  //         ? { ...update, media: [...update.media, mediaUrl.trim()] }
  //         : update
  //     ));
  //   }
  // };

  // const handleRemoveUpdateMedia = (updateId, mediaToRemove) => {
  //   setUpdates(updates.map(update => 
  //       update.id === updateId 
  //         ? { ...update, media: update.media.filter(media => media !== mediaToRemove) }
  //         : update
  //     ));
  // };

  const handleUserEdit = (user) => {
    console.log('✏️ Editing user:', user);
    setEditingUser({ ...user });
  };

  const handleUserSave = () => {
    console.log('💾 Saving user changes...');
    if (editingUser) {
      updateUser(editingUser.id, editingUser);
      setEditingUser(null);
      console.log('✅ User saved successfully');
    }
  };

  const handleUserDelete = (userId) => {
    console.log('🗑️ Deleting user:', userId);
    const user = users.find(u => u.id === userId);
    if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      deleteUser(userId);
      console.log('✅ User deleted successfully');
    }
  };

  const handlePasswordReset = (userId) => {
    console.log('🔑 Resetting password for user:', userId);
    const newPassword = Math.random().toString(36).slice(-8);
    if (window.confirm(`New password: ${newPassword}\n\nCopy this password and inform the user.`)) {
      console.log('✅ Password reset successfully');
    }
  };

  const handleRoleChange = (userId, newRole) => {
    console.log('👑 Changing role for user:', userId, 'to:', newRole);
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole, lastUpdated: new Date().toISOString() } : user
    ));
    console.log('✅ Role changed successfully');
  };

  const handleStatusChange = (userId, newStatus) => {
    console.log('📊 Changing status for user:', userId, 'to:', newStatus);
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus, lastUpdated: new Date().toISOString() } : user
    ));
    console.log('✅ Status changed successfully');
  };

  const handleAddUser = () => {
    console.log('➕ Adding new user:', newUser);
    if (newUser.name && newUser.email && newUser.username && newUser.password) {
      addUser(newUser);
      setNewUser({
        name: '',
        email: '',
        username: '',
        password: '',
        role: 'citizen',
        team: 'Team Alpha',
        status: 'active'
      });
      setShowAddUser(false);
      console.log('✅ New user added successfully');
    } else {
      console.log('❌ User validation failed - missing required fields');
    }
  };

  const handleSettingsSave = () => {
    console.log('💾 Settings saved:', settings);
    // Here you would typically save to backend
            console.log('Settings saved successfully!');
  };

  const handleSettingsReset = () => {
    setSettings({
      notifications: true,
      autoBackup: true,
      dataRetention: '2 years',
      privacyMode: false,
      maintenanceMode: false,
      debugMode: false
    });
    console.log('🔄 Settings reset to default');
  };

  const generateReport = (type) => {
    const newReport = {
      id: Date.now(),
      name: `${type} Report`,
      status: 'In Progress',
      date: new Date().toISOString().split('T')[0],
      type: type
    };
    setReports([...reports, newReport]);
    
    // Simulate report completion
    window.setTimeout(() => {
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === newReport.id 
            ? { ...report, status: 'Completed' }
            : report
        )
      );
    }, 3000);
    
    console.log('📋 Report generation started:', type);
  };

  const downloadReport = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      console.log('📥 Downloading report:', report.name);
      // Here you would generate and download the actual report
              console.log(`Downloading ${report.name}...`);
    }
  };

  const viewReport = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      console.log('👁️ Viewing report:', report.name);
      // Here you would show the report details
              console.log(`Viewing ${report.name}...`);
    }
  };

  // Search and filter functions
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (faq.tags && faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = filterCategory === 'all' || faq.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
           user.team.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredUpdates = updates.filter(update => {
    return update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           update.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
           update.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const sortedFAQs = [...filteredFAQs].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'views':
        return (b.viewCount || 0) - (a.viewCount || 0);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'question':
        return a.question.localeCompare(b.question);
      case 'importance':
        const importanceOrder = { critical: 4, high: 3, medium: 2, low: 1, normal: 0 };
        return importanceOrder[b.importance] - importanceOrder[a.importance];
      default:
        return 0;
    }
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'team':
        return a.team.localeCompare(b.team);
      case 'activity': {
        return new Date(b.lastActivity) - new Date(a.lastActivity);
      }
      case 'contributions': {
        return b.totalContributions - a.totalContributions;
      }
      default:
        return 0;
    }
  });

  const sortedUpdates = [...filteredUpdates].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      case 'views':
        return b.viewCount - a.viewCount;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const renderDashboard = () => (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-main">
          <h3>📊 System Overview</h3>
          <p>Welcome to the ESCOM Citizen Scientist Admin Dashboard</p>
        </div>
        <div className="sync-status">
          <button 
            onClick={forceSync} 
            className={`sync-btn ${isSyncing ? 'syncing' : ''}`}
            disabled={isSyncing}
            title="Force data synchronization"
          >
            {isSyncing ? '🔄 Syncing...' : '🔄 Sync'}
          </button>
          {lastSync && (
            <span className="last-sync">
              Last sync: {new Date(lastSync).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">{systemStats.totalUsers || 0}</div>
          <div className="stat-label">Registered users</div>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <div className="stat-value">{systemStats.activeUsers || 0}</div>
          <div className="stat-label">Real-time active</div>
        </div>
        <div className="stat-card">
          <h3>Total FAQs</h3>
          <div className="stat-value">{faqs.length || 0}</div>
          <div className="stat-label">Knowledge base</div>
        </div>
        <div className="stat-card">
          <h3>Total Updates</h3>
          <div className="stat-value">{updates.length || 0}</div>
          <div className="stat-label">Published announcements</div>
        </div>
        <div className="stat-card">
          <h3>New This Month</h3>
          <div className="stat-value">{systemStats.newThisMonth || 0}</div>
          <div className="stat-label">Registrations</div>
        </div>
        <div className="stat-card">
          <h3>System Health</h3>
          <div className="stat-value">{systemStats.systemHealth || 'Excellent'}</div>
          <div className="stat-label">Status</div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button onClick={() => setActiveTab('users')} className="action-btn">
            👥 Manage Users
          </button>
          <button onClick={() => setActiveTab('faqs')} className="action-btn">
            ❓ Manage FAQs
          </button>
          <button onClick={() => setActiveTab('updates')} className="action-btn">
            📢 Manage Updates
          </button>
          <button onClick={() => setActiveTab('settings')} className="action-btn">
            ⚙️ System Settings
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">👤</span>
            <span className="activity-text">New user registration: Ana Oliveira</span>
            <span className="activity-time">2 hours ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">📊</span>
            <span className="activity-text">Data submission: 15 new readings</span>
            <span className="activity-time">4 hours ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">❓</span>
            <span className="activity-text">FAQ updated: Equipment calibration</span>
            <span className="activity-time">1 day ago</span>
          </div>
        </div>
      </div>

      <div className="data-summary">
        <h3>Data Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">Total FAQs:</span>
            <span className="summary-value">{faqs.length || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Updates:</span>
            <span className="summary-value">{updates.length || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Pending Approvals:</span>
            <span className="summary-value">{systemStats.pendingApprovals || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="user-management">
      <div className="section-header">
        <button onClick={() => setActiveTab('dashboard')} className="back-btn">← Back to Dashboard</button>
      <h3>👥 User Management</h3>
      </div>
      
      <div className="user-actions-header">
        <button onClick={() => setShowAddUser(true)} className="add-btn">➕ Add New User</button>
        <div className="user-filters">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="team">Sort by Team</option>
            <option value="activity">Sort by Activity</option>
            <option value="contributions">Sort by Contributions</option>
          </select>
        </div>
      </div>

      <div className="user-list">
        {sortedUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h4>{user.name}</h4>
              <p className="user-email">{user.email}</p>
              <p className="user-username">@{user.username}</p>
              <div className="user-meta">
                <span className={`status ${user.status.toLowerCase()}`}>{user.status}</span>
                <span className="team">{user.team}</span>
                <span className={`role ${user.role}`}>{user.role}</span>
              </div>
            </div>
            <div className="user-stats">
              <div className="stat">
                <span className="label">Readings:</span>
                <span className="value">{user.readings}</span>
              </div>
              <div className="stat">
                <span className="label">Accuracy:</span>
                <span className="value">{user.accuracy}%</span>
              </div>
              <div className="stat">
                <span className="label">Contributions:</span>
                <span className="value">{user.totalContributions}</span>
              </div>
              <div className="stat">
                <span className="label">Joined:</span>
                <span className="value">{new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="stat">
                <span className="label">Last Active:</span>
                <span className="value">{user.lastActivity}</span>
              </div>
            </div>
            <div className="user-actions">
              <button className="edit-btn" onClick={() => handleUserEdit(user)}>✏️ Edit</button>
              <button className="view-btn">👁️ View</button>
              <button className="password-btn" onClick={() => handlePasswordReset(user.id)}>🔑 Reset Password</button>
              <button className="role-btn" onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'citizen' : 'admin')}>
                {user.role === 'admin' ? '👤 Make Citizen' : '👑 Make Admin'}
              </button>
              <button className="status-btn" onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}>
                {user.status === 'active' ? '⏸️ Deactivate' : '▶️ Activate'}
              </button>
              <button className="delete-btn" onClick={() => handleUserDelete(user.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New User</h3>
            <div className="form-group">
              <label>Full Name:</label>
              <input 
                type="text" 
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="form-input"
                placeholder="Enter full name..."
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="form-input"
                placeholder="Enter email address..."
              />
            </div>
            <div className="form-group">
              <label>Username:</label>
              <input 
                type="text" 
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                className="form-input"
                placeholder="Enter username..."
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input 
                type="password" 
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                className="form-input"
                placeholder="Enter password..."
              />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select 
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="form-input"
              >
                <option value="citizen">Citizen Scientist</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Team:</label>
              <select 
                value={newUser.team}
                onChange={(e) => setNewUser({...newUser, team: e.target.value})}
                className="form-input"
              >
                <option value="Team Alpha">Team Alpha</option>
                <option value="Team Beta">Team Beta</option>
                <option value="Team Gamma">Team Gamma</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select 
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                className="form-input"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={handleAddUser} className="save-btn">💾 Add User</button>
              <button onClick={() => setShowAddUser(false)} className="cancel-btn">❌ Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit User: {editingUser.name}</h3>
            <div className="form-group">
              <label>Name:</label>
              <input 
                type="text" 
                value={editingUser.name}
                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input 
                type="email" 
                value={editingUser.email}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Username:</label>
              <input 
                type="text" 
                value={editingUser.username}
                onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Team:</label>
              <select 
                value={editingUser.team}
                onChange={(e) => setEditingUser({...editingUser, team: e.target.value})}
                className="form-input"
              >
                <option>Team Alpha</option>
                <option>Team Beta</option>
                <option>Team Gamma</option>
              </select>
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select 
                value={editingUser.role}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                className="form-input"
              >
                <option value="citizen">Citizen Scientist</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select 
                value={editingUser.status}
                onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                className="form-input"
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Suspended</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={handleUserSave} className="save-btn">💾 Save Changes</button>
              <button onClick={() => setEditingUser(null)} className="cancel-btn">❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDataAnalytics = () => (
    <div className="data-analytics">
      <h3>📈 Data Analytics</h3>
      
      <div className="analytics-overview">
          <h4>Overall Statistics</h4>
        <div className="stats-grid">
          <div className="stat-card">
            <h5>Total Readings</h5>
            <div className="stat-value">{dataAnalytics.totalReadings}</div>
            <div className="stat-label">Monitoring entries</div>
            </div>
          <div className="stat-card">
            <h5>Average Accuracy</h5>
            <div className="stat-value">{dataAnalytics.averageAccuracy}%</div>
            <div className="stat-label">Data quality</div>
            </div>
          <div className="stat-card">
            <h5>Top Performer</h5>
            <div className="stat-value">{dataAnalytics.topPerformer}</div>
            <div className="stat-label">{dataAnalytics.topPerformerReadings} readings</div>
            </div>
          <div className="stat-card">
            <h5>Most Active Team</h5>
            <div className="stat-value">{dataAnalytics.mostActiveTeam}</div>
            <div className="stat-label">Highest participation</div>
          </div>
        </div>
      </div>

      <div className="monthly-trends">
        <h4>Monthly Trends</h4>
        <div className="trends-chart">
          {dataAnalytics.monthlyTrends.map((trend, index) => (
            <div key={index} className="trend-item">
              <div className="trend-month">{trend.month}</div>
              <div className="trend-bar">
                <div 
                  className="trend-fill" 
                  style={{ 
                    width: `${(trend.readings / 70) * 100}%`,
                    backgroundColor: `hsl(${120 + (trend.accuracy - 80) * 2}, 70%, 50%)`
                  }}
                ></div>
            </div>
              <div className="trend-stats">
                <span className="readings">{trend.readings} readings</span>
                <span className="accuracy">{trend.accuracy}% accuracy</span>
          </div>
            </div>
          ))}
        </div>
      </div>

      <div className="data-quality">
        <h4>Data Quality Metrics</h4>
        <div className="quality-metrics">
          <div className="quality-item">
            <span className="quality-label">Completeness</span>
            <div className="quality-bar">
              <div 
                className="quality-fill" 
                style={{ width: `${dataAnalytics.dataQuality.completeness}%` }}
              ></div>
            </div>
            <span className="quality-value">{dataAnalytics.dataQuality.completeness}%</span>
          </div>
          <div className="quality-item">
            <span className="quality-label">Accuracy</span>
            <div className="quality-bar">
              <div 
                className="quality-fill" 
                style={{ width: `${dataAnalytics.dataQuality.accuracy}%` }}
              ></div>
            </div>
            <span className="quality-value">{dataAnalytics.dataQuality.accuracy}%</span>
          </div>
          <div className="quality-item">
            <span className="quality-label">Timeliness</span>
            <div className="quality-bar">
              <div 
                className="quality-fill" 
                style={{ width: `${dataAnalytics.dataQuality.timeliness}%` }}
              ></div>
            </div>
            <span className="quality-value">{dataAnalytics.dataQuality.timeliness}%</span>
          </div>
        </div>
        <div className="overall-quality">
          <span className="quality-label">Overall Quality:</span>
          <span className={`quality-badge ${dataAnalytics.dataQuality.overall.toLowerCase()}`}>
            {dataAnalytics.dataQuality.overall}
          </span>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="system-settings">
      <div className="section-header">
        <button onClick={() => setActiveTab('dashboard')} className="back-btn">← Back to Dashboard</button>
      <h3>⚙️ System Settings</h3>
      </div>
      
      <div className="settings-section">
        <h4>Notification Settings</h4>
        <div className="setting-item">
          <span className="setting-label">🔔 Notifications</span>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={settings.notifications}
              onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <span className="setting-label">Auto Backup</span>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={settings.autoBackup}
              onChange={(e) => setSettings({...settings, autoBackup: e.target.checked})}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <span className="setting-label">Privacy Mode</span>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={settings.privacyMode}
              onChange={(e) => setSettings({...settings, privacyMode: e.target.checked})}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <span className="setting-label">Maintenance Mode</span>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <span className="setting-label">Debug Mode</span>
          <label className="toggle">
            <input 
              type="checkbox" 
              checked={settings.debugMode}
              onChange={(e) => setSettings({...settings, debugMode: e.target.checked})}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <span className="setting-label">Data Retention</span>
          <select 
            value={settings.dataRetention}
            onChange={(e) => setSettings({...settings, dataRetention: e.target.value})}
            className="setting-select"
          >
            <option value="1 year">1 year</option>
            <option value="2 years">2 years</option>
            <option value="5 years">5 years</option>
            <option value="10 years">10 years</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <h4>Data Management</h4>
        <div className="setting-item">
          <span className="setting-label">📊 Data Export</span>
          <button onClick={exportData} className="action-btn">📥 Export All Data</button>
        </div>
        <div className="setting-item">
          <span className="setting-label">📁 Data Import</span>
          <input 
            type="file" 
            accept=".json"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  try {
                    const data = JSON.parse(event.target.result);
                    if (window.confirm('Are you sure you want to import this data? This will replace all current data.')) {
                      importData(data);
                    }
                  } catch (error) {
                    alert('Invalid data file. Please select a valid JSON backup file.');
                  }
                };
                reader.readAsText(file);
              }
            }}
            className="file-input"
          />
        </div>
        <div className="setting-item">
          <span className="setting-label">🔄 Force Sync</span>
          <button onClick={forceSync} className={`action-btn ${isSyncing ? 'syncing' : ''}`}>
            {isSyncing ? '🔄 Syncing...' : '🔄 Sync Now'}
          </button>
        </div>
        <div className="setting-item">
          <span className="setting-label">🗑️ Clear All Data</span>
          <button 
            onClick={() => {
              if (window.confirm('⚠️ WARNING: This will delete ALL data including FAQs, updates, and users. This action cannot be undone. Are you sure?')) {
                localStorage.clear();
                window.location.reload();
              }
            }} 
            className="action-btn danger"
          >
            🗑️ Clear All Data
          </button>
        </div>
      </div>

      <div className="settings-actions">
        <button onClick={handleSettingsSave} className="save-btn">💾 Save Settings</button>
        <button onClick={handleSettingsReset} className="reset-btn">🔄 Reset to Default</button>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="reports">
      <h3>📋 Reports</h3>
      
      <div className="report-types">
        <h4>Report Types</h4>
        <div className="report-grid">
          <div className="report-type">
            <h5>📊 Monthly Activity</h5>
            <p>Comprehensive monthly summary</p>
            <button onClick={() => generateReport('Monthly Activity')} className="generate-btn">📈 Generate</button>
          </div>
          <div className="report-type">
            <h5>👥 User Performance</h5>
            <p>Individual user metrics</p>
            <button onClick={() => generateReport('User Performance')} className="generate-btn">📈 Generate</button>
          </div>
          <div className="report-type">
            <h5>🎯 Data Quality</h5>
            <p>Data quality analysis</p>
            <button onClick={() => generateReport('Data Quality')} className="generate-btn">📈 Generate</button>
          </div>
          <div className="report-type">
            <h5>⚙️ System Health</h5>
            <p>System performance metrics</p>
            <button onClick={() => generateReport('System Health')} className="generate-btn">📈 Generate</button>
          </div>
        </div>
      </div>

      <div className="recent-reports">
        <h4>Recent Reports</h4>
        <div className="report-list">
          {reports.map(report => (
            <div key={report.id} className="report-item">
              <div className="report-info">
                <h5>{report.name}</h5>
                <p>Type: {report.type}</p>
                <p>Date: {report.date}</p>
          </div>
              <div className="report-status">
                <span className={`status-badge ${report.status.toLowerCase()}`}>
                  {report.status}
                </span>
          </div>
              <div className="report-actions">
                <button onClick={() => viewReport(report.id)} className="view-btn">👁️ View</button>
                {report.status === 'Completed' && (
                  <button onClick={() => downloadReport(report.id)} className="download-btn">📥 Download</button>
                )}
          </div>
          </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFAQManagement = () => (
    <div className="faq-management">
      <div className="section-header">
        <button onClick={() => setActiveTab('dashboard')} className="back-btn">← Back</button>
        <h3>❓ FAQ Management</h3>
        <button onClick={() => setShowAddFaq(true)} className="add-btn">➕ Add FAQ</button>
      </div>
      
      {/* Simplified Search and Filter */}
      <div className="faq-controls">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-section">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="category">Sort by Category</option>
            <option value="question">Sort by Question</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      <div className="faq-categories">
        <div className="category-tabs">
          <button 
            className={`category-tab ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            All
          </button>
          <button 
            className={`category-tab ${filterCategory === 'ESCOM Organization' ? 'active' : ''}`}
            onClick={() => setFilterCategory('ESCOM Organization')}
          >
            Organization
          </button>
          <button 
            className={`category-tab ${filterCategory === 'Monitoring' ? 'active' : ''}`}
            onClick={() => setFilterCategory('Monitoring')}
          >
            Monitoring
          </button>
          <button 
            className={`category-tab ${filterCategory === 'Training' ? 'active' : ''}`}
            onClick={() => setFilterCategory('Training')}
          >
            Training
          </button>
          <button 
            className={`category-tab ${filterCategory === 'Data' ? 'active' : ''}`}
            onClick={() => setFilterCategory('Data')}
          >
            Data
          </button>
        </div>
      </div>

      <div className="faq-list">
        {sortedFAQs.length > 0 ? (
          sortedFAQs.map(faq => (
            <div key={faq.id} className="faq-card">
              <div className="faq-header">
                <div className="faq-meta">
                  <span className="faq-category">{faq.category}</span>
                  {faq.priority && (
                    <span className={`priority-badge ${faq.priority}`}>
                      {faq.priority}
                    </span>
                  )}
                </div>
                <div className="faq-actions">
                  <button className="action-btn edit" onClick={() => handleFaqEdit(faq)}>✏️</button>
                  <button className="action-btn delete" onClick={() => handleFaqDelete(faq.id)}>🗑️</button>
                </div>
              </div>
              <div className="faq-content">
                <h5>{faq.question}</h5>
                <p>{faq.answer}</p>
                <div className="faq-footer">
                  <span className="faq-date">{new Date(faq.createdAt).toLocaleDateString()}</span>
                  {faq.viewCount && (
                    <span className="faq-views">👁️ {faq.viewCount}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-faqs">
            <p>No FAQs found matching your search criteria.</p>
            <button onClick={() => setSearchTerm('')} className="clear-search-btn">Clear Search</button>
          </div>
        )}
      </div>

      {/* Add FAQ Modal */}
      {showAddFaq && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New FAQ</h3>
              <button onClick={() => setShowAddFaq(false)} className="close-btn">×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={newFaq.category}
                  onChange={(e) => setNewFaq({...newFaq, category: e.target.value})}
                  className="form-input"
                >
                  <option value="">Select category...</option>
                  <option value="ESCOM Organization">Organization</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Training">Training</option>
                  <option value="Data">Data</option>
                </select>
              </div>
              <div className="form-group">
                <label>Question</label>
                <input 
                  type="text" 
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                  className="form-input"
                  placeholder="Enter your question..."
                />
              </div>
              <div className="form-group">
                <label>Answer</label>
                <textarea 
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                  className="form-input"
                  placeholder="Enter the answer..."
                  rows="4"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleAddFaq} className="btn primary">💾 Add FAQ</button>
              <button onClick={() => setShowAddFaq(false)} className="btn secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit FAQ Modal */}
      {editingFaq && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit FAQ</h3>
              <button onClick={() => setEditingFaq(null)} className="close-btn">×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={editingFaq.category}
                  onChange={(e) => setEditingFaq({...editingFaq, category: e.target.value})}
                  className="form-input"
                >
                  <option value="ESCOM Organization">Organization</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Training">Training</option>
                  <option value="Data">Data</option>
                </select>
              </div>
              <div className="form-group">
                <label>Question</label>
                <input 
                  type="text" 
                  value={editingFaq.question}
                  onChange={(e) => setEditingFaq({...editingFaq, question: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Answer</label>
                <textarea 
                  value={editingFaq.answer}
                  onChange={(e) => setEditingFaq({...editingFaq, answer: e.target.value})}
                  className="form-input"
                  rows="4"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleFaqSave} className="btn primary">💾 Save Changes</button>
              <button onClick={() => setEditingFaq(null)} className="btn secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderUpdatesManagement = () => (
    <div className="updates-management">
      <div className="section-header">
        <button onClick={() => setActiveTab('dashboard')} className="back-btn">← Back to Dashboard</button>
        <h3>📢 Update Management</h3>
      </div>
      
      <div className="update-actions-header">
        <button onClick={() => setShowAddUpdate(true)} className="add-btn">➕ Add New Update</button>
        <div className="update-filters">
          <input
            type="text"
            placeholder="Search updates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="views">Sort by Views</option>
            <option value="type">Sort by Type</option>
          </select>
        </div>
      </div>
      
      <div className="update-list">
        {sortedUpdates.map(update => (
          <div key={update.id} className="update-item">
            <div className="update-header">
              <h5>{update.title}</h5>
              <div className="update-meta">
                <span className="update-type">{update.type}</span>
                <span className={`update-priority ${update.priority}`}>{update.priority}</span>
                <span className={`update-status ${update.status}`}>{update.status}</span>
              </div>
            </div>
            <div className="update-content">
              <p>{update.content}</p>
              {update.media && update.media.length > 0 && (
                <div className="update-media">
                  <h6>Media:</h6>
                  <ul>
                    {update.media.map((url, index) => (
                      <li key={index}>
                        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="update-tags">
                {update.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
            <div className="update-stats">
              <span className="views">👁️ {update.viewCount} views</span>
              <span className="date">📅 {new Date(update.createdAt).toLocaleDateString()}</span>
              {update.scheduledDate && (
                <span className="scheduled">⏰ Scheduled: {new Date(update.scheduledDate).toLocaleDateString()}</span>
              )}
            </div>
            <div className="update-actions">
              <button onClick={() => handleUpdateEdit(update)} className="edit-btn">✏️ Edit</button>
              <button onClick={() => handleUpdateDelete(update.id)} className="delete-btn">🗑️ Delete</button>
              {update.status === 'scheduled' && (
                <button onClick={() => handlePublishUpdate(update.id)} className="publish-btn">📢 Publish Now</button>
              )}
              {update.status === 'published' && (
                <button onClick={() => handleScheduleUpdate(update.id)} className="schedule-btn">📅 Reschedule</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Update Modal */}
      {showAddUpdate && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Update</h3>
            <div className="form-group">
              <label>Title:</label>
              <input 
                type="text" 
                value={newUpdate.title}
                onChange={(e) => setNewUpdate({...newUpdate, title: e.target.value})}
                className="form-input"
                placeholder="Enter update title..."
              />
            </div>
            <div className="form-group">
              <label>Content:</label>
              <textarea 
                value={newUpdate.content}
                onChange={(e) => setNewUpdate({...newUpdate, content: e.target.value})}
                className="form-input"
                placeholder="Enter update content..."
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Type:</label>
              <select 
                value={newUpdate.type}
                onChange={(e) => setNewUpdate({...newUpdate, type: e.target.value})}
                className="form-input"
              >
                <option>Announcement</option>
                <option>News</option>
                <option>Alert</option>
                <option>Information</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority:</label>
              <select 
                value={newUpdate.priority}
                onChange={(e) => setNewUpdate({...newUpdate, priority: e.target.value})}
                className="form-input"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <div className="form-group">
              <label>Scheduled Date:</label>
              <input 
                type="date" 
                value={newUpdate.scheduledDate}
                onChange={(e) => setNewUpdate({...newUpdate, scheduledDate: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Expiration Date:</label>
              <input 
                type="date" 
                value={newUpdate.expirationDate}
                onChange={(e) => setNewUpdate({...newUpdate, expirationDate: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Auto-expire:</label>
              <input 
                type="checkbox" 
                checked={newUpdate.autoExpire}
                onChange={(e) => setNewUpdate({...newUpdate, autoExpire: e.target.checked})}
                className="form-checkbox"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleAddUpdate} className="save-btn">💾 Add Update</button>
              <button onClick={() => setShowAddUpdate(false)} className="cancel-btn">❌ Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Update Modal */}
      {editingUpdate && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Update: {editingUpdate.title}</h3>
            <div className="form-group">
              <label>Title:</label>
              <input 
                type="text" 
                value={editingUpdate.title}
                onChange={(e) => setEditingUpdate({...editingUpdate, title: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Content:</label>
              <textarea 
                value={editingUpdate.content}
                onChange={(e) => setEditingUpdate({...editingUpdate, content: e.target.value})}
                className="form-input"
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Type:</label>
              <select 
                value={editingUpdate.type}
                onChange={(e) => setEditingUpdate({...editingUpdate, type: e.target.value})}
                className="form-input"
              >
                <option>Announcement</option>
                <option>News</option>
                <option>Alert</option>
                <option>Information</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority:</label>
              <select 
                value={editingUpdate.priority}
                onChange={(e) => setEditingUpdate({...editingUpdate, priority: e.target.value})}
                className="form-input"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <div className="form-group">
              <label>Scheduled Date:</label>
              <input 
                type="date" 
                value={editingUpdate.scheduledDate}
                onChange={(e) => setEditingUpdate({...editingUpdate, scheduledDate: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Expiration Date:</label>
              <input 
                type="date" 
                value={editingUpdate.expirationDate}
                onChange={(e) => setEditingUpdate({...editingUpdate, expirationDate: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Auto-expire:</label>
              <input 
                type="checkbox" 
                checked={editingUpdate.autoExpire}
                onChange={(e) => setEditingUpdate({...editingUpdate, autoExpire: e.target.checked})}
                className="form-checkbox"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleUpdateSave} className="save-btn">💾 Save Changes</button>
              <button onClick={() => setEditingUpdate(null)} className="cancel-btn">❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="admin-profile">
      <div className="section-header">
        <button onClick={() => setActiveTab('dashboard')} className="back-btn">← Back to Dashboard</button>
        <h3>👤 Edit Profile</h3>
      </div>
      
      <div className="profile-form">
        <h4>Personal Information</h4>
        <form className="profile-form-content">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                defaultValue={user?.name || ''}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                className="form-input" 
                defaultValue={user?.email || ''}
                placeholder="Enter your email"
                disabled
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                className="form-input" 
                defaultValue={user?.username || ''}
                placeholder="Enter your username"
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input 
                type="text" 
                className="form-input" 
                defaultValue={user?.role || 'admin'}
                disabled
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Bio</label>
            <textarea 
              className="form-input" 
              placeholder="Tell us about yourself and your role in the organization..."
              rows="4"
            ></textarea>
          </div>
          
          <button type="submit" className="submit-btn">💾 Save Changes</button>
        </form>
      </div>
    </div>
  );

  const renderPassword = () => (
    <div className="admin-password">
      <div className="section-header">
        <button onClick={() => setActiveTab('dashboard')} className="back-btn">← Back to Dashboard</button>
        <h3>🔑 Change Password</h3>
      </div>
      
      <div className="password-form">
        <h4>Update Your Password</h4>
        <form className="password-form-content">
          <div className="form-group">
            <label>Current Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter your current password"
              required
            />
          </div>
          
          <div className="form-group">
            <label>New Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter your new password"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Confirm your new password"
              required
            />
          </div>
          
          <div className="password-requirements">
            <h5>Password Requirements:</h5>
            <ul>
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
              <li>Contains at least one special character</li>
            </ul>
          </div>
          
          <button type="submit" className="submit-btn">🔑 Update Password</button>
        </form>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="admin-preferences">
      <div className="section-header">
        <button onClick={() => setActiveTab('dashboard')} className="back-btn">← Back to Dashboard</button>
        <h3>⚙️ Preferences</h3>
      </div>
      
      <div className="preferences-content">
        <div className="preferences-section">
          <h4>Notification Settings</h4>
          <div className="preference-item">
            <span className="preference-label">Email Notifications</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="preference-item">
            <span className="preference-label">In-App Notifications</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="preference-item">
            <span className="preference-label">SMS Alerts (Urgent Only)</span>
            <label className="toggle">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="preferences-section">
          <h4>Admin Preferences</h4>
          <div className="preference-item">
            <span className="preference-label">Auto-approve New Users</span>
            <label className="toggle">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
          <div className="preference-item">
            <span className="preference-label">Data Export Notifications</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="preference-item">
            <span className="preference-label">System Health Alerts</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="preferences-section">
          <h4>Display Settings</h4>
          <div className="preference-item">
            <span className="preference-label">Theme</span>
            <select className="form-input">
              <option value="light">Light Theme</option>
              <option value="dark">Dark Theme</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
          <div className="preference-item">
            <span className="preference-label">Language</span>
            <select className="form-input">
              <option value="en">English</option>
              <option value="pt">Portuguese</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>

        <div className="preferences-actions">
          <button className="save-btn">💾 Save Preferences</button>
          <button className="reset-btn">🔄 Reset to Default</button>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    console.log('🔍 Rendering main content for tab:', activeTab);
    console.log('🔍 Current user:', user);
    console.log('🔍 Admin mode:', user?.role === 'admin');
    
    switch (activeTab) {
      case 'dashboard':
        console.log('📊 Rendering dashboard tab');
        const dashboardContent = renderDashboard();
        console.log('📊 Dashboard content:', dashboardContent);
        return dashboardContent;
      case 'users':
        console.log('👥 Rendering users tab');
        return renderUserManagement();
      case 'profile':
        console.log('👤 Rendering profile tab');
        return renderProfile();
      case 'password':
        console.log('🔑 Rendering password tab');
        return renderPassword();
      case 'preferences':
        console.log('⚙️ Rendering preferences tab');
        return renderPreferences();
      case 'faqs':
        console.log('❓ Rendering FAQs tab');
        return renderFAQManagement();
      case 'updates':
        console.log('📢 Rendering updates tab');
        return renderUpdatesManagement();
      default:
        console.log('📊 Defaulting to dashboard tab');
        return renderDashboard();
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="header-left">
          <div className="dashboard-logo">
            <img src="/escom-logo.png" alt="ESCOM Logo" className="logo-image" />
            <h2>Admin Panel</h2>
          </div>
          <button onClick={() => onLogout()} className="logout-btn">
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>
        
        <div className="admin-nav">
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Users</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            <span className="nav-icon">❓</span>
            <span className="nav-text">FAQs</span>
          </button>
          <button 
            className={`nav-btn ${activeTab === 'updates' ? 'active' : ''}`}
            onClick={() => setActiveTab('updates')}
          >
            <span className="nav-icon">📢</span>
            <span className="nav-text">Updates</span>
          </button>
        </div>

        <div className="header-right">
          <button 
            onClick={() => setActiveTab('profile')} 
            className="profile-btn"
            title="View Profile"
          >
            👤 {user?.name || 'Profile'}
          </button>
        </div>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading-state">
            <p>Loading dashboard data...</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        ) : (
          renderMainContent()
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
