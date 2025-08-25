import React, { useState, useEffect, useRef } from 'react';
import './Profile.css';

const Profile = ({ user, onLogout, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Profile component mounted with user:', user);
    console.log('🔍 User object keys:', user ? Object.keys(user) : 'No user');
  }, [user]);

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

  if (!user) {
    console.log('❌ No user provided to Profile component');
    return <div className="profile-container">No user data</div>;
  }

  console.log('🎨 Rendering Profile component, isOpen:', isOpen, 'user:', user);

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
          <span className="profile-name">{user.name || 'Unknown'}</span>
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
                <h3 className="profile-title">{user.name || 'Unknown'}</h3>
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
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
