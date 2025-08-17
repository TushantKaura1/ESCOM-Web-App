import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import config from './config';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('welcome');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Check backend connection on app start
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      setConnectionStatus('checking');
      const response = await fetch(`${config.API_BASE_URL}/health`);
      const data = await response.json();
      
      if (data.status === 'ok') {
        setConnectionStatus('connected');
        console.log('✅ Backend connected successfully');
      } else {
        setConnectionStatus('error');
        console.error('❌ Backend health check failed');
      }
    } catch (error) {
      setConnectionStatus('error');
      console.error('❌ Backend connection failed:', error);
    }
  };

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📤 Sending login data:', { email: credentials.email, password: '***' });

      const response = await fetch(`${config.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setCurrentView('dashboard');
        console.log('✅ Login successful');
      } else {
        setError(data.error || 'Login failed');
        console.error('❌ Login failed:', data);
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Transform frontend data to match backend schema
      const backendData = {
        email: userData.email,
        password: userData.password,
        username: userData.name, // Map name to username
        firstName: userData.name.split(' ')[0] || userData.name, // Extract first name
        lastName: userData.name.split(' ').slice(1).join(' ') || '', // Extract last name
        role: userData.role === 'user' ? 'citizen' : userData.role // Map user to citizen
      };

      console.log('📤 Sending signup data:', backendData);

      const response = await fetch(`${config.API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setCurrentView('dashboard');
        console.log('✅ Signup successful');
      } else {
        setError(data.error || 'Signup failed');
        console.error('❌ Signup failed:', data);
      }
    } catch (error) {
      setError('Network error. Please check your connection.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setCurrentView('welcome');
    setError(null);
  };

  const renderWelcome = () => (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1 className="welcome-title">
          🌊 ESCOM Citizen Scientist
        </h1>
        <p className="welcome-subtitle">
          Join the coastal monitoring community and contribute to environmental research
        </p>
        
        <div className="connection-status">
          <div className={`status-indicator ${connectionStatus}`}>
            {connectionStatus === 'checking' && '🔄 Checking connection...'}
            {connectionStatus === 'connected' && '✅ Backend Connected'}
            {connectionStatus === 'error' && '❌ Backend Disconnected'}
          </div>
          <button 
            onClick={checkBackendConnection}
            className="retry-button"
            disabled={connectionStatus === 'checking'}
          >
            🔄 Retry
          </button>
        </div>

        <div className="welcome-buttons">
          <button 
            onClick={() => setCurrentView('login')}
            className="btn btn-primary"
          >
            🔐 Login
          </button>
          <button 
            onClick={() => setCurrentView('signup')}
            className="btn btn-secondary"
          >
            📝 Sign Up
          </button>
        </div>

        <div className="welcome-features">
          <div className="feature">
            <span className="feature-icon">🌊</span>
            <span>Coastal Monitoring</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔬</span>
            <span>Scientific Research</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🌍</span>
            <span>Environmental Impact</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name || 'Citizen Scientist'}! 👋</h1>
        <button onClick={handleLogout} className="btn btn-logout">
          🚪 Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>📊 Your Dashboard</h3>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role || 'User'}</p>
          <p>Member since: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
        </div>

        <div className="dashboard-card">
          <h3>🔬 Quick Actions</h3>
          <button className="btn btn-action">📝 Submit Data</button>
          <button className="btn btn-action">📊 View Reports</button>
          <button className="btn btn-action">❓ FAQs</button>
        </div>

        <div className="dashboard-card">
          <h3>📈 Recent Activity</h3>
          <p>No recent activity yet. Start contributing to see your impact!</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Processing...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      {currentView === 'welcome' && renderWelcome()}
      {currentView === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onBack={() => setCurrentView('welcome')}
        />
      )}
      {currentView === 'signup' && (
        <Signup 
          onSignup={handleSignup} 
          onBack={() => setCurrentView('welcome')}
        />
      )}
      {currentView === 'dashboard' && renderDashboard()}
    </div>
  );
}

export default App;
