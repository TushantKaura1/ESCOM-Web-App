import React, { useState, useEffect } from 'react';
import Profile from './Profile';
import './UserDashboard.css';

function UserDashboard({ user, onLogout, onSectionChange }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [faqs, setFaqs] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [readings, setReadings] = useState([]);
  const [newReading, setNewReading] = useState({
    temperature: '',
    salinity: '',
    ph: '',
    turbidity: '',
    dissolvedOxygen: '',
    location: '',
    notes: '',
    weather: 'sunny',
    timeOfDay: 'morning',
    equipment: 'pH-2000, Salinity-Refractometer'
  });

  // Enhanced state for better functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const validateForm = () => {
    const errors = {};
    
    // Required field validation
    if (!newReading.temperature || isNaN(parseFloat(newReading.temperature))) {
      errors.temperature = 'Temperature is required and must be a valid number';
    } else if (parseFloat(newReading.temperature) < -5 || parseFloat(newReading.temperature) > 50) {
      errors.temperature = 'Temperature must be between -5°C and 50°C';
    }
    
    if (!newReading.salinity || isNaN(parseFloat(newReading.salinity))) {
      errors.salinity = 'Salinity is required and must be a valid number';
    } else if (parseFloat(newReading.salinity) < 0 || parseFloat(newReading.salinity) > 50) {
      errors.salinity = 'Salinity must be between 0 and 50 ppt';
    }
    
    if (!newReading.ph || isNaN(parseFloat(newReading.ph))) {
      errors.ph = 'pH is required and must be a valid number';
    } else if (parseFloat(newReading.ph) < 0 || parseFloat(newReading.ph) > 14) {
      errors.ph = 'pH must be between 0 and 14';
    }
    
    if (!newReading.turbidity || isNaN(parseFloat(newReading.turbidity))) {
      errors.turbidity = 'Turbidity is required and must be a valid number';
    } else if (parseFloat(newReading.turbidity) < 0) {
      errors.turbidity = 'Turbidity must be a positive number';
    }
    
    if (newReading.dissolvedOxygen && (isNaN(parseFloat(newReading.dissolvedOxygen)) || parseFloat(newReading.dissolvedOxygen) < 0)) {
      errors.dissolvedOxygen = 'Dissolved Oxygen must be a valid positive number';
    }
    
    if (!newReading.location) {
      errors.location = 'Location is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitReading = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('❌ Form validation failed:', formErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const reading = {
        id: Date.now(),
        ...newReading,
        temperature: parseFloat(newReading.temperature),
        salinity: parseFloat(newReading.salinity),
        ph: parseFloat(newReading.ph),
        turbidity: parseFloat(newReading.turbidity),
        dissolvedOxygen: newReading.dissolvedOxygen ? parseFloat(newReading.dissolvedOxygen) : null,
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
        dissolvedOxygen: '',
        location: '',
        notes: '',
        weather: 'sunny',
        timeOfDay: 'morning',
        equipment: 'pH-2000, Salinity-Refractometer'
      });
      
      setFormErrors({});
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      console.log('✅ New reading submitted:', reading);
    } catch (error) {
      console.error('❌ Error submitting reading:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateQuality = (reading) => {
    const temp = parseFloat(reading.temperature);
    const sal = parseFloat(reading.salinity);
    const ph = parseFloat(reading.ph);
    const turb = parseFloat(reading.turbidity);
    const do2 = parseFloat(reading.dissolvedOxygen);
    
    let score = 0;
    
    // Temperature quality (ideal range: 15-25°C)
    if (temp >= 15 && temp <= 25) score += 20;
    else if (temp >= 10 && temp <= 30) score += 15;
    else score += 5;
    
    // Salinity quality (ideal range: 30-40 ppt)
    if (sal >= 30 && sal <= 40) score += 20;
    else if (sal >= 25 && sal <= 45) score += 15;
    else score += 5;
    
    // pH quality (ideal range: 7.5-8.5)
    if (ph >= 7.5 && ph <= 8.5) score += 20;
    else if (ph >= 7.0 && ph <= 9.0) score += 15;
    else score += 5;
    
    // Turbidity quality (lower is better, ideal < 5 NTU)
    if (turb < 5) score += 20;
    else if (turb < 10) score += 15;
    else score += 5;
    
    // Dissolved Oxygen quality (higher is better, ideal > 6 mg/L)
    if (do2 > 6) score += 20;
    else if (do2 > 4) score += 15;
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
          <button onClick={() => setActiveTab('monitoring')} className="action-card primary">
            <div className="action-icon">📊</div>
            <div className="action-text">Submit Reading</div>
          </button>
          <button onClick={() => setActiveTab('faqs')} className="action-card">
            <div className="action-icon">❓</div>
            <div className="action-text">View FAQs</div>
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

  const renderMonitoring = () => (
    <div className="monitoring">
      <div className="section-header">
        <button onClick={() => setActiveTab('dashboard')} className="back-btn">← Back</button>
        <h3>📊 Submit Reading</h3>
      </div>
      
      {showSuccessMessage && (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <div className="success-text">
            <h4>Reading Submitted Successfully!</h4>
            <p>Your water quality data has been recorded and will be reviewed by our team.</p>
          </div>
        </div>
      )}
      
      <div className="monitoring-form">
        <form className="reading-form" onSubmit={handleSubmitReading}>
          <div className="form-section">
            <h4>📍 Location & Conditions</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <select 
                  className={`form-input ${formErrors.location ? 'error' : ''}`}
                  value={newReading.location}
                  onChange={(e) => {
                    setNewReading({...newReading, location: e.target.value});
                    if (formErrors.location) {
                      setFormErrors({...formErrors, location: ''});
                    }
                  }}
                  required
                >
                  <option value="">Select location...</option>
                  <option value="Beach Point A">Beach Point A</option>
                  <option value="Beach Point B">Beach Point B</option>
                  <option value="Harbor Entrance">Harbor Entrance</option>
                  <option value="Coastal Lagoon">Coastal Lagoon</option>
                </select>
                {formErrors.location && <span className="error-message">{formErrors.location}</span>}
              </div>
              <div className="form-group">
                <label>Weather</label>
                <select 
                  className="form-input"
                  value={newReading.weather}
                  onChange={(e) => setNewReading({...newReading, weather: e.target.value})}
                >
                  <option value="sunny">☀️ Sunny</option>
                  <option value="partly-cloudy">⛅ Partly Cloudy</option>
                  <option value="cloudy">☁️ Cloudy</option>
                  <option value="rainy">🌧️ Rainy</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>🌊 Water Quality Measurements</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Temperature (°C) *</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="-5"
                  max="50"
                  className={`form-input ${formErrors.temperature ? 'error' : ''}`}
                  placeholder="18.5"
                  value={newReading.temperature}
                  onChange={(e) => {
                    setNewReading({...newReading, temperature: e.target.value});
                    if (formErrors.temperature) {
                      setFormErrors({...formErrors, temperature: ''});
                    }
                  }}
                  required
                />
                {formErrors.temperature && <span className="error-message">{formErrors.temperature}</span>}
              </div>
              <div className="form-group">
                <label>Salinity (ppt) *</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0"
                  max="50"
                  className={`form-input ${formErrors.salinity ? 'error' : ''}`}
                  placeholder="32.1"
                  value={newReading.salinity}
                  onChange={(e) => {
                    setNewReading({...newReading, salinity: e.target.value});
                    if (formErrors.salinity) {
                      setFormErrors({...formErrors, salinity: ''});
                    }
                  }}
                  required
                />
                {formErrors.salinity && <span className="error-message">{formErrors.salinity}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>pH Level *</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0"
                  max="14"
                  className={`form-input ${formErrors.ph ? 'error' : ''}`}
                  placeholder="7.8"
                  value={newReading.ph}
                  onChange={(e) => {
                    setNewReading({...newReading, ph: e.target.value});
                    if (formErrors.ph) {
                      setFormErrors({...formErrors, ph: ''});
                    }
                  }}
                  required
                />
                {formErrors.ph && <span className="error-message">{formErrors.ph}</span>}
              </div>
              <div className="form-group">
                <label>Turbidity (NTU) *</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0"
                  className={`form-input ${formErrors.turbidity ? 'error' : ''}`}
                  placeholder="2.3"
                  value={newReading.turbidity}
                  onChange={(e) => {
                    setNewReading({...newReading, turbidity: e.target.value});
                    if (formErrors.turbidity) {
                      setFormErrors({...formErrors, turbidity: ''});
                    }
                  }}
                  required
                />
                {formErrors.turbidity && <span className="error-message">{formErrors.turbidity}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Dissolved Oxygen (mg/L)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0"
                  className={`form-input ${formErrors.dissolvedOxygen ? 'error' : ''}`}
                  placeholder="7.5"
                  value={newReading.dissolvedOxygen}
                  onChange={(e) => {
                    setNewReading({...newReading, dissolvedOxygen: e.target.value});
                    if (formErrors.dissolvedOxygen) {
                      setFormErrors({...formErrors, dissolvedOxygen: ''});
                    }
                  }}
                />
                {formErrors.dissolvedOxygen && <span className="error-message">{formErrors.dissolvedOxygen}</span>}
                <small className="field-help">Optional - Leave blank if not measured</small>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h4>📝 Additional Information</h4>
            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea 
                className="form-input" 
                placeholder="Any observations or special conditions..."
                value={newReading.notes}
                onChange={(e) => setNewReading({...newReading, notes: e.target.value})}
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className={`submit-btn primary ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Submitting...
                </>
              ) : (
                '📊 Submit Reading'
              )}
            </button>
            <button type="button" onClick={() => setActiveTab('dashboard')} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>

      <div className="monitoring-history">
        <h4>Recent Readings ({readings.length})</h4>
        <div className="readings-list">
          {readings.length === 0 ? (
            <div className="no-readings">
              <div className="no-readings-icon">📊</div>
              <h4>No readings yet</h4>
              <p>Submit your first water quality reading to get started!</p>
            </div>
          ) : (
            readings.slice(0, 5).map(reading => (
              <div key={reading.id} className="reading-card">
                <div className="reading-header">
                  <span className="reading-date">
                    {new Date(reading.timestamp).toLocaleDateString()} at {new Date(reading.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`quality-badge ${reading.quality}`}>
                    {reading.quality.charAt(0).toUpperCase() + reading.quality.slice(1)}
                  </span>
                </div>
                <div className="reading-data">
                  <div className="data-grid">
                    <div className="data-point">
                      <span className="label">🌡️ Temperature:</span>
                      <span className="value">{reading.temperature}°C</span>
                    </div>
                    <div className="data-point">
                      <span className="label">🧂 Salinity:</span>
                      <span className="value">{reading.salinity} ppt</span>
                    </div>
                    <div className="data-point">
                      <span className="label">⚗️ pH:</span>
                      <span className="value">{reading.ph}</span>
                    </div>
                    <div className="data-point">
                      <span className="label">🌊 Turbidity:</span>
                      <span className="value">{reading.turbidity} NTU</span>
                    </div>
                    {reading.dissolvedOxygen && (
                      <div className="data-point">
                        <span className="label">💨 Dissolved Oxygen:</span>
                        <span className="value">{reading.dissolvedOxygen} mg/L</span>
                      </div>
                    )}
                    <div className="data-point">
                      <span className="label">📍 Location:</span>
                      <span className="value">{reading.location}</span>
                    </div>
                    <div className="data-point">
                      <span className="label">🌤️ Weather:</span>
                      <span className="value">{reading.weather}</span>
                    </div>
                    <div className="data-point">
                      <span className="label">⏰ Time:</span>
                      <span className="value">{reading.timeOfDay}</span>
                    </div>
                  </div>
                  {reading.notes && (
                    <div className="reading-notes">
                      <span className="label">📝 Notes:</span>
                      <p>{reading.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
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
        <h3>❓ Help Center</h3>
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
      case 'monitoring':
        return renderMonitoring();
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
          className={`nav-btn ${activeTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitoring')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">Submit</span>
        </button>
        <button 
          className={`nav-btn ${activeTab === 'faqs' ? 'active' : ''}`}
          onClick={() => setActiveTab('faqs')}
        >
          <span className="nav-icon">❓</span>
          <span className="nav-text">Help</span>
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
