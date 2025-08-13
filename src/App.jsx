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
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          if (data.user.isAdmin) {
            onAdminLogin(data.user);
          } else {
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

  return (
    <div className="auth-screen">
      <div className="auth-container">
        <div className="auth-header">
          <h1>🌊 ESCOM Citizen Scientist</h1>
          <p>{isLogin ? 'Welcome back!' : 'Join our community'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="auth-input"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="auth-input"
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="auth-input"
              />
            </>
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        
        <div className="auth-switch">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="switch-btn"
          >
            {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
          </button>
        </div>
        
        <div className="auth-info">
          <p>Join our coastal monitoring community</p>
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

// FAQ Component with Admin Management
function FAQSection({ onBack, userMode }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({ q: '', a: '' });

  const faqData = {
    'ESCOM Organization': {
      'Getting Involved': [
        { q: 'How much time does participation require?', a: 'Once a month for approximately 1 hour, with flexible scheduling.' },
        { q: 'Is there a deadline to join?', a: 'You can join anytime! Support continues until November 2024.' },
        { q: 'Do I need prior scientific knowledge?', a: 'No prior knowledge required—just enthusiasm!' },
      ],
      'Benefits': [
        { q: 'What do I gain from participating?', a: 'Certificate and valuable coastal science skills.' },
        { q: 'How does this benefit my community?', a: 'Your data helps make informed coastal management decisions.' },
      ]
    },
    'Monitoring': {
      'Parameters': [
        { q: 'What parameters do we monitor?', a: 'Water quality, temperature, salinity, pH levels, and coastal erosion.' },
        { q: 'How often should I take measurements?', a: 'Monthly measurements recommended, with additional readings during extreme weather.' },
      ],
      'Protocols': [
        { q: 'What safety protocols should I follow?', a: 'Wear safety gear, never monitor alone in dangerous conditions.' },
        { q: 'How do I calibrate my instruments?', a: 'Calibration instructions are provided in your training manual.' },
      ]
    },
    'Training': {
      'Resources': [
        { q: 'Where can I find training materials?', a: 'Access our comprehensive wiki and training manuals through the ESCOM portal.' },
        { q: 'Are there video tutorials?', a: 'Yes, we offer video tutorials covering all monitoring procedures.' },
      ]
    },
    'Data': {
      'Entry': [
        { q: 'How do I enter my monitoring data?', a: 'Use our mobile app or web portal to enter data immediately after collection.' },
        { q: 'What if I make an error in data entry?', a: 'Contact your team leader immediately for corrections.' },
      ],
      'Sharing': [
        { q: 'Who owns the data I collect?', a: 'You retain ownership while contributing to community research.' },
        { q: 'How is data shared with researchers?', a: 'Data is shared anonymously with your explicit consent.' },
      ]
    },
    'Partners': {
      'Dalhousie': [
        { q: 'What is Dalhousie\'s role?', a: 'Dalhousie provides scientific oversight, training, and research collaboration.' },
        { q: 'Can I interact with Dalhousie researchers?', a: 'Yes, regular webinars and Q&A sessions are held.' },
      ]
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedQuestion(null);
  };

  const handleSubcategorySelect = (subcategory) => {
    setSelectedQuestion(subcategory);
  };

  const handleBack = () => {
    if (selectedQuestion && selectedCategory) {
      setSelectedQuestion(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      onBack();
    }
  };

  if (selectedQuestion && selectedCategory) {
    const questions = faqData[selectedCategory][selectedQuestion];
    return (
      <div className="faq-section">
        <div className="faq-header">
          <button onClick={handleBack} className="back-btn">← Back</button>
          <h3>{selectedQuestion}</h3>
          {userMode === 'admin' && (
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="edit-btn"
            >
              {isEditing ? '✕ Cancel' : '✏️ Edit'}
            </button>
          )}
        </div>
        <div className="questions-list">
          {questions.map((item, index) => (
            <div key={index} className="question-item">
              {isEditing && userMode === 'admin' ? (
                <div className="edit-question">
                  <input
                    type="text"
                    value={editingQuestion?.q || item.q}
                    onChange={(e) => setEditingQuestion({...editingQuestion, q: e.target.value})}
                    placeholder="Question"
                    className="edit-input"
                  />
                  <textarea
                    value={editingQuestion?.a || item.a}
                    onChange={(e) => setEditingQuestion({...editingQuestion, a: e.target.value})}
                    placeholder="Answer"
                    className="edit-textarea"
                  />
                  <div className="edit-actions">
                    <button className="save-btn">💾 Save</button>
                    <button className="delete-btn">🗑️ Delete</button>
                  </div>
                </div>
              ) : (
                <>
                  <h4>{item.q}</h4>
                  <p>{item.a}</p>
                </>
              )}
            </div>
          ))}
          {isEditing && userMode === 'admin' && (
            <div className="add-question">
              <h4>Add New Question</h4>
              <input
                type="text"
                value={newQuestion.q}
                onChange={(e) => setNewQuestion({...newQuestion, q: e.target.value})}
                placeholder="New question"
                className="edit-input"
              />
              <textarea
                value={newQuestion.a}
                onChange={(e) => setNewQuestion({...newQuestion, a: e.target.value})}
                placeholder="Answer"
                className="edit-textarea"
              />
              <button className="add-btn">➕ Add Question</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div className="faq-section">
        <div className="faq-header">
          <button onClick={handleBack} className="back-btn">← Back</button>
          <h3>{selectedCategory}</h3>
        </div>
        <div className="subcategories-list">
          {Object.keys(faqData[selectedCategory]).map((subcategory) => (
            <button
              key={subcategory}
              onClick={() => handleSubcategorySelect(subcategory)}
              className="subcategory-btn"
            >
              {subcategory}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="faq-section">
      <div className="faq-header">
        <button onClick={handleBack} className="back-btn">← Back</button>
        <h3>Frequently Asked Questions</h3>
      </div>
      <div className="categories-list">
        {Object.keys(faqData).map((category) => (
          <button
            key={category}
            onClick={() => handleCategorySelect(category)}
            className="category-btn"
          >
            {category}
          </button>
        ))}
      </div>
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

// Dashboard Component
function DashboardSection({ user, onBack }) {
  const [stats] = useState({
    totalReadings: 24,
    thisMonth: 3,
    streak: 8,
    accuracy: 95,
    communityRank: 12,
    totalMembers: 156
  });

  const [recentActivity] = useState([
    { date: '2024-01-15', type: 'reading', location: 'Port Hawkesbury Beach', parameters: 'Temperature, Salinity' },
    { date: '2024-01-08', type: 'training', title: 'Advanced pH Monitoring', completed: true },
    { date: '2024-01-01', type: 'reading', location: 'Port Hawkesbury Beach', parameters: 'Water Quality' },
  ]);

  return (
    <div className="dashboard-section">
      <div className="dashboard-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>📊 Your Dashboard</h3>
        <p>Welcome back, {user?.name || 'Citizen Scientist'}!</p>
      </div>
      
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
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboardSection({ onBack }) {
  const [stats, setStats] = useState({
    totalUsers: 11,
    activeUsers: 8,
    totalReadings: 567,
    averageAccuracy: 91.3,
    newUsersThisMonth: 3,
    systemHealth: 'Excellent'
  });

  const [recentActivity, setRecentActivity] = useState([
    { type: 'user', action: 'New citizen scientist registered', user: 'Ana Costa', time: '2 hours ago' },
    { type: 'reading', action: 'Data submission', user: 'João Pereira', time: '4 hours ago' },
    { type: 'system', action: 'System backup completed', user: 'System', time: '6 hours ago' },
    { type: 'admin', action: 'FAQ updated', user: 'Admin', time: '1 day ago' }
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.DASHBOARD}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-section">
      <div className="dashboard-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>📊 Admin Dashboard</h3>
        <p>System overview and analytics</p>
      </div>

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
        <h4>Quick Actions</h4>
        <div className="action-buttons">
          <button className="action-btn admin-action">👥 Manage Users</button>
          <button className="action-btn admin-action">📈 View Analytics</button>
          <button className="action-btn admin-action">⚙️ System Settings</button>
          <button className="action-btn admin-action">📋 Generate Report</button>
        </div>
      </div>
    </div>
  );
}

// User Management Component
function UserManagementSection({ onBack }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleSaveUser = async () => {
    try {
              const response = await fetch(`${config.API_BASE_URL}/api/admin/users/${selectedUser.telegramId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(selectedUser)
      });
      
      if (response.ok) {
        await fetchUsers(); // Refresh user list
        setIsEditing(false);
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <div className="dashboard-section">
      <div className="dashboard-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>👥 User Management</h3>
        <p>Manage citizen scientists and their data</p>
      </div>

      <div className="user-list">
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          users.map((user) => (
            <div key={user.telegramId} className="user-card">
              <div className="user-info">
                <h4>{user.profile.name}</h4>
                <p>Team: {user.profile.team} | Role: {user.role}</p>
                <p>Readings: {user.stats.totalReadings} | Last Active: {new Date(user.lastActive).toLocaleDateString()}</p>
                <span className={`status-badge ${user.status}`}>
                  {user.status}
                </span>
              </div>
              <div className="user-actions">
                <button className="edit-user-btn" onClick={() => handleEditUser(user)}>
                  ✏️ Edit
                </button>
                <button className="view-user-btn">
                  👁️ View
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isEditing && selectedUser && (
        <div className="edit-user-modal">
          <div className="modal-content">
            <h4>Edit User: {selectedUser.profile.name}</h4>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                defaultValue={selectedUser.profile.name}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  profile: { ...selectedUser.profile, name: e.target.value }
                })}
              />
            </div>
            <div className="form-group">
              <label>Team</label>
              <select 
                defaultValue={selectedUser.profile.team}
                onChange={(e) => setSelectedUser({
                  ...selectedUser,
                  profile: { ...selectedUser.profile, team: e.target.value }
                })}
              >
                <option value="team1">Team Alpha</option>
                <option value="team2">Team Beta</option>
                <option value="team3">Team Gamma</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select 
                defaultValue={selectedUser.status}
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

// Data Analytics Component
function DataAnalyticsSection({ onBack }) {
  const [analytics, setAnalytics] = useState({
    totalReadings: 567,
    averageAccuracy: 91.3,
    topPerformer: 'Lúcia Fernandes',
    mostActiveTeam: 'Team Beta',
    dataQuality: 'Excellent',
    trends: [
      { month: 'Jan', readings: 45, accuracy: 88 },
      { month: 'Feb', readings: 52, accuracy: 91 },
      { month: 'Mar', readings: 48, accuracy: 89 },
      { month: 'Apr', readings: 61, accuracy: 93 }
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}${config.ENDPOINTS.ADMIN.ANALYTICS}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-section">
      <div className="dashboard-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>📈 Data Analytics</h3>
        <p>Monitoring data analysis and trends</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h4>📊 Overall Statistics</h4>
          <div className="stat-item">
            <span>Total Readings:</span>
            <span>{analytics.totalReadings}</span>
          </div>
          <div className="stat-item">
            <span>Average Accuracy:</span>
            <span>{analytics.averageAccuracy}%</span>
          </div>
          <div className="stat-item">
            <span>Top Performer:</span>
            <span>{analytics.topPerformer}</span>
          </div>
          <div className="stat-item">
            <span>Most Active Team:</span>
            <span>{analytics.mostActiveTeam}</span>
          </div>
        </div>

        <div className="analytics-card">
          <h4>📈 Monthly Trends</h4>
          <div className="trends-list">
            {analytics.trends.map((trend, index) => (
              <div key={index} className="trend-item">
                <span className="month">{trend.month}</span>
                <span className="readings">{trend.readings} readings</span>
                <span className="accuracy">{trend.accuracy}% accuracy</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h4>🎯 Data Quality</h4>
          <div className="quality-indicator">
            <span className="quality-label">Overall Quality:</span>
            <span className={`quality-status ${analytics.dataQuality.toLowerCase()}`}>
              {analytics.dataQuality}
            </span>
          </div>
          <div className="quality-metrics">
            <div className="metric">
              <span>Completeness</span>
              <div className="progress-bar">
                <div className="progress" style={{width: '95%'}}></div>
              </div>
            </div>
            <div className="metric">
              <span>Accuracy</span>
              <div className="progress-bar">
                <div className="progress" style={{width: '91%'}}></div>
              </div>
            </div>
            <div className="metric">
              <span>Timeliness</span>
              <div className="progress-bar">
                <div className="progress" style={{width: '88%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// System Settings Component
function SystemSettingsSection({ onBack }) {
  const [settings, setSettings] = useState({
    notifications: true,
    autoBackup: true,
    dataRetention: '2 years',
    privacyMode: false,
    maintenanceMode: false,
    debugMode: false
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="dashboard-section">
      <div className="dashboard-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>⚙️ System Settings</h3>
        <p>Configure system parameters and preferences</p>
      </div>

      <div className="settings-list">
        <div className="setting-item">
          <div className="setting-info">
            <h4>🔔 Notifications</h4>
            <p>Enable system notifications and alerts</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={settings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h4>💾 Auto Backup</h4>
            <p>Automatically backup data daily</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={settings.autoBackup}
              onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h4>🗄️ Data Retention</h4>
            <p>How long to keep user data</p>
          </div>
          <select 
            value={settings.dataRetention}
            onChange={(e) => handleSettingChange('dataRetention', e.target.value)}
            className="setting-select"
          >
            <option value="1 year">1 year</option>
            <option value="2 years">2 years</option>
            <option value="5 years">5 years</option>
            <option value="indefinite">Indefinite</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h4>🔒 Privacy Mode</h4>
            <p>Enhanced privacy protection</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={settings.privacyMode}
              onChange={(e) => handleSettingChange('privacyMode', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h4>🔧 Maintenance Mode</h4>
            <p>Put system in maintenance mode</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={settings.maintenanceMode}
              onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h4>🐛 Debug Mode</h4>
            <p>Enable debug logging</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={settings.debugMode}
              onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-actions">
        <button className="save-settings-btn">💾 Save Settings</button>
        <button className="reset-settings-btn">🔄 Reset to Default</button>
      </div>
    </div>
  );
}

// Citizen Scientist Bot Component
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

  return (
    <div className="bot-section">
      <div className="bot-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>🤖 Citizen Scientist Assistant</h3>
        <p>Your AI companion for coastal monitoring</p>
      </div>

      <div className="chat-container">
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-content">
                {message.type === 'bot' && <div className="bot-avatar">🤖</div>}
                <div className="message-text">{message.text}</div>
                {message.type === 'user' && <div className="user-avatar">👤</div>}
              </div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message bot">
              <div className="message-content">
                <div className="bot-avatar">🤖</div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about coastal monitoring..."
            className="message-input"
          />
          <button onClick={handleSendMessage} className="send-btn" disabled={!inputText.trim()}>
            ➤
          </button>
        </div>
      </div>

      <div className="quick-actions">
        <h4>Quick Actions</h4>
        <div className="action-buttons">
          <button onClick={() => setInputText('help')} className="action-btn">Help</button>
          <button onClick={() => setInputText('monitoring')} className="action-btn">Monitoring</button>
          <button onClick={() => setInputText('safety')} className="action-btn">Safety</button>
          <button onClick={() => setInputText('equipment')} className="action-btn">Equipment</button>
          <button onClick={() => setInputText('data')} className="action-btn">Data Entry</button>
          <button onClick={() => setInputText('schedule')} className="action-btn">Schedule</button>
        </div>
      </div>
    </div>
  );
}

// Reports Component
function ReportsSection({ onBack }) {
  const [reports, setReports] = useState([
    { id: 1, name: 'Monthly Activity Report', type: 'monthly', status: 'completed', date: '2024-01-20' },
    { id: 2, name: 'User Performance Report', type: 'performance', status: 'completed', date: '2024-01-19' },
    { id: 3, name: 'Data Quality Report', type: 'quality', status: 'in-progress', date: '2024-01-20' },
    { id: 4, name: 'System Health Report', type: 'system', status: 'scheduled', date: '2024-01-21' }
  ]);

  const [selectedReport, setSelectedReport] = useState(null);

  const handleGenerateReport = (type) => {
    // Report generation logic here
    console.log(`Generating ${type} report...`);
  };

  return (
    <div className="dashboard-section">
      <div className="dashboard-header">
        <button onClick={onBack} className="back-btn">← Back</button>
        <h3>📋 Reports</h3>
        <p>Generate and view system reports</p>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h4>📊 Monthly Activity</h4>
          <p>Comprehensive monthly activity summary</p>
          <button className="generate-btn" onClick={() => handleGenerateReport('monthly')}>
            📈 Generate
          </button>
        </div>

        <div className="report-card">
          <h4>👥 User Performance</h4>
          <p>Individual user performance metrics</p>
          <button className="generate-btn" onClick={() => handleGenerateReport('performance')}>
            📈 Generate
          </button>
        </div>

        <div className="report-card">
          <h4>🎯 Data Quality</h4>
          <p>Data quality and accuracy analysis</p>
          <button className="generate-btn" onClick={() => handleGenerateReport('quality')}>
            📈 Generate
          </button>
        </div>

        <div className="report-card">
          <h4>⚙️ System Health</h4>
          <p>System performance and health metrics</p>
          <button className="generate-btn" onClick={() => handleGenerateReport('system')}>
            📈 Generate
          </button>
        </div>
      </div>

      <div className="recent-reports">
        <h4>Recent Reports</h4>
        <div className="reports-list">
          {reports.map((report) => (
            <div key={report.id} className="report-item">
              <div className="report-info">
                <h5>{report.name}</h5>
                <p>Type: {report.type} | Date: {report.date}</p>
              </div>
              <div className="report-status">
                <span className={`status-badge ${report.status}`}>
                  {report.status}
                </span>
                <button className="view-report-btn">👁️ View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main App Component with Dual Mode Support
export default function App() {
  const [currentView, setCurrentView] = useState('auth');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userMode, setUserMode] = useState(null); // 'admin' or 'citizen'

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  const handleAdminLogin = async (adminUser) => {
    setUser(adminUser);
    setUserMode('admin');
    setIsAuthenticated(true);
    setCurrentView('main');
    console.log('✅ Admin access granted');
  };

  const handleCitizenLogin = (citizenUser) => {
    setUser(citizenUser);
    setUserMode('citizen');
    setIsAuthenticated(true);
    setCurrentView('main');
    console.log('✅ Citizen scientist access granted');
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

  if (!isAuthenticated) {
    return <AuthScreen onAdminLogin={handleAdminLogin} onCitizenLogin={handleCitizenLogin} onSignup={handleSignup} />;
  }

  return (
    <div className="app-container">
      {currentView === 'main' && (
        <div className="main-menu">
          <div className="menu-header">
            <h2>🌊 ESCOM Assistant</h2>
            <p>Welcome, {user?.firstName || user?.name || 'User'}! ({userMode === 'admin' ? '👑 Admin' : '👥 Citizen'})</p>
          </div>
          <div className="menu-buttons">
            {userMode === 'admin' ? (
              // Admin Menu Options
              <>
                <button onClick={() => handleViewChange('admin-dashboard')} className="menu-btn admin-dashboard">
                  📊 Admin Dashboard
                </button>
                <button onClick={() => handleViewChange('user-management')} className="menu-btn user-management">
                  👥 User Management
                </button>
                <button onClick={() => handleViewChange('data-analytics')} className="menu-btn data-analytics">
                  📈 Data Analytics
                </button>
                <button onClick={() => handleViewChange('system-settings')} className="menu-btn system-settings">
                  ⚙️ System Settings
                </button>
                <button onClick={() => handleViewChange('reports')} className="menu-btn reports">
                  📋 Reports
                </button>
              </>
            ) : (
              // Citizen Menu Options
              <>
                <button onClick={() => handleViewChange('faq')} className="menu-btn faq">
                  ❓ FAQs
                </button>
                <button onClick={() => handleViewChange('community')} className="menu-btn community">
                  👥 Community
                </button>
                <button onClick={() => handleViewChange('dashboard')} className="menu-btn dashboard">
                  📊 Dashboard
                </button>
                <button onClick={() => handleViewChange('bot')} className="menu-btn bot">
                  🤖 Assistant Bot
                </button>
                <button onClick={() => handleViewChange('profile-setup')} className="menu-btn profile">
                  👤 Profile
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {currentView === 'faq' && (
        <FAQSection onBack={() => handleViewChange('main')} userMode={userMode} />
      )}

      {currentView === 'community' && (
        <CommunitySection onBack={() => handleViewChange('main')} />
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

      {currentView === 'user-management' && (
        <UserManagementSection onBack={() => handleViewChange('main')} />
      )}

      {currentView === 'data-analytics' && (
        <DataAnalyticsSection onBack={() => handleViewChange('main')} />
      )}

      {currentView === 'system-settings' && (
        <SystemSettingsSection onBack={() => handleViewChange('main')} />
      )}

      {currentView === 'reports' && (
        <ReportsSection onBack={() => handleViewChange('main')} />
      )}
    </div>
  );
}
