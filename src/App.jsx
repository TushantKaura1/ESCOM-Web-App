import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import TestDashboard from './components/TestDashboard';
import config from './config';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('welcome');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [adminMode, setAdminMode] = useState(false);
  
  // Force Netlify rebuild - Complete Admin & User Features v2.0 - Aug 17, 2025
  const APP_VERSION = '2.0.0';
  const BUILD_TIMESTAMP = '2025-08-17T18:00:00Z';

  // Check backend connection on app start
  useEffect(() => {
    console.log('🚀 COMPLETE ADMIN & USER FEATURES DEPLOYED - v2.0.0');
    console.log('🔧 Admin mode with full functionality');
    console.log('🔧 User dashboard with monitoring capabilities');
    console.log('🔧 Role-based access control implemented');
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
      console.log('🚀 LOGIN ATTEMPT STARTED');
      console.log('📤 Sending login data:', { email: credentials.email, password: '***' });
      console.log('🔧 Complete features deployed - v2.0.0');

      const response = await fetch(`${config.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('📥 Login response received:', response.status, response.statusText);
      const data = await response.json();
      console.log('📥 Login response data:', data);

      if (response.ok) {
        console.log('✅ LOGIN SUCCESSFUL!');
        console.log('👤 User data received:', data.user);
        console.log('🔑 Token received:', data.token ? 'YES' : 'NO');
        
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setCurrentView('dashboard');
        
        console.log('🎯 Current view set to: dashboard');
        console.log('👤 User state updated:', data.user);
      } else {
        console.error('❌ LOGIN FAILED:', data.error);
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('💥 LOGIN ERROR:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
      console.log('🏁 Login process completed');
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
    setAdminMode(false);
    localStorage.removeItem('token');
    setCurrentView('welcome');
    setError(null);
  };

  const handleAdminMode = () => {
    setAdminMode(true);
    setCurrentView('admin');
    console.log('👑 Admin mode activated');
  };

  const handleUserMode = () => {
    setAdminMode(false);
    setCurrentView('login');
    console.log('🌊 User mode activated');
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
        
        <div className="app-version">
          <small>v{APP_VERSION} - {new Date(BUILD_TIMESTAMP).toLocaleDateString()}</small>
          <br />
          <small style={{color: '#00d4aa'}}>🚀 COMPLETE ADMIN & USER FEATURES DEPLOYED - v2.0.0</small>
        </div>
        
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

        <div className="mode-selection">
          <h3>Choose Your Access Mode</h3>
          <div className="mode-buttons">
            <button 
              onClick={handleAdminMode}
              className="btn btn-admin"
            >
              👑 Admin Mode
            </button>
            <button 
              onClick={handleUserMode}
              className="btn btn-user"
            >
              🌊 User Mode
            </button>
          </div>
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
          <div className="feature">
            <span className="feature-icon">👑</span>
            <span>Admin Management</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    console.log('🔍 ===== DASHBOARD RENDERING STARTED =====');
    console.log('🔍 Current view:', currentView);
    console.log('🔍 User state:', user);
    console.log('🔍 Admin mode:', adminMode);
    
    if (adminMode) {
      console.log('👑 RENDERING ADMIN DASHBOARD');
      return <AdminDashboard onBack={handleLogout} />;
    }
    
    if (!user) {
      console.error('❌ NO USER DATA - Cannot render dashboard');
      return <div>No user data available</div>;
    }
    
    console.log('🌊 RENDERING USER DASHBOARD');
    return <UserDashboard user={user} onBack={handleLogout} />;
  };

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
      {console.log('🎭 APP RENDER - Current view:', currentView, 'User:', user, 'Admin mode:', adminMode)}
      
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
      {(currentView === 'dashboard' || currentView === 'admin') && renderDashboard()}
    </div>
  );
}

export default App;
