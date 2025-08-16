import React from 'react';

function App() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#000',
      color: '#fff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#00ff00', fontSize: '48px' }}>
        🌊 ESCOM Citizen Scientist
      </h1>
      
      <div style={{
        backgroundColor: '#333',
        padding: '20px',
        borderRadius: '10px',
        margin: '20px 0'
      }}>
        <h2>✅ Frontend is Working!</h2>
        <p>If you can see this, your React app is rendering successfully!</p>
        <p>Current time: {new Date().toLocaleString()}</p>
      </div>

      <div style={{
        backgroundColor: '#333',
        padding: '20px',
        borderRadius: '10px',
        margin: '20px 0'
      }}>
        <h3>Backend Test</h3>
        <button 
          onClick={async () => {
            try {
              const response = await fetch('https://citiscience-backend-95pp.onrender.com/health');
              const data = await response.json();
              alert(`Backend Status: ${data.status}\nDatabase: ${data.database}`);
            } catch (error) {
              alert('Backend connection failed: ' + error.message);
            }
          }}
          style={{
            backgroundColor: '#00ff00',
            color: '#000',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          Test Backend Connection
        </button>
      </div>

      <div style={{
        backgroundColor: '#333',
        padding: '20px',
        borderRadius: '10px',
        margin: '20px 0'
      }}>
        <h3>Debug Info</h3>
        <p>React Version: {React.version}</p>
        <p>App loaded at: {new Date().toISOString()}</p>
        <p>User Agent: {navigator.userAgent}</p>
      </div>
    </div>
  );
}

export default App;
