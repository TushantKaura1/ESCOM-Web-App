import React, { useState } from 'react';
import './Profile.css';

const Profile = ({ user, onLogout, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleProfile = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      {/* Profile Button */}
      <button className="profile-button" onClick={toggleProfile}>
        <div className="profile-avatar">
          {user.role === 'admin' ? '👑' : '👤'}
        </div>
        <span className="profile-name">{user.name}</span>
        <span className="profile-role">{user.role === 'admin' ? 'Admin' : 'Citizen'}</span>
      </button>

      {/* Profile Dropdown */}
      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <div className="profile-info">
              <div className="profile-avatar-large">
                {user.role === 'admin' ? '👑' : '👤'}
              </div>
              <div className="profile-details">
                <h3>{user.name}</h3>
                <p className="profile-email">{user.email}</p>
                <p className="profile-role-badge">
                  {user.role === 'admin' ? '👑 Administrator' : '👤 Citizen Scientist'}
                </p>
                {user.team && (
                  <p className="profile-team">Team: {user.team}</p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="profile-action-btn" onClick={() => setIsOpen(false)}>
              📋 View Profile
            </button>
            <button className="profile-action-btn" onClick={() => setIsOpen(false)}>
              ⚙️ Settings
            </button>
            <button className="profile-action-btn danger" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div className="profile-backdrop" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default Profile;
