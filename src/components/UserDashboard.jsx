import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import './UserDashboard.css';

function UserDashboard({ user, onLogout, onSectionChange }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [faqs, setFaqs] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [readings, setReadings] = useState([]);
  // Enhanced state for better functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    console.log('🌊 UserDashboard component mounted for user:', user);
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    // Load enhanced demo data for better user experience
    setFaqs([
      { 
        id: 1, 
        category: 'ESCOM Organization', 
        subcategory: 'Getting Involved',
        question: 'How can I get involved with ESCOM?', 
        answer: 'You can get involved by joining our coastal monitoring program, participating in training sessions, and contributing to data collection. We offer both online and in-person training opportunities.',
        priority: 'high',
        tags: ['getting-started', 'volunteer', 'training'],
        media: ['https://example.com/image1.jpg'],
        importance: 'critical',
        viewCount: 156,
        createdAt: '2024-01-15'
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
        createdAt: '2024-01-10'
      },
      { 
        id: 3, 
        category: 'Safety', 
        subcategory: 'Field Work',
        question: 'What safety precautions should I take?', 
        answer: 'Always check weather conditions before monitoring, wear appropriate safety gear, work in pairs when possible, and avoid monitoring during severe weather. Your safety is our priority.',
        priority: 'high',
        tags: ['safety', 'field-work', 'weather'],
        media: [],
        importance: 'critical',
        viewCount: 178,
        createdAt: '2024-01-18'
      }
    ]);

    setUpdates([
      {
        id: 1,
        title: 'New Monitoring Equipment Available',
        content: 'We have received new water quality monitoring equipment including advanced pH meters and turbidity sensors. Training sessions will be scheduled next week. Please contact your team leader to reserve your spot.',
        type: 'announcement',
        priority: 'high',
        tags: ['equipment', 'training', 'monitoring'],
        media: ['https://example.com/equipment.jpg'],
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
    ]);

    // Enhanced monitoring readings with realistic data
    setReadings([
      {
        id: 1,
        temperature: 18.5,
        salinity: 35.2,
        ph: 8.1,
        turbidity: 2.3,
        dissolvedOxygen: 7.8,
        location: 'Beach Point A',
        notes: 'Clear water, excellent conditions. No visible pollution. Marine life activity normal.',
        weather: 'sunny',
        timeOfDay: 'morning',
        timestamp: '2024-01-20T08:00:00Z',
        quality: 'excellent',
        equipment: 'pH-2000, Salinity-Refractometer',
        observer: user?.name || 'Citizen Scientist'
      },
      {
        id: 2,
        temperature: 19.2,
        salinity: 34.8,
        ph: 8.0,
        turbidity: 3.1,
        dissolvedOxygen: 7.5,
        location: 'Beach Point B',
        notes: 'Slight cloudiness, normal readings. Small amount of seaweed present.',
        weather: 'partly-cloudy',
        timeOfDay: 'afternoon',
        timestamp: '2024-01-19T14:00:00Z',
        quality: 'good',
        equipment: 'pH-2000, Salinity-Refractometer',
        observer: user?.name || 'Citizen Scientist'
      },
      {
        id: 3,
        temperature: 17.8,
        salinity: 35.5,
        ph: 8.2,
        turbidity: 1.8,
        dissolvedOxygen: 8.1,
        location: 'Beach Point C',
        notes: 'Excellent water clarity, perfect for monitoring. No visible contaminants.',
        weather: 'clear',
        timeOfDay: 'evening',
        timestamp: '2024-01-18T18:00:00Z',
        quality: 'excellent',
        equipment: 'pH-2000, Salinity-Refractometer',
        observer: user?.name || 'Citizen Scientist'
      },
      {
        id: 4,
        temperature: 20.1,
        salinity: 34.9,
        ph: 7.9,
        turbidity: 4.2,
        dissolvedOxygen: 7.2,
        location: 'Beach Point D',
        notes: 'Higher turbidity due to recent rainfall. Water still safe for monitoring.',
        weather: 'rainy',
        timeOfDay: 'morning',
        timestamp: '2024-01-17T09:00:00Z',
        quality: 'fair',
        equipment: 'pH-2000, Salinity-Refractometer',
        observer: user?.name || 'Citizen Scientist'
      },
      {
        id: 5,
        temperature: 19.5,
        salinity: 35.1,
        ph: 8.0,
        turbidity: 2.9,
        dissolvedOxygen: 7.6,
        location: 'Beach Point A',
        notes: 'Stable conditions, consistent with previous readings. Good for baseline data.',
        weather: 'partly-cloudy',
        timeOfDay: 'afternoon',
        timestamp: '2024-01-16T15:00:00Z',
        quality: 'good',
        equipment: 'pH-2000, Salinity-Refractometer',
        observer: user?.name || 'Citizen Scientist'
      }
    ]);

    // setLearningResources([
    //   {
    //     id: 1,
    //     title: 'Water Quality Monitoring Basics',
    //     type: 'video',
    //     duration: '15 min',
    //     difficulty: 'beginner',
    //     tags: ['monitoring', 'basics', 'training'],
    //     url: 'https://example.com/video1',
    //     thumbnail: 'https://example.com/thumb1.jpg',
    //     description: 'Learn the fundamentals of water quality monitoring'
    //   },
    //   {
    //     id: 2,
    //     title: 'Equipment Calibration Guide',
    //     type: 'manual',
    //     duration: '30 min',
    //     difficulty: 'intermediate',
    //     tags: ['equipment', 'calibration', 'maintenance'],
    //     url: 'https://example.com/manual1',
    //     thumbnail: 'https://example.com/thumb2.jpg',
    //     description: 'Step-by-step guide to calibrating monitoring equipment'
    //   }
    // ]);

    // setCommunityPosts([
    //   {
    //     id: 1,
    //     author: 'Carlos Silva',
    //     content: 'Just completed my first monitoring session! The new equipment is amazing. Any tips for beginners?',
    //     timestamp: '2024-01-20T10:00:00Z',
    //     likes: 5,
    //     comments: 3,
    //     tags: ['first-time', 'tips', 'equipment']
    //   },
    //   {
    //     id: 2,
    //     author: 'Maria Santos',
    //     content: 'Found some interesting patterns in the salinity data this month. Anyone else notice similar trends?',
    //     timestamp: '2024-01-19T16:00:00Z',
    //     likes: 8,
    //     comments: 6,
    //     tags: ['data-analysis', 'patterns', 'salinity']
    //   }
    // ]);
  };




  // const handleLikePost = (postId) => {
  //   setCommunityPosts(communityPosts.map(post => 
  //     post.id === postId ? { ...post, likes: post.likes + 1 } : post
  //   ));
  // };

  // const handleAddComment = (postId, comment) => {
  //   if (!comment.trim()) return;
  //   
  //   setCommunityPosts(communityPosts.map(post => 
  //     post.id === postId ? { ...post, comments: post.comments + 1 } : post
  //   ));
  // };

  // const handleCreatePost = (content, tags) => {
  //   if (!content.trim()) return;
  //   
  //   const newPost = {
  //     //   author: user.name,
  //   content: content.trim(),
  //   timestamp: new Date().toISOString(),
  //   likes: 0,
  //   comments: 0,
  //   tags: tags || []
  // };
  //   
  //   setCommunityPosts([newPost, ...communityPosts]);
  //   console.log('✅ New community post created:', newPost);
  // };

  const renderDashboard = () => (
    <div className="user-overview">
      <div className="welcome-section">
        <h3>🌊 Welcome back, {user?.name || 'Citizen Scientist'}!</h3>
        <p>Ready to contribute to coastal monitoring today?</p>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
          <div className="stat-value">{readings.length}</div>
            <div className="stat-label">Total Readings</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
          <div className="stat-value">94%</div>
            <div className="stat-label">Data Quality</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
          <div className="stat-value">5</div>
            <div className="stat-label">Day Streak</div>
        </div>
        </div>
      </div>

      <div className="quick-actions">
        <h4>Quick Actions</h4>
        <div className="action-grid">
          <button onClick={() => setActiveTab('faqs')} className="action-card primary">
            <div className="action-icon">❓</div>
            <div className="action-text">View FAQ</div>
          </button>
          <button onClick={() => setActiveTab('updates')} className="action-card">
            <div className="action-icon">📢</div>
            <div className="action-text">Check Updates</div>
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h4>Recent Activity</h4>
        <div className="activity-list">
          {readings.slice(0, 3).map(reading => (
            <div key={reading.id} className="activity-item">
              <div className="activity-icon">📊</div>
              <div className="activity-content">
                <div className="activity-text">Submitted reading at {reading.location}</div>
                <div className="activity-time">{new Date(reading.timestamp).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || 
      faq.category.toLowerCase().includes(filterCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const handleFaqToggle = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  const renderFAQs = () => (
    <div className="user-faqs">
      <div className="section-header">
        <button onClick={() => setActiveTab('dashboard')} className="back-btn">← Back</button>
        <h3>❓ FAQ</h3>
      </div>
      
      <div className="faq-search">
        <input
          type="text"
          placeholder="Search FAQs..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="faq-categories">
        <div className="category-tabs">
          <button 
            className={`category-tab ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            All ({faqs.length})
          </button>
          <button 
            className={`category-tab ${filterCategory === 'escom organization' ? 'active' : ''}`}
            onClick={() => setFilterCategory('escom organization')}
          >
            Organization ({faqs.filter(f => f.category.toLowerCase().includes('escom')).length})
          </button>
          <button 
            className={`category-tab ${filterCategory === 'monitoring' ? 'active' : ''}`}
            onClick={() => setFilterCategory('monitoring')}
          >
            Monitoring ({faqs.filter(f => f.category.toLowerCase().includes('monitoring')).length})
          </button>
          <button 
            className={`category-tab ${filterCategory === 'safety' ? 'active' : ''}`}
            onClick={() => setFilterCategory('safety')}
          >
            Safety ({faqs.filter(f => f.category.toLowerCase().includes('safety')).length})
          </button>
        </div>
      </div>

      <div className="faq-stats">
        <p>Showing {filteredFAQs.length} of {faqs.length} FAQs</p>
      </div>

      <div className="faq-list">
        {filteredFAQs.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h4>No FAQs found</h4>
            <p>Try adjusting your search terms or category filter</p>
          </div>
        ) : (
          filteredFAQs.map(faq => (
            <div key={faq.id} className={`faq-card ${expandedFaq === faq.id ? 'expanded' : ''}`}>
              <div className="faq-header" onClick={() => handleFaqToggle(faq.id)}>
              <h4>{faq.question}</h4>
                <div className="faq-meta">
              <span className="faq-category">{faq.category}</span>
                  <span className="faq-toggle">{expandedFaq === faq.id ? '−' : '+'}</span>
            </div>
              </div>
              {expandedFaq === faq.id && (
            <div className="faq-answer">
              <p>{faq.answer}</p>
                  {faq.tags && faq.tags.length > 0 && (
                    <div className="faq-tags">
                      {faq.tags.map((tag, index) => (
                        <span key={index} className="faq-tag">#{tag}</span>
                      ))}
            </div>
                  )}
          </div>
              )}
      </div>
          ))
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
        {updates.map(update => (
          <div key={update.id} className={`update-card ${update.priority}`}>
            <div className="update-header">
              <h4>{update.title}</h4>
              <span className={`priority-badge ${update.priority}`}>{update.priority}</span>
            </div>
            <p className="update-content">{update.content}</p>
            <div className="update-footer">
              <span className="update-date">{new Date(update.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="user-profile">
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
              <label>Team</label>
              <select className="form-input">
                <option value="Team Alpha">Team Alpha</option>
                <option value="Team Beta">Team Beta</option>
                <option value="Team Gamma">Team Gamma</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Bio</label>
            <textarea 
              className="form-input" 
              placeholder="Tell us about yourself and your interest in coastal monitoring..."
              rows="4"
            ></textarea>
          </div>
          
          <button type="submit" className="submit-btn">💾 Save Changes</button>
        </form>
      </div>
    </div>
  );

  const renderPassword = () => (
    <div className="user-password">
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
    <div className="user-preferences">
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
          <h4>Data Collection Preferences</h4>
          <div className="preference-item">
            <span className="preference-label">Auto-save Drafts</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
    </div>
          <div className="preference-item">
            <span className="preference-label">Location Services</span>
            <label className="toggle">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="preference-item">
            <span className="preference-label">Data Sharing for Research</span>
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
      case 'password':
        return renderPassword();
      case 'preferences':
        return renderPreferences();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <button onClick={() => onSectionChange('welcome')} className="back-btn">← Back</button>
          <h2>🌊 Citizen Scientist Dashboard</h2>
        </div>
        
        <div className="header-right">
          <Profile user={user} onLogout={onLogout} onSectionChange={setActiveTab} />
        </div>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Home</span>
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
          �� Updates
        </button>
      </div>

      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default UserDashboard;
