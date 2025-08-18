import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [editingFaq, setEditingFaq] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddUpdate, setShowAddUpdate] = useState(false);
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
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalReadings: 0,
    averageAccuracy: 0,
    newThisMonth: 0,
    systemHealth: 'Excellent',
    totalFAQs: 0,
    totalUpdates: 0,
    pendingApprovals: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    console.log('👑 AdminDashboard component mounted');
    console.log('📊 Loading dashboard data...');
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    console.log('🔄 Loading demo data...');
    
    // Enhanced demo data
    setUsers([
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
    ]);

    setFaqs([
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
    ]);

    setUpdates([
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
    ]);

    setSystemStats({
      totalUsers: 11,
      activeUsers: 8,
      totalReadings: 567,
      averageAccuracy: 91.3,
      newThisMonth: 3,
      systemHealth: 'Excellent',
      totalFAQs: 5,
      totalUpdates: 2,
      pendingApprovals: 0
    });
    
    console.log('✅ Dashboard data loaded successfully');
    console.log('👥 Users loaded:', 3);
    console.log('❓ FAQs loaded:', 2);
    console.log('📢 Updates loaded:', 2);
    console.log('📊 Stats loaded:', systemStats);
  };

  const handleFaqEdit = (faq) => {
    console.log('✏️ Editing FAQ:', faq);
    setEditingFaq({ ...faq });
  };

  const handleFaqSave = () => {
    console.log('💾 Saving FAQ changes...');
    if (editingFaq) {
      const updatedFaq = { ...editingFaq, updatedAt: new Date().toISOString() };
      setFaqs(faqs.map(faq => 
        faq.id === editingFaq.id ? updatedFaq : faq
      ));
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

  const handleFaqArchive = (faqId) => {
    console.log('📦 Archiving FAQ:', faqId);
    setFaqs(faqs.map(faq => 
      faq.id === faqId ? { ...faq, status: 'archived' } : faq
    ));
    console.log('✅ FAQ archived successfully');
  };

  const handleAddFaq = () => {
    console.log('➕ Adding new FAQ:', newFaq);
    if (newFaq.question && newFaq.answer) {
      const newFaqWithId = { 
        ...newFaq, 
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 0,
        status: 'active'
      };
      setFaqs([...faqs, newFaqWithId]);
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

  const handleAddTag = (faqId, tag) => {
    if (tag.trim()) {
      setFaqs(faqs.map(faq => 
        faq.id === faqId 
          ? { ...faq, tags: [...faq.tags, tag.trim()] }
          : faq
      ));
    }
  };

  const handleRemoveTag = (faqId, tagToRemove) => {
    setFaqs(faqs.map(faq => 
      faq.id === faqId 
        ? { ...faq, tags: faq.tags.filter(tag => tag !== tagToRemove) }
        : faq
    ));
  };

  const handleAddMedia = (faqId, mediaUrl) => {
    if (mediaUrl.trim()) {
      setFaqs(faqs.map(faq => 
        faq.id === faqId 
          ? { ...faq, media: [...faq.media, mediaUrl.trim()] }
          : faq
      ));
    }
  };

  const handleRemoveMedia = (faqId, mediaToRemove) => {
    setFaqs(faqs.map(faq => 
      faq.id === faqId 
        ? { ...faq, media: faq.media.filter(media => media !== mediaToRemove) }
        : faq
    ));
  };

  const handleUpdateEdit = (update) => {
    console.log('✏️ Editing update:', update);
    setEditingUpdate({ ...update });
  };

  const handleUpdateSave = () => {
    console.log('💾 Saving update changes...');
    if (editingUpdate) {
      const updatedUpdate = { ...editingUpdate, updatedAt: new Date().toISOString() };
      setUpdates(updates.map(update => 
        update.id === editingUpdate.id ? updatedUpdate : update
      ));
      setEditingUpdate(null);
      console.log('✅ Update saved successfully');
    }
  };

  const handleUpdateDelete = (updateId) => {
    console.log('🗑️ Deleting update:', updateId);
    if (window.confirm('Are you sure you want to delete this update? This action cannot be undone.')) {
      setUpdates(updates.filter(update => update.id !== updateId));
      console.log('✅ Update deleted successfully');
    }
  };

  const handleAddUpdate = () => {
    console.log('➕ Adding new update:', newUpdate);
    if (newUpdate.title && newUpdate.content) {
      const newUpdateWithId = {
        ...newUpdate,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 0,
        status: newUpdate.scheduledDate ? 'scheduled' : 'published'
      };
      setUpdates([...updates, newUpdateWithId]);
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

  const handleScheduleUpdate = (updateId, scheduledDate) => {
    console.log('📅 Scheduling update:', updateId, 'for:', scheduledDate);
    setUpdates(updates.map(update => 
      update.id === updateId 
        ? { ...update, scheduledDate, status: 'scheduled', updatedAt: new Date().toISOString() }
        : update
    ));
    console.log('✅ Update scheduled successfully');
  };

  const handlePublishUpdate = (updateId) => {
    console.log('📢 Publishing update:', updateId);
    setUpdates(updates.map(update => 
      update.id === updateId 
        ? { ...update, status: 'published', scheduledDate: '', updatedAt: new Date().toISOString() }
        : update
    ));
    console.log('✅ Update published successfully');
  };

  const handleAddUpdateTag = (updateId, tag) => {
    if (tag.trim()) {
      setUpdates(updates.map(update => 
        update.id === updateId 
          ? { ...update, tags: [...update.tags, tag.trim()] }
          : update
      ));
    }
  };

  const handleRemoveUpdateTag = (updateId, tagToRemove) => {
    setUpdates(updates.map(update => 
      update.id === updateId 
        ? { ...update, tags: update.tags.filter(tag => tag !== tagToRemove) }
        : update
    ));
  };

  const handleAddUpdateMedia = (updateId, mediaUrl) => {
    if (mediaUrl.trim()) {
      setUpdates(updates.map(update => 
        update.id === updateId 
          ? { ...update, media: [...update.media, mediaUrl.trim()] }
          : update
      ));
    }
  };

  const handleRemoveUpdateMedia = (updateId, mediaToRemove) => {
    setUpdates(updates.map(update => 
      update.id === updateId 
        ? { ...update, media: update.media.filter(media => media !== mediaToRemove) }
        : update
    ));
  };

  const handleUserEdit = (user) => {
    console.log('✏️ Editing user:', user);
    setEditingUser({ ...user });
  };

  const handleUserSave = () => {
    console.log('💾 Saving user changes...');
    if (editingUser) {
      const updatedUser = { ...editingUser, lastUpdated: new Date().toISOString() };
      setUsers(users.map(user => 
        user.id === editingUser.id ? updatedUser : user
      ));
      setEditingUser(null);
      console.log('✅ User saved successfully');
    }
  };

  const handleUserDelete = (userId) => {
    console.log('🗑️ Deleting user:', userId);
    const user = users.find(u => u.id === userId);
    if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      setUsers(users.filter(user => user.id !== userId));
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
      const newUserWithId = {
        ...newUser,
        id: Date.now(),
        joinDate: new Date().toISOString(),
        lastActivity: 'Never',
        readings: 0,
        accuracy: 0,
        totalContributions: 0,
        lastUpdated: new Date().toISOString()
      };
      setUsers([...users, newUserWithId]);
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
    console.log('Settings saved:', settings);
    // Here you would typically save to backend
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
    setTimeout(() => {
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === newReport.id 
            ? { ...report, status: 'Completed' }
            : report
        )
      );
    }, 3000);
  };

  // Search and filter functions
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
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
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'views':
        return b.viewCount - a.viewCount;
      case 'category':
        return a.category.localeCompare(b.category);
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
      case 'activity':
        return new Date(b.lastActivity) - new Date(a.lastActivity);
      case 'contributions':
        return b.totalContributions - a.totalContributions;
      default:
        return 0;
    }
  });

  const sortedUpdates = [...filteredUpdates].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
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
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">{systemStats.totalUsers}</div>
          <div className="stat-label">1 admin + 10 citizens</div>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <div className="stat-value">{systemStats.activeUsers}</div>
          <div className="stat-label">Real-time active</div>
        </div>
        <div className="stat-card">
          <h3>Total Readings</h3>
          <div className="stat-value">{systemStats.totalReadings}</div>
          <div className="stat-label">Monitoring data</div>
        </div>
        <div className="stat-card">
          <h3>Average Accuracy</h3>
          <div className="stat-value">{systemStats.averageAccuracy}%</div>
          <div className="stat-label">Data quality</div>
        </div>
        <div className="stat-card">
          <h3>New This Month</h3>
          <div className="stat-value">{systemStats.newThisMonth}</div>
          <div className="stat-label">Registrations</div>
        </div>
        <div className="stat-card">
          <h3>System Health</h3>
          <div className="stat-value">{systemStats.systemHealth}</div>
          <div className="stat-label">Status</div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button onClick={() => setActiveTab('users')} className="action-btn">
            👥 Manage Users
          </button>
          <button onClick={() => setActiveTab('analytics')} className="action-btn">
            📈 View Analytics
          </button>
          <button onClick={() => setActiveTab('settings')} className="action-btn">
            ⚙️ System Settings
          </button>
          <button onClick={() => setActiveTab('reports')} className="action-btn">
            📋 Generate Report
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
    </div>
  );

  const renderUserManagement = () => (
    <div className="user-management">
      <h3>👥 User Management</h3>
      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h4>{user.name}</h4>
              <p>{user.email}</p>
              <div className="user-meta">
                <span className={`status ${user.status.toLowerCase()}`}>{user.status}</span>
                <span className="team">{user.team}</span>
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
                <span className="label">Last Active:</span>
                <span className="value">{user.lastActivity}</span>
              </div>
            </div>
            <div className="user-actions">
              <button className="edit-btn" onClick={() => handleUserEdit(user)}>✏️ Edit</button>
              <button className="view-btn">👁️ View</button>
            </div>
          </div>
        ))}
      </div>

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
              <button onClick={handleUserSave} className="save-btn">💾 Save</button>
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
        <div className="overview-card">
          <h4>Overall Statistics</h4>
          <div className="overview-stats">
            <div className="overview-stat">
              <span className="label">Total Readings:</span>
              <span className="value">567</span>
            </div>
            <div className="overview-stat">
              <span className="label">Average Accuracy:</span>
              <span className="value">91.3%</span>
            </div>
            <div className="overview-stat">
              <span className="label">Top Performer:</span>
              <span className="value">Lúcia Fernandes (89 readings)</span>
            </div>
            <div className="overview-stat">
              <span className="label">Most Active Team:</span>
              <span className="value">Team Beta</span>
            </div>
          </div>
        </div>
      </div>

      <div className="monthly-trends">
        <h4>Monthly Trends</h4>
        <div className="trends-grid">
          <div className="trend-month">
            <h5>January</h5>
            <div className="trend-data">
              <span>45 readings</span>
              <span>88% accuracy</span>
            </div>
          </div>
          <div className="trend-month">
            <h5>February</h5>
            <div className="trend-data">
              <span>52 readings</span>
              <span>91% accuracy</span>
            </div>
          </div>
          <div className="trend-month">
            <h5>March</h5>
            <div className="trend-data">
              <span>48 readings</span>
              <span>89% accuracy</span>
            </div>
          </div>
          <div className="trend-month">
            <h5>April</h5>
            <div className="trend-data">
              <span>61 readings</span>
              <span>93% accuracy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="quality-metrics">
        <h4>Data Quality Metrics</h4>
        <div className="metrics-grid">
          <div className="metric">
            <span className="metric-label">Completeness</span>
            <div className="progress-bar">
              <div className="progress" style={{width: '95%'}}></div>
            </div>
            <span className="metric-value">95%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Accuracy</span>
            <div className="progress-bar">
              <div className="progress" style={{width: '91%'}}></div>
            </div>
            <span className="metric-value">91%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Timeliness</span>
            <div className="progress-bar">
              <div className="progress" style={{width: '88%'}}></div>
            </div>
            <span className="metric-value">88%</span>
          </div>
        </div>
        <div className="overall-quality">
          <span className="quality-label">Overall Quality:</span>
          <span className="quality-value excellent">Excellent</span>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="system-settings">
      <h3>⚙️ System Settings</h3>
      
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
            <div key={report.id} className={`report-item ${report.status.toLowerCase().replace(' ', '-')}`}>
              <span className="report-name">{report.name}</span>
              <span className={`report-status ${report.status.toLowerCase().replace(' ', '-')}`}>{report.status}</span>
              <span className="report-date">{report.date}</span>
              <button className="view-btn">View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFAQManagement = () => (
    <div className="faq-management">
      <h3>❓ FAQ Management</h3>
      
      <div className="faq-categories">
        <h4>FAQ Categories</h4>
        <div className="category-tabs">
          <button className="category-tab active">ESCOM Organization</button>
          <button className="category-tab">Monitoring</button>
          <button className="category-tab">Training</button>
          <button className="category-tab">Data</button>
          <button className="category-tab">Partners</button>
        </div>
      </div>

      <div className="faq-list">
        {faqs.map(faq => (
          <div key={faq.id} className="faq-item">
            <div className="faq-header">
              <span className="faq-category">{faq.category}</span>
              <div className="faq-actions">
                <button className="edit-btn" onClick={() => handleFaqEdit(faq)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => handleFaqDelete(faq.id)}>🗑️ Delete</button>
              </div>
            </div>
            <div className="faq-content">
              <h5>{faq.question}</h5>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="add-faq">
        <button onClick={() => setShowAddFaq(true)} className="add-btn">➕ Add New Question</button>
      </div>

      {/* Add FAQ Modal */}
      {showAddFaq && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New FAQ</h3>
            <div className="form-group">
              <label>Category:</label>
              <select 
                value={newFaq.category}
                onChange={(e) => setNewFaq({...newFaq, category: e.target.value})}
                className="form-input"
              >
                <option>ESCOM Organization</option>
                <option>Monitoring</option>
                <option>Training</option>
                <option>Data</option>
                <option>Partners</option>
              </select>
            </div>
            <div className="form-group">
              <label>Question:</label>
              <input 
                type="text" 
                value={newFaq.question}
                onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                className="form-input"
                placeholder="Enter your question..."
              />
            </div>
            <div className="form-group">
              <label>Answer:</label>
              <textarea 
                value={newFaq.answer}
                onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                className="form-input"
                placeholder="Enter the answer..."
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleAddFaq} className="save-btn">💾 Add FAQ</button>
              <button onClick={() => setShowAddFaq(false)} className="cancel-btn">❌ Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit FAQ Modal */}
      {editingFaq && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit FAQ</h3>
            <div className="form-group">
              <label>Category:</label>
              <select 
                value={editingFaq.category}
                onChange={(e) => setEditingFaq({...editingFaq, category: e.target.value})}
                className="form-input"
              >
                <option>ESCOM Organization</option>
                <option>Monitoring</option>
                <option>Training</option>
                <option>Data</option>
                <option>Partners</option>
              </select>
            </div>
            <div className="form-group">
              <label>Question:</label>
              <input 
                type="text" 
                value={editingFaq.question}
                onChange={(e) => setEditingFaq({...editingFaq, question: e.target.value})}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Answer:</label>
              <textarea 
                value={editingFaq.answer}
                onChange={(e) => setEditingFaq({...editingFaq, answer: e.target.value})}
                className="form-input"
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleFaqSave} className="save-btn">💾 Save Changes</button>
              <button onClick={() => setEditingFaq(null)} className="cancel-btn">❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMainContent = () => {
    console.log('🔍 Rendering main content for tab:', activeTab);
    
    switch (activeTab) {
      case 'dashboard':
        console.log('📊 Rendering dashboard tab');
        return renderDashboard();
      case 'users':
        console.log('👥 Rendering users tab');
        return renderUserManagement();
      case 'analytics':
        console.log('📈 Rendering analytics tab');
        return renderDataAnalytics();
      case 'settings':
        console.log('⚙️ Rendering settings tab');
        return renderSystemSettings();
      case 'reports':
        console.log('📋 Rendering reports tab');
        return renderReports();
      case 'faqs':
        console.log('❓ Rendering FAQs tab');
        return renderFAQManagement();
      default:
        console.log('📊 Defaulting to dashboard tab');
        return renderDashboard();
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h2>👑 Admin Panel</h2>
        <div className="admin-nav">
          <button 
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button 
            className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
          <button 
            className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
          <button 
            className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            📋 Reports
          </button>
          <button 
            className={`nav-btn ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            ❓ FAQs
          </button>
        </div>
      </div>

      <div className="admin-content">
        {renderMainContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
