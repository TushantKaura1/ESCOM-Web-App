import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

function UserDashboard({ user, onBack }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [faqs, setFaqs] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [readings, setReadings] = useState([]);
  const [newReading, setNewReading] = useState({
    temperature: '',
    salinity: '',
    ph: '',
    turbidity: '',
    location: '',
    notes: '',
    weather: 'sunny',
    timeOfDay: 'morning'
  });
  const [botHelper, setBotHelper] = useState({
    isOpen: false,
    messages: [],
    currentMessage: ''
  });
  // const [learningResources, setLearningResources] = useState([]);
  // const [communityPosts, setCommunityPosts] = useState([]);
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filterCategory, setFilterCategory] = useState('all');
  // const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    console.log('🌊 UserDashboard component mounted for user:', user);
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    // Load demo data for now
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
        createdAt: '2024-01-15'
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
        createdAt: '2024-01-10'
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
        status: 'published',
        createdAt: '2024-01-18',
        viewCount: 234
      }
    ]);

    setReadings([
      {
        id: 1,
        temperature: 18.5,
        salinity: 35.2,
        ph: 8.1,
        turbidity: 2.3,
        location: 'Beach Point A',
        notes: 'Clear water, good conditions',
        weather: 'sunny',
        timeOfDay: 'morning',
        timestamp: '2024-01-20T08:00:00Z',
        quality: 'excellent'
      },
      {
        id: 2,
        temperature: 19.2,
        salinity: 34.8,
        ph: 8.0,
        turbidity: 3.1,
        location: 'Beach Point B',
        notes: 'Slight cloudiness, normal readings',
        weather: 'partly-cloudy',
        timeOfDay: 'afternoon',
        timestamp: '2024-01-19T14:00:00Z',
        quality: 'good'
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

  const handleSubmitReading = (e) => {
    e.preventDefault();
    
    if (!newReading.temperature || !newReading.salinity || !newReading.ph || !newReading.turbidity) {
              console.log('Please fill in all required fields');
      return;
    }

    const reading = {
      id: Date.now(),
      ...newReading,
      timestamp: new Date().toISOString(),
      quality: calculateQuality(newReading),
      userId: user.id,
      userName: user.name
    };
    
    setReadings([reading, ...readings]);
    setNewReading({
      temperature: '',
      salinity: '',
      ph: '',
      turbidity: '',
      location: '',
      notes: '',
      weather: 'sunny',
      timeOfDay: 'morning'
    });
    
    console.log('✅ New reading submitted:', reading);
  };

  const calculateQuality = (reading) => {
    const temp = parseFloat(reading.temperature);
    const sal = parseFloat(reading.salinity);
    const ph = parseFloat(reading.ph);
    const turb = parseFloat(reading.turbidity);
    
    let score = 0;
    
    // Temperature quality (ideal range: 15-25°C)
    if (temp >= 15 && temp <= 25) score += 25;
    else if (temp >= 10 && temp <= 30) score += 15;
    else score += 5;
    
    // Salinity quality (ideal range: 30-40 ppt)
    if (sal >= 30 && sal <= 40) score += 25;
    else if (sal >= 25 && sal <= 45) score += 15;
    else score += 5;
    
    // pH quality (ideal range: 7.5-8.5)
    if (ph >= 7.5 && ph <= 8.5) score += 25;
    else if (ph >= 7.0 && ph <= 9.0) score += 15;
    else score += 5;
    
    // Turbidity quality (lower is better, ideal < 5 NTU)
    if (turb < 5) score += 25;
    else if (turb < 10) score += 15;
    else score += 5;
    
    if (score >= 90) return 'excellent';
    else if (score >= 70) return 'good';
    else if (score >= 50) return 'fair';
    else return 'poor';
  };

  const handleBotMessage = () => {
    if (!botHelper.currentMessage.trim()) return;
    
    const userMessage = botHelper.currentMessage;
    const botResponse = getBotResponse(userMessage);
    
    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    
    const botMessage = {
      id: Date.now() + 1,
      type: 'bot',
      content: botResponse,
      timestamp: new Date().toISOString()
    };
    
    setBotHelper({
      ...botHelper,
      messages: [...botHelper.messages, newMessage, botMessage],
      currentMessage: ''
    });
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('temperature') || lowerMessage.includes('temp')) {
      return 'Water temperature should be measured at a depth of 30cm below the surface. Ideal range is 15-25°C. Use a calibrated thermometer for accurate readings.';
    } else if (lowerMessage.includes('salinity') || lowerMessage.includes('salt')) {
      return 'Salinity measures the salt content in water. Use a refractometer or conductivity meter. Normal ocean salinity is 30-40 ppt (parts per thousand).';
    } else if (lowerMessage.includes('ph') || lowerMessage.includes('acidity')) {
      return 'pH measures water acidity. Use pH strips or a pH meter. Ocean water typically has a pH of 7.5-8.5. Calibrate your equipment regularly.';
    } else if (lowerMessage.includes('turbidity') || lowerMessage.includes('clarity')) {
      return 'Turbidity measures water clarity. Use a Secchi disk or turbidity meter. Lower values indicate clearer water. Aim for readings below 5 NTU.';
    } else if (lowerMessage.includes('calibrate') || lowerMessage.includes('calibration')) {
      return 'Calibrate your equipment monthly using the calibration kit provided. Follow the step-by-step guide in your training manual. Contact your team leader if you need help.';
    } else if (lowerMessage.includes('location') || lowerMessage.includes('where')) {
      return 'Choose consistent monitoring locations marked with GPS coordinates. Use permanent markers or landmarks for easy identification. Record exact coordinates in your data.';
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('conditions')) {
      return 'Record weather conditions during monitoring: temperature, wind speed, precipitation, and cloud cover. These factors can affect water quality readings.';
    } else if (lowerMessage.includes('frequency') || lowerMessage.includes('how often')) {
      return 'Submit data monthly, or more frequently during extreme weather events. Always submit within 24 hours of collection for best data quality.';
    } else {
      return 'I can help with monitoring questions about temperature, salinity, pH, turbidity, equipment calibration, locations, weather conditions, and data submission frequency. What would you like to know?';
    }
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

  const renderOverview = () => (
    <div className="user-overview">
      <div className="welcome-section">
        <h3>🌊 Welcome back, {user?.firstName || 'Citizen Scientist'}!</h3>
        <p>Ready to contribute to coastal monitoring today?</p>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <h4>Total Readings</h4>
          <div className="stat-value">{readings.length}</div>
          <div className="stat-label">This month</div>
        </div>
        <div className="stat-card">
          <h4>Accuracy</h4>
          <div className="stat-value">94%</div>
          <div className="stat-label">Data quality</div>
        </div>
        <div className="stat-card">
          <h4>Streak</h4>
          <div className="stat-value">5</div>
          <div className="stat-label">Days active</div>
        </div>
        <div className="stat-card">
          <h4>Team Rank</h4>
          <div className="stat-value">#3</div>
          <div className="stat-label">Team Alpha</div>
        </div>
      </div>

      <div className="quick-actions">
        <h4>Quick Actions</h4>
        <div className="action-buttons">
          <button onClick={() => setActiveTab('monitoring')} className="action-btn primary">
            📊 Submit Reading
          </button>
          <button onClick={() => setActiveTab('faqs')} className="action-btn">
            ❓ View FAQs
          </button>
          <button onClick={() => setActiveTab('updates')} className="action-btn">
            📢 Check Updates
          </button>
          <button onClick={() => setActiveTab('bot')} className="action-btn">
            🤖 Bot Helper
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h4>Recent Activity</h4>
        <div className="activity-list">
          {readings.slice(0, 3).map(reading => (
            <div key={reading.id} className="activity-item">
              <span className="activity-icon">📊</span>
              <span className="activity-text">Submitted water quality reading at {reading.location}</span>
              <span className="activity-time">{reading.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMonitoring = () => (
    <div className="monitoring">
      <h3>📊 Monitoring Dashboard</h3>
      
      <div className="monitoring-form">
        <h4>Submit New Reading</h4>
        <form className="reading-form" onSubmit={handleSubmitReading}>
          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <select 
                className="form-input"
                value={newReading.location}
                onChange={(e) => setNewReading({...newReading, location: e.target.value})}
              >
                <option>Beach Point A</option>
                <option>Beach Point B</option>
                <option>Harbor Entrance</option>
                <option>Coastal Lagoon</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date & Time</label>
              <input 
                type="datetime-local" 
                className="form-input"
                value={newReading.dateTime}
                onChange={(e) => setNewReading({...newReading, dateTime: e.target.value})}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Water Temperature (°C)</label>
              <input 
                type="number" 
                step="0.1" 
                className="form-input" 
                placeholder="18.5"
                value={newReading.temperature}
                onChange={(e) => setNewReading({...newReading, temperature: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Salinity (ppt)</label>
              <input 
                type="number" 
                step="0.1" 
                className="form-input" 
                placeholder="32.1"
                value={newReading.salinity}
                onChange={(e) => setNewReading({...newReading, salinity: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>pH Level</label>
              <input 
                type="number" 
                step="0.1" 
                className="form-input" 
                placeholder="7.8"
                value={newReading.ph}
                onChange={(e) => setNewReading({...newReading, ph: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Overall Quality</label>
              <select 
                className="form-input"
                value={newReading.quality}
                onChange={(e) => setNewReading({...newReading, quality: e.target.value})}
              >
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Notes</label>
            <textarea 
              className="form-input" 
              placeholder="Any observations or special conditions..."
              value={newReading.notes}
              onChange={(e) => setNewReading({...newReading, notes: e.target.value})}
            ></textarea>
          </div>
          
          <button type="submit" className="submit-btn">📊 Submit Reading</button>
        </form>
      </div>

      <div className="monitoring-history">
        <h4>Recent Readings</h4>
        <div className="readings-list">
          {readings.map(reading => (
            <div key={reading.id} className="reading-card">
              <div className="reading-header">
                <span className="reading-date">{reading.date}</span>
                <span className={`quality-badge ${reading.quality}`}>{reading.quality}</span>
              </div>
              <div className="reading-data">
                <div className="data-point">
                  <span className="label">Temperature:</span>
                  <span className="value">{reading.temperature}°C</span>
                </div>
                <div className="data-point">
                  <span className="label">Salinity:</span>
                  <span className="value">{reading.salinity} ppt</span>
                </div>
                <div className="data-point">
                  <span className="label">pH:</span>
                  <span className="value">{reading.ph}</span>
                </div>
                <div className="data-point">
                  <span className="label">Location:</span>
                  <span className="value">{reading.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFAQs = () => (
    <div className="user-faqs">
      <h3>❓ Frequently Asked Questions</h3>
      
      <div className="faq-categories">
        <div className="category-tabs">
          <button className="category-tab active">All</button>
          <button className="category-tab">ESCOM Organization</button>
          <button className="category-tab">Monitoring</button>
          <button className="category-tab">Training</button>
          <button className="category-tab">Data</button>
        </div>
      </div>

      <div className="faq-list">
        {faqs.map(faq => (
          <div key={faq.id} className="faq-item">
            <div className="faq-question">
              <h4>{faq.question}</h4>
              <span className="faq-category">{faq.category}</span>
            </div>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="faq-help">
        <p>Can't find what you're looking for? Use our <button onClick={() => setBotHelper({...botHelper, isOpen: true})} className="link-btn">Bot Helper</button> for instant assistance!</p>
      </div>
    </div>
  );

  const renderUpdates = () => (
    <div className="user-updates">
      <h3>📢 Latest Updates</h3>
      
      <div className="updates-list">
        {updates.map(update => (
          <div key={update.id} className={`update-card ${update.priority}`}>
            <div className="update-header">
              <h4>{update.title}</h4>
              <span className={`priority-badge ${update.priority}`}>{update.priority}</span>
            </div>
            <p className="update-content">{update.content}</p>
            <div className="update-footer">
              <span className="update-date">{update.date}</span>
              <button className="read-more-btn">Read More</button>
            </div>
          </div>
        ))}
      </div>

      <div className="updates-subscription">
        <h4>Stay Updated</h4>
        <p>Get notified about important updates and announcements</p>
        <div className="subscription-options">
          <label className="checkbox">
            <input type="checkbox" defaultChecked />
            <span>Email notifications</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" defaultChecked />
            <span>In-app notifications</span>
          </label>
          <label className="checkbox">
            <input type="checkbox" />
            <span>SMS alerts (urgent only)</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderBotHelper = () => (
    <div className="bot-helper">
      <h3>🤖 Bot Helper</h3>
      
      <div className="bot-chat">
        <div className="chat-messages">
          <div className="message bot">
            <span className="message-avatar">🤖</span>
            <div className="message-content">
              <p>Hello! I'm your ESCOM Citizen Science Assistant. How can I help you today?</p>
              <div className="quick-questions">
                <button className="quick-question" onClick={() => setBotHelper({...botHelper, currentMessage: 'How do I submit data?'})}>How do I submit data?</button>
                <button className="quick-question" onClick={() => setBotHelper({...botHelper, currentMessage: 'What equipment do I need?'})}>What equipment do I need?</button>
                <button className="quick-question" onClick={() => setBotHelper({...botHelper, currentMessage: 'Training resources'})}>Training resources</button>
                <button className="quick-question" onClick={() => setBotHelper({...botHelper, currentMessage: 'Contact support'})}>Contact support</button>
              </div>
            </div>
          </div>
          
          {botHelper.messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type}`}>
              <span className="message-avatar">{msg.type === 'user' ? '👤' : '🤖'}</span>
              <div className="message-content">
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="chat-input">
          <input 
            type="text" 
            placeholder="Type your question..."
            value={botHelper.currentMessage}
            onChange={(e) => setBotHelper({...botHelper, currentMessage: e.target.value})}
            className="message-input"
            onKeyPress={(e) => e.key === 'Enter' && handleBotMessage()}
          />
          <button onClick={handleBotMessage} className="send-btn">📤</button>
        </div>
      </div>

      <div className="bot-features">
        <h4>What I can help with:</h4>
        <ul>
          <li>📊 Data submission guidance</li>
          <li>🔬 Equipment instructions</li>
          <li>📚 Training resources</li>
          <li>❓ FAQ answers</li>
          <li>📢 Latest updates</li>
          <li>🔗 Contact information</li>
        </ul>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'monitoring':
        return renderMonitoring();
      case 'faqs':
        return renderFAQs();
      case 'updates':
        return renderUpdates();
      case 'bot':
        return renderBotHelper();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h2>🌊 Citizen Scientist Dashboard</h2>
        <div className="user-info">
          <span className="user-name">{user?.firstName} {user?.lastName}</span>
          <span className="user-role">{user?.role}</span>
        </div>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${activeTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitoring')}
        >
          📊 Monitoring
        </button>
        <button 
          className={`nav-btn ${activeTab === 'faqs' ? 'active' : ''}`}
          onClick={() => setActiveTab('faqs')}
        >
          ❓ FAQs
        </button>
        <button 
          className={`nav-btn ${activeTab === 'updates' ? 'active' : ''}`}
          onClick={() => setActiveTab('updates')}
        >
          📢 Updates
        </button>
        <button 
          className={`nav-btn ${activeTab === 'bot' ? 'active' : ''}`}
          onClick={() => setActiveTab('bot')}
        >
          🤖 Bot Helper
        </button>
      </div>

      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default UserDashboard;
