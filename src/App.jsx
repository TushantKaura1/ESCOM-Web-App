import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import TestDashboard from './components/TestDashboard';
import AuthSystem from './components/AuthSystem';
import DynamicBotHelper from './components/DynamicBotHelper';
import DailyUpdatesManager from './components/DailyUpdatesManager';
import config from './config';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('welcome');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [adminMode, setAdminMode] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showBotHelper, setShowBotHelper] = useState(false);
  const [showDailyUpdates, setShowDailyUpdates] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  
  // Force Netlify rebuild - Enhanced Admin & User Features v3.0 - Aug 19, 2025
  const APP_VERSION = '3.0.0';
  const BUILD_TIMESTAMP = '2025-08-19T00:00:00Z';

  // Check backend connection on app start
  useEffect(() => {
    console.log('🚀 ENHANCED ADMIN & USER FEATURES DEPLOYED - v3.0.0');
    console.log('🔧 Complete authentication system');
    console.log('🤖 Dynamic bot helper with context awareness');
    console.log('📢 Daily updates management');
    console.log('🔄 Real-time synchronization between admin and user');
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
      console.log('🔧 Enhanced features deployed - v3.0.0');

      // For demo purposes, simulate authentication
      // In production, this would call your backend API
      if (credentials.email === 'admin@escom.com' && credentials.password === 'admin123') {
        const adminUser = {
          id: 1,
          name: 'Admin User',
          email: credentials.email,
          role: 'admin',
          team: 'Admin',
          status: 'active'
        };
        setUser(adminUser);
        setAdminMode(true);
        setCurrentView('dashboard');
        console.log('✅ ADMIN LOGIN SUCCESSFUL!');
        return true;
      } else if (credentials.email === 'user@escom.com' && credentials.password === 'user123') {
        const regularUser = {
          id: 2,
          name: 'Citizen Scientist',
          email: credentials.email,
          role: 'citizen',
          team: 'Alpha',
          status: 'active'
        };
        setUser(regularUser);
        setAdminMode(false);
        setCurrentView('dashboard');
        console.log('✅ USER LOGIN SUCCESSFUL!');
        return true;
      } else {
        console.error('❌ LOGIN FAILED: Invalid credentials');
        setError('Invalid credentials. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('💥 LOGIN ERROR:', error);
      setError('Network error. Please check your connection.');
      return false;
    } finally {
      setLoading(false);
      console.log('🏁 Login process completed');
    }
  };

  const handleSignup = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 SIGNUP ATTEMPT STARTED');
      console.log('📤 Sending signup data:', { ...userData, password: '***' });

      // For demo purposes, simulate user creation
      // In production, this would call your backend API
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        team: userData.team,
        status: 'active',
        joinDate: new Date().toISOString()
      };

      // Store user in localStorage for demo
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      setUser(newUser);
      setAdminMode(userData.role === 'admin');
      setCurrentView('dashboard');
      console.log('✅ SIGNUP SUCCESSFUL!');
      return true;
    } catch (error) {
      console.error('💥 SIGNUP ERROR:', error);
      setError('Signup failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAdminMode(false);
    setCurrentView('welcome');
    setCurrentSection('dashboard');
    console.log('👋 User logged out');
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const closeAuth = () => {
    setShowAuth(false);
    setError(null);
  };

  const toggleBotHelper = () => {
    setShowBotHelper(!showBotHelper);
  };

  const toggleDailyUpdates = () => {
    setShowDailyUpdates(!showDailyUpdates);
  };

  const renderWelcome = () => (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="app-header">
          <h1>🌊 ESCOM Citizen Scientist Assistant</h1>
          <p className="app-subtitle">Join the coastal monitoring community and contribute to environmental research</p>
          <div className="version-info">
            <span>Version {APP_VERSION}</span>
            <span>Built: {new Date(BUILD_TIMESTAMP).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="connection-status">
          <span className={`status-indicator ${connectionStatus}`}>
            {connectionStatus === 'connected' ? '🟢' : connectionStatus === 'checking' ? '🟡' : '🔴'}
            {connectionStatus === 'connected' ? ' Connected' : connectionStatus === 'checking' ? ' Checking...' : ' Disconnected'}
          </span>
        </div>

        <div className="welcome-actions">
          <div className="action-group">
            <h3>🔐 User Access</h3>
            <button 
              className="action-btn primary"
              onClick={() => openAuth('login')}
            >
              🔐 Login
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => openAuth('signup')}
            >
              📝 Sign Up
            </button>
          </div>

          <div className="action-group">
            <h3>👑 Admin Access</h3>
            <button 
              className="action-btn admin"
              onClick={() => openAuth('login')}
            >
              👑 Admin Login
            </button>
            <p className="admin-note">Admin credentials: admin@escom.com / admin123</p>
          </div>

          <div className="action-group">
            <h3>🧪 Demo Access</h3>
            <button 
              className="action-btn demo"
              onClick={() => setCurrentView('test')}
            >
              🧪 Test Dashboard
            </button>
            <p className="demo-note">Quick access to test features</p>
          </div>
        </div>

        <div className="feature-highlights">
          <h3>✨ New Features Available</h3>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🔐</span>
              <h4>Secure Authentication</h4>
              <p>Login/signup system for all users</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🤖</span>
              <h4>AI Bot Helper</h4>
              <p>Context-aware assistance</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📢</span>
              <h4>Daily Updates</h4>
              <p>Real-time announcements</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔄</span>
              <h4>Live Sync</h4>
              <p>Admin changes appear instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    if (adminMode) {
      return (
        <AdminDashboard 
          user={user}
          onLogout={handleLogout}
          onSectionChange={setCurrentSection}
        />
      );
    } else {
      return (
        <UserDashboard 
          user={user}
          onLogout={handleLogout}
          onSectionChange={setCurrentSection}
        />
      );
    }
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'welcome':
        return renderWelcome();
      case 'dashboard':
        return renderDashboard();
      case 'test':
        return <TestDashboard onBack={() => setCurrentView('welcome')} />;
      default:
        return renderWelcome();
    }
  };

  return (
    <div className="App">
      {renderMainContent()}

      {/* Authentication Modal */}
      {showAuth && (
        <AuthSystem
          mode={authMode}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onClose={closeAuth}
        />
      )}

      {/* Dynamic Bot Helper */}
      {user && (
        <DynamicBotHelper
          userRole={user.role}
          currentSection={currentSection}
          onClose={() => setShowBotHelper(false)}
        />
      )}

      {/* Daily Updates Manager */}
      {showDailyUpdates && (
        <div className="modal-overlay">
          <div className="modal-content">
            <DailyUpdatesManager
              userRole={user?.role || 'citizen'}
              onClose={() => setShowDailyUpdates(false)}
            />
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      {user && (
        <div className="floating-actions">
          <button 
            className="fab-btn bot-helper-btn"
            onClick={toggleBotHelper}
            title="AI Assistant"
          >
            🤖
          </button>
          <button 
            className="fab-btn updates-btn"
            onClick={toggleDailyUpdates}
            title="Daily Updates"
          >
            📢
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Processing...</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-toast">
          <span>❌ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
    </div>
  );
}

export default App;
