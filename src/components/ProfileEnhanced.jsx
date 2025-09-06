import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import './Profile.css';

const ProfileEnhanced = ({ user, onLogout }) => {
  const { updateUser } = useData();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    username: user?.username || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    team: user?.team || '',
    department: user?.department || ''
  });


  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('🔄 Updating profile for user:', user.id, 'with data:', profileData);
      await updateUser(user.id, profileData);
      console.log('✅ Profile updated successfully in database');
      showMessage('success', 'Profile updated successfully! Changes are now visible to admins.');
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      showMessage('error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const renderProfileTab = () => (
    <div className="profile-tab-content">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {user.role === 'admin' ? '👑' : '👤'}
        </div>
        <div className="profile-info">
          <h2>Edit Profile</h2>
          <p>Update your personal information and preferences. Changes will be saved to the database and visible to administrators.</p>
        </div>
      </div>

      <form onSubmit={handleProfileUpdate} className="profile-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                className="form-input"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="form-group">
              <label>Team</label>
              <select
                value={profileData.team}
                onChange={(e) => setProfileData({...profileData, team: e.target.value})}
                className="form-input"
              >
                <option value="">Select Team</option>
                <option value="Alpha">Team Alpha</option>
                <option value="Beta">Team Beta</option>
                <option value="Gamma">Team Gamma</option>
                <option value="Delta">Team Delta</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Department</label>
            <select
              value={profileData.department}
              onChange={(e) => setProfileData({...profileData, department: e.target.value})}
              className="form-input"
            >
              <option value="">Select Department</option>
              <option value="Research">Research</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Data Analysis">Data Analysis</option>
              <option value="Field Operations">Field Operations</option>
            </select>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              className="form-input"
              rows="4"
              placeholder="Tell us about yourself and your interest in coastal monitoring..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => setProfileData({
            name: user?.name || '',
            email: user?.email || '',
            username: user?.username || '',
            phone: user?.phone || '',
            bio: user?.bio || '',
            team: user?.team || '',
            department: user?.department || ''
          })}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );


  return (
    <div className="profile-enhanced">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-user-info">
            <div className="profile-avatar">
              {user.role === 'admin' ? '👑' : '👤'}
            </div>
            <div className="profile-details">
              <h3>{user?.name || 'User'}</h3>
              <p>{user?.email || 'No email'}</p>
              <span className="role-badge">{user?.role === 'admin' ? 'Administrator' : 'Citizen Scientist'}</span>
            </div>
          </div>

          <nav className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile</span>
            </button>
            <button 
              className="nav-item logout"
              onClick={onLogout}
            >
              <span className="nav-icon">🚪</span>
              <span className="nav-text">Logout</span>
            </button>
          </nav>
        </div>

        <div className="profile-content">
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          {activeTab === 'profile' && renderProfileTab()}
        </div>
      </div>
    </div>
  );
};

export default ProfileEnhanced;
