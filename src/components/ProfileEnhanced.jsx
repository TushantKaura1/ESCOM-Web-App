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

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [emailData, setEmailData] = useState({
    newEmail: '',
    confirmEmail: '',
    currentPassword: ''
  });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateUser(user.id, profileData);
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      showMessage('error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match.');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      showMessage('error', 'Password must be at least 8 characters long.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await updateUser(user.id, { password: passwordData.newPassword });
      showMessage('success', 'Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showMessage('error', 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    
    if (emailData.newEmail !== emailData.confirmEmail) {
      showMessage('error', 'Email addresses do not match.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailData.newEmail)) {
      showMessage('error', 'Please enter a valid email address.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await updateUser(user.id, { email: emailData.newEmail });
      showMessage('success', 'Email changed successfully!');
      setEmailData({ newEmail: '', confirmEmail: '', currentPassword: '' });
    } catch (error) {
      showMessage('error', 'Failed to change email. Please try again.');
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
          <p>Update your personal information and preferences</p>
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

  const renderPasswordTab = () => (
    <div className="profile-tab-content">
      <div className="profile-header">
        <div className="profile-avatar-large">🔑</div>
        <div className="profile-info">
          <h2>Change Password</h2>
          <p>Update your account password for better security</p>
        </div>
      </div>

      <form onSubmit={handlePasswordChange} className="profile-form">
        <div className="form-section">
          <div className="form-group">
            <label>Current Password *</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>New Password *</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              required
              className="form-input"
              minLength="8"
            />
            <div className="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li className={passwordData.newPassword.length >= 8 ? 'valid' : ''}>At least 8 characters</li>
                <li className={/[A-Z]/.test(passwordData.newPassword) ? 'valid' : ''}>One uppercase letter</li>
                <li className={/[a-z]/.test(passwordData.newPassword) ? 'valid' : ''}>One lowercase letter</li>
                <li className={/\d/.test(passwordData.newPassword) ? 'valid' : ''}>One number</li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) ? 'valid' : ''}>One special character</li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password *</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          })}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );

  const renderEmailTab = () => (
    <div className="profile-tab-content">
      <div className="profile-header">
        <div className="profile-avatar-large">📧</div>
        <div className="profile-info">
          <h2>Change Email</h2>
          <p>Update your email address for account notifications</p>
        </div>
      </div>

      <form onSubmit={handleEmailChange} className="profile-form">
        <div className="form-section">
          <div className="form-group">
            <label>Current Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="form-input disabled"
            />
          </div>

          <div className="form-group">
            <label>New Email Address *</label>
            <input
              type="email"
              value={emailData.newEmail}
              onChange={(e) => setEmailData({...emailData, newEmail: e.target.value})}
              required
              className="form-input"
              placeholder="newemail@example.com"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Email *</label>
            <input
              type="email"
              value={emailData.confirmEmail}
              onChange={(e) => setEmailData({...emailData, confirmEmail: e.target.value})}
              required
              className="form-input"
              placeholder="newemail@example.com"
            />
          </div>

          <div className="form-group">
            <label>Current Password *</label>
            <input
              type="password"
              value={emailData.currentPassword}
              onChange={(e) => setEmailData({...emailData, currentPassword: e.target.value})}
              required
              className="form-input"
              placeholder="Enter your current password"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Email'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => setEmailData({
            newEmail: '',
            confirmEmail: '',
            currentPassword: ''
          })}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );

  const renderAccountTab = () => (
    <div className="profile-tab-content">
      <div className="profile-header">
        <div className="profile-avatar-large">⚙️</div>
        <div className="profile-info">
          <h2>Account Settings</h2>
          <p>Manage your account preferences and security</p>
        </div>
      </div>

      <div className="account-settings">
        <div className="setting-section">
          <h3>Account Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">User ID:</span>
              <span className="info-value">{user?.id || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value role-badge">{user?.role === 'admin' ? '👑 Administrator' : '👤 Citizen Scientist'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value status-active">Active</span>
            </div>
            <div className="info-item">
              <span className="info-label">Member Since:</span>
              <span className="info-value">{user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="setting-section">
          <h3>Security Settings</h3>
          <div className="security-options">
            <div className="security-item">
              <div className="security-info">
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security to your account</p>
              </div>
              <button className="btn-outline">Enable</button>
            </div>
            <div className="security-item">
              <div className="security-info">
                <h4>Login Notifications</h4>
                <p>Get notified when someone logs into your account</p>
              </div>
              <button className="btn-outline">Configure</button>
            </div>
          </div>
        </div>

        <div className="setting-section danger-zone">
          <h3>Danger Zone</h3>
          <div className="danger-actions">
            <div className="danger-item">
              <div className="danger-info">
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all associated data</p>
              </div>
              <button className="btn-danger">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
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
              className={`nav-item ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              <span className="nav-icon">🔑</span>
              <span className="nav-text">Password</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'email' ? 'active' : ''}`}
              onClick={() => setActiveTab('email')}
            >
              <span className="nav-icon">📧</span>
              <span className="nav-text">Email</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Account</span>
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
          {activeTab === 'password' && renderPasswordTab()}
          {activeTab === 'email' && renderEmailTab()}
          {activeTab === 'account' && renderAccountTab()}
        </div>
      </div>
    </div>
  );
};

export default ProfileEnhanced;
