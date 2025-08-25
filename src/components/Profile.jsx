import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';

const Profile = ({ user, onLogout, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleProfile = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container" ref={profileRef}>
      {/* Profile Button */}
      <button 
        className="profile-button" 
        onClick={toggleProfile}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="profile-avatar">
          {user.role === 'admin' ? '👑' : '👤'}
        </div>
        <div className="profile-info">
          <span className="profile-name">{user.name || 'User'}</span>
          <span className="profile-role">{user.role === 'admin' ? 'Admin' : 'Citizen'}</span>
        </div>
        <div className="profile-arrow">
          {isOpen ? '▲' : '▼'}
        </div>
      </button>

      {/* Profile Dropdown */}
      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="profile-info-large">
              <div className="profile-avatar-large">
                {user.role === 'admin' ? '👑' : '👤'}
              </div>
              <div className="profile-details">
                <h3 className="profile-title">{user.name || 'User'}</h3>
                <p className="profile-email">{user.email || 'No email'}</p>
                <div className="profile-role-badge">
                  {user.role === 'admin' ? '👑 Administrator' : '👤 Citizen Scientist'}
                </div>
                {user.team && (
                  <p className="profile-team">Team: {user.team}</p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="profile-action-btn" onClick={() => setIsOpen(false)}>
              <span className="action-icon">📋</span>
              <span className="action-text">View Profile</span>
            </button>
            <button className="profile-action-btn" onClick={() => setIsOpen(false)}>
              <span className="action-icon">⚙️</span>
              <span className="action-text">Settings</span>
            </button>
            <button className="profile-action-btn danger" onClick={handleLogout}>
              <span className="action-icon">🚪</span>
              <span className="action-text">Logout</span>
              <span className="action-description">Sign out of your account</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
