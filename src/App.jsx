import React, { useState, useEffect } from 'react';
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

  const [adminMode, setAdminMode] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showDailyUpdates, setShowDailyUpdates] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  
  // FORCE NETLIFY REBUILD - Enhanced Admin & User Features v3.1 - Aug 25, 2025
  // This version includes: Profile System, Logout, Bug Fixes, Enhanced Data
  const APP_VERSION = '3.1.0';
  const BUILD_TIMESTAMP = '2025-08-25T08:50:00Z';
  const FORCE_REBUILD = 'NETLIFY_REBUILD_REQUIRED_v3.1.0';

  // App initialization
  useEffect(() => {
    console.log('🚀 ENHANCED ADMIN & USER FEATURES DEPLOYED - v3.0.0');
    console.log('🔧 Complete authentication system');
    console.log('🤖 Dynamic bot helper with context awareness');
    console.log('📢 Daily updates management');
    console.log('🔄 Real-time synchronization between admin and user');
    console.log('🔄 FORCE REBUILD:', FORCE_REBUILD);
  }, []);



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
          name: 'Dr. Camilo Admin',
          email: credentials.email,
          username: 'camilo_admin',
          role: 'admin',
          team: 'ESCOM Administration',
          status: 'active',
          telegramId: '@camilo_admin_escom',
          phone: '+52 55 1234 5678',
          department: 'Coastal Monitoring',
          permissions: ['full_access', 'user_management', 'data_export', 'system_settings'],
          lastLogin: new Date().toISOString(),
          joinDate: '2024-01-15',
          profileImage: '👑',
          bio: 'Lead Administrator for Citizen Scientist Coastal Monitoring Platform'
        };
        console.log('🔧 Setting admin user:', adminUser);
        setUser(adminUser);
        setAdminMode(true);
        setCurrentView('dashboard');
        setShowAuth(false); // Close the auth modal
        console.log('✅ ADMIN LOGIN SUCCESSFUL!');
        console.log('🔧 Current view set to:', 'dashboard');
        console.log('🔧 Admin mode set to:', true);
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


  const handleLogout = () => {
    setUser(null);
    setAdminMode(false);
    setCurrentView('welcome');
    setCurrentSection('dashboard');
    console.log('👋 User logged out');
  };

  const openAuth = () => {
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
        </div>



        <div className="welcome-actions">
          <div className="action-group">
            <h3>User Access</h3>
            <button 
              className="action-btn primary"
              onClick={() => openAuth()}
            >
              Login
            </button>
            <p className="user-note">Existing users can login with their credentials</p>
          </div>

          <div className="action-group">
            <h3>Admin Access</h3>
            <button 
              className="action-btn admin"
              onClick={() => openAuth()}
            >
              Admin Login
            </button>
            <p className="admin-note">Admin credentials: admin@escom.com / admin123</p>
          </div>

          <div className="info-section">
            <h3>About the App</h3>
            <p>This is a comprehensive coastal monitoring platform for citizen scientists. Features include:</p>
            <ul>
              <li>Data collection and monitoring</li>
              <li>FAQ management system</li>
              <li>Daily updates and announcements</li>
              <li>User profile management</li>
              <li>Secure authentication</li>
            </ul>
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
    console.log('🔍 App renderMainContent - currentView:', currentView);
    console.log('🔍 App renderMainContent - user:', user);
    console.log('🔍 App renderMainContent - adminMode:', adminMode);
    
    switch (currentView) {
      case 'welcome':
        console.log('🔍 Rendering welcome view');
        return renderWelcome();
      case 'dashboard':
        console.log('🔍 Rendering dashboard view');
        const dashboardResult = renderDashboard();
        console.log('🔍 Dashboard render result:', dashboardResult);
        return dashboardResult;
      default:
        console.log('🔍 Defaulting to welcome view');
        return renderWelcome();
    }
  };

  return (
    <div className="App">

      
      {renderMainContent()}

      {/* Authentication Modal */}
      {showAuth && (
        <AuthSystem
          onLogin={handleLogin}
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
          <span>{error}</span>
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
