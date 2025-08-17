import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [faqs, setFaqs] = useState([]);
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

  useEffect(() => {
    console.log('👑 AdminDashboard component mounted');
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
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
      { id: 3, category: 'Training', question: 'How do I calibrate my monitoring equipment?', answer: 'Equipment calibration should be done monthly using the calibration kit provided.' }
    ]);

    setSystemStats({
      totalUsers: 11,
      activeUsers: 8,
      totalReadings: 567,
      averageAccuracy: 91.3,
      newThisMonth: 3,
      systemHealth: 'Excellent'
    });
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
              <button className="edit-btn">✏️ Edit</button>
              <button className="view-btn">👁️ View</button>
            </div>
          </div>
        ))}
      </div>
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
        <button className="save-btn">💾 Save Settings</button>
        <button className="reset-btn">🔄 Reset to Default</button>
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
            <button className="generate-btn">📈 Generate</button>
          </div>
          <div className="report-type">
            <h5>👥 User Performance</h5>
            <p>Individual user metrics</p>
            <button className="generate-btn">📈 Generate</button>
          </div>
          <div className="report-type">
            <h5>🎯 Data Quality</h5>
            <p>Data quality analysis</p>
            <button className="generate-btn">📈 Generate</button>
          </div>
          <div className="report-type">
            <h5>⚙️ System Health</h5>
            <p>System performance metrics</p>
            <button className="generate-btn">📈 Generate</button>
          </div>
        </div>
      </div>

      <div className="recent-reports">
        <h4>Recent Reports</h4>
        <div className="report-list">
          <div className="report-item completed">
            <span className="report-name">Monthly Activity Report</span>
            <span className="report-status">Completed</span>
            <span className="report-date">2024-01-20</span>
            <button className="view-btn">View</button>
          </div>
          <div className="report-item completed">
            <span className="report-name">User Performance Report</span>
            <span className="report-status">Completed</span>
            <span className="report-date">2024-01-19</span>
            <button className="view-btn">View</button>
          </div>
          <div className="report-item in-progress">
            <span className="report-name">Data Quality Report</span>
            <span className="report-status">In Progress</span>
            <span className="report-date">2024-01-20</span>
            <button className="view-btn">View</button>
          </div>
          <div className="report-item scheduled">
            <span className="report-name">System Health Report</span>
            <span className="report-status">Scheduled</span>
            <span className="report-date">2024-01-21</span>
            <button className="view-btn">View</button>
          </div>
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
                <button className="edit-btn">✏️ Edit</button>
                <button className="delete-btn">🗑️ Delete</button>
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
        <button className="add-btn">➕ Add New Question</button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUserManagement();
      case 'analytics':
        return renderDataAnalytics();
      case 'settings':
        return renderSystemSettings();
      case 'reports':
        return renderReports();
      case 'faqs':
        return renderFAQManagement();
      default:
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
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
