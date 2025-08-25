import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import AuthSystem from './components/AuthSystem';
import DailyUpdatesManager from './components/DailyUpdatesManager';
import { DataProvider, useData } from './contexts/DataContext';
import config from './config';
import './App.css';

function AppContent() {
  const { users, addUser } = useData();
  const [currentView, setCurrentView] = useState('welcome');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [adminMode, setAdminMode] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showDailyUpdates, setShowDailyUpdates] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  
  // FORCE NETLIFY REBUILD - Enhanced Admin & User Features v3.1 - Aug 25, 2025
  // This version includes: Profile System, Logout, Bug Fixes, Enhanced Data
  const APP_VERSION = '3.1.0';
  const BUILD_TIMESTAMP = '2025-08-25T08:50:00Z';
  const FORCE_REBUILD = 'NETLIFY_REBUILD_REQUIRED_v3.1.0';

  // Check backend connection on app start
  useEffect(() => {
    console.log('🚀 ENHANCED ADMIN & USER FEATURES DEPLOYED - v3.0.0');
    console.log('🔧 Complete authentication system');
    console.log('🤖 Dynamic bot helper with context awareness');
    console.log('📢 Daily updates management');
    console.log('🔄 Real-time synchronization between admin and user');
    console.log('🔄 FORCE REBUILD:', FORCE_REBUILD);
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
      console.log('🔄 FORCE REBUILD:', FORCE_REBUILD);

      // Check for hardcoded admin access first
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
        setShowAuth(false); // Close the auth modal
        console.log('✅ ADMIN LOGIN SUCCESSFUL!');
        return true;
      }

      // Check against centralized users data
      const foundUser = users.find(u => u.email === credentials.email);
      
      if (foundUser) {
        // Check if password matches (for demo purposes, we'll accept any password for existing users)
        // In production, this would verify the actual password hash
        if (foundUser.password === credentials.password || !foundUser.password) {
          setUser(foundUser);
          setAdminMode(foundUser.role === 'admin');
          setCurrentView('dashboard');
          setShowAuth(false); // Close the auth modal
          console.log('✅ LOGIN SUCCESSFUL!', foundUser);
          return true;
        } else {
          console.error('❌ LOGIN FAILED: Invalid password');
          setError('Invalid password. Please try again.');
          return false;
        }
      } else {
        console.error('❌ LOGIN FAILED: User not found');
        setError('User not found. Please check your email or sign up.');
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
      console.log('🔄 FORCE REBUILD:', FORCE_REBUILD);

      // Check if user already exists
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        setError('User with this email already exists.');
        return false;
      }

      // Create new user with password
      const newUser = {
        name: userData.name,
        email: userData.email,
        username: userData.email.split('@')[0], // Generate username from email
        password: userData.password, // Store password for demo purposes
        role: userData.role || 'citizen',
        team: `Team ${userData.team}`, // Ensure proper team format
        status: 'active'
      };

      // Add user to centralized system
      addUser(newUser);

      setUser(newUser);
      setAdminMode(newUser.role === 'admin');
      setCurrentView('dashboard');
      setShowAuth(false); // Close the auth modal
      console.log('✅ SIGNUP SUCCESSFUL!', newUser);
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
            <span style={{color: '#00d4aa'}}>🚀 ENHANCED v3.0.0 DEPLOYED!</span>
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
          onSectionChange={(section) => {
            if (section === 'welcome') {
              setCurrentView('welcome');
              setUser(null);
              setAdminMode(false);
            } else {
              setCurrentSection(section);
            }
          }}
        />
      );
    } else {
      return (
        <UserDashboard 
          user={user}
          onLogout={handleLogout}
          onSectionChange={(section) => {
            if (section === 'welcome') {
              setCurrentView('welcome');
              setUser(null);
              setAdminMode(false);
            } else {
              setCurrentSection(section);
            }
          }}
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

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
