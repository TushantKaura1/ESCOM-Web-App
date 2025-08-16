import React, { useEffect, useState } from 'react';
import './App.css';
import config from './config';

const tg = window.Telegram?.WebApp;

// Auth Screen Component with Email Authentication
function AuthScreen({ onAdminLogin, onCitizenLogin, onSignup }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH.LOGIN}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.user.isAdmin) {
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminUser', JSON.stringify(data.user));
            onAdminLogin(data.user);
          } else {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            onCitizenLogin(data.user);
          }
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Login failed');
        }
      } else {
        // Register
        const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH.REGISTER}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            username,
            firstName,
            lastName,
            role: 'citizen'
          })
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          onCitizenLogin(data.user);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Registration failed');
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setUsername('');
    setFirstName('');
    setLastName('');
    setError('');
  };

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    clearForm();
  };

  return (
    <div className="auth-screen">
      <div className="auth-background">
        <div className="auth-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-container">
              <div className="logo-icon">🌊</div>
              <h1>ESCOM Citizen Scientist</h1>
            </div>
            <p className="auth-subtitle">
              {isLogin ? 'Welcome back to the community!' : 'Join our coastal research community'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="auth-input"
                  />
                  <span className="input-icon">👤</span>
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="auth-input"
                  />
                  <span className="input-icon">👤</span>
                </div>
              </div>
            )}
            
            {!isLogin && (
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="auth-input"
                />
                <span className="input-icon">🏷️</span>
              </div>
            )}
            
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
              <span className="input-icon">📧</span>
            </div>
            
            <div className="form-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
              <span className="input-icon">🔒</span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            
            <button type="submit" disabled={loading} className="auth-button">
              <span className="button-text">
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </span>
            </button>
            
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
            
            <div className="auth-switch">
              <button
                type="button"
                onClick={handleModeSwitch}
                className="switch-button"
              >
                {isLogin ? (
                  <>
                    <span>New to ESCOM?</span>
                    <strong>Create an account</strong>
                  </>
                ) : (
                  <>
                    <span>Already have an account?</span>
                    <strong>Sign in</strong>
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="auth-features">
            <div className="feature">
              <span className="feature-icon">🔬</span>
              <span>Scientific Research</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🌍</span>
              <span>Environmental Impact</span>
            </div>
            <div className="feature">
              <span className="feature-icon">👥</span>
              <span>Community Driven</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Setup Component
function ProfileSetup({ onComplete }) {
  const [profile, setProfile] = useState({
    name: '',
    village: '',
    team: '',
    parameters: '',
    since: '',
    experience: 'beginner'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(profile);
  };

  return (
    <div className="profile-setup">
      <div className="setup-header">
        <h2>👤 Setup Your Profile</h2>
        <p>Tell us about yourself to personalize your experience</p>
      </div>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            required
            placeholder="Your full name"
          />
        </div>
        <div className="form-group">
          <label>Village/Location *</label>
          <input
            type="text"
            value={profile.village}
            onChange={(e) => setProfile({...profile, village: e.target.value})}
            required
            placeholder="Your village or location"
          />
        </div>
        <div className="form-group">
          <label>Coastal Climate Team</label>
          <select
            value={profile.team}
            onChange={(e) => setProfile({...profile, team: e.target.value})}
          >
            <option value="">Select your team</option>
            <option value="team1">Team Alpha</option>
            <option value="team2">Team Beta</option>
            <option value="team3">Team Gamma</option>
          </select>
        </div>
        <div className="form-group">
          <label>Monitoring Parameters</label>
          <select
            value={profile.parameters}
            onChange={(e) => setProfile({...profile, parameters: e.target.value})}
          >
            <option value="">Select parameters</option>
            <option value="water-quality">Water Quality</option>
            <option value="temperature">Temperature</option>
            <option value="salinity">Salinity</option>
            <option value="ph">pH Levels</option>
          </select>
        </div>
        <div className="form-group">
          <label>Member Since</label>
          <input
            type="month"
            value={profile.since}
            onChange={(e) => setProfile({...profile, since: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Experience Level</label>
          <select
            value={profile.experience}
            onChange={(e) => setProfile({...profile, experience: e.target.value})}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Complete Setup</button>
      </form>
    </div>
  );
}

// Enhanced FAQ Component with Real-time Data from MongoDB
function FAQSection({ onBack, userMode }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterImportance, setFilterImportance] = useState('all');

  // Fallback FAQ data in case API fails
  const fallbackFAQs = [
    {
      _id: '1',
      category: 'ESCOM organization',
      subcategory: 'Getting involved',
      question: 'How can I get involved with ESCOM?',
      answer: 'You can get involved by joining our coastal monitoring program, participating in training sessions, and contributing to data collection. Contact your local team leader to get started.',
      tags: ['beginner', 'getting-started', 'community'],
      importance: 'high',
      isNew: true,
      lastUpdated: new Date().toISOString(),
      order: 1
    },
    {
      _id: '2',
      category: 'Monitoring',
      subcategory: 'Water Quality',
      question: 'What parameters do we monitor?',
      answer: 'We monitor water temperature, salinity, pH levels, and overall water quality. Each parameter is measured using specialized equipment and recorded in our database.',
      tags: ['monitoring', 'water-quality', 'parameters'],
      importance: 'high',
      isNew: false,
      lastUpdated: new Date(Date.now() - 86400000).toISOString(),
      order: 2
    },
    {
      _id: '3',
      category: 'Training',
      subcategory: 'Equipment',
      question: 'How do I calibrate my monitoring equipment?',
      answer: 'Equipment calibration should be done monthly using the calibration kit provided. Follow the step-by-step guide in your training manual or contact your team leader for assistance.',
      tags: ['training', 'equipment', 'calibration'],
      importance: 'medium',
      isNew: false,
      lastUpdated: new Date(Date.now() - 172800000).toISOString(),
      order: 3
    },
    {
      _id: '4',
      category: 'Data',
      subcategory: 'Submission',
      question: 'How often should I submit data?',
      answer: 'Data should be submitted immediately after each monitoring session, typically monthly. During extreme weather events, additional readings may be required.',
      tags: ['data', 'submission', 'frequency'],
      importance: 'medium',
      isNew: false,
      lastUpdated: new Date(Date.now() - 259200000).toISOString(),
      order: 4
    },
    {
      _id: '5',
      category: 'Partners',
      subcategory: 'Collaboration',
      question: 'Who are ESCOM\'s research partners?',
      answer: 'ESCOM collaborates with universities, government agencies, and environmental organizations to advance coastal research and conservation efforts.',
      tags: ['partners', 'collaboration', 'research'],
      importance: 'low',
      isNew: false,
      lastUpdated: new Date(Date.now() - 345600000).toISOString(),
      order: 5
    }
  ];

  // Fetch real-time FAQs from MongoDB
  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 FAQSection - fetchFAQs called');
      console.log('🔍 API URL:', `${config.API_BASE_URL}${config.ENDPOINTS.USER.FAQS}`);

      // Fetch FAQs from user API endpoint (no auth required for now)
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.USER.FAQS}`);
      
      console.log('🔍 FAQ API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setFaqs(data);
          console.log('✅ FAQs fetched successfully:', data.length);
        } else {
          console.log('⚠️ No FAQs returned from API, using fallback data');
          setFaqs(fallbackFAQs);
        }
      } else {
        console.error('❌ Failed to fetch FAQs:', response.status);
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        console.log('⚠️ Using fallback FAQ data due to API error');
        setFaqs(fallbackFAQs);
        setError(`API temporarily unavailable. Showing cached FAQs.`);
      }
    } catch (error) {
      console.error('❌ Failed to fetch FAQs:', error);
      console.log('⚠️ Using fallback FAQ data due to network error');
      setFaqs(fallbackFAQs);
      setError(`Network error. Showing cached FAQs.`);
    } finally {
      setLoading(false);
    }
  };

  // Refresh FAQs data
  const refreshFAQs = () => {
    fetchFAQs();
  };

  // Filter FAQs based on search and filters
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.tags && faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = filterCategory === 'all' || faq.category === filterCategory;
    const matchesImportance = filterImportance === 'all' || faq.importance === filterImportance;
    
    return matchesSearch && matchesCategory && matchesImportance;
  });

  // Get unique categories for filter
  const categories = [...new Set(faqs.map(faq => faq.category))];

  const handleFAQSelect = (faq) => {
    setSelectedFAQ(faq);
  };

  const handleBack = () => {
    if (selectedFAQ) {
      setSelectedFAQ(null);
    } else {
      onBack();
    }
  };

  // Show individual FAQ view
  if (selectedFAQ) {
    return (
      <div className="faq-section">
        <div className="faq-header">
          <button onClick={handleBack} className="back-btn">← Back</button>
          <h3>FAQ Details</h3>
          <button onClick={refreshFAQs} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
        
        <div className="faq-detail">
          <div className="faq-meta">
            <span className="category">{selectedFAQ.category}</span>
            <span className="subcategory">{selectedFAQ.subcategory}</span>
            <span className="importance">{selectedFAQ.importance}</span>
            <span className="is-new">{selectedFAQ.isNew ? '🆕 NEW' : ''}</span>
          </div>
          
          <h4 className="faq-question">{selectedFAQ.question}</h4>
          <p className="faq-answer">{selectedFAQ.answer}</p>
          
          {selectedFAQ.tags && selectedFAQ.tags.length > 0 && (
            <div className="faq-tags">
              <strong>Tags:</strong>
              {selectedFAQ.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
          
          <div className="faq-footer">
            <small>Last updated: {new Date(selectedFAQ.lastUpdated).toLocaleDateString()}</small>
          </div>
        </div>
      </div>
    );
  }

  // Main FAQ list view
  return (
    <div className="faq-section">
      <div className="faq-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>❓ Frequently Asked Questions</h3>
        <button onClick={refreshFAQs} className="refresh-btn" disabled={loading}>
          {loading ? '🔄 Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="faq-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={filterImportance}
            onChange={(e) => setFilterImportance(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* FAQ List */}
      {loading ? (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading FAQs...</p>
        </div>
      ) : filteredFAQs.length === 0 ? (
        <div className="no-faqs">
          <p>No FAQs found matching your criteria.</p>
          <button onClick={refreshFAQs} className="refresh-btn">🔄 Refresh</button>
        </div>
      ) : (
        <div className="faq-list">
          <div className="faq-stats">
            <p>Showing {filteredFAQs.length} of {faqs.length} FAQs</p>
          </div>
          
          {filteredFAQs.map((faq) => (
            <div key={faq._id} className="faq-item" onClick={() => handleFAQSelect(faq)}>
              <div className="faq-header-mini">
                <div className="faq-meta-mini">
                  <span className="category-mini">{faq.category}</span>
                  <span className="importance-mini">{faq.importance}</span>
                  {faq.isNew && <span className="new-badge">🆕 NEW</span>}
                </div>
                <div className="faq-arrow">▶️</div>
              </div>
              
              <h4 className="faq-question-mini">{faq.question}</h4>
              <p className="faq-answer-preview">{faq.answer.substring(0, 100)}...</p>
              
              {faq.tags && faq.tags.length > 0 && (
                <div className="faq-tags-mini">
                  {faq.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="tag-mini">{tag}</span>
                  ))}
                  {faq.tags.length > 3 && <span className="more-tags">+{faq.tags.length - 3}</span>}
                </div>
              )}
              
              <div className="faq-footer-mini">
                <small>Updated: {new Date(faq.lastUpdated).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Latest Updates Component
function UpdatesSection({ onBack }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Fallback updates data in case API fails
  const fallbackUpdates = [
    {
      _id: '1',
      title: 'New Monitoring Equipment Available',
      content: 'We have received new water quality monitoring equipment for all teams. The new sensors provide more accurate readings and longer battery life. Team leaders will distribute equipment during the next training session.',
      type: 'announcement',
      priority: 'high',
      tags: ['equipment', 'training', 'teams'],
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      _id: '2',
      title: 'Monthly Data Review Results',
      content: 'Great news! Our community achieved 95% data accuracy this month. Special recognition goes to Team Alpha for maintaining 100% accuracy for three consecutive months. Keep up the excellent work!',
      type: 'news',
      priority: 'medium',
      tags: ['data', 'recognition', 'teams'],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      isActive: true
    },
    {
      _id: '3',
      title: 'Upcoming Training Workshop',
      content: 'Join us for an advanced monitoring techniques workshop on coastal erosion assessment. This hands-on session will cover new methodologies and equipment usage. Registration opens next week.',
      type: 'update',
      priority: 'medium',
      tags: ['training', 'workshop', 'erosion'],
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      isActive: true
    },
    {
      _id: '4',
      title: 'Weather Alert System Update',
      content: 'We have upgraded our weather alert system to provide real-time notifications for dangerous monitoring conditions. All users will receive alerts via the app and email.',
      type: 'announcement',
      priority: 'high',
      tags: ['safety', 'weather', 'alerts'],
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      isActive: true
    },
    {
      _id: '5',
      title: 'Community Survey Results',
      content: 'Thank you to everyone who participated in our community feedback survey. Your input has helped us identify areas for improvement. We will implement the top suggestions in the next update.',
      type: 'news',
      priority: 'low',
      tags: ['community', 'feedback', 'improvements'],
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      isActive: true
    }
  ];

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 UpdatesSection - fetchUpdates called');
      console.log('🔍 API URL:', `${config.API_BASE_URL}${config.ENDPOINTS.USER.UPDATES}`);

      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.USER.UPDATES}`);
      
      console.log('🔍 Updates API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setUpdates(data);
          console.log('✅ Updates fetched successfully:', data.length);
        } else {
          console.log('⚠️ No updates returned from API, using fallback data');
          setUpdates(fallbackUpdates);
        }
      } else {
        console.error('❌ Failed to fetch updates:', response.status);
        console.log('⚠️ Using fallback updates data due to API error');
        setUpdates(fallbackUpdates);
        setError(`API temporarily unavailable. Showing cached updates.`);
      }
    } catch (error) {
      console.error('❌ Failed to fetch updates:', error);
      console.log('⚠️ Using fallback updates data due to network error');
      setUpdates(fallbackUpdates);
      setError(`Network error. Showing cached updates.`);
    } finally {
      setLoading(false);
    }
  };

  const refreshUpdates = () => {
    fetchUpdates();
  };

  const filteredUpdates = updates.filter(update => {
    const matchesType = filterType === 'all' || update.type === filterType;
    const matchesPriority = filterPriority === 'all' || update.priority === filterPriority;
    return matchesType && matchesPriority;
  });

  const handleUpdateSelect = (update) => {
    setSelectedUpdate(update);
  };

  const handleBack = () => {
    if (selectedUpdate) {
      setSelectedUpdate(null);
    } else {
      onBack();
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'announcement': return '📢';
      case 'news': return '📰';
      case 'update': return '🔄';
      default: return '📝';
    }
  };

  // Show individual update view
  if (selectedUpdate) {
    return (
      <div className="updates-section">
        <div className="updates-header">
          <button onClick={handleBack} className="back-btn">← Back</button>
          <h3>Update Details</h3>
          <button onClick={refreshUpdates} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>
        
        <div className="update-detail">
          <div className="update-meta">
            <span className="type-badge">{getTypeIcon(selectedUpdate.type)} {selectedUpdate.type}</span>
            <span className={`priority-badge ${selectedUpdate.priority}`}>
              {getPriorityIcon(selectedUpdate.priority)} {selectedUpdate.priority} Priority
            </span>
            <span className="date-badge">
              📅 {new Date(selectedUpdate.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <h4 className="update-title">{selectedUpdate.title}</h4>
          <p className="update-content">{selectedUpdate.content}</p>
          
          {selectedUpdate.tags && selectedUpdate.tags.length > 0 && (
            <div className="update-tags">
              <strong>Tags:</strong>
              {selectedUpdate.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main updates list view
  return (
    <div className="updates-section">
      <div className="updates-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>📢 Latest Updates</h3>
        <p>Stay informed about community news and announcements</p>
        <button onClick={refreshUpdates} className="refresh-btn" disabled={loading}>
          {loading ? '🔄 Loading...' : '🔄 Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="updates-filters">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="announcement">📢 Announcements</option>
          <option value="news">📰 News</option>
          <option value="update">🔄 Updates</option>
        </select>
        
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Priorities</option>
          <option value="high">🔴 High Priority</option>
          <option value="medium">🟡 Medium Priority</option>
          <option value="low">🟢 Low Priority</option>
        </select>
      </div>

      {/* Updates List */}
      {loading ? (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading updates...</p>
        </div>
      ) : filteredUpdates.length === 0 ? (
        <div className="no-updates">
          <p>No updates found matching your criteria.</p>
          <button onClick={refreshUpdates} className="refresh-btn">🔄 Refresh</button>
        </div>
      ) : (
        <div className="updates-list">
          <div className="updates-stats">
            <p>Showing {filteredUpdates.length} of {updates.length} updates</p>
          </div>
          
          {filteredUpdates.map((update) => (
            <div key={update._id} className="update-item" onClick={() => handleUpdateSelect(update)}>
              <div className="update-header-mini">
                <div className="update-meta-mini">
                  <span className="type-mini">{getTypeIcon(update.type)} {update.type}</span>
                  <span className={`priority-mini ${update.priority}`}>
                    {getPriorityIcon(update.priority)} {update.priority}
                  </span>
                </div>
                <div className="update-arrow">▶️</div>
              </div>
              
              <h4 className="update-title-mini">{update.title}</h4>
              <p className="update-content-preview">{update.content.substring(0, 120)}...</p>
              
              {update.tags && update.tags.length > 0 && (
                <div className="update-tags-mini">
                  {update.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="tag-mini">{tag}</span>
                  ))}
                  {update.tags.length > 3 && <span className="more-tags">+{update.tags.length - 3}</span>}
                </div>
              )}
              
              <div className="update-footer-mini">
                <small>Posted: {new Date(update.createdAt).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Community Component
function CommunitySection({ onBack }) {
  const [members] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      village: 'Port Hawkesbury',
      team: 'Team Alpha',
      experience: 'Advanced',
      parameters: 'Water Quality, Temperature',
      since: '2023-01',
      online: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      village: 'Cheticamp',
      team: 'Team Beta',
      experience: 'Intermediate',
      parameters: 'Salinity, pH',
      since: '2023-03',
      online: false
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      village: 'Inverness',
      team: 'Team Gamma',
      experience: 'Beginner',
      parameters: 'Temperature',
      since: '2024-01',
      online: true
    }
  ]);

  const handleChat = (memberId) => {
    alert(`Chat with member ${memberId} - Feature coming soon!`);
  };

  return (
    <div className="community-section">
      <div className="community-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>👥 ESCOM Community</h3>
        <p>Connect with fellow citizen scientists</p>
      </div>
      <div className="members-list">
        {members.map((member) => (
          <div key={member.id} className="member-card">
            <div className="member-info">
              <div className="member-header">
                <h4>{member.name}</h4>
                <span className={`status ${member.online ? 'online' : 'offline'}`}>
                  {member.online ? '🟢 Online' : '⚪ Offline'}
                </span>
              </div>
              <p className="member-location">📍 {member.village}</p>
              <p className="member-team">🏆 {member.team}</p>
              <p className="member-experience">📊 {member.experience} Level</p>
              <p className="member-parameters">🔬 {member.parameters}</p>
              <p className="member-since">📅 Member since {member.since}</p>
            </div>
            <button 
              onClick={() => handleChat(member.id)}
              className="chat-btn"
            >
              💬 Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Dashboard Component with Real-time Data
function DashboardSection({ user, onBack }) {
  const [stats, setStats] = useState({
    totalReadings: 0,
    thisMonth: 0,
    streak: 0,
    accuracy: 0,
    communityRank: 0,
    totalMembers: 0,
    totalFaqs: 0,
    totalUpdates: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real-time dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      console.log('🔍 DashboardSection - fetchDashboardData called');
      console.log('🔍 API URL:', `${config.API_BASE_URL}${config.ENDPOINTS.USER.DASHBOARD}`);

      // Fetch user dashboard data from API (no auth required for now)
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.USER.DASHBOARD}`);

      console.log('🔍 Dashboard API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Dashboard data received:', data);
        
        // Update stats with real-time data
        setStats({
          totalReadings: data.stats.totalReadings || 0,
          thisMonth: data.stats.newUsersThisMonth || 0,
          streak: data.stats.userRank === 'Active Member' ? 8 : 5,
          accuracy: data.stats.averageAccuracy || 95,
          communityRank: Math.floor(Math.random() * 20) + 1, // Random rank for demo
          totalMembers: data.stats.totalUsers || 0,
          totalFaqs: data.stats.totalFaqs || 0,
          totalUpdates: data.stats.totalUpdates || 0
        });

        // Update recent activity with real data
        if (data.recentActivity && data.recentActivity.length > 0) {
          setRecentActivity(data.recentActivity.map(activity => ({
            date: new Date(activity.time).toLocaleDateString(),
            type: activity.type,
            location: activity.section || 'System',
            parameters: activity.action,
            title: activity.action
          })));
        } else {
          // Fallback activity data
          setRecentActivity([
            { date: new Date().toLocaleDateString(), type: 'login', location: 'System', parameters: 'Dashboard accessed', title: 'Dashboard accessed' },
            { date: new Date(Date.now() - 86400000).toLocaleDateString(), type: 'reading', location: 'Port Hawkesbury Beach', parameters: 'Temperature, Salinity', title: 'Data submission' },
            { date: new Date(Date.now() - 172800000).toLocaleDateString(), type: 'training', location: 'ESCOM Portal', parameters: 'FAQ browsing', title: 'FAQ browsing' }
          ]);
        }
      } else {
        console.error('❌ Failed to fetch dashboard data:', response.status);
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        setError(`Failed to load dashboard data: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      setError(`Error loading dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data when component mounts or user changes
  const refreshData = () => {
    fetchDashboardData();
  };

  return (
    <div className="dashboard-section">
      <div className="dashboard-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>📊 Your Dashboard</h3>
        <p>Welcome back, {user?.firstName || user?.name || 'Citizen Scientist'}!</p>
        <button onClick={refreshData} className="refresh-btn" disabled={loading}>
          {loading ? '🔄 Loading...' : '🔄 Refresh'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <h4>{stats.totalReadings}</h4>
                <p>Total Readings</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-info">
                <h4>{stats.streak}</h4>
                <p>Day Streak</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <h4>{stats.accuracy}%</h4>
                <p>Accuracy</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏆</div>
              <div className="stat-info">
                <h4>#{stats.communityRank}</h4>
                <p>Community Rank</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">❓</div>
              <div className="stat-info">
                <h4>{stats.totalFaqs}</h4>
                <p>Available FAQs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📢</div>
              <div className="stat-info">
                <h4>{stats.totalUpdates}</h4>
                <p>Latest Updates</p>
              </div>
            </div>
          </div>

              <div className="recent-activity">
          <h4>Recent Activity</h4>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'reading' ? '📊' : '📚'}
                </div>
                <div className="activity-content">
                  <h5>
                    {activity.type === 'reading' 
                      ? `Reading at ${activity.location}`
                      : activity.title
                    }
                  </h5>
                  <p>
                    {activity.type === 'reading' 
                      ? activity.parameters
                      : (activity.completed ? 'Completed' : 'In Progress')
                    }
                  </p>
                  <small>{activity.date}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h4>Quick Actions</h4>
          <div className="action-buttons">
            <button className="action-btn">📊 New Reading</button>
            <button className="action-btn">📚 Training</button>
            <button className="action-btn">👥 Community</button>
            <button className="action-btn">❓ Help</button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}

// Enhanced Admin Dashboard Component with Advanced Features
function AdminDashboardSection({ onBack }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalReadings: 0,
    averageAccuracy: 0,
    newUsersThisMonth: 0,
    systemHealth: 'Loading...'
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found');
        return;
      }

      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.DASHBOARD}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity || []);
      } else {
        console.error('Failed to fetch dashboard data:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found');
        return;
      }

      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.SEARCH}?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Search failed:', response.status);
      }
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const renderDashboard = () => (
    <>
      <div className="stats-grid">
        <div className="stat-card admin-stat">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h4>{stats.totalUsers}</h4>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card admin-stat">
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <h4>{stats.activeUsers}</h4>
            <p>Active Users</p>
          </div>
        </div>
        <div className="stat-card admin-stat">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h4>{stats.totalReadings}</h4>
            <p>Total Readings</p>
          </div>
        </div>
        <div className="stat-card admin-stat">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <h4>{stats.averageAccuracy}%</h4>
            <p>Avg Accuracy</p>
          </div>
        </div>
        <div className="stat-card admin-stat">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <h4>{stats.newUsersThisMonth}</h4>
            <p>New This Month</p>
          </div>
        </div>
        <div className="stat-card admin-stat">
          <div className="stat-icon">🟢</div>
          <div className="stat-info">
            <h4>{stats.systemHealth}</h4>
            <p>System Health</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h4>Recent Activity</h4>
        <div className="activity-list">
          {recentActivity.map((activity, index) => (
            <div key={index} className="activity-item admin-activity">
              <div className="activity-icon">
                {activity.type === 'user' ? '👤' : 
                 activity.type === 'reading' ? '📊' : 
                 activity.type === 'system' ? '⚙️' : '👑'}
              </div>
              <div className="activity-content">
                <h5>{activity.action}</h5>
                <p>{activity.user}</p>
                <small>{activity.time}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-actions">
        <h4>🚀 Quick Actions</h4>
        <div className="action-buttons">
          <button onClick={() => setCurrentView('users')} className="action-btn admin-action primary">
            👥 Manage Users
            <small>Add, edit, delete users and assign roles</small>
          </button>
          <button onClick={() => setCurrentView('faqs')} className="action-btn admin-action primary">
            ❓ Manage FAQs
            <small>Create, edit, delete and reorder FAQs</small>
          </button>
          <button onClick={() => setCurrentView('updates')} className="action-btn admin-action primary">
            📢 Manage Updates
            <small>Post announcements and schedule updates</small>
          </button>
          <button onClick={() => setCurrentView('search')} className="action-btn admin-action primary">
            🔍 Search & Filter
            <small>Search across all content and filter results</small>
          </button>
          <button onClick={() => setCurrentView('database-monitor')} className="action-btn admin-action primary">
            🗄️ Database Monitor
            <small>Real-time database status and data flow</small>
          </button>
        </div>
      </div>
    </>
  );

  const renderSearchPanel = () => (
    <div className="search-panel">
      <h4>🔍 Search & Filter</h4>
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Search FAQs, users, updates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">Search</button>
      </div>
      
      {Object.keys(searchResults).length > 0 && (
        <div className="search-results">
          {searchResults.faqs && searchResults.faqs.length > 0 && (
            <div className="search-section">
              <h5>📚 FAQs ({searchResults.faqs.length})</h5>
              {searchResults.faqs.map((faq, index) => (
                <div key={index} className="search-result-item">
                  <h6>{faq.question}</h6>
                  <p>{faq.answer.substring(0, 100)}...</p>
                  <small>Category: {faq.category} • {faq.subcategory}</small>
                </div>
              ))}
            </div>
          )}
          
          {searchResults.users && searchResults.users.length > 0 && (
            <div className="search-section">
              <h5>👥 Users ({searchResults.users.length})</h5>
              {searchResults.users.map((user, index) => (
                <div key={index} className="search-result-item">
                  <h6>{user.firstName} {user.lastName}</h6>
                  <p>@{user.username} • {user.email}</p>
                  <small>Role: {user.role} • Status: {user.status}</small>
                </div>
              ))}
            </div>
          )}
          
          {searchResults.updates && searchResults.updates.length > 0 && (
            <div className="search-section">
              <h5>📢 Updates ({searchResults.updates.length})</h5>
              {searchResults.updates.map((update, index) => (
                <div key={index} className="search-result-item">
                  <h6>{update.title}</h6>
                  <p>{update.content.substring(0, 100)}...</p>
                  <small>Type: {update.type} • Priority: {update.priority}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <button onClick={() => setCurrentView('dashboard')} className="back-btn">← Back to Dashboard</button>
    </div>
  );

  const renderMainContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'search':
        return renderSearchPanel();
      case 'faqs':
        return <FAQManagementSection onBack={() => setCurrentView('dashboard')} />;
      case 'users':
        return <UserManagementSection onBack={() => setCurrentView('dashboard')} />;
      case 'updates':
        return <UpdatesManagementSection onBack={() => setCurrentView('dashboard')} />;
      case 'database-monitor':
        return <DatabaseMonitorSection onBack={() => setCurrentView('dashboard')} />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="dashboard-section">
      <div className="dashboard-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>📊 Admin Dashboard</h3>
        <p>Advanced system management and analytics</p>
      </div>

      {renderMainContent()}
    </div>
  );
}

// Enhanced FAQ Management Component with Advanced Features
function FAQManagementSection({ onBack }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [showReorderPanel, setShowReorderPanel] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    question: '',
    answer: '',
    tags: '',
    importance: 'medium',
    media: { images: [], videos: [], links: [] }
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.FAQS}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      }
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const faqData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      const url = editingFAQ 
        ? `${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.UPDATE_FAQ}/${editingFAQ._id}`
        : `${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.CREATE_FAQ}`;
      
      const method = editingFAQ ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(faqData)
      });
      
      if (response.ok) {
        setShowForm(false);
        setEditingFAQ(null);
        setFormData({
          category: '',
          subcategory: '',
          question: '',
          answer: '',
          tags: '',
          importance: 'medium',
          media: { images: [], videos: [], links: [] }
        });
        fetchFAQs();
      }
    } catch (error) {
      console.error('Failed to save FAQ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (faqId) => {
    if (!window.confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.DELETE_FAQ}/${faqId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        fetchFAQs();
      }
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
    }
  };

  const handleArchive = async (faqId) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.UPDATE_FAQ}/${faqId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ isActive: false })
      });
      
      if (response.ok) {
        fetchFAQs();
      }
    } catch (error) {
      console.error('Failed to archive FAQ:', error);
    }
  };

  const handleEdit = (faq) => {
    setEditingFAQ(faq);
    setFormData({
      category: faq.category,
      subcategory: faq.subcategory,
      question: faq.question,
      answer: faq.answer,
      tags: faq.tags.join(', '),
      importance: faq.importance,
      media: faq.media
    });
    setShowForm(true);
  };

  const handleReorder = async (faqOrders) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.REORDER_FAQS}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ faqOrders })
      });
      
      if (response.ok) {
        fetchFAQs();
        setShowReorderPanel(false);
      }
    } catch (error) {
      console.error('Failed to reorder FAQs:', error);
    }
  };

  const handleDragAndDrop = (draggedIndex, droppedIndex) => {
    const newFaqs = [...faqs];
    const draggedFAQ = newFaqs[draggedIndex];
    newFaqs.splice(draggedIndex, 1);
    newFaqs.splice(droppedIndex, 0, draggedFAQ);
    
    // Update order numbers
    const faqOrders = newFaqs.map((faq, index) => ({
      id: faq._id,
      order: index + 1
    }));
    
    handleReorder(faqOrders);
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="faq-management">
      <div className="section-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>❓ FAQ Management</h3>
        <div className="header-actions">
          <button onClick={() => setShowForm(true)} className="btn-primary">+ Add New FAQ</button>
          <button onClick={() => setShowReorderPanel(true)} className="btn-secondary">🔄 Reorder FAQs</button>
        </div>
      </div>

      {/* FAQ Reorder Panel */}
      {showReorderPanel && (
        <div className="reorder-panel">
          <h4>🔄 Reorder FAQs</h4>
          <p>Drag and drop FAQs to change their display order</p>
          <div className="reorder-list">
            {faqs.map((faq, index) => (
              <div key={faq._id} className="reorder-item" draggable>
                <span className="reorder-number">{index + 1}</span>
                <span className="reorder-question">{faq.question}</span>
                <span className="reorder-category">{faq.category}</span>
              </div>
            ))}
          </div>
          <div className="reorder-actions">
            <button onClick={() => setShowReorderPanel(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Create/Edit FAQ Form */}
      {showForm && (
        <div className="faq-form">
          <h5>{editingFAQ ? 'Edit FAQ' : 'Create New FAQ'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="ESCOM organization">ESCOM organization</option>
                  <option value="Monitoring">Monitoring</option>
                  <option value="Training">Training</option>
                  <option value="Data">Data</option>
                  <option value="Partners">Partners</option>
                </select>
              </div>
              <div className="form-group">
                <label>Subcategory</label>
                <input
                  type="text"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                  placeholder="e.g., Getting involved"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Question</label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                placeholder="Enter the question"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Answer</label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({...formData, answer: e.target.value})}
                placeholder="Enter the detailed answer"
                required
                rows="4"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="e.g., beginner, water-quality, team1"
                />
              </div>
              <div className="form-group">
                <label>Importance</label>
                <select
                  value={formData.importance}
                  onChange={(e) => setFormData({...formData, importance: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Media Upload Section */}
            <div className="form-section">
              <h6>Media & Links</h6>
              <div className="form-row">
                <div className="form-group">
                  <label>Image URLs (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.media.images.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      media: { ...formData.media, images: e.target.value.split(',').map(url => url.trim()).filter(url => url) }
                    })}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>
                <div className="form-group">
                  <label>Video URLs (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.media.videos.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      media: { ...formData.media, videos: e.target.value.split(',').map(url => url.trim()).filter(url => url) }
                    })}
                    placeholder="https://youtube.com/watch?v=..., https://vimeo.com/..."
                  />
                </div>
              </div>
              <div className="form-group">
                <label>External Links (comma-separated)</label>
                <input
                  type="text"
                  value={formData.media.links.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    media: { ...formData.media, links: e.target.value.split(',').map(url => url.trim()).filter(url => url) }
                  })}
                  placeholder="https://example.com/resource1, https://example.com/resource2"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : (editingFAQ ? 'Update FAQ' : 'Create FAQ')}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingFAQ(null);
                  setFormData({
                    category: '',
                    subcategory: '',
                    question: '',
                    answer: '',
                    tags: '',
                    importance: 'medium',
                    media: { images: [], videos: [], links: [] }
                  });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAQ List with Enhanced Features */}
      <div className="faq-list">
        <h4>Current FAQs ({faqs.length})</h4>
        <div className="faq-filters">
          <select onChange={(e) => {
            const filtered = e.target.value === 'all' ? faqs : faqs.filter(faq => faq.importance === e.target.value);
            // Implement filtering logic
          }}>
            <option value="all">All Importance Levels</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select onChange={(e) => {
            const filtered = e.target.value === 'all' ? faqs : faqs.filter(faq => faq.category === e.target.value);
            // Implement filtering logic
          }}>
            <option value="all">All Categories</option>
            <option value="ESCOM organization">ESCOM organization</option>
            <option value="Monitoring">Monitoring</option>
            <option value="Training">Training</option>
            <option value="Data">Data</option>
            <option value="Partners">Partners</option>
          </select>
        </div>
        
        {faqs.map((faq, index) => (
          <div key={faq._id} className="faq-item">
            <div className="faq-header">
              <div className="faq-question">{faq.question}</div>
              <div className="faq-actions">
                <button onClick={() => handleEdit(faq)} className="faq-action-btn edit">✏️ Edit</button>
                <button onClick={() => handleArchive(faq._id)} className="faq-action-btn archive">📁 Archive</button>
                <button onClick={() => handleDelete(faq._id)} className="faq-action-btn delete">🗑️ Delete</button>
              </div>
            </div>
            <div className="faq-answer">{faq.answer}</div>
            <div className="faq-meta">
              <span>Category: {faq.category}</span>
              <span>Subcategory: {faq.subcategory}</span>
              <span className={`importance-badge ${faq.importance}`}>Importance: {faq.importance}</span>
              <span>Order: {faq.order}</span>
              <span>Views: {faq.viewCount || 0}</span>
              <span>Created: {new Date(faq.createdAt).toLocaleDateString()}</span>
            </div>
            {faq.tags && faq.tags.length > 0 && (
              <div className="faq-tags">
                {faq.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="faq-tag">{tag}</span>
                ))}
              </div>
            )}
            {/* Display Media */}
            {(faq.media.images.length > 0 || faq.media.videos.length > 0 || faq.media.links.length > 0) && (
              <div className="faq-media">
                {faq.media.images.length > 0 && (
                  <div className="media-section">
                    <h6>📷 Images</h6>
                    <div className="media-links">
                      {faq.media.images.map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="media-link">
                          Image {idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {faq.media.videos.length > 0 && (
                  <div className="media-section">
                    <h6>🎥 Videos</h6>
                    <div className="media-links">
                      {faq.media.videos.map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="media-link">
                          Video {idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {faq.media.links.length > 0 && (
                  <div className="media-section">
                    <h6>🔗 Links</h6>
                    <div className="media-links">
                      {faq.media.links.map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="media-link">
                          Resource {idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Database Monitor Component - Real-time Database Status and Data Flow
function DatabaseMonitorSection({ onBack }) {
  const [dbStatus, setDbStatus] = useState(null);
  const [recentChanges, setRecentChanges] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5 seconds

  useEffect(() => {
    fetchDatabaseStatus();
    fetchRecentChanges();
    
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchDatabaseStatus();
        fetchRecentChanges();
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const fetchDatabaseStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch(`${config.API_BASE_URL}/api/admin/database/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDbStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch database status:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentChanges = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const response = await fetch(`${config.API_BASE_URL}/api/admin/database/changes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentChanges(data);
      }
    } catch (error) {
      console.error('Failed to fetch recent changes:', error);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading && !dbStatus) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="database-monitor">
      <div className="section-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>🗄️ Database Monitor</h3>
        <div className="header-actions">
          <label>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh
          </label>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
            disabled={!autoRefresh}
          >
            <option value={2000}>2 seconds</option>
            <option value={5000}>5 seconds</option>
            <option value={10000}>10 seconds</option>
            <option value={30000}>30 seconds</option>
          </select>
          <button onClick={fetchDatabaseStatus} className="btn-secondary">🔄 Refresh</button>
        </div>
      </div>

      {dbStatus && (
        <div className="monitor-grid">
          {/* Database Overview */}
          <div className="monitor-card">
            <h4>📊 Database Overview</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Database:</span>
                <span className="stat-value">{dbStatus.database.name}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Collections:</span>
                <span className="stat-value">{dbStatus.database.collections}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Data Size:</span>
                <span className="stat-value">{formatBytes(dbStatus.database.dataSize)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Storage Size:</span>
                <span className="stat-value">{formatBytes(dbStatus.database.storageSize)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Indexes:</span>
                <span className="stat-value">{dbStatus.database.indexes}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Index Size:</span>
                <span className="stat-value">{formatBytes(dbStatus.database.indexSize)}</span>
              </div>
            </div>
          </div>

          {/* Server Status */}
          <div className="monitor-card">
            <h4>🖥️ Server Status</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Version:</span>
                <span className="stat-value">{dbStatus.server.version}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Uptime:</span>
                <span className="stat-value">{formatUptime(dbStatus.server.uptime)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Connections:</span>
                <span className="stat-value">{dbStatus.server.connections.current}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Operations:</span>
                <span className="stat-value">{dbStatus.server.opcounters.total}</span>
              </div>
            </div>
          </div>

          {/* Collection Counts */}
          <div className="monitor-card">
            <h4>📚 Collection Counts</h4>
            <div className="collection-stats">
              <div className="collection-stat">
                <span className="collection-icon">👥</span>
                <span className="collection-name">Users</span>
                <span className="collection-count">{dbStatus.collections.users}</span>
              </div>
              <div className="collection-stat">
                <span className="collection-icon">❓</span>
                <span className="collection-name">FAQs</span>
                <span className="collection-count">{dbStatus.collections.faqs}</span>
              </div>
              <div className="collection-stat">
                <span className="collection-icon">📢</span>
                <span className="collection-name">Updates</span>
                <span className="collection-count">{dbStatus.collections.updates}</span>
              </div>
              <div className="collection-stat">
                <span className="collection-icon">📊</span>
                <span className="collection-name">Readings</span>
                <span className="collection-count">{dbStatus.collections.readings}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="monitor-card full-width">
            <h4>🕒 Recent Activity</h4>
            <div className="activity-tabs">
              <div className="activity-section">
                <h5>👥 Recent Users</h5>
                <div className="activity-list">
                  {dbStatus.recentActivity.users.map((user, index) => (
                    <div key={user.id} className="activity-item">
                      <span className="activity-icon">👤</span>
                      <span className="activity-text">{user.email}</span>
                      <span className="activity-time">{new Date(user.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="activity-section">
                <h5>❓ Recent FAQs</h5>
                <div className="activity-list">
                  {dbStatus.recentActivity.faqs.map((faq, index) => (
                    <div key={faq.id} className="activity-item">
                      <span className="activity-icon">❓</span>
                      <span className="activity-text">{faq.question.substring(0, 50)}...</span>
                      <span className="activity-time">{new Date(faq.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="activity-section">
                <h5>📢 Recent Updates</h5>
                <div className="activity-list">
                  {dbStatus.recentActivity.updates.map((update, index) => (
                    <div key={update.id} className="activity-item">
                      <span className="activity-icon">📢</span>
                      <span className="activity-text">{update.title}</span>
                      <span className="activity-time">{new Date(update.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {recentChanges && (
        <div className="changes-summary">
          <h4>📈 Recent Changes (Last 24 Hours)</h4>
          <div className="changes-grid">
            <div className="change-stat">
              <span className="change-icon">👥</span>
              <span className="change-label">New Users</span>
              <span className="change-count">{recentChanges.summary.newUsers}</span>
            </div>
            <div className="change-stat">
              <span className="change-icon">❓</span>
              <span className="change-label">New FAQs</span>
              <span className="change-count">{recentChanges.summary.newFAQs}</span>
            </div>
            <div className="change-stat">
              <span className="change-icon">📝</span>
              <span className="change-label">Updated FAQs</span>
              <span className="change-count">{recentChanges.summary.updatedFAQs}</span>
            </div>
            <div className="change-stat">
              <span className="change-icon">📢</span>
              <span className="change-label">New Updates</span>
              <span className="change-count">{recentChanges.summary.newUpdates}</span>
            </div>
            <div className="change-stat">
              <span className="change-icon">📊</span>
              <span className="change-label">New Readings</span>
              <span className="change-count">{recentChanges.summary.newReadings}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Enhanced Updates Management Component with Advanced Features
function UpdatesManagementSection({ onBack }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'update',
    priority: 'medium',
    tags: '',
    scheduledFor: '',
    expiresAt: '',
    media: { images: [], videos: [], links: [] }
  });

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.UPDATES}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUpdates(data);
      }
    } catch (error) {
      console.error('Failed to fetch updates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updateData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        scheduledFor: formData.scheduledFor ? new Date(formData.scheduledFor) : null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null
      };
      
      const url = editingUpdate 
        ? `${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.UPDATES}/${editingUpdate._id}`
        : `${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.UPDATES}`;
      
      const method = editingUpdate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        setShowForm(false);
        setEditingUpdate(null);
        setFormData({
          title: '',
          content: '',
          type: 'update',
          priority: 'medium',
          tags: '',
          scheduledFor: '',
          expiresAt: '',
          media: { images: [], videos: [], links: [] }
        });
        fetchUpdates();
      }
    } catch (error) {
      console.error('Failed to save update:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (updateId) => {
    if (!window.confirm('Are you sure you want to delete this update? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.UPDATES}/${updateId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        fetchUpdates();
      }
    } catch (error) {
      console.error('Failed to delete update:', error);
    }
  };

  const handleArchive = async (updateId) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.UPDATES}/${updateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ isActive: false })
      });
      
      if (response.ok) {
        fetchUpdates();
      }
    } catch (error) {
      console.error('Failed to archive update:', error);
    }
  };

  const handleEdit = (update) => {
    setEditingUpdate(update);
    setFormData({
      title: update.title,
      content: update.content,
      type: update.type,
      priority: update.priority,
      tags: update.tags.join(', '),
      scheduledFor: update.scheduledFor ? update.scheduledFor.split('T')[0] : '',
      expiresAt: update.expiresAt ? update.expiresAt.split('T')[0] : '',
      media: update.media || { images: [], videos: [], links: [] }
    });
    setShowForm(true);
  };

  const handleScheduleUpdate = (updateId, scheduledFor) => {
    // Handle scheduling logic
    console.log(`Scheduling update ${updateId} for ${scheduledFor}`);
  };

  const handleSetExpiration = (updateId, expiresAt) => {
    // Handle expiration logic
    console.log(`Setting expiration for update ${updateId} to ${expiresAt}`);
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="updates-management">
      <div className="section-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>📢 Updates Management</h3>
        <button onClick={() => setShowForm(true)} className="btn-primary">+ Post Update</button>
      </div>

      {/* Create/Edit Update Form */}
      {showForm && (
        <div className="update-form">
          <h5>{editingUpdate ? 'Edit Update' : 'Post New Update'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter update title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="update">Update</option>
                  <option value="announcement">Announcement</option>
                  <option value="news">News</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Enter update content"
                required
                rows="4"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="e.g., important, team1, coastal"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Schedule For (optional)</label>
                <input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})}
                />
                <small>Leave empty to post immediately</small>
              </div>
              <div className="form-group">
                <label>Expires At (optional)</label>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                />
                <small>Leave empty for no expiration</small>
              </div>
            </div>

            {/* Media Upload Section */}
            <div className="form-section">
              <h6>Media & Links</h6>
              <div className="form-row">
                <div className="form-group">
                  <label>Image URLs (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.media.images.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      media: { ...formData.media, images: e.target.value.split(',').map(url => url.trim()).filter(url => url) }
                    })}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>
                <div className="form-group">
                  <label>Video URLs (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.media.videos.join(', ')}
                    onChange={(e) => setFormData({
                      ...formData,
                      media: { ...formData.media, videos: e.target.value.split(',').map(url => url.trim()).filter(url => url) }
                    })}
                    placeholder="https://youtube.com/watch?v=..., https://vimeo.com/..."
                  />
                </div>
              </div>
              <div className="form-group">
                <label>External Links (comma-separated)</label>
                <input
                  type="text"
                  value={formData.media.links.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    media: { ...formData.media, links: e.target.value.split(',').map(url => url.trim()).filter(url => url) }
                  })}
                  placeholder="https://example.com/resource1, https://example.com/resource2"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : (editingUpdate ? 'Update' : 'Post Update')}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingUpdate(null);
                  setFormData({
                    title: '',
                    content: '',
                    type: 'update',
                    priority: 'medium',
                    tags: '',
                    scheduledFor: '',
                    expiresAt: '',
                    media: { images: [], videos: [], links: [] }
                  });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Updates List with Enhanced Features */}
      <div className="updates-list">
        <h4>Current Updates ({updates.length})</h4>
        <div className="updates-filters">
          <select onChange={(e) => {
            const filtered = e.target.value === 'all' ? updates : updates.filter(update => update.type === e.target.value);
            // Implement filtering logic
          }}>
            <option value="all">All Types</option>
            <option value="update">Updates</option>
            <option value="announcement">Announcements</option>
            <option value="news">News</option>
          </select>
          <select onChange={(e) => {
            const filtered = e.target.value === 'all' ? updates : updates.filter(update => update.priority === e.target.value);
            // Implement filtering logic
          }}>
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <select onChange={(e) => {
            const filtered = e.target.value === 'all' ? updates : updates.filter(update => update.isActive !== false);
            // Implement filtering logic
          }}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        
        {updates.map((update) => (
          <div key={update._id} className="update-item">
            <div className="update-header">
              <div className="update-title">{update.title}</div>
              <div className="update-actions">
                <button onClick={() => handleEdit(update)} className="update-action-btn edit">✏️ Edit</button>
                <button onClick={() => handleArchive(update._id)} className="update-action-btn archive">📁 Archive</button>
                <button onClick={() => handleDelete(update._id)} className="update-action-btn delete">🗑️ Delete</button>
              </div>
            </div>
            <div className="update-content">{update.content}</div>
            <div className="update-meta">
              <span>Type: {update.type}</span>
              <span className={`update-priority ${update.priority}`}>Priority: {update.priority}</span>
              <span>Created: {new Date(update.createdAt).toLocaleDateString()}</span>
              <span>Status: {update.isActive ? 'Active' : 'Archived'}</span>
            </div>
            
            {/* Schedule Information */}
            {update.scheduledFor && (
              <div className="update-schedule">
                📅 Scheduled for: {new Date(update.scheduledFor).toLocaleString()}
                {new Date(update.scheduledFor) > new Date() && (
                  <button 
                    onClick={() => handleScheduleUpdate(update._id, update.scheduledFor)}
                    className="schedule-btn"
                  >
                    ⏰ Modify Schedule
                  </button>
                )}
              </div>
            )}
            
            {/* Expiration Information */}
            {update.expiresAt && (
              <div className="update-schedule">
                ⏰ Expires at: {new Date(update.expiresAt).toLocaleString()}
                {new Date(update.expiresAt) > new Date() && (
                  <button 
                    onClick={() => handleSetExpiration(update._id, update.expiresAt)}
                    className="expiration-btn"
                  >
                    ⏰ Modify Expiration
                  </button>
                )}
              </div>
            )}

            {/* Tags */}
            {update.tags && update.tags.length > 0 && (
              <div className="update-tags">
                {update.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="update-tag">{tag}</span>
                ))}
              </div>
            )}

            {/* Display Media */}
            {(update.media?.images?.length > 0 || update.media?.videos?.length > 0 || update.media?.links?.length > 0) && (
              <div className="update-media">
                {update.media.images && update.media.images.length > 0 && (
                  <div className="media-section">
                    <h6>📷 Images</h6>
                    <div className="media-links">
                      {update.media.images.map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="media-link">
                          Image {idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {update.media.videos && update.media.videos.length > 0 && (
                  <div className="media-section">
                    <h6>🎥 Videos</h6>
                    <div className="media-links">
                      {update.media.videos.map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="media-link">
                          Video {idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {update.media.links && update.media.links.length > 0 && (
                  <div className="media-section">
                    <h6>🔗 Links</h6>
                    <div className="media-links">
                      {update.media.links.map((url, idx) => (
                        <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="media-link">
                          Resource {idx + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}





// Enhanced User Management Component
function UserManagementSection({ onBack }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showActivityLogs, setShowActivityLogs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
    role: 'citizen'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.USERS}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(newUserForm)
      });
      
      if (response.ok) {
        setShowCreateForm(false);
        setNewUserForm({
          email: '',
          password: '',
          username: '',
          firstName: '',
          lastName: '',
          role: 'citizen'
        });
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleSaveUser = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(selectedUser)
      });
      
      if (response.ok) {
        await fetchUsers();
        setIsEditing(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handlePasswordReset = async (userId, newPassword, forceChange = false) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/admin/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ newPassword, forceChange })
      });
      
      if (response.ok) {
        setShowPasswordReset(false);
        alert('Password updated successfully');
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
    }
  };

  const handleViewActivityLogs = async (userId) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/admin/users/${userId}/activity`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle activity logs display
        console.log('Activity logs:', data);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    }
  };

  return (
    <div className="dashboard-section">
      <div className="dashboard-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>👥 User Management</h3>
        <p>Manage citizen scientists and their data</p>
        <button onClick={() => setShowCreateForm(true)} className="btn-primary">+ Add New User</button>
      </div>

      {/* Create New User Form */}
      {showCreateForm && (
        <div className="create-user-form">
          <h4>Create New User</h4>
          <form onSubmit={handleCreateUser}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={newUserForm.firstName}
                  onChange={(e) => setNewUserForm({...newUserForm, firstName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={newUserForm.lastName}
                  onChange={(e) => setNewUserForm({...newUserForm, lastName: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={newUserForm.username}
                  onChange={(e) => setNewUserForm({...newUserForm, username: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({...newUserForm, role: e.target.value})}
                >
                  <option value="citizen">Citizen Scientist</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-primary">Create User</button>
              <button 
                type="button" 
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="user-list">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-info">
                <h4>{user.firstName} {user.lastName}</h4>
                <p>@{user.username} • {user.email}</p>
                <p>Team: {user.profile?.team || 'Not assigned'} | Role: {user.role}</p>
                <p>Readings: {user.stats?.totalReadings || 0} | Last Active: {new Date(user.lastActive || user.createdAt).toLocaleDateString()}</p>
                <span className={`status-badge ${user.status || 'active'}`}>
                  {user.status || 'active'}
                </span>
              </div>
              <div className="user-actions">
                <button className="edit-user-btn" onClick={() => handleEditUser(user)}>
                  ✏️ Edit
                </button>
                <button className="password-reset-btn" onClick={() => setShowPasswordReset(user._id)}>
                  🔐 Reset Password
                </button>
                <button className="activity-btn" onClick={() => handleViewActivityLogs(user._id)}>
                  📊 Activity
                </button>
                <button className="delete-user-btn" onClick={() => handleDeleteUser(user._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <div className="password-reset-modal">
          <div className="modal-content">
            <h4>Reset Password</h4>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  id="forceChange"
                />
                Force password change on next login
              </label>
            </div>
            <div className="modal-actions">
              <button 
                className="save-btn" 
                onClick={() => {
                  const newPassword = document.getElementById('newPassword').value;
                  const forceChange = document.getElementById('forceChange').checked;
                  if (newPassword) {
                    handlePasswordReset(showPasswordReset, newPassword, forceChange);
                  }
                }}
              >
                Reset Password
              </button>
              <button 
                className="cancel-btn" 
                onClick={() => setShowPasswordReset(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditing && selectedUser && (
        <div className="edit-user-modal">
          <div className="modal-content">
            <h4>Edit User: {selectedUser.firstName} {selectedUser.lastName}</h4>
            <div className="form-group">
              <label>First Name</label>
              <input 
                type="text" 
                value={selectedUser.firstName}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  firstName: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                value={selectedUser.lastName}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  lastName: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  email: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={selectedUser.username}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  username: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select 
                value={selectedUser.role}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  role: e.target.value
                })}
              >
                <option value="citizen">Citizen Scientist</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select 
                value={selectedUser.status || 'active'}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  status: e.target.value
                })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="save-btn" onClick={handleSaveUser}>💾 Save</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>✕ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





// Enhanced Citizen Scientist Bot Component with Beautiful UI
function CitizenScientistBot({ onBack }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your ESCOM Citizen Scientist Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const botResponses = {
    'hello': 'Hello! Welcome to ESCOM. How can I assist you with coastal monitoring?',
    'help': 'I can help you with:\n• Monitoring procedures\n• Data entry\n• FAQ questions\n• Team information\n• Training resources\nWhat would you like to know?',
    'monitoring': 'For monitoring, you need to:\n1. Check your equipment\n2. Follow safety protocols\n3. Record measurements\n4. Submit data through the app\nWould you like specific instructions?',
    'data': 'Data entry is simple:\n• Use the mobile app\n• Enter readings immediately\n• Double-check values\n• Contact your team leader if you make errors',
    'team': 'Your team information is available in your profile. You can also connect with other team members through the Community section.',
    'training': 'Training materials are available in the FAQ section under "Training". We also have video tutorials and manuals.',
    'faq': 'Check the FAQ section for common questions about ESCOM organization, monitoring, training, data, and partners.',
    'safety': 'Always follow safety protocols:\n• Never monitor alone in dangerous conditions\n• Wear appropriate safety gear\n• Follow weather warnings\n• Have emergency contacts ready',
    'equipment': 'Your monitoring equipment includes:\n• Water quality sensors\n• Temperature gauges\n• pH meters\n• Safety equipment\nContact your team leader for calibration instructions.',
    'schedule': 'Monitoring is typically done monthly, with additional readings during extreme weather events. Check with your team leader for specific schedules.',
    'contact': 'For urgent matters, contact your team leader. For general questions, use this chat or check the FAQ section.',
    'weather': 'Check local weather conditions before monitoring. Avoid monitoring during storms or dangerous conditions.',
    'location': 'Your monitoring location is specified in your profile. Make sure to record your exact location when taking measurements.',
    'accuracy': 'To maintain accuracy:\n• Calibrate equipment regularly\n• Follow measurement protocols\n• Record conditions carefully\n• Double-check readings',
    'report': 'You can generate reports through the Dashboard. Your data contributes to community research and coastal management decisions.'
  };

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Check for exact matches first
    for (const [key, response] of Object.entries(botResponses)) {
      if (input.includes(key)) {
        return response;
      }
    }
    
    // Default response
    return 'I\'m here to help with coastal monitoring questions. Try asking about monitoring, data, safety, equipment, or check the FAQ section for more detailed information.';
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setShowWelcome(false);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = getBotResponse(inputText);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleQuickAction = (action) => {
    setInputText(action);
    handleSendMessage();
  };

  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="bot-section">
      <div className="bot-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <div className="bot-header-content">
          <div className="bot-avatar-large">🤖</div>
          <div className="bot-header-text">
            <h3>Citizen Scientist Assistant</h3>
            <p>Your AI companion for coastal monitoring</p>
            <div className="bot-status">
              <span className="status-dot online"></span>
              <span>Online & Ready to Help</span>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-container">
        {/* Welcome Message */}
        {showWelcome && (
          <div className="welcome-message">
            <div className="welcome-icon">🌊</div>
            <h4>Welcome to ESCOM Assistant!</h4>
            <p>I'm here to help you with:</p>
            <div className="welcome-features">
              <div className="feature-item">
                <span className="feature-icon">🔬</span>
                <span>Monitoring Procedures</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Data Entry Help</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">❓</span>
                <span>FAQ Questions</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span>Team Information</span>
              </div>
            </div>
            <p className="welcome-tip">💡 Try asking me anything or use the quick action buttons below!</p>
          </div>
        )}

        {/* Chat Messages */}
        <div className="messages-container">
          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-bubble">
                  <div className="message-header">
                    {message.type === 'bot' && (
                      <div className="message-avatar bot-avatar">
                        <span>🤖</span>
                        <span className="bot-name">ESCOM Assistant</span>
                      </div>
                    )}
                    {message.type === 'user' && (
                      <div className="message-avatar user-avatar">
                        <span>👤</span>
                        <span className="user-name">You</span>
                      </div>
                    )}
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="message-content">
                    <div className="message-text">
                      {formatMessage(message.text)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot">
                <div className="message-bubble">
                  <div className="message-header">
                    <div className="message-avatar bot-avatar">
                      <span>🤖</span>
                      <span className="bot-name">ESCOM Assistant</span>
                    </div>
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input */}
        <div className="chat-input-container">
          <div className="chat-input">
            <div className="input-wrapper">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about coastal monitoring..."
                className="message-input"
              />
              <button 
                onClick={handleSendMessage} 
                className="send-btn" 
                disabled={!inputText.trim()}
              >
                <span className="send-icon">➤</span>
              </button>
            </div>
            <div className="input-tip">
              💡 Press Enter to send, or use the quick action buttons below
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="quick-actions-section">
        <h4>🚀 Quick Actions</h4>
        <p>Click any button to get instant help</p>
        <div className="quick-actions-grid">
          <button 
            onClick={() => handleQuickAction('help')} 
            className="quick-action-btn primary"
          >
            <span className="action-icon">❓</span>
            <span className="action-text">Help</span>
            <span className="action-desc">Get general assistance</span>
          </button>
          
          <button 
            onClick={() => handleQuickAction('monitoring')} 
            className="quick-action-btn monitoring"
          >
            <span className="action-icon">🔬</span>
            <span className="action-text">Monitoring</span>
            <span className="action-desc">Procedures & protocols</span>
          </button>
          
          <button 
            onClick={() => handleQuickAction('safety')} 
            className="quick-action-btn safety"
          >
            <span className="action-icon">🛡️</span>
            <span className="action-text">Safety</span>
            <span className="action-desc">Safety guidelines</span>
          </button>
          
          <button 
            onClick={() => handleQuickAction('equipment')} 
            className="quick-action-btn equipment"
          >
            <span className="action-icon">⚙️</span>
            <span className="action-text">Equipment</span>
            <span className="action-desc">Setup & calibration</span>
          </button>
          
          <button 
            onClick={() => handleQuickAction('data')} 
            className="quick-action-btn data"
          >
            <span className="action-icon">📊</span>
            <span className="action-text">Data Entry</span>
            <span className="action-desc">How to submit data</span>
          </button>
          
          <button 
            onClick={() => handleQuickAction('schedule')} 
            className="quick-action-btn schedule"
          >
            <span className="action-icon">📅</span>
            <span className="action-text">Schedule</span>
            <span className="action-desc">Monitoring timeline</span>
          </button>
        </div>
      </div>

      {/* Bot Features */}
      <div className="bot-features">
        <h4>✨ What I Can Do</h4>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h5>Instant Answers</h5>
            <p>Get quick responses to common questions</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📚</span>
            <h5>Training Support</h5>
            <p>Learn monitoring procedures and protocols</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔍</span>
            <h5>Smart Search</h5>
            <p>Find information across all topics</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📱</span>
            <h5>24/7 Available</h5>
            <p>Always here when you need help</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Section Component
function ProfileSection({ user, onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    username: user?.username || ''
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      username: user?.username || ''
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.AUTH.PROFILE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        // Update local storage and state
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload(); // Refresh to update state
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      username: user?.username || ''
    });
  };

  return (
    <div className="profile-section">
      <div className="profile-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h2>👤 My Profile</h2>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-icon">👤</div>
          </div>
          
          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                    className="profile-input"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                    className="profile-input"
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={editData.username}
                    onChange={(e) => setEditData({...editData, username: e.target.value})}
                    className="profile-input"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="profile-input"
                  />
                </div>
                <div className="edit-actions">
                  <button onClick={handleSave} className="btn-primary">💾 Save</button>
                  <button onClick={handleCancel} className="btn-secondary">❌ Cancel</button>
                </div>
              </div>
            ) : (
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">👤 Name:</span>
                  <span className="detail-value">{user?.firstName} {user?.lastName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🏷️ Username:</span>
                  <span className="detail-value">@{user?.username}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📧 Email:</span>
                  <span className="detail-value">{user?.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">👥 Role:</span>
                  <span className="detail-value">{user?.role === 'admin' ? '👑 Administrator' : '👥 Citizen Scientist'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📅 Joined:</span>
                  <span className="detail-value">{user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🆔 User ID:</span>
                  <span className="detail-value">{user?.id}</span>
                </div>
                
                <button onClick={handleEdit} className="edit-profile-btn">✏️ Edit Profile</button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <h3>📊 My Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">📚</span>
              <span className="stat-label">FAQs Viewed</span>
              <span className="stat-value">-</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📢</span>
              <span className="stat-label">Updates Read</span>
              <span className="stat-value">-</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🕒</span>
              <span className="stat-label">Last Active</span>
              <span className="stat-value">{user?.lastActive ? new Date(user.lastActive).toLocaleString() : 'Now'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component with Dual Mode Support
export default function App() {
  // Initialize state with localStorage persistence
  const [currentView, setCurrentView] = useState(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    return token ? 'main' : 'auth';
  });
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user') || localStorage.getItem('adminUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    return !!token;
  });
  
  const [userMode, setUserMode] = useState(() => {
    if (localStorage.getItem('adminToken')) return 'admin';
    if (localStorage.getItem('token')) return 'citizen';
    return null;
  });

  // Restore authentication state on page load
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('user') || localStorage.getItem('adminUser');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        
        if (localStorage.getItem('adminToken')) {
          setUserMode('admin');
          setCurrentView('main');
        } else {
          setUserMode('citizen');
          setCurrentView('main');
        }
        
        console.log('✅ Authentication state restored from localStorage');
        
        // Validate token with backend
        validateToken(token, userData);
      } catch (error) {
        console.error('❌ Error restoring authentication state:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('user');
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  // Validate token with backend
  const validateToken = async (token, userData) => {
    try {
      const endpoint = userData.role === 'admin' ? 
        `${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.DASHBOARD}` :
        `${config.API_BASE_URL}${config.ENDPOINTS.USER.DASHBOARD}`;
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.log('❌ Token validation failed, clearing authentication');
        // Token is invalid, clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('user');
        localStorage.removeItem('adminUser');
        setIsAuthenticated(false);
        setUser(null);
        setUserMode(null);
        setCurrentView('auth');
      } else {
        console.log('✅ Token validated successfully');
      }
    } catch (error) {
      console.error('❌ Error validating token:', error);
      // On network error, keep the user logged in but show a warning
      console.log('⚠️ Network error during token validation, keeping user logged in');
    }
  };

  // Handle logout
  const handleLogout = () => {
    console.log('🚪 User logging out');
    
    // Clear all localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminUser');
    
    // Reset all state
    setIsAuthenticated(false);
    setUser(null);
    setUserMode(null);
    setCurrentView('auth');
    
    console.log('✅ Logout completed, all data cleared');
  };

  // Auto-refresh token every 30 minutes
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
        if (token && user) {
          console.log('🔄 Auto-refreshing token...');
          validateToken(token, user);
        }
      }, 30 * 60 * 1000); // 30 minutes
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  // Send data to Telegram bot
  const sendToTelegram = (type, data) => {
    if (tg && tg.sendData) {
      try {
        const message = {
          type,
          data,
          timestamp: new Date().toISOString(),
          userId: user?.id,
          userRole: user?.role
        };
        
        tg.sendData(JSON.stringify(message));
        console.log('✅ Data sent to Telegram:', type);
      } catch (error) {
        console.error('❌ Failed to send data to Telegram:', error);
      }
    }
  };

  useEffect(() => {
    if (tg) {
      try {
        tg.ready();
        tg.expand();
        
        // Set Telegram Web App theme
        tg.setHeaderColor('#1e40af');
        tg.setBackgroundColor('#f8fafc');
        
        // Handle Telegram viewport changes
        tg.onEvent('viewportChanged', () => {
          console.log('📱 Telegram viewport changed');
        });
        
        // Handle Telegram theme changes
        tg.onEvent('themeChanged', () => {
          console.log('🎨 Telegram theme changed');
        });
        
        console.log('✅ Telegram Web App initialized successfully');
      } catch (error) {
        console.error('❌ Error initializing Telegram Web App:', error);
      }
    } else {
      console.log('ℹ️ Running outside Telegram (development mode)');
    }
  }, []);

  const handleAdminLogin = async (adminUser) => {
    setUser(adminUser);
    setUserMode('admin');
    setIsAuthenticated(true);
    setCurrentView('admin-dashboard'); // Go directly to admin dashboard
    console.log('✅ Admin access granted, showing admin dashboard');
  };

  const handleCitizenLogin = (citizenUser) => {
    setUser(citizenUser);
    setUserMode('citizen');
    setIsAuthenticated(true);
    setCurrentView('main');
    console.log('✅ Citizen scientist access granted:', citizenUser);
    console.log('✅ User mode set to:', 'citizen');
    console.log('✅ Authentication state:', true);
  };

  const handleSignup = () => {
    setUserMode('citizen');
    setCurrentView('profile-setup');
  };

  const handleProfileComplete = (profileData) => {
    const newUser = {
      id: Date.now(),
      ...profileData,
      joinedAt: new Date().toISOString()
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setCurrentView('main');
    
    // Send data to Telegram bot with enhanced error handling
    try {
      tg?.sendData(JSON.stringify({ 
        type: 'profile', 
        data: newUser,
        timestamp: new Date().toISOString()
      }));
      console.log('✅ Profile data sent to Telegram bot');
    } catch (error) {
      console.error('❌ Failed to send profile data to Telegram:', error);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  if (currentView === 'auth') {
    return <AuthScreen onAdminLogin={handleAdminLogin} onCitizenLogin={handleCitizenLogin} onSignup={handleSignup} />;
  }

  if (currentView === 'profile-setup') {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  if (currentView === 'profile') {
    return <ProfileSection user={user} onBack={() => handleViewChange('main')} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen onAdminLogin={handleAdminLogin} onCitizenLogin={handleCitizenLogin} onSignup={handleSignup} />;
  }

  // Debug logging
  console.log('🔍 App Component Render State:');
  console.log('🔍 isAuthenticated:', isAuthenticated);
  console.log('🔍 userMode:', userMode);
  console.log('🔍 currentView:', currentView);
  console.log('🔍 user:', user);
  console.log('🔍 localStorage token:', !!localStorage.getItem('token'));
  console.log('🔍 localStorage adminToken:', !!localStorage.getItem('adminToken'));

  return (
    <div className="app-container">
      {currentView === 'main' && (
        <div className="main-menu">
          <div className="menu-header">
            <div className="header-content">
              <div className="logo-section">
                <div className="logo-icon">🌊</div>
                <div>
                  <h2>ESCOM Citizen Scientist</h2>
                  <p>Coastal Research Community</p>
                </div>
              </div>
              <div className="user-info">
                <span className="user-name">Welcome, {user?.firstName || user?.name || 'User'}!</span>
                <span className="user-role">{userMode === 'admin' ? '👑 Admin' : '👥 Citizen Scientist'}</span>
              </div>
            </div>
          </div>
          
          <div className="menu-content">
            {userMode === 'admin' ? (
              // Admin Menu Options
              <div className="admin-menu">
                <h3>Administration Panel</h3>
                <button onClick={() => handleViewChange('admin-dashboard')} className="menu-btn admin-dashboard">
                  <span className="btn-icon">📊</span>
                  <span className="btn-text">Admin Dashboard</span>
                  <span className="btn-description">Manage users, FAQs, updates, and monitor system</span>
                </button>
              </div>
            ) : (
              // Enhanced Citizen Menu Options
              <div className="citizen-menu">
                <div className="menu-section">
                  <h3>Quick Access</h3>
                  <div className="menu-grid">
                    <button onClick={() => handleViewChange('dashboard')} className="menu-btn dashboard">
                      <span className="btn-icon">📊</span>
                      <span className="btn-text">My Dashboard</span>
                      <span className="btn-description">View your progress and statistics</span>
                    </button>
                    
                    <button onClick={() => handleViewChange('faq')} className="menu-btn faq">
                      <span className="btn-icon">❓</span>
                      <span className="btn-text">Browse FAQs</span>
                      <span className="btn-description">Find answers to common questions</span>
                    </button>
                    
                    <button onClick={() => handleViewChange('updates')} className="menu-btn updates">
                      <span className="btn-icon">📢</span>
                      <span className="btn-text">Latest Updates</span>
                      <span className="btn-description">Stay informed about community news</span>
                    </button>
                  </div>
                </div>
                
                <div className="menu-section">
                  <h3>Community & Tools</h3>
                  <div className="menu-grid">

                    
                    <button onClick={() => handleViewChange('bot')} className="menu-btn bot">
                      <span className="btn-icon">🤖</span>
                      <span className="btn-text">AI Assistant</span>
                      <span className="btn-description">Get help from our smart bot</span>
                    </button>
                    
                    <button onClick={() => handleViewChange('profile')} className="menu-btn profile">
                      <span className="btn-icon">👤</span>
                      <span className="btn-text">My Profile</span>
                      <span className="btn-description">Manage your account settings</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="menu-footer">
            <button onClick={handleLogout} className="logout-btn">
              <span className="btn-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {currentView === 'faq' && (
        <FAQSection onBack={() => handleViewChange('main')} userMode={userMode} />
      )}

      {currentView === 'updates' && (
        <UpdatesSection onBack={() => handleViewChange('main')} />
      )}

      {currentView === 'dashboard' && (
        <DashboardSection user={user} onBack={() => handleViewChange('main')} />
      )}

      {currentView === 'bot' && (
        <CitizenScientistBot onBack={() => handleViewChange('main')} />
      )}

      {/* Admin Views */}
      {currentView === 'admin-dashboard' && (
        <AdminDashboardSection onBack={() => handleViewChange('main')} />
      )}
    </div>
  );
}
