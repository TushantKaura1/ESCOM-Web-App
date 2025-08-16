import React, { useState, useEffect } from 'react';
import './App.css';

// Super simple App that will definitely work
function App() {
  const [status, setStatus] = useState('loading');
  const [backendUrl, setBackendUrl] = useState('https://citiscience-backend-95pp.onrender.com');

  useEffect(() => {
    // Test backend connection
    fetch(`${backendUrl}/health`)
      .then(response => response.json())
      .then(data => {
        console.log('Backend health:', data);
        setStatus('connected');
      })
      .catch(error => {
        console.error('Backend error:', error);
        setStatus('error');
      });
  }, [backendUrl]);

  const testLogin = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@admin.com', password: 'admin123' })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        alert('Login successful! Check console for details.');
      } else {
        const error = await response.json();
        console.error('Login failed:', error);
        alert('Login failed. Check console for details.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login error. Check console for details.');
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#1a1a1a',
      color: 'white',
      minHeight: '100vh'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#4CAF50' }}>🌊 ESCOM Citizen Scientist</h1>
        <p>Backend Connection Test</p>
      </div>

      <div style={{ 
        backgroundColor: '#2a2a2a', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3>Backend Status</h3>
        <p>URL: {backendUrl}</p>
        <p>Status: 
          {status === 'loading' && ' 🔍 Checking...'}
          {status === 'connected' && ' ✅ Connected'}
          {status === 'error' && ' ❌ Error'}
        </p>
      </div>

      <div style={{ 
        backgroundColor: '#2a2a2a', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3>Test Login</h3>
        <p>Email: admin@admin.com</p>
        <p>Password: admin123</p>
        <button 
          onClick={testLogin}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Test Login
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#2a2a2a', 
        padding: '20px', 
        borderRadius: '10px'
      }}>
        <h3>Debug Info</h3>
        <p>Frontend loaded successfully!</p>
        <p>React version: {React.version}</p>
        <p>Current time: {new Date().toLocaleString()}</p>
        <p>Check browser console for detailed logs</p>
      </div>
    </div>
  );
}

export default App;
