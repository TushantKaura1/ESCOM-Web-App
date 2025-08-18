import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

function UserDashboard({ user, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [faqs, setFaqs] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [monitoringData, setMonitoringData] = useState([]);
  const [newReading, setNewReading] = useState({
    location: 'Beach Point A',
    dateTime: '',
    temperature: '',
    salinity: '',
    ph: '',
    quality: 'Excellent',
    notes: ''
  });
  const [botHelper, setBotHelper] = useState({
    isOpen: false,
    messages: [],
    currentMessage: ''
  });

  useEffect(() => {
    console.log('🌊 UserDashboard component mounted for user:', user);
    loadUserData();
  }, []);

  const loadUserData = async () => {
    // Load demo data for now
    setFaqs([
      { id: 1, category: 'ESCOM Organization', question: 'How can I get involved with ESCOM?', answer: 'You can get involved by joining our coastal monitoring program, participating in training sessions, and contributing to data collection. Contact your local team leader to get started.' },
      { id: 2, category: 'Monitoring', question: 'What parameters do we monitor?', answer: 'We monitor water temperature, salinity, pH levels, and overall water quality. Each parameter is measured using specialized equipment and recorded in our database.' },
      { id: 3, category: 'Training', question: 'How do I calibrate my monitoring equipment?', answer: 'Equipment calibration should be done monthly using the calibration kit provided. Follow the step-by-step guide in your training manual or contact your team leader for assistance.' },
      { id: 4, category: 'Data', question: 'How often should I submit data?', answer: 'Data should be submitted immediately after each monitoring session, typically monthly. During extreme weather events, additional readings may be required.' },
      { id: 5, category: 'Partners', question: 'Who are our research partners?', answer: 'We collaborate with Dalhousie University, local environmental organizations, and government agencies to advance coastal research and conservation efforts.' }
    ]);

    setUpdates([
      { id: 1, title: 'New Monitoring Protocol Released', content: 'We have updated our water quality monitoring protocol to include additional parameters. Please review the new guidelines and update your monitoring procedures accordingly.', date: '2024-01-20', priority: 'high' },
      { id: 2, title: 'Training Session This Weekend', content: 'Join us for a hands-on training session on equipment calibration and data collection techniques. The session will cover new monitoring protocols and best practices.', date: '2024-01-18', priority: 'medium' },
      { id: 3, title: 'Monthly Data Review', content: 'Your January monitoring data has been reviewed. Great job maintaining high accuracy standards! Your contributions are making a real difference in our research.', date: '2024-01-15', priority: 'low' },
      { id: 4, title: 'Equipment Maintenance Reminder', content: 'Remember to schedule your monthly equipment calibration. Proper maintenance ensures data accuracy and extends equipment lifespan.', date: '2024-01-12', priority: 'medium' }
    ]);

    setMonitoringData([
      { id: 1, date: '2024-01-20', temperature: 18.5, salinity: 32.1, ph: 7.8, quality: 'excellent', location: 'Beach Point A' },
      { id: 2, date: '2024-01-18', temperature: 17.8, salinity: 31.9, ph: 7.6, quality: 'good', location: 'Beach Point B' },
      { id: 3, date: '2024-01-15', temperature: 19.2, salinity: 32.3, ph: 7.9, quality: 'excellent', location: 'Beach Point A' }
    ]);
  };

  const handleSubmitReading = (e) => {
    e.preventDefault();
    if (newReading.temperature && newReading.salinity && newReading.ph) {
      const reading = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        temperature: parseFloat(newReading.temperature),
        salinity: parseFloat(newReading.salinity),
        ph: parseFloat(newReading.ph),
        quality: newReading.quality,
        location: newReading.location,
        notes: newReading.notes
      };
      
      setMonitoringData([reading, ...monitoringData]);
      setNewReading({
        location: 'Beach Point A',
        dateTime: '',
        temperature: '',
        salinity: '',
        ph: '',
        quality: 'Excellent',
        notes: ''
      });
      
      // Show success message
      alert('Reading submitted successfully!');
    }
  };

  const handleBotMessage = () => {
    if (botHelper.currentMessage.trim()) {
      const userMessage = {
        type: 'user',
        text: botHelper.currentMessage
      };
      
      // Simulate bot response
      const botResponse = {
        type: 'bot',
        text: getBotResponse(botHelper.currentMessage)
      };
      
      setBotHelper({
        ...botHelper,
        messages: [...botHelper.messages, userMessage, botResponse],
        currentMessage: ''
      });
    }
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('submit') || lowerMessage.includes('data')) {
      return 'To submit data, go to the Monitoring tab and fill out the form. Make sure to record temperature, salinity, pH, and overall quality for each reading.';
    } else if (lowerMessage.includes('equipment') || lowerMessage.includes('calibrate')) {
      return 'Equipment calibration should be done monthly. Check your training manual for step-by-step instructions, or contact your team leader for assistance.';
    } else if (lowerMessage.includes('training') || lowerMessage.includes('resources')) {
      return 'Training resources are available in the Training section. We offer manuals, videos, and regular training sessions. Check the Updates tab for upcoming sessions.';
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
      return 'For support, contact your team leader or email support@escom.org. For urgent issues, use the emergency contact number provided in your welcome packet.';
    } else {
      return 'I can help you with data submission, equipment calibration, training resources, and general support. What specific question do you have?';
    }
  };

  const renderOverview = () => (
    <div className="user-overview">
      <div className="welcome-section">
        <h3>🌊 Welcome back, {user?.firstName || 'Citizen Scientist'}!</h3>
        <p>Ready to contribute to coastal monitoring today?</p>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <h4>Total Readings</h4>
          <div className="stat-value">{monitoringData.length}</div>
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
          {monitoringData.slice(0, 3).map(reading => (
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
          {monitoringData.map(reading => (
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
