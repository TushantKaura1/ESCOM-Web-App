import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';

const Profile = ({ user, onLogout, onSectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);

  // Debug: Log component rendering
  console.log('🔍 Profile component rendering with user:', user);
  console.log('🔍 Profile component isOpen state:', isOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        console.log('🖱️ Click outside detected, closing dropdown');
        setIsOpen(false);
      }
    };

    if (isOpen) {
      console.log('➕ Adding click outside listener');
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          console.log('⌨️ Escape key pressed, closing dropdown');
          setIsOpen(false);
        }
      });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleProfile = () => {
    console.log('🔄 Profile toggle clicked, current state:', isOpen, 'new state:', !isOpen);
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    console.log('🚪 Logout clicked');
    onLogout();
    setIsOpen(false);
  };

  const handleSectionChange = (section) => {
    console.log('🔄 Section change requested:', section);
    if (onSectionChange) {
      onSectionChange(section);
    }
    setIsOpen(false);
  };

  if (!user) {
    console.log('❌ No user provided to Profile component');
    return null;
  }

  console.log('🎨 Rendering Profile component, isOpen:', isOpen, 'user:', user);

  return (
    <div className="profile-container-unique" ref={profileRef}>
      {/* Profile Button */}
      <button 
        className="profile-button-unique" 
        onClick={toggleProfile}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="profile-avatar-unique">
          {user.role === 'admin' ? '👑' : '👤'}
        </div>
        <div className="profile-info-unique">
          <span className="profile-name-unique">{user.name || 'User'}</span>
          <span className="profile-role-unique">{user.role === 'admin' ? 'Admin' : 'Citizen'}</span>
        </div>
        <div className="profile-arrow-unique">
          {isOpen ? '▲' : '▼'}
        </div>
      </button>

      {/* Profile Dropdown */}
      {isOpen && (
        <div className="profile-dropdown-unique">
          <div className="profile-header-unique">
            <div className="profile-info-large-unique">
              <div className="profile-avatar-large-unique">
                {user.profileImage || (user.role === 'admin' ? '👑' : '👤')}
              </div>
              <div className="profile-details-unique">
                <h3 className="profile-title-unique">{user.name || 'User'}</h3>
                <p className="profile-email-unique">{user.email || 'No email'}</p>
                <div className="profile-role-badge-unique">
                  {user.role === 'admin' ? '👑 Administrator' : '👤 Citizen Scientist'}
                </div>
                {user.team && (
                  <p className="profile-team-unique">Team: {user.team}</p>
                )}
                {user.department && (
                  <p className="profile-department-unique">Department: {user.department}</p>
                )}
                {user.username && (
                  <p className="profile-username-unique">Username: {user.username}</p>
                )}
              </div>
            </div>
            
            {/* Admin-specific information */}
            {user.role === 'admin' && (
              <div className="admin-info-section-unique">
                <h4 className="admin-info-title-unique">👑 Administrator Details</h4>
                {user.telegramId && (
                  <div className="admin-info-item-unique">
                    <span className="admin-info-icon-unique">📱</span>
                    <span className="admin-info-label-unique">Telegram:</span>
                    <span className="admin-info-value-unique">{user.telegramId}</span>
                  </div>
                )}
                {user.phone && (
                  <div className="admin-info-item-unique">
                    <span className="admin-info-icon-unique">📞</span>
                    <span className="admin-info-label-unique">Phone:</span>
                    <span className="admin-info-value-unique">{user.phone}</span>
                  </div>
                )}
                {user.joinDate && (
                  <div className="admin-info-item-unique">
                    <span className="admin-info-icon-unique">📅</span>
                    <span className="admin-info-label-unique">Joined:</span>
                    <span className="admin-info-value-unique">{new Date(user.joinDate).toLocaleDateString()}</span>
                  </div>
                )}
                {user.lastLogin && (
                  <div className="admin-info-item-unique">
                    <span className="admin-info-icon-unique">🕒</span>
                    <span className="admin-info-label-unique">Last Login:</span>
                    <span className="admin-info-value-unique">{new Date(user.lastLogin).toLocaleString()}</span>
                  </div>
                )}
                {user.bio && (
                  <div className="admin-info-item-unique">
                    <span className="admin-info-icon-unique">📝</span>
                    <span className="admin-info-label-unique">Bio:</span>
                    <span className="admin-info-value-unique">{user.bio}</span>
                  </div>
                )}
                {user.permissions && user.permissions.length > 0 && (
                  <div className="admin-info-item-unique">
                    <span className="admin-info-icon-unique">🔐</span>
                    <span className="admin-info-label-unique">Permissions:</span>
                    <div className="permissions-list-unique">
                      {user.permissions.map((permission, index) => (
                        <span key={index} className="permission-tag-unique">{permission}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="profile-actions-unique">
            <button 
              className="profile-action-btn-unique" 
              onClick={() => handleSectionChange('profile')}
            >
              <span className="action-icon-unique">👤</span>
              <span className="action-text-unique">Edit Profile</span>
              <span className="action-description-unique">Update your personal information</span>
            </button>
            <button 
              className="profile-action-btn-unique" 
              onClick={() => handleSectionChange('password')}
            >
              <span className="action-icon-unique">🔑</span>
              <span className="action-text-unique">Change Password</span>
              <span className="action-description-unique">Update your account password</span>
            </button>
            <button 
              className="profile-action-btn-unique" 
              onClick={() => handleSectionChange('preferences')}
            >
              <span className="action-icon-unique">⚙️</span>
              <span className="action-text-unique">Preferences</span>
              <span className="action-description-unique">Customize your app settings</span>
            </button>
            <button 
              className="profile-action-btn-unique danger" 
              onClick={handleLogout}
            >
              <span className="action-icon-unique">🚪</span>
              <span className="action-text-unique">Logout</span>
              <span className="action-description-unique">Sign out of your account</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
