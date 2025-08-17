import React from 'react';

function TestDashboard({ user, onBack }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '20px'
      }}>
        <h1>🧪 TEST DASHBOARD WORKING!</h1>
        <p>If you can see this, dashboard rendering is working!</p>
        <button 
          onClick={onBack}
          style={{
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ← Back to Welcome
        </button>
      </div>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '20px',
        borderRadius: '15px'
      }}>
        <h2>👤 User Information</h2>
        <pre style={{background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px'}}>
          {JSON.stringify(user, null, 2)}
        </pre>
        
        <h2>🔍 Debug Info</h2>
        <p><strong>User Role:</strong> {user?.role || 'undefined'}</p>
        <p><strong>Is Admin:</strong> {user?.isAdmin ? 'true' : 'false'}</p>
        <p><strong>User ID:</strong> {user?.id || 'undefined'}</p>
        <p><strong>Email:</strong> {user?.email || 'undefined'}</p>
      </div>
    </div>
  );
}

export default TestDashboard;
