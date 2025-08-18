import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [editingFaq, setEditingFaq] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [newFaq, setNewFaq] = useState({ category: 'ESCOM Organization', question: '', answer: '' });
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalReadings: 0,
    averageAccuracy: 0,
    newThisMonth: 0,
    systemHealth: 'Excellent'
  });
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

  useEffect(() => {
    console.log('👑 AdminDashboard component mounted');
    console.log('📊 Loading dashboard data...');
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    console.log('🔄 Loading demo data...');
    // Load demo data for now
    setUsers([
      { id: 1, name: 'Lúcia Fernandes', email: 'lucia@example.com', team: 'Team Beta', status: 'Active', readings: 89, accuracy: 94, lastActivity: '2 hours ago' },
      { id: 2, name: 'Carlos Silva', email: 'carlos@example.com', team: 'Team Alpha', status: 'Active', readings: 67, accuracy: 91, lastActivity: '1 day ago' },
      { id: 3, name: 'Maria Santos', email: 'maria@example.com', team: 'Team Gamma', status: 'Active', readings: 78, accuracy: 89, lastActivity: '3 hours ago' },
      { id: 4, name: 'João Costa', email: 'joao@example.com', team: 'Team Beta', status: 'Inactive', readings: 45, accuracy: 87, lastActivity: '1 week ago' },
      { id: 5, name: 'Ana Oliveira', email: 'ana@example.com', team: 'Team Alpha', status: 'Active', readings: 92, accuracy: 96, lastActivity: '5 hours ago' }
    ]);

    setFaqs([
      { id: 1, category: 'ESCOM Organization', question: 'How can I get involved with ESCOM?', answer: 'You can get involved by joining our coastal monitoring program, participating in training sessions, and contributing to data collection.' },
      { id: 2, category: 'Monitoring', question: 'What parameters do we monitor?', answer: 'We monitor water temperature, salinity, pH levels, and overall water quality using specialized equipment.' },
      { id: 3, category: 'Training', question: 'How do I calibrate my monitoring equipment?', answer: 'Equipment calibration should be done monthly using the calibration kit provided.' },
      { id: 4, category: 'Data', question: 'How often should I submit data?', answer: 'Data should be submitted immediately after each monitoring session, typically monthly.' },
      { id: 5, category: 'Partners', question: 'Who are our research partners?', answer: 'We collaborate with Dalhousie University, local environmental organizations, and government agencies.' }
    ]);

    setSystemStats({
      totalUsers: 11,
      activeUsers: 8,
      totalReadings: 567,
      averageAccuracy: 91.3,
      newThisMonth: 3,
      systemHealth: 'Excellent'
    });
    
    console.log('✅ Dashboard data loaded successfully');
    console.log('👥 Users loaded:', 5);
    console.log('❓ FAQs loaded:', 5);
    console.log('📊 Stats loaded:', systemStats);
  };

  const handleFaqEdit = (faq) => {
    console.log('✏️ Editing FAQ:', faq);
    setEditingFaq({ ...faq });
  };

  const handleFaqSave = () => {
    console.log('💾 Saving FAQ changes...');
    if (editingFaq) {
      setFaqs(faqs.map(faq => 
        faq.id === editingFaq.id ? editingFaq : faq
      ));
      setEditingFaq(null);
      console.log('✅ FAQ saved successfully');
    }
  };

  const handleFaqDelete = (faqId) => {
    console.log('🗑️ Deleting FAQ:', faqId);
    setFaqs(faqs.filter(faq => faq.id !== faqId));
    console.log('✅ FAQ deleted successfully');
  };

  const handleAddFaq = () => {
    console.log('➕ Adding new FAQ:', newFaq);
    if (newFaq.question && newFaq.answer) {
      const newFaqWithId = { ...newFaq, id: Date.now() };
      setFaqs([...faqs, newFaqWithId]);
      setNewFaq({ category: 'ESCOM Organization', question: '', answer: '' });
      setShowAddFaq(false);
      console.log('✅ New FAQ added successfully');
    } else {
      console.log('❌ FAQ validation failed - missing question or answer');
    }
  };

  const handleUserEdit = (user) => {
    setEditingUser({ ...user });
  };

  const handleUserSave = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setEditingUser(null);
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
