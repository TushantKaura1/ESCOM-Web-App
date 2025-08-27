import React, { useState, useEffect } from 'react';
import config from '../config';

const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking');
  const [details, setDetails] = useState('');
  const [lastCheck, setLastCheck] = useState(null);

  const checkConnection = async () => {
    setStatus('checking');
    setDetails('Checking backend connection...');
    
    try {
      const response = await fetch(`${config.API_BASE_URL}/health`);
      const data = await response.json();
      
      if (response.ok) {
        setStatus('connected');
        setDetails(`✅ Backend Connected!\nStatus: ${data.status}\nDatabase: ${data.database}\nUptime: ${data.uptime}s\nVersion: ${data.version}`);
      } else {
        setStatus('error');
        setDetails(`❌ Backend Error!\nStatus: ${response.status}\nResponse: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      setStatus('error');
      setDetails(`❌ Connection Failed!\nError: ${error.message}`);
    }
    
    setLastCheck(new Date().toLocaleTimeString());
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return '#00ff00';
      case 'error': return '#ff0000';
      case 'checking': return '#ffff00';
      default: return '#888888';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return '🟢';
      case 'error': return '🔴';
      case 'checking': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999,
      border: `2px solid ${getStatusColor()}`,
      fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span>{getStatusIcon()}</span>
        <strong>Backend Status</strong>
        <button 
          onClick={checkConnection}
          style={{
            background: 'none',
            border: '1px solid white',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          🔄
        </button>
      </div>
      
      <div style={{ whiteSpace: 'pre-line', lineHeight: '1.4' }}>
        {details}
      </div>
      
      {lastCheck && (
        <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.7 }}>
          Last check: {lastCheck}
        </div>
      )}
      
      <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.7 }}>
        Backend: {config.API_BASE_URL}
      </div>
    </div>
  );
};

export default ConnectionStatus;
