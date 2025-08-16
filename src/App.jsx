import React from 'react';

function App() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '48px', color: '#00ff00', marginBottom: '20px' }}>
        🌊 ESCOM Citizen Scientist
      </h1>
      
      <div style={{
        backgroundColor: '#333',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '20px'
      }}>
        <h2 style={{ color: '#00ff00', marginBottom: '15px' }}>
          ✅ Frontend is Working!
        </h2>
        <p style={{ fontSize: '18px', marginBottom: '10px' }}>
          If you can see this, your React app is rendering successfully!
        </p>
        <p style={{ fontSize: '16px', color: '#ccc' }}>
          Current time: {new Date().toLocaleString()}
        </p>
      </div>

      <div style={{
        backgroundColor: '#333',
        padding: '20px',
        borderRadius: '15px',
        marginBottom: '20px'
      }}>
        <h3>Backend Test</h3>
        <button 
          onClick={async () => {
            try {
              const response = await fetch('https://citiscience-backend-95pp.onrender.com/health');
              const data = await response.json();
              alert(`✅ Backend Status: ${data.status}\n🌐 Database: ${data.database}`);
            } catch (error) {
              alert('❌ Backend connection failed: ' + error.message);
            }
          }}
          style={{
            backgroundColor: '#00ff00',
            color: '#000',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Test Backend Connection
        </button>
      </div>

      <div style={{
        backgroundColor: '#333',
        padding: '20px',
        borderRadius: '15px'
      }}>
        <h3>Debug Info</h3>
        <p>React Version: {React.version}</p>
        <p>App loaded at: {new Date().toISOString()}</p>
        <p>User Agent: {navigator.userAgent}</p>
        <p>Window size: {window.innerWidth} x {window.innerHeight}</p>
      </div>
    </div>
  );
}

export default App;
