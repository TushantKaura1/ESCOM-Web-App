import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import Profile from './Profile';
import './UserDashboard.css';

function UserDashboard({ user, onLogout, onSectionChange }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [readings, setReadings] = useState([]);
  
  // Get data from DataContext instead of local state
  const { faqs, updates, isLoading, refreshData, forceSync } = useData();
  
  // Enhanced state for better functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    console.log('🌊 UserDashboard component mounted for user:', user);
    console.log('🔍 UserDashboard - FAQs from DataContext:', faqs);
    console.log('🔍 UserDashboard - Updates from DataContext:', updates);
    console.log('🔍 UserDashboard - FAQ count:', faqs?.length || 0);
    console.log('🔍 UserDashboard - Updates count:', updates?.length || 0);
    console.log('🔍 UserDashboard - FAQ type:', typeof faqs);
    console.log('🔍 UserDashboard - Updates type:', typeof updates);
    console.log('🔍 UserDashboard - FAQ is array:', Array.isArray(faqs));
    console.log('🔍 UserDashboard - Updates is array:', Array.isArray(updates));
  }, [user, faqs, updates]);

  // Load demo readings data (this is user-specific, not shared)
  useEffect(() => {
    const demoReadings = [
      {
        id: 1,
        temperature: 18.5,
        salinity: 35.2,
        ph: 8.1,
        turbidity: 2.3,
        dissolvedOxygen: 6.8,
        location: 'Beach Point A',
        date: '2024-01-22',
        time: '14:30',
        notes: 'Clear conditions, moderate waves',
        quality: 'excellent',
        submitted: true
      },
      {
        id: 2,
        temperature: 17.8,
        salinity: 34.9,
        ph: 7.9,
        turbidity: 3.1,
        dissolvedOxygen: 6.5,
        location: 'Beach Point B',
        date: '2024-01-20',
        time: '09:15',
        notes: 'Slightly cloudy water, good visibility',
        quality: 'good',
        submitted: true
      },
      {
        id: 3,
        temperature: 19.2,
        salinity: 35.5,
        ph: 8.2,
        turbidity: 1.8,
        dissolvedOxygen: 7.1,
        location: 'Beach Point A',
        date: '2024-01-18',
        time: '16:45',
        notes: 'Perfect conditions for monitoring',
        quality: 'excellent',
        submitted: true
      },
      {
        id: 4,
        temperature: 16.9,
        salinity: 35.8,
        ph: 7.8,
        turbidity: 4.2,
        dissolvedOxygen: 6.2,
        location: 'Beach Point C',
        date: '2024-01-15',
        time: '11:20',
        notes: 'Stormy conditions, high turbidity',
        quality: 'fair',
        submitted: true
      },
      {
        id: 5,
        temperature: 20.1,
        salinity: 35.0,
        ph: 8.0,
        turbidity: 2.8,
        dissolvedOxygen: 6.9,
        location: 'Beach Point A',
        date: '2024-01-12',
        time: '13:45',
        notes: 'Calm seas, excellent visibility',
        quality: 'excellent',
        submitted: true
      }
    ];
    setReadings(demoReadings);
    console.log('✅ User-specific readings data loaded');
  }, []);

  const handleFaqToggle = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const renderFAQs = () => (
    <div className="user-faqs">
      <div className="section-header">
        <button onClick={() => setActiveTab('dashboard')} className="back-btn">← Back</button>
        <h3>❓ FAQ</h3>
      </div>
      
      <div className="faq-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-tabs">
          <button 
            className={`category-tab ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            All ({faqs?.length || 0})
          </button>
          <button 
            className={`category-tab ${filterCategory === 'escom organization' ? 'active' : ''}`}
            onClick={() => setFilterCategory('escom organization')}
          >
            Organization ({faqs?.filter(f => f.category.toLowerCase().includes('escom')).length || 0})
          </button>
          <button 
            className={`category-tab ${filterCategory === 'monitoring' ? 'active' : ''}`}
            onClick={() => setFilterCategory('monitoring')}
          >
            Monitoring ({faqs?.filter(f => f.category.toLowerCase().includes('monitoring')).length || 0})
          </button>
          <button 
            className={`category-tab ${filterCategory === 'safety' ? 'active' : ''}`}
            onClick={() => setFilterCategory('safety')}
          >
            Safety ({faqs?.filter(f => f.category.toLowerCase().includes('safety')).length || 0})
          </button>
        </div>
      </div>

      <div className="faq-stats">
        <p>Showing {filteredFAQs.length} of {faqs?.length || 0} FAQs</p>
      </div>

      <div className="faq-list">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map(faq => (
            <div key={faq.id} className="faq-card">
              <div className="faq-header">
                <h4>{faq.question}</h4>
                <div className="faq-meta">
                  <span className="faq-category">{faq.category}</span>
                  <span className="faq-priority">{faq.priority}</span>
                </div>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
                {faq.tags && faq.tags.length > 0 && (
                  <div className="faq-tags">
                    {faq.tags.map((tag, index) => (
                      <span key={index} className="faq-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No FAQs found matching your search criteria.</p>
            <button onClick={() => setSearchTerm('')} className="clear-search-btn">Clear Search</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderUpdates = () => (
    <div className="user-updates">
      <div className="section-header">
        <button onClick={() => setActiveTab('dashboard')} className="back-btn">← Back</button>
        <h3>📢 Latest Updates</h3>
      </div>
      
      <div className="updates-list">
        {updates && updates.length > 0 ? (
          updates.map(update => (
            <div key={update.id} className={`update-card ${update.priority}`}>
              <div className="update-header">
                <h4>{update.title}</h4>
                <span className="update-date">{new Date(update.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="update-content">
                <p>{update.content}</p>
                <div className="update-meta">
                  <span className="update-type">{update.type}</span>
                  <span className="update-priority">{update.priority}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-updates">
            <p>No updates available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <Profile user={user} onLogout={onLogout} />
  );

  const renderDashboard = () => (
    <div className="user-dashboard">
      <div className="welcome-section">
        <h2>Welcome back, {user.name}!</h2>
        <p>Ready to contribute to coastal monitoring?</p>
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={() => {
              console.log('🔄 Manual refresh triggered');
              forceSync();
            }} 
            style={{
              background: '#00d4aa',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            🔄 Refresh Data
          </button>
          <span style={{ fontSize: '12px', color: '#ccc' }}>
            FAQs: {faqs?.length || 0} | Updates: {updates?.length || 0}
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{readings.length}</div>
          <div className="stat-label">Total Readings</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">94.2%</div>
          <div className="stat-label">Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">12</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-value">156</div>
          <div className="stat-label">Contributions</div>
        </div>
      </div>

      <div className="action-grid">
        <button onClick={() => setActiveTab('faqs')} className="action-card primary">
          <div className="action-icon">❓</div>
          <div className="action-text">View FAQ</div>
        </button>
        <button onClick={() => setActiveTab('updates')} className="action-card">
          <div className="action-icon">📢</div>
          <div className="action-text">Check Updates</div>
        </button>
        <button onClick={() => setActiveTab('profile')} className="action-card">
          <div className="action-icon">👤</div>
          <div className="action-text">Profile</div>
        </button>
      </div>

      <div className="recent-readings">
        <h3>Recent Readings</h3>
        <div className="readings-list">
          {readings.slice(0, 3).map(reading => (
            <div key={reading.id} className="reading-card">
              <div className="reading-header">
                <span className="reading-location">{reading.location}</span>
                <span className="reading-date">{reading.date}</span>
              </div>
              <div className="reading-data">
                <span>Temp: {reading.temperature}°C</span>
                <span>pH: {reading.ph}</span>
                <span>Salinity: {reading.salinity}</span>
              </div>
              <div className={`quality-badge ${reading.quality}`}>
                {reading.quality}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Filter FAQs based on search and category
  const filteredFAQs = (faqs || []).filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || 
      faq.category.toLowerCase().includes(filterCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'faqs':
        return renderFAQs();
      case 'updates':
        return renderUpdates();
      case 'profile':
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <div className="dashboard-logo">
            <img src="/escom-logo.png" alt="ESCOM Logo" className="logo-image" />
            <h2>Citizen Scientist Dashboard</h2>
          </div>
        </div>
        <div className="header-right">
          <div className="header-actions">
            <button onClick={() => setActiveTab('dashboard')} className="header-action-btn">
              <span className="action-icon">🏠</span>
              <span className="action-text">Dashboard</span>
            </button>
            <button onClick={onLogout} className="header-action-btn logout-btn">
              <span className="action-icon">🚪</span>
              <span className="action-text">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Dashboard</span>
        </button>
        <button 
          className={`nav-btn ${activeTab === 'faqs' ? 'active' : ''}`}
          onClick={() => setActiveTab('faqs')}
        >
          <span className="nav-icon">❓</span>
          <span className="nav-text">FAQ</span>
        </button>
        <button 
          className={`nav-btn ${activeTab === 'updates' ? 'active' : ''}`}
          onClick={() => setActiveTab('updates')}
        >
          <span className="nav-icon">📢</span>
          <span className="nav-text">Updates</span>
        </button>
        <button 
          className={`nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-text">Profile</span>
        </button>
      </div>

      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default UserDashboard;
