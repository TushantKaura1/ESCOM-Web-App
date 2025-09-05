import React from 'react';
import ReactDOM from 'react-dom/client';

console.log('🚀 Starting simple test...');

function SimpleApp() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1>🌊 ESCOM Assistant</h1>
      <p>Simple test version - If you see this, React is working!</p>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        <p>✅ React Version: {React.version}</p>
        <p>✅ Time: {new Date().toLocaleString()}</p>
        <button 
          onClick={() => alert('Button clicked!')}
          style={{
            background: '#00d4ff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
}

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<SimpleApp />);
  console.log('✅ Simple app rendered successfully!');
} catch (error) {
  console.error('❌ Failed to render simple app:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; background: #ff0000; color: white; text-align: center;">
      <h1>❌ Error</h1>
      <p>Failed to render app: ${error.message}</p>
    </div>
  `;
}
