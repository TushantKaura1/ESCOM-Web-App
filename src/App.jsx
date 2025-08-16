import React, { useState, useEffect } from 'react';
import './App.css';
import config from './config';

// Simple Auth Screen Component
function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend connection on component mount
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/health`);
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch (error) {
        console.error('Backend connection check failed:', error);
        setBackendStatus('error');
      }
    };

    checkBackendConnection();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔗 Attempting to connect to:', config.API_BASE_URL);
      
      // Test backend connection first
      const healthResponse = await fetch(`${config.API_BASE_URL}/health`);
      if (!healthResponse.ok) {
        throw new Error(`Backend health check failed: ${healthResponse.status}`);
      }
      console.log('✅ Backend connection successful');

      // Try admin login first
      console.log('🔐 Attempting admin login...');
      const adminResponse = await fetch(`${config.API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (adminResponse.ok) {
        const data = await adminResponse.json();
        console.log('✅ Admin login successful');
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        onLogin(data.user, 'admin');
        return;
      } else {
        console.log('❌ Admin login failed:', adminResponse.status);
        const errorData = await adminResponse.json().catch(() => ({}));
        console.log('Error details:', errorData);
      }

      // Try regular user login
      console.log('🔐 Attempting user login...');
      const userResponse = await fetch(`${config.API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (userResponse.ok) {
        const data = await userResponse.json();
        console.log('✅ User login successful');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user, 'citizen');
      } else {
        const errorData = await userResponse.json().catch(() => ({}));
        console.log('❌ User login failed:', userResponse.status, errorData);
        setError(errorData.error || `Login failed (Status: ${userResponse.status})`);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      if (error.message.includes('Failed to fetch')) {
        setError('Cannot connect to backend. Please check if the server is running.');
      } else {
        setError(`Connection error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-background">
        <div className="auth-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-icon">🌊</div>
            <h1>ESCOM Citizen Scientist</h1>
            <p>Welcome back to the community!</p>
            
            {/* Backend Connection Status */}
            <div className={`connection-status ${backendStatus}`}>
              {backendStatus === 'checking' && (
                <span>🔍 Checking backend connection...</span>
              )}
              {backendStatus === 'connected' && (
                <span>✅ Backend connected</span>
              )}
              {backendStatus === 'error' && (
                <span>❌ Backend connection failed</span>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            
            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Login'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>New to ESCOM? <a href="#" onClick={(e) => e.preventDefault()}>Create an account</a></p>
          </div>
          
          <div className="feature-highlights">
            <div className="feature">
              <span className="feature-icon">🔬</span>
              <span>Scientific Research</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🌍</span>
              <span>Environmental Impact</span>
            </div>
            <div className="feature">
              <span className="feature-icon">👥</span>
              <span>Community Driven</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Dashboard Component
function Dashboard({ user, userMode, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        const endpoint = userMode === 'admin' ? 
          `${config.API_BASE_URL}/api/admin/dashboard` :
          `${config.API_BASE_URL}/api/user/dashboard`;
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          setData(result.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userMode]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName || user?.name || 'User'}!</h1>
        <p>Role: {userMode === 'admin' ? '👑 Admin' : '👥 Citizen Scientist'}</p>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
      
      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading dashboard...</div>
        ) : (
          <div className="dashboard-data">
            <h2>Dashboard Data</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [user, setUser] = useState(null);
  const [userMode, setUserMode] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('user') || localStorage.getItem('adminUser');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        setUserMode(localStorage.getItem('adminToken') ? 'admin' : 'citizen');
      } catch (error) {
        console.error('Error restoring user data:', error);
        localStorage.clear();
      }
    }
  }, []);

  const handleLogin = (userData, mode) => {
    setUser(userData);
    setUserMode(mode);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setUserMode(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return <Dashboard user={user} userMode={userMode} onLogout={handleLogout} />;
}
