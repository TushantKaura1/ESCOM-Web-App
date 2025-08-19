import React, { useState, useEffect } from 'react';
import './AuthSystem.css';

const AuthSystem = ({ onLogin, onSignup, onClose, mode = 'login' }) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'citizen',
    team: 'Alpha'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Reset form when mode changes
  useEffect(() => {
    setCurrentMode(mode);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      role: 'citizen',
      team: 'Alpha'
    });
    setError('');
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (currentMode === 'signup' && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (currentMode === 'login') {
        // Handle login
        const success = await onLogin({
          email: formData.email,
          password: formData.password
        });
        
        if (!success) {
          setError('Invalid credentials. Please try again.');
        }
      } else {
        // Handle signup
        const success = await onSignup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          team: formData.team
        });
        
        if (!success) {
          setError('Signup failed. Please try again.');
        }
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
          <h2>{currentMode === 'login' ? '🔐 Login' : '📝 Sign Up'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {currentMode === 'signup' && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>
          )}

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

          {mode === 'signup' && (
            <>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  placeholder="Confirm your password"
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="citizen">Citizen Scientist</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="team">Team</label>
                <select
                  id="team"
                  name="team"
                  value={formData.team}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Alpha">Team Alpha</option>
                  <option value="Beta">Team Beta</option>
                  <option value="Gamma">Team Gamma</option>
                </select>
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="auth-actions">
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? '⏳ Processing...' : (currentMode === 'login' ? '🔐 Login' : '📝 Sign Up')}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          {currentMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button 
                type="button"
                className="link-btn" 
                onClick={() => {
                  setCurrentMode('signup');
                  setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    name: '',
                    role: 'citizen',
                    team: 'Alpha'
                  });
                  setError('');
                }}
              >
                Sign up here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button 
                type="button"
                className="link-btn" 
                onClick={() => {
                  setCurrentMode('login');
                  setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    name: '',
                    role: 'citizen',
                    team: 'Alpha'
                  });
                  setError('');
                }}
              >
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthSystem;
