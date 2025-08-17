import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

console.log('🚀 Starting ESCOM Citizen Scientist App...');
console.log('📱 React Version:', React.version);
console.log('🌐 Environment:', import.meta.env.MODE);
console.log('🔗 API Base URL:', import.meta.env.VITE_API_BASE_URL || 'Not set');

// Error boundary for the entire app
const handleError = (error, errorInfo) => {
  console.error('🚨 App Error:', error);
  console.error('📋 Error Info:', errorInfo);
  
  // Show user-friendly error message
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #000;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 20px;
  `;
  errorDiv.innerHTML = `
    <h1 style="color: #ff0000; margin-bottom: 20px;">🚨 App Error</h1>
    <p style="margin-bottom: 15px;">Something went wrong. Please refresh the page.</p>
    <button onclick="location.reload()" style="
      background: #ff0000;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
    ">🔄 Refresh Page</button>
    <p style="margin-top: 20px; font-size: 12px; color: #ccc;">
      Error: ${error.message}
    </p>
  `;
  document.body.appendChild(errorDiv);
};

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('✅ App rendered successfully!');
} catch (error) {
  console.error('❌ Failed to render app:', error);
  handleError(error, {});
}
