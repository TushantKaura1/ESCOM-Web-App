import React, { useState, useEffect } from 'react';
import './AuthSystem.css';

const AuthSystem = ({ onLogin, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Reset form on mount
  useEffect(() => {
    setFormData({
      email: '',
      password: ''
    });
    setError('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Handle login
      const success = await onLogin({
        email: formData.email,
        password: formData.password
      });
      
      if (success) {
        // Login successful, form will be closed by parent component
        return;
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <div className="auth-header">
          <div className="auth-logo">
            <img src="/escom-logo.png" alt="ESCOM Logo" className="logo-image" />
            <h2>Login</h2>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
                minLength="6"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="auth-actions">
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Processing...' : '🔐 Login'}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p className="login-info">
            Use your existing credentials to access the platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSystem;
